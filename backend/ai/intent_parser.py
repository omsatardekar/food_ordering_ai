import re
from ai.keyword_dictionary import CATEGORY_MAPPINGS, SEMANTIC_KEYWORDS, NEGATION_TRIGGERS

class IntentParser:
    """
    Parses natural language queries into structured search filters.
    Enhanced to handle negations, price ranges, and subtle user intents.
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
        price_match = re.search(r'(?:under|below|less than|budget|under|within|around)\s*(?:rs\.?|rupees|inr)?\s*(\d+)', query)
        if price_match:
            intent["max_price"] = float(price_match.group(1))
            
        # 2. Context-Aware Negation & Intent Extraction
        # Split query into segments based on conjunctions
        segments = re.split(r'\s*(?:and|but|with|also|,)\s*', query)
        
        for segment in segments:
            # Check if this segment is negated
            is_negated = any(word in segment for word in NEGATION_TRIGGERS)
            
            # --- Spicy Check ---
            spicy_words = ["spicy", "hot", "fiery", "masala", "pepper", "chilli"]
            if any(word in segment for word in spicy_words):
                if is_negated:
                    intent["spicy"] = False
                else:
                    intent["spicy"] = True
            
            # --- Non-Spicy Specific Check --- (e.g., "mild", "sweet")
            if any(word in segment for word in ["mild", "sweet", "bland", "not spicy"]):
                intent["spicy"] = False

            # --- Dietary Check ---
            meat_words = ["non veg", "non-veg", "chicken", "mutton", "fish", "meat", "egg", "nonveg", "prawns"]
            veg_words = ["vegetarian", "pure veg", "veg", "plant based", "paneer", "vegetables"]
            
            if any(word in segment for word in meat_words):
                if is_negated:
                    intent["vegetarian"] = True # "No meat" -> Vegetarian
                else:
                    intent["vegetarian"] = False
            elif any(word in segment for word in veg_words):
                if is_negated:
                    intent["vegetarian"] = False # "No veg" -> Non-Veg
                else:
                    intent["vegetarian"] = True

        # 3. Category Detection
        # Match against predefined mappings
        for word, cat in CATEGORY_MAPPINGS.items():
            if word in query:
                final_cat = cat
                # Adjust for Non-Veg context
                if intent["vegetarian"] is False:
                    if cat == "Veg Starters": final_cat = "Non-Veg Starters"
                    if cat == "Veg Main Course": final_cat = "Non-Veg Main Course"
                intent["category"] = final_cat
                break
                
        # 4. Keyword & Semantic Triggers
        # Use SEMANTIC_KEYWORDS to broaden the search
        for trigger, related in SEMANTIC_KEYWORDS.items():
            if trigger in query:
                # Only add if the trigger isn't being negated in its segment
                # (Simple check: is the trigger near a negation word?)
                trigger_match = re.search(rf'({"|".join(NEGATION_TRIGGERS)})\s+\w*\s*{trigger}', query)
                if not trigger_match:
                    intent["keywords"].extend(related)
                else:
                    # If it IS negated, we add the related keywords to exclusions
                    intent["excluded_keywords"].extend(related)
        
        # 5. Fine-grained Exclusions
        # Extract specific words that follow a negation
        words = query.split()
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
        
        # Deduplicate and Clean
        intent["keywords"] = list(set(intent["keywords"]))
        intent["excluded_keywords"] = list(set(intent["excluded_keywords"]))
        
        return intent

intent_parser = IntentParser()
