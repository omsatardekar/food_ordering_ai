import asyncio
import sys
import os
from datetime import datetime, timedelta
import random

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings
from bson import ObjectId

async def seed_orders():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    orders_col = db["orders"]
    users_col = db["users"]
    menu_col = db["menu_items"]

    # Clear existing orders
    await orders_col.delete_many({})

    # Get some users and menu items
    users = await users_col.find({"role": "customer"}).to_list(10)
    if not users:
        print("No customers found. Please sign up at least one user first.")
        return

    menu_items = await menu_col.find({"availability": True}).to_list(100)
    if not menu_items:
        print("No menu items found. Please run seed_menu_items.py first.")
        return

    statuses = ["Placed", "Confirmed", "Preparing", "Ready", "Picked Up"]
    
    orders = []
    for i in range(50):
        user = random.choice(users)
        num_items = random.randint(1, 4)
        order_items = []
        total = 0
        
        selected_menu_items = random.sample(menu_items, num_items)
        for mi in selected_menu_items:
            qty = random.randint(1, 3)
            price = mi["price"]
            order_items.append({
                "menu_item_id": mi["_id"],
                "name": mi["name"],
                "quantity": qty,
                "price": price
            })
            total += price * qty

        # Distribute orders over the last 7 days
        days_ago = random.randint(0, 7)
        created_at = datetime.utcnow() - timedelta(days=days_ago, hours=random.randint(0, 23))

        orders.append({
            "user_id": user["_id"],
            "items": order_items,
            "total_amount": round(total, 2),
            "status": random.choice(statuses),
            "created_at": created_at
        })

    result = await orders_col.insert_many(orders)
    print(f"Successfully seeded {len(result.inserted_ids)} orders.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_orders())
