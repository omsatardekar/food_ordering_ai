from app.database.mongodb import get_database
from app.models.menu_model import MenuItem
from app.schemas.menu_schema import MenuCreate, MenuUpdate
from bson import ObjectId
from datetime import datetime
from typing import List, Optional

class MenuService:
    @property
    def collection(self):
        return get_database()["menu_items"]

    async def get_all_items(self, category: Optional[str] = None) -> List[dict]:
        query = {}
        if category:
            query["category"] = category
        
        items = []
        async for item in self.collection.find(query):
            item["id"] = str(item["_id"])
            if "created_at" not in item:
                item["created_at"] = datetime.utcnow()
            items.append(item)
        return items

    async def get_item_by_id(self, item_id: str) -> Optional[dict]:
        if not ObjectId.is_valid(item_id):
            return None
        item = await self.collection.find_one({"_id": ObjectId(item_id)})
        if item:
            item["id"] = str(item["_id"])
            if "created_at" not in item:
                item["created_at"] = datetime.utcnow()
            return item
        return None

    async def create_item(self, item_data: MenuCreate) -> dict:
        item_dict = item_data.model_dump()
        item_dict["created_at"] = datetime.utcnow()

        result = await self.collection.insert_one(item_dict)
        item_dict["id"] = str(result.inserted_id)
        return item_dict

    async def update_item(self, item_id: str, item_data: MenuUpdate) -> Optional[dict]:
        if not ObjectId.is_valid(item_id):
            return None
        
        update_data = {k: v for k, v in item_data.model_dump().items() if v is not None}

        if not update_data:
            return await self.get_item_by_id(item_id)

        await self.collection.update_one(
            {"_id": ObjectId(item_id)},
            {"$set": update_data}
        )
        return await self.get_item_by_id(item_id)

    async def delete_item(self, item_id: str) -> bool:
        if not ObjectId.is_valid(item_id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(item_id)})
        return result.deleted_count > 0

    async def toggle_availability(self, item_id: str, availability: bool) -> Optional[dict]:
        if not ObjectId.is_valid(item_id):
            return None
        
        await self.collection.update_one(
            {"_id": ObjectId(item_id)},
            {"$set": {"availability": availability}}
        )
        return await self.get_item_by_id(item_id)

menu_service = MenuService()
