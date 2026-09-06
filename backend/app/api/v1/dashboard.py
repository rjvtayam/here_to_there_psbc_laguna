from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.api.deps import get_current_user, require_principal
from app.services.session_service import SessionService
from app.services.emergency_service import EmergencyService
from app.services.user_service import UserService

router = APIRouter()


@router.get("/status")
def get_system_status(db: Session = Depends(get_db), _=Depends(get_current_user)):
    session_service = SessionService(db)
    user_service = UserService(db)

    active_session = session_service.get_active_session()
    paete_users = user_service.get_users_by_campus("paete")
    pagsanjan_users = user_service.get_users_by_campus("pagsanjan")

    return {
        "active_session": {
            "id": str(active_session.id) if active_session else None,
            "title": active_session.title if active_session else None,
            "status": active_session.status if active_session else None,
        },
        "campuses": {
            "paete": {
                "online": len(paete_users) > 0,
                "user_count": len(paete_users),
            },
            "pagsanjan": {
                "online": len(pagsanjan_users) > 0,
                "user_count": len(pagsanjan_users),
            },
        },
    }


@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), _=Depends(get_current_user)):
    session_service = SessionService(db)
    user_service = UserService(db)

    all_sessions = session_service.get_all_sessions()
    all_users = user_service.get_all_users()

    return {
        "total_sessions": len(all_sessions),
        "active_sessions": sum(1 for s in all_sessions if s.status == "active"),
        "total_users": len(all_users),
        "users_by_campus": {
            "paete": len([u for u in all_users if u.campus == "paete"]),
            "pagsanjan": len([u for u in all_users if u.campus == "pagsanjan"]),
            "control_room": len([u for u in all_users if u.campus == "control_room"]),
        },
        "users_by_role": {
            "principal": len([u for u in all_users if u.role == "principal"]),
            "admin": len([u for u in all_users if u.role == "admin"]),
            "teacher": len([u for u in all_users if u.role == "teacher"]),
            "staff": len([u for u in all_users if u.role == "staff"]),
        },
    }


@router.post("/emergency")
def trigger_emergency(
    message: dict = {},
    db: Session = Depends(get_db),
    user=Depends(require_principal),
):
    emergency_service = EmergencyService(db)
    emergency = emergency_service.trigger_emergency(user.id, message.get("message"))
    return {"message": "Emergency triggered", "emergency_id": str(emergency.id)}
