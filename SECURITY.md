**Security & Secrets — Product_Assignment**

This document explains how to rotate credentials that were accidentally committed, and how to securely manage secrets for local development and deployment.

1) Rotate exposed credentials (immediately)
   - MongoDB: In MongoDB Atlas, go to "Database Access" → edit the database user used in `MONGODB_URI` → change the password.
   - Clerk or third-party keys: regenerate/rotate the keys in the vendor console.
   - Once rotated, update the new values only in your deployment secret manager (see step 3).

2) Update your connection string
   - After rotating the MongoDB password, update your connection string in your environment variables. If the password contains special characters, URL-encode them (e.g., `@` → `%40`).
   - Example connection string:
     mongodb+srv://myuser:myP%40ssw0rd@cluster0.xxxxx.mongodb.net/producthub?retryWrites=true&w=majority

3) Deploy secrets safely (do NOT commit `.env`)
   - Local development: keep a local `backend/.env` (gitignored). Use `backend/.env.example` as a template.
   - Production / CI: set `MONGODB_URI`, `JWT_SECRET`, and other secrets using your host's secret manager (GitHub Actions secrets, Railway/Heroku/Vercel environment settings, AWS Secrets Manager, etc.).

4) Remove secrets from Git history (optional but recommended)
   - If secrets were pushed, consider rotating them (mandatory) and optionally remove them from git history using `git filter-repo` or the BFG Repo-Cleaner. Be careful: rewriting history affects collaborators.

5) Verify connection & tests
   - Run the included connection test locally:
```powershell
cd backend
node scripts/testConnection.js
```
   - Run tests:
```powershell
cd backend
npm test
```

6) Contact & follow-up
   - After rotation, ensure all deployments and CI pipelines use the new secrets.
   - If you want, I can help rotate keys and update deployment settings — tell me which host or CI you're using.

Best practices
 - Use a password manager to create and store strong passwords.
 - Use short-lived credentials or scoped service accounts for production.
 - Audit access in Atlas and third-party consoles regularly.
