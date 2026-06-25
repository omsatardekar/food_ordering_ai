from app.database.mongodb import get_database
from app.schemas.user_schema import AdminCreate, UserUpdate
from app.utils.password_handler import hash_password
from bson import ObjectId
from typing import List, Optional

class AdminService:
    @property
    def collection(self):
        return get_database()["users"]

    async def get_all_users(self, search: Optional[str] = None) -> List[dict]:
        query = {"role": "customer"} # By default only show customers
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}}
            ]
        
        users = []
        async for user in self.collection.find(query):
            user["id"] = str(user["_id"])
            users.append(user)
        return users

    async def get_user_by_id(self, user_id: str) -> Optional[dict]:
        if not ObjectId.is_valid(user_id):
            return None
        user = await self.collection.find_one({"_id": ObjectId(user_id)})
        if user:
            user["id"] = str(user["_id"])
            # Get last 5 orders
            orders_col = get_database()["orders"]
            orders = []
            async for order in orders_col.find({"user_id": ObjectId(user_id)}).sort("created_at", -1).limit(5):
                order["id"] = str(order["_id"])
                orders.append(order)
            user["recent_orders"] = orders
            return user
        return None

    async def delete_user(self, user_id: str) -> bool:
        if not ObjectId.is_valid(user_id):
            return False
        result = await self.collection.delete_one({"_id": ObjectId(user_id)})
        return result.deleted_count > 0

    async def update_user_status(self, user_id: str, disabled: bool) -> Optional[dict]:
        if not ObjectId.is_valid(user_id):
            return None
        
        await self.collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": {"is_disabled": disabled}}
        )
        return await self.get_user_by_id(user_id)

    async def create_admin(self, admin_data: AdminCreate) -> dict:
        admin_dict = {
            "name": admin_data.name,
            "email": admin_data.email,
            "password": hash_password(admin_data.password),
            "role": "admin"
        }
        result = await self.collection.insert_one(admin_dict)
        admin_dict["id"] = str(result.inserted_id)
        del admin_dict["password"]
        return admin_dict

admin_service = AdminService()
