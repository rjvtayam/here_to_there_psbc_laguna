from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.utils.security import decode_token
from app.services.auth_service import AuthService

security = HTTPBearer(auto_error=False)


async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = None

    if credentials:
        token = credentials.credentials

    if not token:
        token = request.cookies.get("access_token")

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    payload = decode_token(token)

    if not payload or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    auth_service = AuthService(db)
    user = auth_service.get_current_user(payload["sub"])
    return user


async def require_admin(current_user=Depends(get_current_user)):
    if current_user.role not in ["principal", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return current_user


async def require_principal(current_user=Depends(get_current_user)):
    if current_user.role != "principal":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Principal access required",
        )
    return current_user
