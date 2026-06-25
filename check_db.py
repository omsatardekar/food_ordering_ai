import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

async def check_mongo():
    try:
        url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        client = AsyncIOMotorClient(url, serverSelectionTimeoutMS=2000)
        db_name = os.getenv("DATABASE_NAME", "food_ordering_db")
        db = client[db_name]
        
        # Try a simple command
        await client.admin.command('ping')
        print("MongoDB is UP")
        
        collections = await db.list_collection_names()
        print(f"Collections in {db_name}: {collections}")
        
        for coll in collections:
            count = await db[coll].count_documents({})
            print(f" - {coll}: {count} documents")
            
    except Exception as e:
        print(f"MongoDB check failed: {e}")

if __name__ == "__main__":
    asyncio.run(check_mongo())
