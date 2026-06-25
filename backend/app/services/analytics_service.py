from app.database.mongodb import get_database
from datetime import datetime, timedelta
from bson import ObjectId

class AnalyticsService:
    async def get_dashboard_stats(self) -> dict:
        db = get_database()
        orders_col = db["orders"]
        users_col = db["users"]
        menu_col = db["menu_items"]

        # Today's range
        today_start = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)

        # Basic Stats
        total_users = await users_col.count_documents({"role": "customer"})
        total_orders = await orders_col.count_documents({})
        active_orders = await orders_col.count_documents({"status": {"$in": ["Placed", "Confirmed", "Preparing", "Ready"]}})
        available_menu = await menu_col.count_documents({"availability": True})

        # Revenue - Only from completed orders
        pipeline_total = [
            {"$match": {"status": "Picked Up"}},
            {"$group": {"_id": None, "total": {"$sum": "$total_amount"}}}
        ]
        total_revenue_res = await orders_col.aggregate(pipeline_total).to_list(1)
        total_revenue = total_revenue_res[0]["total"] if total_revenue_res else 0

        pipeline_today = [
            {"$match": {
                "created_at": {"$gte": today_start},
                "status": "Picked Up"
            }},
            {"$group": {"_id": None, "total": {"$sum": "$total_amount"}}}
        ]
        today_revenue_res = await orders_col.aggregate(pipeline_today).to_list(1)
        today_revenue = today_revenue_res[0]["total"] if today_revenue_res else 0

        # Recent Orders for Dashboard
        recent_orders = []
        async for order in orders_col.find({}).sort("created_at", -1).limit(5):
            order["id"] = str(order["_id"])
            del order["_id"]
            user = None
            if "user_id" in order:
                try:
                    user_id_obj = ObjectId(str(order["user_id"]))
                    user = await users_col.find_one({"_id": user_id_obj})
                except Exception:
                    pass
                order["user_id"] = str(order["user_id"])
            order["customer_name"] = user["name"] if user else order.get("customer_name", "Unknown")
            recent_orders.append(order)

        # Top Selling Items (Simple aggregation)
        pipeline_top = [
            {"$unwind": "$items"},
            {"$group": {"_id": "$items.name", "count": {"$sum": "$items.quantity"}}},
            {"$sort": {"count": -1}},
            {"$limit": 5}
        ]
        top_selling = await orders_col.aggregate(pipeline_top).to_list(5)

        return {
            "total_users": total_users,
            "total_orders": total_orders,
            "active_orders": active_orders,
            "today_revenue": round(today_revenue, 2),
            "total_revenue": round(total_revenue, 2),
            "available_menu": available_menu,
            "recent_orders": recent_orders,
            "top_selling": top_selling
        }

    async def get_full_analytics(self) -> dict:
        db = get_database()
        orders_col = db["orders"]

        # Orders By Status
        pipeline_status = [
            {"$group": {"_id": "$status", "count": {"$sum": 1}}}
        ]
        orders_by_status_raw = await orders_col.aggregate(pipeline_status).to_list(10)

        # Revenue by Category
        pipeline_category = [
            {"$match": {"status": "Picked Up"}},
            {"$unwind": "$items"},
            {"$group": {"_id": "$items.name", "revenue": {"$sum": "$items.price"}}},
            {"$sort": {"revenue": -1}},
            {"$limit": 10}
        ]
        revenue_by_category = await orders_col.aggregate(pipeline_category).to_list(10)

        # Average Order Value
        pipeline_aov = [
            {"$group": {"_id": None, "aov": {"$avg": "$total_amount"}}}
        ]
        aov_res = await orders_col.aggregate(pipeline_aov).to_list(1)
        aov = aov_res[0]["aov"] if aov_res else 0

        return {
            "orders_by_status": orders_by_status_raw,
            "revenue_by_category": revenue_by_category,
            "average_order_value": round(aov, 2)
        }

analytics_service = AnalyticsService()
