class ScoringEngine:
    """
    Ranks menu items based on intent match.
    Balanced strictness for dietary, spice, and price constraints.
    """
    
    def calculate_score(self, item, intent):
        # Base score slightly increased for better variety
        score = 35 
        reasons = []
        is_hard_mismatch = False
        
        # 1. Dietary Matches (High Priority)
        if intent["vegetarian"] is not None:
            if item.get("is_vegetarian") == intent["vegetarian"]:
                score += 55
                reasons.append("Matches dietary preference")
            else:
                score -= 300
                is_hard_mismatch = True
                reasons.append("Dietary mismatch")
                
        # 2. Spice Level (Contextual strictness)
        if intent["spicy"] is not None:
            if item.get("is_spicy") == intent["spicy"]:
                score += 55
                reasons.append("Matches spice level")
            elif intent["spicy"] is True and item.get("is_spicy") is False:
                # User specifically asked for SPICY, but item is MILD
                score -= 60 # Penalty instead of hard mismatch to allow "Masala" items if relevant
                reasons.append("Not spicy enough")
            elif intent["spicy"] is False and item.get("is_spicy") is True:
                # User asked for MILD, but item is SPICY
                score -= 200
                is_hard_mismatch = True
                reasons.append("Excluded spicy items")
                
        # 3. Price Match (Gradual Penalty)
        if intent["max_price"]:
            price = item.get("price", 0)
            if price <= intent["max_price"]:
                score += 55
                reasons.append("Within your budget")
            elif price <= intent["max_price"] * 1.15: # 15% buffer allowed for "near matches"
                score -= (price - intent["max_price"]) * 2 # Per-rupee penalty
                reasons.append("Slightly over budget")
            else:
                score -= 300
                is_hard_mismatch = True
                reasons.append("Exceeds budget")
                
        # 4. Category Match
        if intent["category"]:
            if item.get("category") == intent["category"]:
                score += 65
                reasons.append(f"In {item.get('category')} section")
            elif intent["category"].split()[-1] == item.get("category", "").split()[-1]:
                score += 25
            else:
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
            reasons.append(f"Matches keywords: {', '.join(list(set(matched_keywords))[:2])}")
            
        # 6. Penalize Exclusions
        for ex in intent["excluded_keywords"]:
            if ex in name or ex in desc:
                score -= 300
                is_hard_mismatch = True
                reasons.append(f"Excluded: {ex}")

        # Final Score Logic
        if is_hard_mismatch or score < 0:
            final_score = 0
        else:
            # Normalized for a more permissive threshold
            final_score = max(0, min(int((score / 220) * 100), 100))
        
        return {
            "score": final_score,
            "reason": " | ".join(reasons) if reasons else "Good general choice"
        }

scoring_engine = ScoringEngine()
