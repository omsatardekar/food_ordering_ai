import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import bcrypt
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "food_ordering_db")

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

async def create_admin():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    admin_email = "admin@food.com"
    admin_password = "password123"
    
    # Check if admin already exists
    existing_admin = await db["users"].find_one({"email": admin_email})
    if existing_admin:
        print(f"Admin with email {admin_email} already exists.")
        return

    admin_user = {
        "name": "System Admin",
        "email": admin_email,
        "password": hash_password(admin_password),
        "role": "admin",
        "created_at": datetime.utcnow()
    }
    
    await db["users"].insert_one(admin_user)
    print(f"Admin created successfully!")
    print(f"Email: {admin_email}")
    print(f"Password: {admin_password}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(create_admin())
