import asyncio
import sys
import os
from datetime import datetime

# Add the project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from motor.motor_asyncio import AsyncIOMotorClient
from app.config.settings import settings

MENU_ITEMS = [
    # Veg Starters (5)
    {"name": "Paneer Tikka", "description": "Classic tandoor-grilled cottage cheese cubes with peppers.", "category": "Veg Starters", "price": 280, "is_vegetarian": True, "is_spicy": True, "image_url": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format"},
    {"name": "Hara Bhara Kabab", "description": "Spinach and green pea patties with traditional Indian spices.", "category": "Veg Starters", "price": 240, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=600&auto=format"},
    {"name": "Veg Manchurian", "description": "Crispy vegetable balls tossed in a tangy soy-ginger sauce.", "category": "Veg Starters", "price": 210, "is_vegetarian": True, "is_spicy": True, "image_url": "https://images.unsplash.com/photo-1512058560366-cd242d4536ee?w=600&auto=format"},
    {"name": "Crispy Corn", "description": "Golden fried corn kernels with lime, onions, and green chilies.", "category": "Veg Starters", "price": 220, "is_vegetarian": True, "is_spicy": True, "image_url": "https://images.unsplash.com/photo-1514327605112-b887c0e61c0a?w=600&auto=format"},
    {"name": "Veg Steamed Momos", "description": "Delicate street-style dumplings filled with minced veg.", "category": "Veg Starters", "price": 180, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=600&auto=format"},

    # Non-Veg Starters (5)
    {"name": "Chicken Tikka", "description": "Roasted chicken chunks marinated in spicy yogurt and red chilies.", "category": "Non-Veg Starters", "price": 350, "is_vegetarian": False, "is_spicy": True, "image_url": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&auto=format"},
    {"name": "Chicken Malai Tikka", "description": "Creamy and mild chicken chunks grilled to perfection.", "category": "Non-Veg Starters", "price": 380, "is_vegetarian": False, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&auto=format"},
    {"name": "Fish Amritsari", "description": "Amritsari style batter-fried fish with carom seeds.", "category": "Non-Veg Starters", "price": 450, "is_vegetarian": False, "is_spicy": True, "image_url": "https://images.unsplash.com/photo-1560684352-8497838a2229?w=600&auto=format"},
    {"name": "Chicken Lollipop", "description": "Drums of heaven - crispy fried chicken wings in spicy red sauce.", "category": "Non-Veg Starters", "price": 320, "is_vegetarian": False, "is_spicy": True, "image_url": "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&auto=format"},
    {"name": "Mutton Seekh Kabab", "description": "Minced mutton skewers seasoned with aromatic herbs.", "category": "Non-Veg Starters", "price": 480, "is_vegetarian": False, "is_spicy": True, "image_url": "https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=600&auto=format"},

    # Veg Main Course (5)
    {"name": "Paneer Butter Masala", "description": "Rich and creamy tomato-based cottage cheese curry.", "category": "Veg Main Course", "price": 350, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format"},
    {"name": "Dal Makhani", "description": "Slow-cooked black lentils with white butter and cream.", "category": "Veg Main Course", "price": 290, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format"},
    {"name": "Palak Paneer", "description": "Cottage cheese cubes in a smooth spinach and garlic gravy.", "category": "Veg Main Course", "price": 320, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1613292443284-8d10ef9383fe?w=600&auto=format"},
    {"name": "Malai Kofta", "description": "Soft paneer balls in a rich cashew and cream sauce.", "category": "Veg Main Course", "price": 340, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1585937421612-70a0f295561a?w=600&auto=format"},
    {"name": "Mix Vegetable", "description": "Seasonal garden fresh vegetables cooked with Indian masalas.", "category": "Veg Main Course", "price": 260, "is_vegetarian": True, "is_spicy": True, "image_url": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&auto=format"},

    # Non-Veg Main Course (5)
    {"name": "Butter Chicken", "description": "Grilled chicken cooked in a smooth, sweet, and buttery tomato sauce.", "category": "Non-Veg Main Course", "price": 420, "is_vegetarian": False, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1603894584114-603175ef071e?w=600&auto=format"},
    {"name": "Mutton Rogan Josh", "description": "A classic Kashmiri lamb delicacy with rich aromatic gravy.", "category": "Non-Veg Main Course", "price": 550, "is_vegetarian": False, "is_spicy": True, "image_url": "https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=600&auto=format"},
    {"name": "Chicken Kadai", "description": "Chicken pieces cooked with bell peppers and freshly ground spices.", "category": "Non-Veg Main Course", "price": 390, "is_vegetarian": False, "is_spicy": True, "image_url": "https://images.unsplash.com/photo-1603894584114-603175ef071e?w=600&auto=format"},
    {"name": "Fish Curry", "description": "Bengali style fish cooked in a tangy mustard and tomato gravy.", "category": "Non-Veg Main Course", "price": 460, "is_vegetarian": False, "is_spicy": True, "image_url": "https://images.unsplash.com/photo-1560684352-8497838a2229?w=600&auto=format"},
    {"name": "Egg Masala", "description": "Boiled eggs cooked in a spicy onion and tomato thick gravy.", "category": "Non-Veg Main Course", "price": 280, "is_vegetarian": False, "is_spicy": True, "image_url": "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=600&auto=format"},

    # Rice & Biryani (4)
    {"name": "Chicken Dum Biryani", "description": "Basmati rice cooked with marinated chicken on slow 'dum'.", "category": "Rice", "price": 420, "is_vegetarian": False, "is_spicy": True, "image_url": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format"},
    {"name": "Veg Pulao", "description": "Fragrant basmati rice cooked with garden vegetables and saffron.", "category": "Rice", "price": 280, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?w=600&auto=format"},
    {"name": "Jeera Rice", "description": "Basmati rice tempered with cumin seeds and whole spices.", "category": "Rice", "price": 180, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format"},
    {"name": "Steamed Rice", "description": "Plain and fluffy white steamed basmati rice.", "category": "Rice", "price": 140, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&auto=format"},

    # Breads (3)
    {"name": "Butter Naan", "description": "Soft and fluffy tandoor-baked flatbread with butter.", "category": "Breads", "price": 60, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?w=600&auto=format"},
    {"name": "Garlic Naan", "description": "Freshly baked naan topped with chopped garlic and coriander.", "category": "Breads", "price": 75, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&auto=format"},
    {"name": "Tandoori Roti", "description": "Healthy whole wheat bread baked in a traditional clay oven.", "category": "Breads", "price": 35, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1548365328-8c6db3220e4c?w=600&auto=format"},

    # Desserts (3)
    {"name": "Gulab Jamun", "description": "Warm and sweet dumplings soaked in rose sugar syrup.", "category": "Desserts", "price": 120, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1589119908995-c6837939443b?w=600&auto=format"},
    {"name": "Rasmalai", "description": "Soft cottage cheese discs in sweetened thick saffron milk.", "category": "Desserts", "price": 150, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=600&auto=format"},
    {"name": "Gajar Ka Halwa", "description": "Classic carrot pudding slow-cooked with ghee and nuts.", "category": "Desserts", "price": 180, "is_vegetarian": True, "is_spicy": False, "image_url": "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600&auto=format"}
]

async def seed():
    client = AsyncIOMotorClient(settings.MONGODB_URL)
    db = client[settings.DATABASE_NAME]
    collection = db["menu_items"]

    # Delete existing items first
    await collection.delete_many({})
    
    # Add created_at and availability to each item
    for item in MENU_ITEMS:
        item["created_at"] = datetime.utcnow()
        item["availability"] = True

    result = await collection.insert_many(MENU_ITEMS)
    print(f"Successfully seeded {len(result.inserted_ids)} highly accurate menu items.")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed())
