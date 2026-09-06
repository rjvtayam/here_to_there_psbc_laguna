import re
import pyotp
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request, Response, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, Token, UserResponse
from app.schemas.auth import TokenRefresh, TwoFactorLoginRequest
from app.services.auth_service import AuthService
from app.api.deps import get_current_user
from app.config import settings
from app.middleware.rate_limit import limiter
from app.utils.security import decode_token, create_access_token, create_refresh_token

router = APIRouter()

PASSWORD_MIN_LENGTH = 8
PASSWORD_PATTERN = re.compile(r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?\":{}|<>]).{8,}$")


def validate_password_strength(password: str):
    if len(password) < PASSWORD_MIN_LENGTH:
        raise HTTPException(status_code=400, detail=f"Password must be at least {PASSWORD_MIN_LENGTH} characters")
    if not PASSWORD_PATTERN.match(password):
        raise HTTPException(
            status_code=400,
            detail="Password must contain uppercase, lowercase, number, and special character",
        )


def _get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    is_production = not settings.origins_list[0].startswith("http://localhost")
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=is_production,
        samesite="strict",
        max_age=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        path="/",
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=is_production,
        samesite="strict",
        max_age=settings.REFRESH_TOKEN_EXPIRE_DAYS * 86400,
        path="/",
    )


def _clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
@limiter.limit("5/minute")
def register(request: Request, response: Response, user_data: UserCreate, db: Session = Depends(get_db)):
    validate_password_strength(user_data.password)
    auth_service = AuthService(db)
    try:
        auth_service.register(user_data)
        result = auth_service.login(UserLogin(email=user_data.email, password=user_data.password), _get_client_ip(request))
        _set_auth_cookies(response, result["access_token"], result["refresh_token"])
        return Token(
            access_token=result["access_token"],
            refresh_token=result["refresh_token"],
            user=UserResponse(**result["user"]),
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


@router.post("/login")
@limiter.limit(settings.RATE_LIMIT_AUTH)
def login(request: Request, response: Response, credentials: UserLogin, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    ip = _get_client_ip(request)
    try:
        result = auth_service.login(credentials, ip)
        if result.get("requires_2fa"):
            return result
        _set_auth_cookies(response, result["access_token"], result["refresh_token"])
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/2fa-login", response_model=Token)
@limiter.limit("10/minute")
def verify_2fa_login(request: Request, response: Response, data: TwoFactorLoginRequest, db: Session = Depends(get_db)):
    payload = decode_token(data.temp_token)
    if not payload or payload.get("type") != "2fa_pending":
        raise HTTPException(status_code=401, detail="Invalid or expired 2FA token")

    from app.models.user import User
    user = db.query(User).filter(User.id == payload["sub"]).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    if not user.is_active:
        raise HTTPException(status_code=401, detail="Account is deactivated")

    if not user.two_factor_enabled or not user.two_factor_secret:
        raise HTTPException(status_code=400, detail="2FA is not enabled for this account")

    totp = pyotp.TOTP(user.two_factor_secret)
    if not totp.verify(data.code, valid_window=1):
        raise HTTPException(status_code=401, detail="Invalid 2FA code")

    user.last_login_at = datetime.utcnow()
    db.commit()

    access_token = create_access_token(data={"sub": str(user.id), "role": user.role, "campus": user.campus})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})

    _set_auth_cookies(response, access_token, refresh_token)

    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        user=UserResponse.model_validate(user),
    )


@router.post("/refresh", response_model=Token)
@limiter.limit("20/minute")
def refresh_token(request: Request, response: Response, data: TokenRefresh, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    try:
        result = auth_service.refresh_token(data.refresh_token)
        _set_auth_cookies(response, result.access_token, result.refresh_token)
        return result
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))


@router.post("/logout")
def logout(response: Response):
    _clear_auth_cookies(response)
    return {"message": "Logged out"}


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "role": current_user.role,
        "campus": current_user.campus,
        "phone": current_user.phone,
        "avatar_url": current_user.avatar_url,
        "two_factor_enabled": current_user.two_factor_enabled,
        "is_active": current_user.is_active,
        "last_login_at": current_user.last_login_at.isoformat() if current_user.last_login_at else None,
        "created_at": current_user.created_at.isoformat() if current_user.created_at else None,
        "updated_at": current_user.updated_at.isoformat() if current_user.updated_at else None,
    }
