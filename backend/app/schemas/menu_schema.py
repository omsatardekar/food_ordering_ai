from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MenuBase(BaseModel):
    name: str
    description: str
    category: str
    price: float
    is_vegetarian: bool = True
    is_spicy: bool = False
    availability: bool = True
    image_url: Optional[str] = None

class MenuCreate(MenuBase):
    pass

class MenuUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    is_vegetarian: Optional[bool] = None
    is_spicy: Optional[bool] = None
    availability: Optional[bool] = None
    image_url: Optional[str] = None

class MenuOut(MenuBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
