# Backend API Specification (Express)

This document outlines the endpoints required by the frontend. The backend developer should implement these in the Express server.

## Base URL
`http://localhost:4000/api`

---

## 1. Products
- **GET `/api/products`**: Fetch products. Query params: `category`, `featured`.
- **POST `/api/products`**: Create product.
- **PUT `/api/products/:slug`**: Update product.
- **DELETE `/api/products/:slug`**: Delete product.

---

## 2. Categories
- **GET `/api/categories`**: Fetch categories.
- **POST `/api/categories`**: Create category.
- **DELETE `/api/categories/:slug`**: Delete category.

---

## 3. Inquiries
- **GET `/api/inquiries`**: Fetch all inquiries.
- **DELETE `/api/inquiries/:id`**: Delete inquiry.

---

## 4. Authentication
- **POST `/api/auth/register`**: User registration.
- **POST `/api/auth/login`**: User login.
- **GET `/api/auth/me`**: Get current user (requires JWT).

---

## 5. Banners (New)
- **GET `/api/banners`**: Fetch promotional banners for the home page.
- **POST `/api/banners`**: Upload/Add a new banner.
- **DELETE `/api/banners/:id`**: Remove a banner.

---

## 6. Jobs & Applications (New)
- **GET `/api/jobs`**: Fetch open positions.
- **POST `/api/jobs/apply`**: Submit a job application.
  - Body: `{ "jobId": "string", "name": "string", "email": "string", "resumeUrl": "string", "message": "string" }`
