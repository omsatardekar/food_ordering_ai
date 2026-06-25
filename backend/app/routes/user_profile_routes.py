from fastapi import APIRouter, Depends, HTTPException
from app.middleware.auth_middleware import get_current_user

from app.database.mongodb import get_database
from app.services.order_service import order_service

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("")
async def get_profile(user: dict = Depends(get_current_user)):
    user_id = str(user["_id"])
    
    # Get stats
    orders = await order_service.get_my_orders(user_id)
    total_spent = sum(order["total_amount"] for order in orders if order["status"] == "Picked Up")
    
    return {
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
        "created_at": user.get("created_at"),
        "stats": {
            "total_orders": len(orders),
            "total_spent": round(total_spent, 2)
        }
    }
