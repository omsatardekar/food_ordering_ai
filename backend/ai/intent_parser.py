import re
from ai.keyword_dictionary import CATEGORY_MAPPINGS, SEMANTIC_KEYWORDS, NEGATION_TRIGGERS

class IntentParser:
    """
    Parses natural language queries into structured search filters.
    Works offline using regex and rule-based heuristic matching.
    """
    
    def parse(self, query):
        query = query.lower().strip()
        
        intent = {
            "vegetarian": None,
            "spicy": None,
            "max_price": None,
            "category": None,
            "keywords": [],
            "excluded_keywords": []
        }
        
        # 1. Price Extraction (e.g., "under 200", "below 150")
        price_match = re.search(r'(?:under|below|less than|budget|under|within)\s*(?:rs\.?|rupees|inr)?\s*(\d+)', query)
        if price_match:
            intent["max_price"] = float(price_match.group(1))
            
        # 2. Dietary Detection
        if any(word in query for word in ["non veg", "non-veg", "chicken", "mutton", "fish", "meat", "egg", "nonveg"]):
            intent["vegetarian"] = False
        elif any(word in query for word in ["vegetarian", "pure veg", "veg", "plant based"]):
            intent["vegetarian"] = True
            
        if any(word in query for word in ["spicy", "hot", "fiery", "masala"]):
            intent["spicy"] = True
        elif any(word in query for word in ["mild", "sweet", "not spicy", "bland"]):
            intent["spicy"] = False
            
        # 3. Category Detection
        is_non_veg_query = any(word in query for word in ["non veg", "non-veg", "chicken", "mutton", "fish", "meat", "egg"])
        
        for word, cat in CATEGORY_MAPPINGS.items():
            if word in query:
                final_cat = cat
                # Switch to Non-Veg if specified
                if is_non_veg_query:
                    if cat == "Veg Starters": final_cat = "Non-Veg Starters"
                    if cat == "Veg Main Course": final_cat = "Non-Veg Main Course"
                
                intent["category"] = final_cat
                break
                
        # 4. Keyword & Negation Extraction
        # First, detect all semantic triggers present in the query
        for trigger, related in SEMANTIC_KEYWORDS.items():
            if trigger in query:
                intent["keywords"].extend(related)
        
        # Then, handle individual words and negations
        words = query.split()
        is_negated = False
        
        for word in words:
            # Check for negation triggers
            if word in NEGATION_TRIGGERS:
                is_negated = True
                continue
                
            # If we are in a negation block, track exclusions
            if is_negated and len(word) > 3 and word not in ["dish", "food", "something", "have", "and", "with"]:
                intent["excluded_keywords"].append(word)
                    
            # Reset negation for next segment if we hit a conjunction
            if word in ["and", "but", "with", "also"]:
                is_negated = False
        
        # Deduplicate keywords
        intent["keywords"] = list(set(intent["keywords"]))
        intent["excluded_keywords"] = list(set(intent["excluded_keywords"]))
        
        return intent

intent_parser = IntentParser()
