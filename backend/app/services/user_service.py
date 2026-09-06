from sqlalchemy.orm import Session
from typing import List, Optional
from uuid import UUID
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.utils.security import hash_password

ALLOWED_UPDATE_FIELDS = {"full_name", "email", "phone", "campus", "role", "is_active"}


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def get_all_users(self) -> List[User]:
        return self.db.query(User).filter(User.is_active == True).all()

    def get_user_by_id(self, user_id: UUID) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    def get_users_by_campus(self, campus: str) -> List[User]:
        return self.db.query(User).filter(User.campus == campus, User.is_active == True).all()

    def update_user(self, user_id: UUID, updates: dict) -> User:
        user = self.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")

        for key, value in updates.items():
            if key not in ALLOWED_UPDATE_FIELDS:
                continue
            if key == "email":
                existing = self.db.query(User).filter(User.email == value, User.id != user_id).first()
                if existing:
                    raise ValueError("Email already in use")
            setattr(user, key, value)

        self.db.commit()
        self.db.refresh(user)
        return user

    def deactivate_user(self, user_id: UUID) -> bool:
        user = self.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")

        user.is_active = False
        self.db.commit()
        return True
