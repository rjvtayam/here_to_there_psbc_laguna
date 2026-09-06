from pydantic import BaseModel
from typing import Optional


class TokenRefresh(BaseModel):
    refresh_token: str


class TwoFactorLoginRequest(BaseModel):
    temp_token: str
    code: str


class TwoFactorLoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict


class LoginResponse(BaseModel):
    requires_2fa: bool = False
    temp_token: Optional[str] = None
    access_token: Optional[str] = None
    refresh_token: Optional[str] = None
    token_type: str = "bearer"
    user: Optional[dict] = None
