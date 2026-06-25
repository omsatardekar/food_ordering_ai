import pymongo

client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["food_ordering_db"]

result = db.orders.delete_many({})
print(f"Deleted {result.deleted_count} orders from the database.")
