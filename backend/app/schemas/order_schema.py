from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class OrderItem(BaseModel):
    menu_item_id: str
    name: str
    quantity: int
    price: float
    instructions: Optional[str] = None

class OrderBase(BaseModel):
    items: List[OrderItem]
    total_amount: float
    status: str = "Placed"
    payment_method: str = "Unknown"
    customer_name: str = "Unknown"
    customer_mobile: str = "Unknown"
    delivery_address: str = "Unknown"

class OrderCreate(OrderBase):
    pass # user_id will be added from token

class OrderOut(OrderBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str

class OrderTracking(BaseModel):
    id: str
    status: str
    updated_at: datetime
    # history can be added if needed, but for now we follow the flow:
    # Placed -> Confirmed -> Preparing -> Ready -> Picked Up
