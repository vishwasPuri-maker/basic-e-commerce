# basic-e-commerce

 Product Catalog — E-Commerce Backend

A fully functional e-commerce REST API built with **Spring Boot**, **MySQL**, and **JWT Authentication**. This project includes product management, category filtering, order placement, and secure user authentication.

---

##  Tech Stack

| Technology | Usage |
| Java 26 | Core Language |
| Spring Boot 4.0.5 | Backend Framework |
| Spring Security | Authentication & Authorization |
| JWT (jjwt 0.11.5) | Token-based Auth |
| Spring Data JPA | ORM / Database Layer |
| Hibernate | JPA Implementation |
| MySQL | Relational Database |
| Lombok | Boilerplate Reduction |
| Maven | Build Tool |

---

Project Structure

```
src/main/java/com/ecom/productcatalog/
│
├── config/
│   └── DataSeeder.java          # Auto-seeds categories & products on startup
│
├── controller/
│   ├── AuthController.java      # Register & Login endpoints
│   ├── ProductController.java   # Product CRUD & Search
│   ├── CategoryController.java  # Category endpoints
│   └── OrderController.java     # Order placement & history
│
├── model/
│   ├── User.java
│   ├── Product.java
│   ├── Category.java
│   └── Order.java
│
├── repository/
│   ├── UserRepository.java
│   ├── ProductRepository.java
│   ├── CategoryRepository.java
│   └── OrderRepository.java
│
├── security/
│   ├── JwtUtil.java             # JWT generation & validation
│   ├── JwtFilter.java           # Request filter for token verification
│   ├── UserDetailsServiceImpl.java
│   └── SecurityConfig.java      # Security rules & password encoder
│
└── service/
    └── ProductService.java      # Business logic layer
```

---

## ⚙️ Getting Started

### Prerequisites

- Java 26
- MySQL 8+
- Maven 3.8+

### 2. Create MySQL Database

```sql
CREATE DATABASE `product-catalog`;
```

### 3. Configure `application.properties`

```properties
spring.application.name=productcatalog
server.port=8083

spring.datasource.url=jdbc:mysql://localhost:3306/product-catalog
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

### 4. Run the Application

```bash
mvn spring-boot:run
```

The server will start on **http://localhost:8083**

> On first startup, `DataSeeder` will automatically populate the database with **7 categories** and **70 products**.

---

## 🔐 Authentication API

### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "john",
  "password": "123456"
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "john",
  "password": "123456"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
```

> Use this token in the `Authorization` header for protected routes:
> `Authorization: Bearer <your_token>`

---

## 📦 Product API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | Get all products |
| GET | `/api/products/{id}` | Get product by ID |
| GET | `/api/products/category/{categoryId}` | Get products by category |
| GET | `/api/products/search?keyword=phone` | Search products by name |

---

## 🗂️ Category API

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/categories` | Get all categories |

---

## 🧾 Order API

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/orders` | Place a new order |
| GET | `/api/orders/user/{userId}` | Get orders by user |

### Place Order Example
```
POST /api/orders
Content-Type: application/json

{
  "userId": 1,
  "productId": 1
}
```

---

## 🗃️ Database Schema

```
users
  └── id, username, password, role

categories
  └── id, name

products
  └── id, name, description, imageUrl, price, category_id (FK)

orders
  └── id, userId, status, orderDate, product_id (FK)
```

---

## 🌱 Seeded Data

On startup, the following data is automatically inserted:

**Categories (7):**
- Electronics
- Clothing
- Home and Kitchen
- Sports and Fitness
- Books and Stationery
- Beauty and Personal Care
- Shoes and Footwear

**Products:** 10 products per category = **70 total products**

---

## 🔒 Security

- Passwords are encrypted using **BCrypt**
- JWT tokens expire after **10 hours**
- Public routes: `/api/auth/**`, `/api/products/**`, `/api/categories/**`
- Protected routes: `/api/orders/**` requires valid JWT token

---

## 👨‍💻 Author

**Vishwas**
- 2nd Year CS Student
- Spring Boot

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
