# Deploying the backend to Railway

This guide covers deploying the `backend` service to Railway (https://railway.app).

Prerequisites
- A Railway account
- Railway CLI (optional but handy): `npm i -g railway`

Steps — Web dashboard (recommended)
1. Create a new Railway project and connect your GitHub repo (Product_Assignment).
2. In the Railway project, add a new Service and choose "Deploy from GitHub". Select the `backend` folder as the root if prompted.
3. Set the Build and Start settings (Railway may auto-detect):
   - Build: default (Nixpacks)
   - Start Command: `npm start`
   - Healthcheck Path: `/health`
4. Add required environment variables in Project Settings → Variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong secret
   - `CLIENT_URL` — e.g., `https://your-frontend-url` (or http://localhost:5174 for local testing)
   - `API_URL` — can be the Railway service URL (set after first deploy) or `http://localhost:5000` for local dev
   - `CLERK_SECRET_KEY` — only if you use Clerk
   - `NODE_ENV=production`

   Copy/paste checklist for Railway variables:
```text
MONGODB_URI=mongodb+srv://<DB_USER>:<DB_PASSWORD>@<CLUSTER_HOST>/<DB_NAME>?retryWrites=true&w=majority
JWT_SECRET=<strong-random-secret>
CLIENT_URL=https://<your-frontend-domain>
API_URL=https://<your-railway-backend-domain>
CLERK_SECRET_KEY=<your-clerk-secret-key>
NODE_ENV=production
```

5. Deploy. Railway will build the project and run `npm start`.

Steps — Railway CLI (alternative)
1. Install and login:
```bash
npm i -g railway
railway login
```
2. Initialize or link the project from your repo's backend folder:
```bash
cd backend
railway init # or `railway link` to an existing project
```
3. Set environment variables via CLI (repeat per variable):
```bash
railway variables set MONGODB_URI="<your-uri>"
railway variables set JWT_SECRET="<your-jwt-secret>"
railway variables set CLIENT_URL="https://your-frontend"
railway variables set CLERK_SECRET_KEY="<your-clerk-key>"
```
4. Deploy:
```bash
railway up
```

Post-deploy
- Check service logs in Railway to confirm `Server running on port` and `MongoDB connected` messages.
- Use the Railway service URL as `API_URL` for your frontend environment variables.

Troubleshooting
- Connection/auth errors: confirm `MONGODB_URI` is correct and Atlas has your Railway IP allowed (or set IP 0.0.0.0/0 for testing).
- DNS SRV issues: try a non-SRV connection string if your environment cannot resolve SRV records.
- Env variables not present: ensure the service is redeployed after updating variables.

Security reminder
- Do not commit `.env` or secrets. Use Railway environment variables.
- Rotate the MongoDB user password if it has been exposed.
