from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.sessions import router as sessions_router
from app.api.v1.announcements import router as announcements_router
from app.api.v1.dashboard import router as dashboard_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.profile import router as profile_router

api_router = APIRouter()

api_router.include_router(auth_router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users_router, prefix="/users", tags=["Users"])
api_router.include_router(sessions_router, prefix="/sessions", tags=["Sessions"])
api_router.include_router(announcements_router, prefix="/announcements", tags=["Announcements"])
api_router.include_router(dashboard_router, prefix="/dashboard", tags=["Dashboard"])
api_router.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
api_router.include_router(profile_router, prefix="/profile", tags=["Profile"])
