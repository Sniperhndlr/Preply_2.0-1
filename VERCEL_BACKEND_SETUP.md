# Vercel Backend Deployment (PreplyUS)

This repo now supports deploying the backend from `server/` as a Vercel serverless API.

## 1) Create a Postgres database
Use Neon, Supabase, Railway, or another hosted Postgres provider.

Copy the connection string as `DATABASE_URL`.

## 2) Deploy backend project on Vercel
1. In Vercel, click **Add New Project**.
2. Import this GitHub repo.
3. Set **Root Directory** to: `server`.
4. Build settings:
   - Install Command: `npm install`
   - Build Command: `npm run prisma:generate`
5. Environment Variables:
   - `DATABASE_URL` = your Postgres connection URL
   - `JWT_SECRET` = strong random secret
   - `CORS_ORIGIN` = your frontend URL (e.g. `https://your-frontend.vercel.app`)
6. Deploy.

Your backend base URL will be:

`https://<your-backend-vercel-project>.vercel.app/api`

Example if project name is `preplyus-api`:

`https://preplyus-api.vercel.app/api`

## 3) Initialize database schema and seed data
After backend deploy, run from local machine:

```bash
cd server
# Ensure DATABASE_URL in your local server/.env points to the same hosted Postgres DB
npm run prisma:push
npm run prisma:seed
```

## 4) Connect frontend to backend
In your frontend Vercel project, set:

- `VITE_API_URL=https://<your-backend-vercel-project>.vercel.app/api`

Redeploy frontend.

## 5) Verify health
Open:

`https://<your-backend-vercel-project>.vercel.app/api/health`

Expected JSON:

```json
{"status":"ok","message":"Server is running"}
```
