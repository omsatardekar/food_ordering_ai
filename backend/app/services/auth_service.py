from app.database.mongodb import get_database
from app.models.user_model import User
from app.schemas.auth_schema import UserSignup, UserLogin
from app.utils.password_handler import hash_password, verify_password
from app.utils.jwt_handler import create_access_token
from fastapi import HTTPException, status
from datetime import datetime

async def signup_user(user_data: UserSignup):
    db = get_database()
    
    # Check if user exists
    existing_user = await db["users"].find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    if user_data.password != user_data.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )
    
    hashed_pwd = hash_password(user_data.password)
    
    new_user = {
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed_pwd,
        "role": "customer", # Frontend signup only for customers
        "created_at": datetime.utcnow()
    }
    
    result = await db["users"].insert_one(new_user)
    return str(result.inserted_id)

async def login_user(login_data: UserLogin):
    db = get_database()
    
    user = await db["users"].find_one({"email": login_data.email})
    if not user or not verify_password(login_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "email": user["email"], "role": user["role"]}
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"]
        }
    }
