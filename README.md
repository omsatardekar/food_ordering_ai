# Caramel & Clove - Online Food Ordering System

This is a full-stack food ordering system I built for restaurants to manage their orders and for customers to order food easily. It uses React for the frontend and FastAPI (Python) for the backend, with MongoDB for storing everything.

---

## 🚀 AI-Based Menu Search
A key part of this project is the search bar, which I built to be smarter than a regular keyword search. It's an AI-based system that understands what the user is looking for:
- **Intelligent Filtering**: You can search for things like "spicy vegetarian" or "healthy" instead of just the dish name.
- **Smart Ranking**: The search uses a scoring logic to show the most relevant dishes first based on what you typed.
- **Better Results**: It picks up on price keywords too, helping users find exactly what fits their budget and taste.

---

## 🍱 Important Features

### For Customers
- **Clean Menu**: A nice, easy-to-use menu with images and dietary icons (Veg/Spicy).
- **Cart & Checkout**: A smooth process to add items, see the total with taxes, and place orders.
- **Live Order Tracking**: You can see exactly what's happening with your order (from Confirmed to Delivered).
- **Personal Profile**: Save your details and look back at your past orders.

### For Admins
- **Menu Management**: Easily add new dishes, change prices, or update descriptions.
- **Order Dashboard**: A real-time view of all incoming orders to manage the kitchen workflow.
- **Customer Overview**: See list of users and their activity.
- **Quick Analytics**: A simple dashboard to see total sales and active users.

---

## 🛠️ Tools I Used

### Frontend
- **React (Vite)**: For building a fast user interface.
- **Tailwind CSS**: For all the styling and making it responsive.
- **Lucide Icons**: For clean and modern icons.

### Backend
- **FastAPI**: A fast Python framework for building the API.
- **MongoDB**: To store all the data flexibly.
- **JWT Authentication**: To handle secure logins for users and admins.

---

## ⚙️ How to Setup

### 1. Prerequisites
- Have Python and Node.js installed on your computer.
- Have MongoDB running locally.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
# Create a .env file and update your secret key
uvicorn app.main:app --reload
```

### 3. Setup Admin
To create your first admin account, run:
`python create_admin.py`
(Login: admin@food.com / Password: password123)

### 4. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🎨 Design and UI
I focused on making the UI look modern and clean. I used some modern frosted-glass effects and smooth transitions to make the experience feel high-quality and easy to navigate on any device.
