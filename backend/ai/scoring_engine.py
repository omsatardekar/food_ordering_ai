class ScoringEngine:
    """
    Ranks menu items based on intent match.
    Strictly handles dietary, spice, and price constraints.
    """
    
    def calculate_score(self, item, intent):
        # Start with a lower base score to ensure precision
        score = 20 
        reasons = []
        is_hard_mismatch = False
        
        # 1. Dietary Matches (STRICT)
        if intent["vegetarian"] is not None:
            if item.get("is_vegetarian") == intent["vegetarian"]:
                score += 50
                reasons.append("Matches dietary preference")
            else:
                score -= 300
                is_hard_mismatch = True
                reasons.append("Dietary mismatch")
                
        # 2. Spice Level (STRICT)
        if intent["spicy"] is not None:
            if item.get("is_spicy") == intent["spicy"]:
                score += 50
                reasons.append("Matches spice level")
            elif intent["spicy"] is True and item.get("is_spicy") is False:
                # User specifically asked for SPICY, but item is MILD
                score -= 150 # Stronger penalty
                is_hard_mismatch = True # Don't show mild items if they asked for spicy
                reasons.append("Not spicy enough")
            elif intent["spicy"] is False and item.get("is_spicy") is True:
                # User asked for MILD, but item is SPICY
                score -= 200
                is_hard_mismatch = True
                reasons.append("Excluded spicy items")
                
        # 3. Price Match (STRICT)
        if intent["max_price"]:
            price = item.get("price", 0)
            if price <= intent["max_price"]:
                score += 50
                reasons.append("Within your budget")
            elif price <= intent["max_price"] * 1.05: # Only 5% buffer allowed
                score -= 20
                reasons.append("Slightly over budget")
            else:
                score -= 300 # Hard penalty for being over budget
                is_hard_mismatch = True
                reasons.append("Exceeds budget")
                
        # 4. Category Match
        if intent["category"]:
            if item.get("category") == intent["category"]:
                score += 60
                reasons.append(f"In {item.get('category')} section")
            elif intent["category"].split()[-1] == item.get("category", "").split()[-1]:
                score += 20
            else:
                # Different major category (e.g., Beverages when Main Course asked)
                score -= 80 
                reasons.append("Different category")
                
        # 5. Keyword Matches
        name = item.get("name", "").lower()
        desc = item.get("description", "").lower()
        
        matched_keywords = []
        for kw in intent["keywords"]:
            if kw in name:
                score += 35
                matched_keywords.append(kw)
            elif kw in desc:
                score += 15
                matched_keywords.append(kw)
        
        if matched_keywords:
            # We don't add to reasons here unless it's a strong match
            if len(matched_keywords) > 1:
                reasons.append(f"Matches several keywords")
            
        # 6. Penalize Exclusions
        for ex in intent["excluded_keywords"]:
            if ex in name or ex in desc:
                score -= 300
                is_hard_mismatch = True
                reasons.append(f"Excluded: {ex}")

        # Final Score Logic
        # Explicit Hard Mismatch or below zero = ignore
        if is_hard_mismatch or score < 0:
            final_score = 0
        else:
            # Normalizing by 200 for a consistent 0-100 scale
            final_score = max(0, min(int((score / 200) * 100), 100))
        
        return {
            "score": final_score,
            "reason": " | ".join(reasons) if reasons else "Good general choice"
        }

scoring_engine = ScoringEngine()
