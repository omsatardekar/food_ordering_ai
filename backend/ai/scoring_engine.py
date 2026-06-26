class ScoringEngine:
    """
    Ranks menu items based on intent match.
    Provides explainable and persuasive results with reasoning.
    """
    
    def calculate_score(self, item, intent):
        score = 60 
        reasons = []
        is_hard_mismatch = False
        
        demand_points = 60 
        
        name = item.get("name", "").lower()
        desc = item.get("description", "").lower()
        item_category = item.get("category", "")
        item_category_lower = item_category.lower()
        
        # 0. Quick Category Filter for Spicy
        if intent["spicy"] is True:
            demand_points += 50
            if any(x in item_category_lower for x in ["beverage", "dessert", "shake", "drink", "sweet"]):
                score -= 150
                reasons.append("Usually not spicy")

        # 1. Dietary Matches
        if intent["vegetarian"] is not None:
            demand_points += 60
            if item.get("is_vegetarian") == intent["vegetarian"]:
                score += 80
                reasons.append("Perfect dietary match")
            else:
                score -= 500
                is_hard_mismatch = True
                reasons.append("Dietary mismatch")
                
        # 2. Spice Level
        if intent["spicy"] is not None:
            demand_points += 60
            if item.get("is_spicy") == intent["spicy"]:
                score += 80
                reasons.append("Matches your spice level")
            elif intent["spicy"] is False and item.get("is_spicy") is True:
                score -= 500
                is_hard_mismatch = True
                reasons.append("Excluded spicy items")
            elif intent["spicy"] is True and item.get("is_spicy") is False:
                score -= 60
                reasons.append("Mild, but worth a try!")
                
        # 3. Category Match
        if intent["category"]:
            demand_points += 100
            if item_category == intent["category"]:
                score += 150 
                reasons.append(f"In {item_category}")
            elif intent["category"].split()[-1].lower() in item_category_lower:
                score += 60
                reasons.append(f"Matches {item_category.split()[-1]} type")
            else:
                score -= 80
                reasons.append(f"Different section, but a great choice!")
                
        # 4. Price Match
        if intent["max_price"]:
            demand_points += 80
            price = item.get("price", 0)
            if price <= intent["max_price"]:
                score += 120
                reasons.append("Perfectly in budget")
            elif price <= intent["max_price"] * 1.2:
                score += 40
                reasons.append(f"Slightly over ₹{int(intent['max_price'])} but totally worth it!")
            else:
                score -= 200
                reasons.append("A bit above budget")
                
        # 5. Keyword Matches
        keyword_score = 0
        matched_keywords = []
        if intent["keywords"]:
            demand_points += 40 
            for kw in intent["keywords"]:
                if kw in name:
                    keyword_score += 60
                    matched_keywords.append(kw)
                elif kw in desc:
                    keyword_score += 30
                    matched_keywords.append(kw)
        
        if matched_keywords:
            score += min(keyword_score, 120)
            reasons.append(f"Matches search: {', '.join(list(set(matched_keywords))[:2])}")
            
        # 6. Exclusions
        for ex in intent["excluded_keywords"]:
            if ex in name or ex in desc:
                score -= 500
                is_hard_mismatch = True
                reasons.append(f"Excluded: {ex}")

        # Final Score Logic
        if is_hard_mismatch or score < 0:
            final_score = 0
        else:
            normalization_divisor = demand_points * 1.1 
            final_score = max(0, min(int((score / normalization_divisor) * 100), 100))
            
            if final_score > 90 and not is_hard_mismatch:
                final_score = 100
        
        return {
            "score": final_score,
            "reason": " | ".join(reasons) if reasons else "Chef's Recommendation"
        }

scoring_engine = ScoringEngine()
