from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    location: Optional[str] = None
    phone_number: Optional[str] = None

class UserOut(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    name: Optional[str] = None
    location: Optional[str] = None
    phone_number: Optional[str] = None
    role: Optional[str] = None

class AdminCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
