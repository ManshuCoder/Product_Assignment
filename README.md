# ProductHub — Full-Stack Product Management Application

A production-ready product catalog built for the Backend Intern Assignment. Manage products with JWT authentication, advanced filtering, pagination, and a polished React dashboard.

![Tech Stack](https://img.shields.io/badge/Node.js-20-green) ![React](https://img.shields.io/badge/React-19-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-7-green) ![Tests](https://img.shields.io/badge/Tests-15%20passing-brightgreen)

---

## Live Demo

| Service | URL |
|---------|-----|
| **Frontend (Vercel)** | _Deploy and add your link here_ |
| **Backend API (Railway)** | _Deploy and add your link here_ |
| **API Docs (Swagger)** | `{BACKEND_URL}/api-docs` |
| **GitHub Repository** | _Add your repo link here_ |

---

## Features

### Core Requirements
- Product CRUD with Mongoose schema validations
- JWT authentication (signup / login) protecting all product routes
- Featured products, price filter, and rating filter endpoints
- React frontend with Login, Signup, Product List, and Add Product pages
- Axios API integration with protected routes
- Client-side form validations (required fields, numeric price, error messages)

### Bonus Features
- Pagination, search by name, sort by price/rating/date
- Swagger API documentation at `/api-docs`
- Rate limiting (100 req / 15 min per IP)
- bcrypt password hashing (12 salt rounds)
- MongoDB indexes on key fields
- Centralized error handling middleware
- Docker & Docker Compose support
- Jest unit tests with 15 passing test cases

---

## Project Structure

```
Backend_Intern_Assignment/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── config/             # DB & Swagger config
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Auth, validation, errors
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # API routes
│   │   ├── validators/         # express-validator rules
│   │   └── utils/              # Helpers
│   ├── tests/                  # Jest test suites
│   ├── Dockerfile
│   └── package.json
├── frontend/                   # React + Vite app
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── context/            # Auth context (React Hooks)
│   │   ├── pages/              # Route pages
│   │   ├── services/           # Axios API layer
│   │   └── utils/              # Client validators
│   └── vercel.json
├── docker-compose.yml          # MongoDB + API containers
└── README.md
```

---

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas) free tier)

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd Backend_Intern_Assignment

# Backend
cd backend
cp .env.example .env    # Edit with your values
npm install

# Frontend
cd ../frontend
cp .env.example .env
npm install
```

### 2. Start MongoDB

**Option A — Docker:**
```bash
docker compose up mongodb -d
```

**Option B — Local MongoDB:**
Ensure MongoDB is running on `mongodb://localhost:27017`

### 3. Run the Apps

```bash
# Terminal 1 — API (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 5173)
cd frontend
npm run dev
```

Open **http://localhost:5173** → Sign up → Start adding products.

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/producthub` |
| `JWT_SECRET` | Secret for signing tokens | `your_secret_key` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |
| `RATE_LIMIT_MAX` | Max requests per window | `100` |

### Frontend (`frontend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## API Documentation

Base URL: `http://localhost:5000/api`

Interactive Swagger docs: **http://localhost:5000/api-docs**

### Authentication

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/auth/signup` | No | Register new user |
| `POST` | `/auth/login` | No | Login and receive JWT |
| `GET` | `/auth/me` | Yes | Get current user profile |

**Signup / Login Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Logged in successfully",
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Products (All require `Authorization: Bearer <token>`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/products` | Create a product |
| `GET` | `/products` | List products (with filters) |
| `GET` | `/products/:id` | Get single product |
| `PUT` | `/products/:id` | Update a product |
| `DELETE` | `/products/:id` | Delete a product |
| `GET` | `/products/featured` | Get featured products |
| `GET` | `/products/price/below/:price` | Products below price |
| `GET` | `/products/rating/above/:rating` | Products above rating |

**Create Product Body:**
```json
{
  "productId": "PROD-001",
  "name": "Wireless Headphones",
  "price": 149.99,
  "featured": true,
  "rating": 4.5,
  "company": "SoundTech",
  "createdAt": "2026-06-07T00:00:00.000Z"
}
```

**Query Parameters for `GET /products`:**

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default: 1) |
| `limit` | number | Items per page (default: 10, max: 50) |
| `search` | string | Search by product name |
| `sort` | string | `price_asc`, `price_desc`, `rating_asc`, `rating_desc`, `newest`, `oldest`, `name_asc` |
| `featured` | boolean | Filter featured products |
| `maxPrice` | number | Products below this price |
| `minRating` | number | Products above this rating |

---

## Docker

Run the entire stack with one command:

```bash
docker compose up --build
```

This starts:
- **MongoDB** on port `27017`
- **API** on port `5000`

---

## Testing

```bash
cd backend
npm test
```

Runs 15 Jest tests covering authentication and product CRUD with an in-memory MongoDB.

---

## Deployment Guide

### Backend → Railway

1. Push code to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Add a **MongoDB** plugin (or use MongoDB Atlas URI)
4. Deploy from the `backend/` directory
5. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET` (generate a strong random string)
   - `CLIENT_URL` (your Vercel frontend URL)
   - `NODE_ENV=production`
6. Copy the deployed URL (e.g. `https://producthub-api.up.railway.app`)

### Frontend → Vercel

1. Import the repo on [Vercel](https://vercel.com)
2. Set root directory to `frontend`
3. Add environment variable:
   - `VITE_API_URL=https://your-railway-url/api`
4. Deploy and copy the Vercel URL
5. Update Railway's `CLIENT_URL` to match your Vercel URL

---

## Product Schema

| Field | Type | Validation |
|-------|------|------------|
| `productId` | String | Required, unique, uppercase, alphanumeric + hyphens |
| `name` | String | Required, 2–100 chars |
| `price` | Number | Required, min 0 |
| `featured` | Boolean | Default: false |
| `rating` | Decimal128 | Optional, 0–5 |
| `createdAt` | Date | Required |
| `company` | String | Required, min 2 chars |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js 20 |
| Framework | Express.js 4 |
| Database | MongoDB + Mongoose 8 |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Docs | Swagger (OpenAPI 3) |
| Frontend | React 19 + Vite 8 |
| HTTP Client | Axios |
| Routing | React Router 7 |
| Testing | Jest + Supertest |
| Container | Docker + Docker Compose |

---

## License

MIT
