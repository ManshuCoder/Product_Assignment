# Backend — Product_Assignment

Quick setup and running instructions for the backend (local development).

Prerequisites
- Node.js 18+ and npm
- A MongoDB Atlas cluster or other MongoDB instance

Local setup

1. Copy the example env file and fill values (do NOT commit your `.env`):

```powershell
cd backend
cp .env.example .env
# edit `.env` and set MONGODB_URI, JWT_SECRET, CLERK_SECRET_KEY, etc.
```

2. Install dependencies and run locally:

```powershell
npm install
npm run dev
```

Run tests

```powershell
npm test
```

Verify MongoDB connection (quick test)

```powershell
node scripts/testConnection.js
```

Secrets and security
- Never commit `.env` — it is gitignored. Use `backend/.env.example` as the template.
- Rotate any secrets that were exposed (MongoDB user password, Clerk keys). See `SECURITY.md` for details.
- For production, set environment variables in your host/CI secret manager (Vercel, Railway, Heroku, GitHub Actions secrets, etc.).

Deployment notes
- Ensure `MONGODB_URI` is provided in the environment where the app runs.
- In production set `NODE_ENV=production` and keep `JWT_SECRET` secure.

Support
- If you want me to create deployment-specific instructions (e.g., Vercel, Railway, Docker Compose), tell me which platform and I will add them.
