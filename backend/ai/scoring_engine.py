class ScoringEngine:
    """
    Ranks menu items based on intent match.
    Provides explainable results with reasoning.
    Gracefully handles simple queries with negative constraints.
    """
    
    def calculate_score(self, item, intent):
        score = 45 
        reasons = []
        is_hard_mismatch = False
        
        # 1. Dietary Matches (High Weight + Hard Mismatch)
        if intent["vegetarian"] is not None:
            if item.get("is_vegetarian") == intent["vegetarian"]:
                score += 50
                reasons.append("Matches dietary preference")
            else:
                score -= 300 # Heavier penalty to override any other matches
                is_hard_mismatch = True
                reasons.append("Dietary mismatch")
                
        # 2. Spice Level (High Weight + Hard Mismatch)
        if intent["spicy"] is not None:
            if item.get("is_spicy") == intent["spicy"]:
                score += 40
                reasons.append("Matches spice level")
            elif intent["spicy"] is False and item.get("is_spicy") is True:
                score -= 200
                is_hard_mismatch = True
                reasons.append("Excluded spicy items")
            elif intent["spicy"] is True and item.get("is_spicy") is False:
                score -= 40
                reasons.append("Not spicy enough")
                
        # 3. Category Match (Very High Weight)
        if intent["category"]:
            if item.get("category") == intent["category"]:
                score += 80
                reasons.append(f"In {item.get('category')} section")
            elif intent["category"].split()[-1] == item.get("category", "").split()[-1]:
                # Matches "Main Course" part
                score += 25
            else:
                # Different major category (e.g., Desserts when Main Course asked)
                score -= 50
                reasons.append("Different category")
                
        # 4. Price Match
        if intent["max_price"]:
            price = item.get("price", 0)
            if price <= intent["max_price"]:
                score += 30
                reasons.append("Under your budget")
            elif price <= intent["max_price"] * 1.2:
                score += 10
            else:
                score -= 60
                
        # 5. Keyword Matches
        name = item.get("name", "").lower()
        desc = item.get("description", "").lower()
        
        matched_keywords = []
        for kw in intent["keywords"]:
            if kw in name:
                score += 35
                matched_keywords.append(kw)
            elif kw in desc:
                score += 20
                matched_keywords.append(kw)
        
        if matched_keywords:
            reasons.append(f"Matches: {', '.join(list(set(matched_keywords))[:2])}")
            
        # 6. Penalize Exclusions
        for ex in intent["excluded_keywords"]:
            if ex in name or ex in desc:
                score -= 200
                is_hard_mismatch = True
                reasons.append(f"Excluded: {ex}")

        # Final Score Logic
        if is_hard_mismatch or score < 0:
            final_score = 0
        else:
            # Normalized against a higher pool (~250-300 max)
            final_score = max(0, min(int((score / 200) * 100), 100))
        
        return {
            "score": final_score,
            "reason": " | ".join(reasons) if reasons else "Good general choice"
        }

scoring_engine = ScoringEngine()
