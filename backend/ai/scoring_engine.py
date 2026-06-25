class ScoringEngine:
    """
    Ranks menu items based on intent match.
    Provides explainable results with reasoning.
    Gracefully handles simple queries with negative constraints.
    """
    
    def calculate_score(self, item, intent):
        # Start with a base score so that any item that isn't a 'hard mismatch' 
        # has a chance of showing up, especially for simple queries.
        score = 45 
        reasons = []
        is_hard_mismatch = False
        
        # 1. Dietary Matches (High Weight + Hard Mismatch)
        if intent["vegetarian"] is not None:
            if item.get("is_vegetarian") == intent["vegetarian"]:
                score += 40
                reasons.append("Matches dietary preference")
            else:
                score -= 200
                is_hard_mismatch = True
                reasons.append("Dietary mismatch")
                
        # 2. Spice Level (High Weight + Hard Mismatch)
        if intent["spicy"] is not None:
            if item.get("is_spicy") == intent["spicy"]:
                score += 40
                reasons.append("Matches spice level")
            elif intent["spicy"] is False and item.get("is_spicy") is True:
                # User specifically asked for NO spicy, but item is spicy
                score -= 200
                is_hard_mismatch = True
                reasons.append("Excluded spicy items")
            elif intent["spicy"] is True and item.get("is_spicy") is False:
                # User asked for spicy, but item is not spicy
                score -= 30
                reasons.append("Not spicy enough")
                
        # 3. Category Match
        if intent["category"]:
            if item.get("category") == intent["category"]:
                score += 60
                reasons.append(f"In {item.get('category')} section")
            elif intent["category"].split()[-1] == item.get("category", "").split()[-1]:
                score += 20
                
        # 4. Price Match
        if intent["max_price"]:
            price = item.get("price", 0)
            if price <= intent["max_price"]:
                score += 30
                reasons.append("Under your budget")
            elif price <= intent["max_price"] * 1.2:
                score += 10
            else:
                score -= 40
                
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
            # We use a lower dynamic normalization to ensure simple queries show results
            # Max score can be ~250. Normalizing by 180 makes relevant items cross 40 easily.
            final_score = max(0, min(int((score / 180) * 100), 100))
        
        return {
            "score": final_score,
            "reason": " | ".join(reasons) if reasons else "Good general choice"
        }

scoring_engine = ScoringEngine()
