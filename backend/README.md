# The Candle Lab 3.0 — Laravel 11 REST API Backend

Enterprise Laravel 11 Backend API for **The Candle Lab**, providing database management, authentication via Sanctum, payment integration via Razorpay, and order processing.

---

## 🛠 Tech Stack

- **Framework**: Laravel 11 (PHP 8.2+)
- **Database**: PostgreSQL (PostGIS / JSON B support)
- **Authentication**: Laravel Sanctum (Bearer Token / Stateful Session)
- **Payment Gateway**: Razorpay SDK (`razorpay/razorpay`)
- **API Spec**: RESTful JSON Standards

---

## 🚀 Setup & Installation Instructions

### 1. Requirements
- PHP 8.2 or higher
- Composer 2.x
- PostgreSQL 14+ database

### 2. Environment Setup
```bash
cp .env.example .env
```

Configure your PostgreSQL database parameters in `.env`:
```ini
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=candle_lab_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

### 3. Install Dependencies & Run Migrations
```bash
composer install
php artisan key:generate
php artisan migrate --seed
```

### 4. Serve the API Server
```bash
php artisan serve --port=8000
```
The API will be live at `http://localhost:8000/api`.

---

## 🔗 Key API Endpoints

### **Public Endpoints**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | Fetch catalog with filters (`search`, `category`, `sort`, `filter`) |
| `GET` | `/api/products/{id}` | Single candle product details |
| `POST` | `/api/auth/register` | Register new customer account |
| `POST` | `/api/auth/login` | Authenticate customer or admin |
| `POST` | `/api/orders` | Place new order with stock decrement transaction |

### **Protected Endpoints (Sanctum Token)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/auth/me` | Fetch authenticated user profile |
| `POST` | `/api/auth/logout` | Revoke token |
| `GET` | `/api/user/orders` | Customer order history |

### **Admin Endpoints (`auth:sanctum` + `can:admin`)**
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/products` | Create new product |
| `PUT` | `/api/products/{id}` | Update product |
| `DELETE` | `/api/products/{id}` | Soft/hard delete product |
| `GET` | `/api/admin/orders` | All customer orders list |
| `PATCH` | `/api/admin/orders/{id}/status` | Update status (`Processing`, `Shipped`, `Delivered`, `Cancelled`) |
