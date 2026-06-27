import re
from ai.keyword_dictionary import CATEGORY_MAPPINGS, SEMANTIC_KEYWORDS, NEGATION_TRIGGERS
from ai.llm_fallback import llm_fallback

class IntentParser:
    """
    Parses natural language queries into structured search filters.
    Optimized for dietary accuracy (Veg vs Non-Veg).
    Now includes an LLM fallback for complex, nuanced queries.
    """
    
    async def parse(self, query):
        orig_query = query.lower().strip()
        
        # --- Stage 1: Rule-Based Parsing (Fast, Local) ---
        intent = self._rule_based_parse(orig_query)
        
        # --- Stage 2: Fallback to LLM if needed ---
        # Trigger LLM if the local parser is "dry" OR if the query is long AND local results are incomplete.
        word_count = len(orig_query.split())
        is_dry = (intent["vegetarian"] is None and 
                  intent["spicy"] is None and 
                  intent["max_price"] is None and 
                  intent["category"] is None and 
                  not intent["keywords"])
        
        # Only call LLM for long queries if we haven't already found a lot of local info
        is_conversational_and_vague = word_count >= 5 and (intent["spicy"] is None or not intent["keywords"])
        
        should_use_llm = is_dry or is_conversational_and_vague
        
        if should_use_llm:
            if not llm_fallback.enabled:
                print(f"DEBUG: LLM Fallback is DISABLED (Check your GROQ_API_KEY in .env)")
            else:
                llm_intent = await llm_fallback.parse_query(orig_query)
                if llm_intent:
                    # Merge LLM results into our intent dictionary
                    for key in intent:
                        if llm_intent.get(key) is not None:
                            intent[key] = llm_intent[key]
                    print(f"SUCCESS: LLM Fallback Used for: '{orig_query}'")
                else:
                    print(f"ERROR: LLM Fallback returned nothing for: '{orig_query}'")
        
        return intent

    def _rule_based_parse(self, orig_query):
        query = f" {orig_query} " 
        
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
            
        # 2. Dietary Detection
        meat_keywords = ["non-veg", "non veg", "nonveg", "chicken", "mutton", "fish", "meat", "egg", "prawns", "kebab"]
        veg_keywords = ["vegetarian", "pure veg", "veg", "plant based", "paneer", "vegetables", "poha", "upma"]
        
        is_meat = any(re.search(rf'\b{word}\b', query) for word in meat_keywords)
        is_veg = any(re.search(rf'\b{word}\b', query) for word in veg_keywords)
        
        if is_meat:
            intent["vegetarian"] = False
        elif is_veg:
            intent["vegetarian"] = True

        # 3. Context-Aware segments for Spicy and Negation
        segments = re.split(r'\s*(?:and|but|with|also|,)\s*', query)
        for segment in segments:
            is_negated = any(re.search(rf'\b{word}\b', segment) for word in NEGATION_TRIGGERS)
            
            # --- Spicy Check (Excluding weather contexts) ---
            spicy_words = ["spicy", "fiery", "masala", "pepper", "chilli"]
            if any(re.search(rf'\b{word}\b', segment) for word in spicy_words):
                intent["spicy"] = False if is_negated else True
            
            # Check 'hot' separately
            if re.search(rf'\bhot\b', segment) and not re.search(rf'\bhot\s*(?:day|afternoon|weather|outside|summer)\b', segment):
                intent["spicy"] = False if is_negated else True
            
            # --- Non-Spicy/Refreshing Check ---
            if any(re.search(rf'\b{word}\b', segment) for word in ["mild", "sweet", "bland", "not spicy"]):
                intent["spicy"] = False
            
            if any(re.search(rf'\b{word}\b', segment) for word in ["refreshing", "cold", "iced", "cool"]):
                intent["category"] = "Beverages"

        # 4. Category Detection
        for word, cat in CATEGORY_MAPPINGS.items():
            if re.search(rf'\b{word}\b', query):
                final_cat = cat
                if intent["vegetarian"] is False:
                    if cat == "Veg Starters": final_cat = "Non-Veg Starters"
                    if cat == "Veg Main Course": final_cat = "Non-Veg Main Course"
                intent["category"] = final_cat
                break
                
        # 5. Keyword & Semantic Triggers
        for trigger, related in SEMANTIC_KEYWORDS.items():
            if re.search(rf'\b{trigger}\b', query):
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
        
        intent["keywords"] = list(set(intent["keywords"]))
        intent["excluded_keywords"] = list(set(intent["excluded_keywords"]))
        
        return intent

intent_parser = IntentParser()
