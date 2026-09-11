[README.md](https://github.com/user-attachments/files/32090716/README.md)


# SENSHOP

SENSHOP is a customer-focused Point of Sale (POS) web application built
with HTML, CSS, JavaScript, Node.js, Express, and MySQL.

The project provides an online shopping flow where customers can
register, log in, browse products, manage a cart, check out, place
orders, view order history and order details, and manage their account.

## Features

-   Customer registration and login
-   JWT-based authentication
-   Password hashing with bcrypt
-   Product listing from MySQL
-   Product categories
-   Product images
-   Featured products
-   Product search
-   Shopping cart using browser local storage
-   Checkout
-   VAT calculation
-   Order creation
-   Stock validation and stock deduction
-   Order history
-   Order details
-   Receipt generation
-   Customer profile management
-   Customer settings
-   Password changing
-   Wishlist
-   Notifications
-   Product details pages
-   CORS-enabled backend API

## Technologies Used

### Frontend

-   HTML5
-   CSS3
-   JavaScript
-   Browser Local Storage
-   Python HTTP server for local development

### Backend

-   Node.js
-   Express.js
-   MySQL
-   mysql2
-   JWT
-   bcrypt
-   CORS
-   dotenv
-   multer
-   nodemon

## Project Structure

``` text
pos/
├── .vscode/
│   └── launch.json
│
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── productController.js
│   │   └── userController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── orderModel.js
│   │   ├── productModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── productRoutes.js
│   │   └── userRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── frontend/
    ├── images/
    ├── about.html
    ├── cart.html
    ├── checkout.html
    ├── home.html
    ├── login.html
    ├── notification.html
    ├── orderdetails.html
    ├── orders.html
    ├── product-details.html
    ├── products.html
    ├── profile.html
    ├── receipt.html
    ├── settings.html
    ├── signup.html
    ├── wishlist.html
    └── supporting CSS and JavaScript files
```

## Database

SENSHOP uses MySQL.

The backend expects environment variables for the database connection:

``` env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=store_database
JWT_SECRET=your_secret_key
PORT=5000
```

Do not publish the real `.env` file or its credentials.

The main database tables used by the application include:

-   `users`
-   `categories`
-   `products`
-   `orders`
-   `order_items`

## Backend Setup

Open a terminal inside the backend folder:

``` cmd
cd "C:\Users\Administrator\OneDrive\Desktop\code scope\pos\backend"
```

Install the dependencies:

``` cmd
npm install
```

Create your `.env` file with the required database and JWT settings.

Start the backend in development mode:

``` cmd
npm run dev
```

The backend runs on:

``` text
http://localhost:5000
```

The root endpoint can be tested at:

``` text
http://localhost:5000/
```

## Frontend Setup

Open another terminal inside the frontend folder:

``` cmd
cd "C:\Users\Administrator\OneDrive\Desktop\code scope\pos\frontend"
```

Start the local frontend server:

``` cmd
python -m http.server 5500
```

Open the login page:

``` text
http://localhost:5500/login.html
```

The frontend communicates with the backend through:

``` text
http://localhost:5000/api
```

## API Routes

### Authentication

``` text
POST /api/auth/register
POST /api/auth/login
```

### Products

``` text
GET /api/products
```

### Users

``` text
GET /api/users/profile
PUT /api/users/profile
PUT /api/users/password
```

These routes require authentication where applicable.

### Orders

``` text
POST /api/orders
GET /api/orders/user
GET /api/orders/:orderId
```

Order and user routes use JWT authentication.

## Order Flow

The current customer order flow is:

``` text
Login
   ↓
Browse Products
   ↓
Add Products to Cart
   ↓
Checkout
   ↓
Create Order
   ↓
Validate Products and Stock
   ↓
Calculate Subtotal + VAT
   ↓
Save Order
   ↓
Save Order Items
   ↓
Deduct Stock
   ↓
Generate Receipt
   ↓
View Order History
   ↓
View Order Details
```

The backend recalculates product prices from the database when creating
an order instead of trusting prices sent by the browser.

## Local Development

For the complete local application, run both servers.

### Terminal 1 --- Backend

``` cmd
cd "C:\Users\Administrator\OneDrive\Desktop\code scope\pos\backend"
npm run dev
```

### Terminal 2 --- Frontend

``` cmd
cd "C:\Users\Administrator\OneDrive\Desktop\code scope\pos\frontend"
python -m http.server 5500
```

Then open:

``` text
http://localhost:5500/login.html


## Important Security Notes

-   Never commit `.env` to GitHub.
-   Never expose database passwords in frontend JavaScript.
-   Keep JWT secrets on the backend.
-   Keep M-PESA credentials on the backend when payment integration is
    added.
-   Do not trust prices supplied by the browser.
-   Validate product quantities and stock on the backend.
-   Use authenticated routes for private customer data.
-   Before production deployment, configure production database
    credentials and HTTPS.

## Current Project Scope

This version focuses on the customer side of SENSHOP.

The planned next version will expand the POS into three roles:

``` text
Admin
Cashier
Customer
```

The Admin and Cashier systems will be developed separately from the
current customer-focused version.

## Planned Improvements

-   Online deployment
-   Production database
-   M-PESA Daraja API integration
-   M-PESA STK Push
-   Payment callbacks and payment verification
-   Production HTTPS configuration
-   Admin dashboard
-   Cashier dashboard
-   Product management
-   Inventory management
-   Order status management
-   Better production error handling

## Author

SENSHOP --- Customer POS Web Application

Built as a Computer Science project using a custom frontend,
Node.js/Express backend, and MySQL database.
