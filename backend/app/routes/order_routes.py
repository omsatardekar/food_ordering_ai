from fastapi import APIRouter, Depends, HTTPException, status
from app.services.order_service import order_service
from app.schemas.order_schema import OrderOut, OrderStatusUpdate, OrderCreate, OrderTracking
from app.middleware.auth_middleware import get_admin_user, get_current_user

from typing import List, Optional

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("", response_model=OrderOut, status_code=status.HTTP_201_CREATED)
async def create_order(order_data: OrderCreate, user: dict = Depends(get_current_user)):
    return await order_service.create_order(order_data.model_dump(), str(user["_id"]))

@router.get("/my-orders", response_model=List[OrderOut])
async def get_my_orders(user: dict = Depends(get_current_user)):
    return await order_service.get_my_orders(str(user["_id"]))

@router.get("", response_model=List[OrderOut])
async def get_all_orders(status: Optional[str] = None, admin: dict = Depends(get_admin_user)):
    return await order_service.get_all_orders(status)

@router.get("/{order_id}", response_model=OrderOut)
async def get_order_detail(order_id: str, user: dict = Depends(get_current_user)):
    # If user is admin, they can see any order. If customer, only their own.
    user_id = None if user["role"] == "admin" else str(user["_id"])
    order = await order_service.get_order_by_id(order_id, user_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.get("/{order_id}/tracking", response_model=OrderTracking)
async def get_order_tracking(order_id: str, user: dict = Depends(get_current_user)):
    user_id = None if user["role"] == "admin" else str(user["_id"])
    order = await order_service.get_order_by_id(order_id, user_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    return {
        "id": order["id"],
        "status": order["status"],
        "updated_at": order["updated_at"]
    }

@router.patch("/{order_id}/status", response_model=OrderOut)
async def update_order_status(order_id: str, status_data: OrderStatusUpdate, admin: dict = Depends(get_admin_user)):
    order = await order_service.update_order_status(order_id, status_data)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order
