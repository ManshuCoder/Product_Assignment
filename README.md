# Product Assignment — ProductHub

A full-stack **Product Management** web application where users can sign up, log in, and manage a product catalog (create, read, update, delete) with search, filtering, sorting, and pagination.

**Live demo**
- Frontend: [https://product-assignment-zeta.vercel.app](https://product-assignment-zeta.vercel.app)
- Backend API: [https://product-assignment-730z.onrender.com](https://product-assignment-730z.onrender.com)
- API docs: [https://product-assignment-730z.onrender.com/api-docs](https://product-assignment-730z.onrender.com/api-docs)

**Repository:** [https://github.com/ManshuCoder/Product_Assignment](https://github.com/ManshuCoder/Product_Assignment)

---

## Tech stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 19 | UI components and pages |
| | Vite 8 | Fast dev server and production build |
| | React Router 7 | Client-side routing (`/login`, `/products`, etc.) |
| | Axios | HTTP requests to the REST API |
| | CSS (custom) | Styling |
| **Backend** | Node.js + Express 4 | REST API server |
| | MongoDB + Mongoose 8 | Database and ODM |
| | JWT (`jsonwebtoken`) | Stateless authentication |
| | bcryptjs | Password hashing |
| | express-validator | Request validation |
| | express-rate-limit | API rate limiting |
| | Swagger (swagger-jsdoc + swagger-ui-express) | Interactive API documentation |
| **Auth** | Custom JWT flow | Signup, login, protected routes |
| **Testing** | Jest + Supertest | Backend API tests |
| | mongodb-memory-server | In-memory DB for tests |
| **DevOps** | Docker + Docker Compose | Local containerized setup |
| | Vercel | Frontend hosting |
| | Render | Backend hosting |
| | MongoDB Atlas | Cloud database (production) |

---

## How the application works

### High-level architecture

```
┌─────────────────────┐         ┌─────────────────────┐         ┌─────────────────┐
│   React Frontend    │         │   Express Backend   │         │    MongoDB      │
│   (Vercel)          │ ──────► │   (Render)          │ ──────► │   (Atlas)       │
│   product-assignment│  /api   │   product-assignment│         │                 │
│   -zeta.vercel.app  │         │   -730z.onrender.com│         │  Users, Products│
└─────────────────────┘         └─────────────────────┘         └─────────────────┘
```

In **production**, the browser talks to the **same origin** (`your-app.vercel.app/api/...`). Vercel rewrites those requests to the Render backend. This avoids CORS issues between the frontend and API.

In **local development**, Vite proxies `/api` to `http://localhost:5000`.

### Authentication flow (JWT)

1. **Signup** — User submits name, email, and password on `/signup`.
2. Frontend sends `POST /api/auth/signup` with the form data.
3. Backend validates input, checks for duplicate email, hashes the password with bcrypt, saves the user in MongoDB, and returns a **JWT token** plus user details.
4. Frontend stores the token and user in `localStorage` via `AuthContext`.
5. **Login** — Same flow via `POST /api/auth/login`; invalid credentials return `401`.
6. **Protected requests** — Axios adds `Authorization: Bearer <token>` on every API call.
7. Backend `protect` middleware verifies the JWT, loads the user from MongoDB, and attaches `req.user`.
8. **Session check** — On app load, `AuthContext` calls `GET /api/auth/me` to restore the session; expired or invalid tokens trigger logout.

### Product management flow

1. Only **authenticated** users can access product routes (`ProtectedRoute` on the frontend, `protect` middleware on the backend).
2. **List products** — `GET /api/products` supports:
   - **Search** by name (`search`)
   - **Filter** by featured, max price, min rating
   - **Sort** (price, rating, name, date)
   - **Pagination** (`page`, `limit`)
3. **Create** — `POST /api/products` with productId, name, price, rating, company, featured, etc.
4. **Update** — `PUT /api/products/:id`
5. **Delete** — `DELETE /api/products/:id`
6. **Extra queries** — featured products, below price, above rating

### Request lifecycle (example: create product)

```
User fills form → React ProductForm
    → Axios POST /api/products + Bearer token
    → Vercel rewrite → Render Express
    → rate limiter → CORS → JSON parser
    → auth middleware (JWT verify)
    → validator → productController.createProduct
    → Mongoose save to MongoDB
    → JSON response → UI updates
```

---

## Project structure

```
Product_Assignment/
├── frontend/                 # React + Vite client
│   ├── src/
│   │   ├── components/     # Navbar, ProductCard, FilterBar, Pagination, etc.
│   │   ├── context/        # AuthContext (JWT session)
│   │   ├── pages/          # Login, Signup, ProductList, AddProduct, EditProduct
│   │   ├── services/       # api.js (Axios + API helpers)
│   │   └── utils/          # Form validators
│   └── vercel.json         # SPA routing + /api proxy to Render
├── backend/                  # Express REST API
│   ├── src/
│   │   ├── config/         # DB connection, Swagger
│   │   ├── controllers/    # authController, productController
│   │   ├── middleware/     # auth, validate, errorHandler
│   │   ├── models/         # User, Product (Mongoose schemas)
│   │   ├── routes/         # /api/auth, /api/products
│   │   ├── validators/     # express-validator rules
│   │   └── utils/            # AppError, apiResponse, asyncHandler
│   └── tests/              # Jest + Supertest
├── docker-compose.yml        # MongoDB + API containers
├── DEPLOY_RAILWAY.md         # Railway deployment guide
└── SECURITY.md               # Secrets and security notes
```

---

## Features

- User registration and login with JWT
- Protected product CRUD (Create, Read, Update, Delete)
- Product search, filters, sorting, and pagination
- Featured / price / rating query endpoints
- Rate limiting and input validation
- Swagger API documentation at `/api-docs`
- Responsive UI with loading states and error messages
- Backend test suite (auth + products)

---

## Local setup

### Prerequisites

- Node.js 18+
- npm
- MongoDB (local, Atlas, or via Docker Compose)

### 1. Backend

```powershell
cd backend
cp .env.example .env
# Edit .env: set MONGODB_URI, JWT_SECRET, etc.
npm install
npm run dev
```

API runs at `http://localhost:5000`.

### 2. Frontend

```powershell
cd frontend
cp .env.example .env
npm install
npm run dev
```

App runs at `http://localhost:5174`. Vite proxies `/api` to the backend (see `vite.config.js`).

### 3. Docker (optional)

```powershell
docker compose up --build
```

Starts MongoDB and the API on port `5000`.

### Run tests

```powershell
cd backend
npm test
```

---

## Deployment

| Service | Host | Role |
|---------|------|------|
| Frontend | **Vercel** | Serves React build; proxies `/api` to backend |
| Backend | **Render** | Express API |
| Database | **MongoDB Atlas** | Persistent storage |

### Frontend (Vercel)

- Root directory: `frontend`
- `vercel.json` rewrites `/api/*` → Render backend
- Set `VITE_API_URL=/api` (or leave unset; production defaults to `/api`)
- Do **not** point `VITE_API_URL` directly at Render unless you also configure backend CORS

### Backend (Render)

- Root directory: `backend`
- Start command: `npm start`
- Health check: `/health`
- Required env vars: `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`
- CORS: set `CLIENT_URLS` to your Vercel URL, e.g. `https://product-assignment-zeta.vercel.app`

See [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md) for Railway-specific steps.

---

## API endpoints

### Auth

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login | No |
| GET | `/api/auth/me` | Current user profile | Yes |

### Products (all require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List with search, filter, sort, pagination |
| GET | `/api/products/:id` | Get one product |
| POST | `/api/products` | Create product |
| PUT | `/api/products/:id` | Update product |
| DELETE | `/api/products/:id` | Delete product |
| GET | `/api/products/featured` | Featured products |
| GET | `/api/products/price/below/:price` | Products below price |
| GET | `/api/products/rating/above/:rating` | Products above rating |

### Other

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api-docs` | Swagger UI |

---

## Environment variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWTs |
| `JWT_EXPIRES_IN` | Token expiry (default `7d`) |
| `CLIENT_URL` / `CLIENT_URLS` | Allowed frontend origins (CORS) |
| `NODE_ENV` | `development` or `production` |
| `PORT` | Server port (default `5000`) |

### Frontend (`frontend/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | API base URL (`/api` for local and Vercel) |

Never commit `.env` files. Use `.env.example` as a template.

---

## Security notes

- Passwords are hashed with bcrypt before storage
- JWT tokens expire after a configurable period
- API routes are rate-limited
- Input is validated on both client and server
- Secrets belong in hosting env vars, not in git — see [SECURITY.md](./SECURITY.md)

---

## Author

**ManshuCoder** — [GitHub](https://github.com/ManshuCoder)
