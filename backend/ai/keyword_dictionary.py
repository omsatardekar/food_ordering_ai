"""
Keyword Dictionary for Natural Language Understanding
Maps common terms and synonyms to categories or search keywords.
Expanded for cultural dishes and healthy lifestyle terms.
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
    "soup": "Veg Starters",
}

# Semantic triggers for broadening search
SEMANTIC_KEYWORDS = {
    "light lunch": ["salad", "sandwich", "soup", "pulao", "dal", "light", "khichdi", "curd rice", "roti", "sabji"],
    "healthy": [
        "steamed", "grilled", "salad", "vegetables", "leafy", "sprouts", "roasted", 
        "low calorie", "rajma", "chole", "dal", "protein", "oats", "millet", "wheat",
        "boiled", "baked", "sugar free", "fruit", "juice"
    ],
    "heavy meal": ["biryani", "paneer", "butter masala", "thali", "mutton", "chicken", "meat", "loaded", "full meal"],
    "spicy": ["tikka", "masala", "chilli", "schezwan", "kadai", "peri peri", "vindaloo", "kolhapuri", "sizzling", "hot"],
    "sweet": ["halwa", "gulab jamun", "ice cream", "mousse", "pudding", "shake", "chocolate", "caramel", "honey"],
    "cheap": ["budget", "value", "combo", "under", "affordable", "saver", "deal", "student"],
    "refreshing": ["mint", "lemon", "juice", "soda", "cooler", "iced", "mojito", "fruit"],
    "fried": ["pakora", "crispy", "deep fried", "fritters", "crunchy", "tempura"],
    "paneer": ["cottage cheese", "paneer", "tofu"],
    "italian": ["pasta", "pizza", "lasagna", "risotto", "cheese", "herb"],
    "traditional": ["home style", "authentic", "classic", "heritage", "grandma", "desi"],
    "signature": ["chef special", "recommended", "must try", "award winning", "famous"],
    "soft": ["naan", "roti", "kulcha", "soft", "melt in mouth", "marshmallow", "pudding", "tender"],
    "crispy": ["fried", "crunchy", "crisp", "papad", "crackers", "nachos"],
    "juicy": ["kebab", "meat", "grilled", "succulent", "tender"],
    "cheesy": ["mozzarella", "parmesan", "cheese sauce", "loaded", "gouda", "chedder"],
    "breakfast": ["poha", "upma", "paratha", "omelette", "toast", "pancakes"],
    "rajma": ["rajma", "kidney beans", "red beans", "chawal"],
    "chole": ["chickpeas", "chole", "bhature", "kabuli"],
}

# Negative triggers
NEGATION_TRIGGERS = [
    "not", "no", "without", "dont", "don't", "avoid", "low", 
    "never", "less", "exclude", "zero", "stop"
]
