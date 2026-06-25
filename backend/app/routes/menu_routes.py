from fastapi import APIRouter, Depends, HTTPException, status
from app.services.menu_service import menu_service
from app.schemas.menu_schema import MenuCreate, MenuUpdate, MenuOut
from app.middleware.auth_middleware import get_admin_user, get_current_user

from typing import List, Optional

router = APIRouter(prefix="/menu", tags=["Menu"])

@router.get("", response_model=List[MenuOut])
async def get_menu(category: Optional[str] = None):
    return await menu_service.get_all_items(category)

@router.get("/{item_id}", response_model=MenuOut)
async def get_menu_item(item_id: str):
    item = await menu_service.get_item_by_id(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item

@router.post("", response_model=MenuOut, status_code=status.HTTP_201_CREATED)
async def create_menu_item(item_data: MenuCreate, admin: dict = Depends(get_admin_user)):
    return await menu_service.create_item(item_data)

@router.put("/{item_id}", response_model=MenuOut)
async def update_menu_item(item_id: str, item_data: MenuUpdate, admin: dict = Depends(get_admin_user)):
    item = await menu_service.update_item(item_id, item_data)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item

@router.delete("/{item_id}")
async def delete_menu_item(item_id: str, admin: dict = Depends(get_admin_user)):
    success = await menu_service.delete_item(item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return {"message": "Menu item deleted successfully"}

@router.patch("/{item_id}/availability", response_model=MenuOut)
async def toggle_availability(item_id: str, availability: bool, admin: dict = Depends(get_admin_user)):
    item = await menu_service.toggle_availability(item_id, availability)
    if not item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return item
