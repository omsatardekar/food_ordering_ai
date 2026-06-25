from app.database.mongodb import get_database
from app.schemas.order_schema import OrderStatusUpdate
from bson import ObjectId
from typing import List, Optional
from datetime import datetime

class OrderService:
    @property
    def collection(self):
        return get_database()["orders"]

    async def create_order(self, order_data: dict, user_id: str) -> dict:
        order_dict = order_data.copy()
        order_dict["user_id"] = user_id
        order_dict["created_at"] = datetime.utcnow()
        order_dict["updated_at"] = order_dict["created_at"]
        
        result = await self.collection.insert_one(order_dict)
        order_dict["id"] = str(result.inserted_id)
        return order_dict

    async def get_all_orders(self, status: Optional[str] = None) -> List[dict]:
        query = {}
        if status:
            query["status"] = status
        
        orders = []
        async for order in self.collection.find(query).sort("created_at", -1):
            order["id"] = str(order["_id"])
            if "user_id" in order:
                order["user_id"] = str(order["user_id"])
            for item in order.get("items", []):
                if "menu_item_id" in item:
                    item["menu_item_id"] = str(item["menu_item_id"])
            orders.append(order)
        return orders

    async def get_my_orders(self, user_id: str) -> List[dict]:
        query = {"user_id": user_id} # note: depending on whether user_id is saved as str or ObjectId, this query might miss old records, but fixing parsing for now
        orders = []
        async for order in self.collection.find(query).sort("created_at", -1):
            order["id"] = str(order["_id"])
            if "user_id" in order:
                order["user_id"] = str(order["user_id"])
            for item in order.get("items", []):
                if "menu_item_id" in item:
                    item["menu_item_id"] = str(item["menu_item_id"])
            orders.append(order)
        return orders

    async def get_order_by_id(self, order_id: str, user_id: Optional[str] = None) -> Optional[dict]:
        if not ObjectId.is_valid(order_id):
            return None
        
        query = {"_id": ObjectId(order_id)}
        if user_id:
            query["user_id"] = user_id
            
        order = await self.collection.find_one(query)
        if order:
            order["id"] = str(order["_id"])
            if "user_id" in order:
                order["user_id"] = str(order["user_id"])
            for item in order.get("items", []):
                if "menu_item_id" in item:
                    item["menu_item_id"] = str(item["menu_item_id"])
            return order
        return None

    async def update_order_status(self, order_id: str, status_data: OrderStatusUpdate) -> Optional[dict]:
        if not ObjectId.is_valid(order_id):
            return None
        
        await self.collection.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {
                "status": status_data.status,
                "updated_at": datetime.utcnow()
            }}
        )
        return await self.get_order_by_id(order_id)

order_service = OrderService()

