import re
from ai.keyword_dictionary import CATEGORY_MAPPINGS, SEMANTIC_KEYWORDS, NEGATION_TRIGGERS

class IntentParser:
    """
    Parses natural language queries into structured search filters.
    Fixed dietary detection to avoid 'veg' matching inside 'non-veg'.
    """
    
    def parse(self, query):
        # Normalize and keep original for some checks
        raw_query = query.lower().strip()
        
        intent = {
            "vegetarian": None,
            "spicy": None,
            "max_price": None,
            "category": None,
            "keywords": [],
            "excluded_keywords": []
        }
        
        # 1. Price Extraction
        price_match = re.search(r'(?:under|below|less than|budget|under|within|around|affordable)\s*(?:rs\.?|rupees|inr)?\s*(\d+)', raw_query)
        if price_match:
            intent["max_price"] = float(price_match.group(1))
            
        # 2. Context-Aware Negation & Intent Extraction
        segments = re.split(r'\s*(?:and|but|with|also|,)\s*', raw_query)
        
        for segment in segments:
            is_negated = any(re.search(rf'\b{re.escape(word)}\b', segment) for word in NEGATION_TRIGGERS)
            
            # --- Spicy Check ---
            spicy_words = ["spicy", "hot", "fiery", "masala", "pepper", "chilli", "tikka"]
            if any(re.search(rf'\b{re.escape(word)}\b', segment) for word in spicy_words):
                intent["spicy"] = False if is_negated else True
            
            # Specific non-spicy terms
            if any(re.search(rf'\b{re.escape(word)}\b', segment) for word in ["mild", "sweet", "bland", "not spicy"]):
                intent["spicy"] = False

            # --- Dietary Check (Strict Word Boundaries) ---
            meat_words = ["non veg", "non-veg", "chicken", "mutton", "fish", "meat", "egg", "nonveg", "prawns", "kebab"]
            veg_words = ["vegetarian", "pure veg", "veg", "plant based", "paneer", "vegetables", "dal", "soya"]
            
            # Check for meat first
            has_meat = any(re.search(rf'\b{re.escape(word)}\b' if ' ' not in word else re.escape(word), segment) for word in meat_words)
            # Check for veg with strict boundary to avoid matching 'veg' in 'non-veg'
            has_veg = any(re.search(rf'\b{re.escape(word)}\b' if ' ' not in word else re.escape(word), segment) for word in veg_words)
            
            if has_meat:
                intent["vegetarian"] = True if is_negated else False
            elif has_veg:
                intent["vegetarian"] = False if is_negated else True

        # 3. Category Detection
        for word, cat in CATEGORY_MAPPINGS.items():
            if re.search(rf'\b{re.escape(word)}\b', raw_query):
                final_cat = cat
                if intent["vegetarian"] is False:
                    if cat == "Veg Starters": final_cat = "Non-Veg Starters"
                    if cat == "Veg Main Course": final_cat = "Non-Veg Main Course"
                    # Handle Rice/Breads as well
                    if cat == "Rice": final_cat = "Rice" # Usually Rice is ambiguous but can have non-veg
                intent["category"] = final_cat
                break
                
        # 4. Keyword & Semantic Triggers
        for trigger, related in SEMANTIC_KEYWORDS.items():
            if re.search(rf'\b{re.escape(trigger)}\b', raw_query):
                # Check for negation nearby
                neg_match = any(re.search(rf'\b{re.escape(n)}\b\s+(?:\w+\s+)?{re.escape(trigger)}', raw_query) for n in NEGATION_TRIGGERS)
                if not neg_match:
                    intent["keywords"].extend(related)
                else:
                    intent["excluded_keywords"].extend(related)
        
        # 5. Clean Exclusions
        words = raw_query.split()
        is_negating = False
        for i, word in enumerate(words):
            if word in NEGATION_TRIGGERS:
                is_negating = True
                continue
            if is_negating:
                if len(word) > 3 and word not in ["dish", "food", "want", "some"]:
                    intent["excluded_keywords"].append(word)
                if word in ["and", "but", "also"]:
                    is_negating = False
        
        # Final cleanup
        intent["keywords"] = list(set([k for k in intent["keywords"] if k not in intent["excluded_keywords"]]))
        intent["excluded_keywords"] = list(set(intent["excluded_keywords"]))
        
        return intent

intent_parser = IntentParser()
