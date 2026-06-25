import asyncio
import traceback
from fastapi.testclient import TestClient
from app.main import app
from app.middleware.auth_middleware import get_admin_user, get_current_user

def override_get_admin_user():
    return {'_id': '6a3a9a7438a46389e589efe1', 'role': 'admin', 'email': 'admin@test.com'}

def override_get_current_user():
    return {'_id': '6a3a9a7438a46389e589efe1', 'role': 'admin', 'email': 'admin@test.com'}

app.dependency_overrides[get_admin_user] = override_get_admin_user
app.dependency_overrides[get_current_user] = override_get_current_user

try:
    with TestClient(app) as client:
        response = client.get('/api/orders?status=')
        print('ORDERS CODE:', response.status_code)
        print('ORDERS RESP:', response.text[:500])
except Exception as e:
    traceback.print_exc()
