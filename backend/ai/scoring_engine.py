class ScoringEngine:
    """
    Ranks menu items based on intent match.
    Provides explainable results with reasoning.
    Now with stricter penalties for preference mismatch.
    """
    
    def calculate_score(self, item, intent):
        score = 0
        reasons = []
        is_hard_mismatch = False
        
        # 1. Dietary Matches (High Weight + Hard Mismatch)
        if intent["vegetarian"] is not None:
            if item.get("is_vegetarian") == intent["vegetarian"]:
                score += 40
                reasons.append("Matches dietary preference")
            else:
                # CRITICAL: Penalty for dietary mismatch
                score -= 150
                is_hard_mismatch = True
                reasons.append("Dietary mismatch")
                
        # 2. Spice Level (High Weight + Hard Mismatch)
        if intent["spicy"] is not None:
            if item.get("is_spicy") == intent["spicy"]:
                score += 30
                reasons.append("Matches spice level")
            elif intent["spicy"] is False and item.get("is_spicy") is True:
                # User specifically asked for NO spicy, but item is spicy
                score -= 100
                is_hard_mismatch = True
                reasons.append("Excluded spicy items")
            elif intent["spicy"] is True and item.get("is_spicy") is False:
                # User asked for spicy, but item is not spicy
                score -= 40
                reasons.append("Not spicy enough")
                
        # 3. Category Match
        if intent["category"]:
            if item.get("category") == intent["category"]:
                score += 50
                reasons.append(f"Fits {item['category']} category")
            elif intent["category"].split()[-1] == item.get("category", "").split()[-1]:
                # Matches "Main Course" part but maybe not "Veg/Non-Veg"
                score += 15
                
        # 4. Price Match
        if intent["max_price"]:
            price = item.get("price", 0)
            if price <= intent["max_price"]:
                score += 25
                reasons.append("Inside your budget")
            elif price <= intent["max_price"] * 1.2:
                score += 10
                reasons.append("Slightly over budget")
            else:
                score -= 30 # Penalize very expensive items in budget search
                
        # 5. Keyword Matches
        name = item.get("name", "").lower()
        desc = item.get("description", "").lower()
        cat = item.get("category", "").lower()
        
        matched_keywords = []
        for kw in intent["keywords"]:
            if kw in name:
                score += 30
                matched_keywords.append(kw)
            elif kw in desc:
                score += 15
                matched_keywords.append(kw)
        
        if matched_keywords:
            reasons.append(f"Matches keywords: {', '.join(list(set(matched_keywords))[:2])}")
            
        # 6. Penalize Exclusions (Very strict)
        for ex in intent["excluded_keywords"]:
            if ex in name or ex in desc or ex in cat:
                score -= 100
                is_hard_mismatch = True
                reasons.append(f"Contains excluded term: {ex}")

        # Final Normalization
        # Force score to 0 if there's a hard mismatch (dietary or explicit exclusion)
        if is_hard_mismatch:
            final_score = 0
        else:
            # Scale score to 0-100 range based on weights
            # Max possible score is around 150-200, so we normalize
            final_score = max(0, min(int((score / 140) * 100), 100))
        
        # Exception: If it's a very high quality match but slightly under 100, we show it.
        # But if matches dietary and spice and category, it should be high.
        
        return {
            "score": final_score,
            "reason": " | ".join(reasons) if reasons else "General recommendation"
        }

scoring_engine = ScoringEngine()
