from fastapi import APIRouter, Depends, HTTPException
from app.middleware.auth_middleware import get_current_user

from app.database.mongodb import get_database
from app.services.order_service import order_service
from app.services.auth_service import verify_password
from app.utils.password_handler import hash_password
from app.schemas.user_schema import UserUpdate, PasswordUpdate

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("")
async def get_profile(user: dict = Depends(get_current_user)):
    user_id = str(user["_id"])
    
    # Get stats
    orders = await order_service.get_my_orders(user_id)
    total_spent = sum(order["total_amount"] for order in orders if order["status"] == "Picked Up")
    
    return {
        "id": user_id,
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "created_at": user.get("created_at"),
        "stats": {
            "total_orders": len(orders),
            "total_spent": round(total_spent, 2)
        }
    }

@router.put("")
async def update_profile(update_data: UserUpdate, user: dict = Depends(get_current_user)):
    db = get_database()
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if "password" in update_dict:
        update_dict["password"] = hash_password(update_dict["password"])
        
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": update_dict}
    )
    return {"message": "Profile updated successfully"}

@router.put("/password")
async def update_password(data: PasswordUpdate, user: dict = Depends(get_current_user)):
    if not verify_password(data.current_password, user["password"]):
        raise HTTPException(status_code=400, detail="Current password incorrect")
    
    db = get_database()
    await db["users"].update_one(
        {"_id": user["_id"]},
        {"$set": {"password": hash_password(data.new_password)}}
    )
    return {"message": "Password updated successfully"}
