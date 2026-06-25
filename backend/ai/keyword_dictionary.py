"""
Keyword Dictionary for Natural Language Understanding
Maps common terms and synonyms to categories or search keywords.
"""

# Synonyms for categories
CATEGORY_MAPPINGS = {
    "starter": "Veg Starters",
    "starters": "Veg Starters",
    "appetizer": "Veg Starters",
    "appetizers": "Veg Starters",
    "main course": "Veg Main Course",
    "main": "Veg Main Course",
    "mains": "Veg Main Course",
    "gravy": "Veg Main Course",
    "curry": "Veg Main Course",
    "bread": "Breads",
    "roti": "Breads",
    "naan": "Breads",
    "rice": "Rice",
    "biryani": "Rice",
    "pulao": "Rice",
    "dessert": "Desserts",
    "sweet": "Desserts",
    "sweets": "Desserts",
    "beverage": "Beverages",
    "beverages": "Beverages",
    "drink": "Beverages",
    "drinks": "Beverages",
    "cold drink": "Beverages",
}

# Semantic triggers for broadening search
SEMANTIC_KEYWORDS = {
    "light lunch": ["salad", "sandwich", "soup", "pulao", "dal"],
    "healthy": ["steamed", "grilled", "salad", "vegetables", "leafy", "sprouts", "roasted"],
    "heavy meal": ["biryani", "paneer", "butter masala", "thali", "mutton", "chicken", "meat"],
    "spicy": ["tikka", "masala", "chilli", "schezwan", "kadai", "peri peri", "vindaloo", "kolhapuri"],
    "sweet": ["halwa", "gulab jamun", "ice cream", "mousse", "pudding", "shake", "chocolate", "caramel"],
    "cheap": ["budget", "value", "combo", "under", "affordable", "saver"],
    "refreshing": ["mint", "lemon", "juice", "soda", "cooler", "iced", "mojito"],
    "fried": ["pakora", "crispy", "deep fried", "fritters", "crunchy"],
    "paneer": ["cottage cheese", "paneer"],
    "italian": ["pasta", "pizza", "lasagna", "risotto", "cheese"],
    "traditional": ["home style", "authentic", "classic", "heritage"],
    "signature": ["chef special", "recommended", "must try"],
    "soft": ["naan", "roti", "kulcha", "soft", "melt in mouth", "marshmallow", "pudding"],
    "crispy": ["fried", "crunchy", "crisp", "papad", "crackers"],
    "juicy": ["kebab", "meat", "grilled", "succulent"],
    "cheesy": ["mozzarella", "parmesan", "cheese sauce", "loaded"],
}

# Negative triggers (for "not" logic)
NEGATION_TRIGGERS = ["not", "no", "without", "dont", "don't", "avoid", "low"]
