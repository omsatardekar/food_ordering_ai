from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.mongodb import connect_to_mongo, close_mongo_connection
from app.routes import auth_routes, admin_routes, menu_routes, order_routes, user_profile_routes, ai_search


app = FastAPI(title="Food Ordering AI API")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_db_client():
    await close_mongo_connection()

# Include Routers
app.include_router(auth_routes.router, prefix="/api")
app.include_router(admin_routes.router, prefix="/api")
app.include_router(menu_routes.router, prefix="/api")
app.include_router(order_routes.router, prefix="/api")
app.include_router(user_profile_routes.router, prefix="/api")
app.include_router(ai_search.router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Welcome to Food Ordering AI API"}
