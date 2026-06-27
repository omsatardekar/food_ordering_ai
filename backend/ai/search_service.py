from ai.intent_parser import intent_parser
from ai.scoring_engine import scoring_engine

class SearchService:
    """
    Service to handle AI-powered natural language menu search.
    Connects intent parsing, DB filtering, and scoring.
    """
    
    async def search(self, query, menu_items):
        # 1. Extract Intent
        intent = await intent_parser.parse(query)
        
        results = []
        
        # 2. Score and Filter Items
        for item in menu_items:
            # Basic filtering (can be done in DB query, but here for scoring context)
            if not item.get("availability", True):
                continue
                
            match_data = scoring_engine.calculate_score(item, intent)
            
            # Only include items with significant relevance
            if match_data["score"] >= 35:
                # Add score data to item
                item_with_score = {
                    **item,
                    "score": match_data["score"],
                    "match_reason": match_data["reason"]
                }
                results.append(item_with_score)

        
        # 3. Rank Results by Score Descending
        results.sort(key=lambda x: x["score"], reverse=True)
        
        return {
            "query": query,
            "intent": intent,
            "count": len(results),
            "results": results[:20] # Return top 20 matches
        }

search_service = SearchService()
