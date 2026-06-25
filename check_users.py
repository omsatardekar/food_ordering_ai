import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def check_users():
    url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
    client = AsyncIOMotorClient(url)
    db = client[os.getenv("DATABASE_NAME", "food_ordering_db")]
    async for user in db["users"].find({}):
        print(f"Name: {user.get('name')}, Email: {user.get('email')}, Role: {user.get('role')}")

if __name__ == "__main__":
    asyncio.run(check_users())
