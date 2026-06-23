# Food Ordering AI - Production Ready Foundation

A modern, full-stack food ordering system built with React (Vite) and FastAPI, featuring MongoDB and JWT Authentication.

## Project Architecture

### Frontend (`/frontend`)
- **React (Vite)**: Lighting fast frontend development.
- **Tailwind CSS**: Modern, utility-first styling with custom glassmorphism components.
- **React Router DOM**: Client-side routing with protected route logic.
- **Context API**: Global state management for authentication.
- **Axios**: Promised-based HTTP client with JWT interceptors.

### Backend (`/backend`)
- **FastAPI**: High-performance Python web framework.
- **MongoDB**: NoSQL database for flexible data modeling.
- **Motor**: Asynchronous MongoDB driver.
- **Pydantic**: Data validation and settings management.
- **JWT**: Secure token-based authentication.

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js & npm
- MongoDB Compass (Running locally on `localhost:27017`)

### 1. Backend Setup
1. Navigate to `backend/`
2. Create a virtual environment: `python -m venv venv`
3. Activate it: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Mac/Linux)
4. Install dependencies: `pip install -r requirements.txt`
5. Create `.env` from `.env.example` and update your `JWT_SECRET`.
6. Run the server: `uvicorn app.main:app --reload`

### 2. Admin Creation
To create the initial admin user, run:
```bash
python create_admin.py
```
*Default Credentials: admin@food.com / password123*

### 3. Frontend Setup
1. Navigate to `frontend/`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`

## Authentication Flow
1. **Signup**: Users can register as customers from the `/signup` page.
2. **Login**: Users provide email/password. The backend verifies credentials and returns a JWT.
3. **Role-Based Access**:
   - `admin`: Redirected to `/admin/dashboard`. Can access Admin routes.
   - `customer`: Redirected to `/dashboard`. Can access User routes.
4. **JWT Interceptor**: Frontend automatically attaches the `Bearer token` to every request.

## UI/UX Features
- **Glassmorphism**: Premium design with blurred backgrounds and borders.
- **Responsive Animations**: Smooth fade-in and slide-up transitions.
- **Toast Notifications**: Real-time feedback for user actions.
- **Protected Routes**: Secure navigation logic preventing unauthorized access.
