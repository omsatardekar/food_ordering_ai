from groq import AsyncGroq # Use AsyncGroq for FastAPI
import json
import re
from app.config.settings import settings

class LLMFallback:
    """
    Uses AsyncGroq (Llama 3.3) for high-performance, non-blocking intent parsing.
    """
    
    def __init__(self):
        self.enabled = bool(settings.GROQ_API_KEY)
        if self.enabled:
            # Initialize the ASYNC client
            self.client = AsyncGroq(api_key=settings.GROQ_API_KEY)
            self.model_id = "llama-3.3-70b-versatile"
        else:
            self.client = None

    async def parse_query(self, query):
        if not self.enabled:
            return None
            
        system_prompt = """
        You are a food ordering assistant. Extract search parameters from the user's query.
        Return ONLY a JSON object with these keys:
        - vegetarian: (boolean or null)
        - spicy: (boolean or null)
        - max_price: (number or null)
        - category: (string or null) [Veg Starters, Non-Veg Starters, Veg Main Course, Non-Veg Main Course, Breads, Rice, Desserts, Beverages]
        - keywords: (list of strings)
        - excluded_keywords: (list of strings)
        
        Logic:
        - "kick" or "hot" -> spicy: true
        - "easy on wallet" or "cheap" -> max_price: 250
        - "healthy" -> keywords: ["salad", "grilled", "steamed", "light"]
        """
        
        try:
            # Use await with the AsyncGroq client
            chat_completion = await self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": system_prompt,
                    },
                    {
                        "role": "user",
                        "content": query,
                    }
                ],
                model=self.model_id,
                response_format={"type": "json_object"}
            )
            
            content = chat_completion.choices[0].message.content
            return json.loads(content)
            
        except Exception as e:
            print(f"Groq Fallback Error: {e}")
            return None

llm_fallback = LLMFallback()
