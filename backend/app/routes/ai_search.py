from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.menu_service import menu_service
from ai.search_service import search_service

router = APIRouter(prefix="/ai-search", tags=["AI Search"])

class SearchRequest(BaseModel):
    query: str

@router.post("")
async def ai_menu_search(request: SearchRequest):
    """
    Endpoint for natural language menu search.
    Analyzes query intent and returns ranked menu items using the offline AI layer.
    """
    if not request.query:
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
        
    try:
        # 1. Fetch all available items from DB
        all_items = await menu_service.get_all_items()
        
        # 2. Run AI Search logic
        search_results = await search_service.search(request.query, all_items)
        
        # 3. Guaranteed JSON-safe conversion using string-casting
        import json
        return json.loads(json.dumps(search_results, default=str))

        
    except Exception as e:
        print(f"AI Search Error: {str(e)}")
        raise HTTPException(status_code=500, detail="Error processing AI search request")
