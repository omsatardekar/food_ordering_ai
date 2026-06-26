# AI-POWERED FOOD ORDERING SYSTEM

A full-stack food ordering system developed using **React**, **FastAPI**, and **MongoDB**. The application provides separate interfaces for customers and administrators, allowing customers to browse the menu, place orders, and track their order status, while administrators can manage menu items, orders, users, and basic business analytics.

# Features

## Customer Module

* User registration and login
* Browse food menu with images
* Search food using natural language
* Add or remove items from cart
* Secure checkout process
* Real-time order status tracking
* View previous orders
* Update personal profile


## Admin Module

* Secure admin login
* Add, edit, and delete menu items
* Manage customer orders
* Update order status
* View registered users
* Dashboard showing basic analytics such as:

  * Total Orders
  * Revenue
  * Active Users
  * Popular Menu Items

---

# Smart Menu Search

One of the main features of this project is the menu search system.

Instead of searching only by dish name, the search accepts simple natural language queries such as:

> "Something spicy under ₹200"

> "Healthy vegetarian food"

> "Sweet dishes"

The search process includes:

* Extracting user preferences from the sentence
* Matching related food categories using a keyword dictionary
* Filtering out items that do not satisfy required conditions
* Calculating a relevance score for matching dishes
* Displaying results in order of relevance

This provides more useful search results than a basic keyword search while keeping the implementation lightweight and easy to understand.

---

# Technology Stack

## Frontend

* React (Vite)
* React Router
* Tailwind CSS
* Axios
* Lucide React Icons
* Recharts

## Backend

* FastAPI
* Python
* MongoDB
* Motor (MongoDB Driver)
* JWT Authentication
* bcrypt
* Pydantic
  

# Authentication

The application uses **JWT (JSON Web Token)** based authentication.

There are two roles:

* Customer
* Admin

Protected routes are accessible only after successful authentication.



# Installation

## Prerequisites

* Python 3.10+
* Node.js 18+
* MongoDB

```

## Backend Setup

```bash
cd backend

python -m venv venv
```

Activate virtual environment

Windows

```bash
venv\Scripts\activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create a `.env` file using `.env.example` and update the required values.

Start the backend server

```bash
uvicorn app.main:app --reload
```

---

## Create Admin Account

Run

```bash
python create_admin.py
```

Default credentials

```
Email:
admin@food.com

Password:
password123
```

(These can be changed after setup.)



## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

The frontend will start on the default Vite development server.


# Main Functionalities

### Customer

* Register/Login
* Browse menu
* Smart search
* Add to cart
* Checkout
* Order tracking
* Order history
* Profile management

### Admin

* Menu management
* Order management
* Customer management
* Dashboard analytics


# Design

The interface is designed to be simple, responsive, and easy to navigate.

Some UI highlights include:

* Responsive layout
* Modern glass-style components
* Clean typography
* Interactive cards
* Mobile-friendly design
* Smooth transitions


# Future Improvements

Some features that can be added in future versions include:

* Online payment integration (Razorpay/Stripe)
* Customer reviews and ratings
* Personalized food recommendations
* Restaurant table reservations
* Cloud deployment


# Author

**Omkar Satardekar**
