from fastapi import APIRouter, Depends, HTTPException, status
from app.services.admin_service import admin_service
from app.services.analytics_service import analytics_service
from app.schemas.user_schema import UserOut, UserUpdate, AdminCreate
from app.middleware.auth_middleware import get_admin_user

from typing import List, Optional

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/users", response_model=List[UserOut])
async def get_users(search: Optional[str] = None, admin: dict = Depends(get_admin_user)):
    return await admin_service.get_all_users(search)

@router.get("/users/{user_id}")
async def get_user_detail(user_id: str, admin: dict = Depends(get_admin_user)):
    user = await admin_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/users/{user_id}")
async def delete_user(user_id: str, admin: dict = Depends(get_admin_user)):
    success = await admin_service.delete_user(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted successfully"}

@router.put("/users/{user_id}/disable")
async def disable_user(user_id: str, admin: dict = Depends(get_admin_user)):
    user = await admin_service.update_user_status(user_id, True)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.put("/users/{user_id}/enable")
async def enable_user(user_id: str, admin: dict = Depends(get_admin_user)):
    user = await admin_service.update_user_status(user_id, False)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("/create-admin", status_code=status.HTTP_201_CREATED)
async def create_admin(admin_data: AdminCreate, admin: dict = Depends(get_admin_user)):
    return await admin_service.create_admin(admin_data)

@router.get("/stats")
async def get_dashboard_stats(admin: dict = Depends(get_admin_user)):
    return await analytics_service.get_dashboard_stats()

@router.get("/analytics")
async def get_full_analytics(admin: dict = Depends(get_admin_user)):
    return await analytics_service.get_full_analytics()
