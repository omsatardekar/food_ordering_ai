from fastapi import APIRouter, Depends, status
from app.schemas.auth_schema import UserSignup, UserLogin, UserResponse
from app.services.auth_service import signup_user, login_user
from app.middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserSignup):
    user_id = await signup_user(user_data)
    return {"message": "User created successfully", "user_id": user_id}

@router.post("/login")
async def login(login_data: UserLogin):
    return await login_user(login_data)

@router.get("/profile")
async def get_profile(current_user: dict = Depends(get_current_user)):
    return current_user

@router.post("/logout")
async def logout():
    return {"message": "Successfully logged out"}
