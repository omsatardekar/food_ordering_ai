class ScoringEngine:
    """
    Ranks menu items based on how well they match the user's intent.
    Provides explainable results with reasoning.
    """
    
    def calculate_score(self, item, intent):
        score = 0
        reasons = []
        
        # 1. Dietary Matches (High Weight)
        if intent["vegetarian"] is not None:
            if item.get("is_vegetarian") == intent["vegetarian"]:
                score += 35
                reasons.append("Matches dietary preference")
            else:
                # CRITICAL: Penalty for dietary mismatch if user specified it
                # If they ask for Non-Veg, Veg items are penalized heavily
                score -= 100
                reasons.append("Dietary mismatch")
                
        if intent["spicy"] is not None:
            if item.get("is_spicy") == intent["spicy"]:
                # Only add significant score if user ASKED for spicy
                if intent["spicy"] is True:
                    score += 25
                    reasons.append("Matches spice level")
                else:
                    score += 15
                
        # 2. Category Match (Higher Weight)
        if intent["category"]:
            if item.get("category") == intent["category"]:
                score += 50
                reasons.append(f"Fits {item['category']} category")
                
        # 3. Price Match
        if intent["max_price"]:
            price = item.get("price", 0)
            if price <= intent["max_price"]:
                score += 20
                reasons.append("Within budget")
            elif price <= intent["max_price"] * 1.1: # 10% buffer
                score += 10
                reasons.append("Slightly over budget but relevant")
                
        # 4. Keyword Matches (Increased Influence)
        name = item.get("name", "").lower()
        desc = item.get("description", "").lower()
        
        keyword_score = 0
        matched_keywords = []
        for kw in intent["keywords"]:
            if kw in name:
                keyword_score += 25
                matched_keywords.append(kw)
            elif kw in desc:
                keyword_score += 15
                matched_keywords.append(kw)
        
        if matched_keywords:
            score += min(keyword_score, 50) # Cap keyword score higher
            reasons.append(f"Matches keywords: {', '.join(matched_keywords[:2])}")
            
        # 5. Penalize Exclusions
        for ex in intent["excluded_keywords"]:
            if ex in name or ex in desc:
                score -= 50
                reasons.append(f"Contains excluded term: {ex}")

        # Normalize score to 0-100
        final_score = max(0, min(score, 100))
        
        return {
            "score": final_score,
            "reason": " | ".join(reasons) if reasons else "General match"
        }

scoring_engine = ScoringEngine()
