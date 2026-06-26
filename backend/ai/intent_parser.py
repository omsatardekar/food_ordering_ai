import re
from ai.keyword_dictionary import CATEGORY_MAPPINGS, SEMANTIC_KEYWORDS, NEGATION_TRIGGERS

class IntentParser:
    """
    Parses natural language queries into structured search filters.
    Optimized for dietary accuracy (Veg vs Non-Veg).
    """
    
    def parse(self, query):
        orig_query = query.lower().strip()
        query = f" {orig_query} " # Add padding for easier regex/word matching
        
        intent = {
            "vegetarian": None,
            "spicy": None,
            "max_price": None,
            "category": None,
            "keywords": [],
            "excluded_keywords": []
        }
        
        # 1. Price Extraction
        price_match = re.search(r'(?:under|below|less than|budget|under|within|around)\s*(?:rs\.?|rupees|inr)?\s*(\d+)', query)
        if price_match:
            intent["max_price"] = float(price_match.group(1))
            
        # 2. Dietary Detection (Whole word matching to avoid "veg" in "non-veg" confusion)
        meat_keywords = ["non-veg", "non veg", "nonveg", "chicken", "mutton", "fish", "meat", "egg", "prawns", "kebab"]
        veg_keywords = ["vegetarian", "pure veg", "veg", "plant based", "paneer", "vegetables", "poha", "upma"]
        
        # Check for Non-Veg FIRST to prevent "veg" substring match from taking priority
        is_meat = any(re.search(rf'\b{word}\b', query) for word in meat_keywords)
        is_veg = any(re.search(rf'\b{word}\b', query) for word in veg_keywords)
        
        # Determine strict preference
        if is_meat:
            intent["vegetarian"] = False
        elif is_veg:
            intent["vegetarian"] = True

        # 3. Context-Aware segments for Spicy and Negation
        segments = re.split(r'\s*(?:and|but|with|also|,)\s*', query)
        for segment in segments:
            is_negated = any(re.search(rf'\b{word}\b', segment) for word in NEGATION_TRIGGERS)
            
            # --- Spicy Check ---
            spicy_words = ["spicy", "hot", "fiery", "masala", "pepper", "chilli"]
            if any(re.search(rf'\b{word}\b', segment) for word in spicy_words):
                intent["spicy"] = False if is_negated else True
            
            # --- Non-Spicy Specific Check ---
            if any(re.search(rf'\b{word}\b', segment) for word in ["mild", "sweet", "bland", "not spicy"]):
                intent["spicy"] = False

        # 4. Category Detection
        for word, cat in CATEGORY_MAPPINGS.items():
            if re.search(rf'\b{word}\b', query):
                final_cat = cat
                if intent["vegetarian"] is False:
                    # Map categories to their non-veg counterparts if non-veg is detected
                    if cat == "Veg Starters": final_cat = "Non-Veg Starters"
                    if cat == "Veg Main Course": final_cat = "Non-Veg Main Course"
                intent["category"] = final_cat
                break
                
        # 5. Keyword & Semantic Triggers
        for trigger, related in SEMANTIC_KEYWORDS.items():
            if re.search(rf'\b{trigger}\b', query):
                # Simple negation check for trigger
                trigger_match = any(re.search(rf'\b{neg}\b.*?\b{trigger}\b', query) for neg in NEGATION_TRIGGERS)
                if not trigger_match:
                    intent["keywords"].extend(related)
                else:
                    intent["excluded_keywords"].extend(related)
        
        # 6. Extraction of Excluded Keywords
        words = orig_query.split()
        is_marking_exclusions = False
        for i, word in enumerate(words):
            if word in NEGATION_TRIGGERS:
                is_marking_exclusions = True
                continue
            if is_marking_exclusions:
                if len(word) > 3 and word not in ["dish", "food", "want", "some"]:
                    intent["excluded_keywords"].append(word)
                if word in ["and", "but", "also"]:
                    is_marking_exclusions = False
        
        # Cleanup
        intent["keywords"] = list(set(intent["keywords"]))
        intent["excluded_keywords"] = list(set(intent["excluded_keywords"]))
        
        return intent

intent_parser = IntentParser()
