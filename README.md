# Caramel & Clove - Food Ordering System

This is a full-stack food ordering website I built using React for the frontend and FastAPI (Python) for the backend. It's designed to be a complete solution for a restaurant, with separate sections for customers to order food and for admins to manage everything.

## Project Overview

I wanted to create something that looks professional and works smoothly. The app handles everything from user registration and login to placing orders and tracking them in real-time.

### Key Features

#### For Customers:
- **Browse Menu**: A clean, organized menu with categories and search.
- **Smart Filtering**: easily find food based on price, spice level, or vegetarian choices.
- **Shopping Cart**: Add multiple items, update quantities, and see a full price breakdown including taxes.
- **Order Tracking**: See the status of your order (Placed, Preparing, Ready, etc.).
- **User Profile**: Manage your details and see your order history.

#### For Admins:
- **Menu Management**: Add new dishes, update prices, or hide items that are out of stock.
- **User Management**: View and manage customer accounts.
- **Order Dashboard**: Track all incoming orders and update their status as they move through the kitchen.
- **Analytics**: Quick overview of total orders and active customers.

## Tech Stack

- **Frontend**: React.js with Vite for a fast development experience. Use Tailwind CSS for the styling and glassmorphism effects.
- **Backend**: FastAPI (Python) for handling API requests quickly and securely.
- **Database**: MongoDB for storing menu items, users, and orders.
- **Authentication**: JWT (JSON Web Tokens) to make sure only logged-in users can place orders.

## How to Run it Locally

### Prerequisites
- Make sure you have Python and Node.js installed.
- You'll also need MongoDB running on your machine (default port 27017).

### 1. Setting up the Backend
1. Go to the `backend` folder.
2. Create a virtual environment: `python -m venv venv`.
3. Activate it: `venv\Scripts\activate` (Windows).
4. Install the requirements: `pip install -r requirements.txt`.
5. Create a `.env` file (copy from `.env.example`) and set your secret key.
6. Start the server: `uvicorn app.main:app --reload`.

### 2. Creating an Admin
I made a script to quickly set up an admin account:
`python create_admin.py`
(Login: admin@food.com / Password: password123)

### 3. Setting up the Frontend
1. Go to the `frontend` folder.
2. Run `npm install` to get all dependencies.
3. Run `npm run dev` to start the app.
4. Open the link shown in your terminal to see the site.

## How the Search Works
I implemented a smart search logic that doesn't just look for exact names. It can pick up on keywords like "spicy", "cheap", or "veg" and filter the menu automatically. It uses a scoring system to show the most relevant results first.
