Render + Vercel deployment notes

Overview
- This repo contains a MERN stack app: a React/Vite frontend in the repo root and an Express + MongoDB (Mongoose) backend in `backend/`.
- Deploy the backend to Render (Node service) connected to MongoDB Atlas, and deploy the frontend to Vercel (static site).

Backend (Render)
1. Provision a MongoDB Atlas cluster and copy its connection URI.
2. In Render: create a Web Service
   - Root Directory: `backend`
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Env vars:
     - `NODE_ENV=production`
     - `MONGODB_URI=<your-mongodb-atlas-uri>`
     - `JWT_SECRET=<strong-random-secret>`
     - `CORS_ORIGIN=https://<your-vercel-app>.vercel.app`
   - On first boot, the server automatically seeds the `villages` collection from `backend/db.json` if empty (you can also run `npm run seed`).
2. Locally (test):
```bash
cd backend
npm install
npm run build   # builds dist/server.cjs
npm run start
```

Frontend (Vercel)
1. Vercel will use the root `package.json` `build` script to build the client (`vite build`).
2. Add a Vercel project pointing to this repo. The provided `vercel.json` config uses `@vercel/static-build` and expects output in `dist`.
3. Build Command (if asked in UI): `npm run build`
   Output Directory: `dist`

Notes
- I changed the root `package.json` `build` script to `vite build` and added `build:server` which bundles the server separately with `esbuild` if you need it.
- For Render the `backend/package.json` scripts control server build/start.
- Vercel does not provide persistent filesystem disks; do not put `db.json` in a Vercel-hosted project if you expect persistence.

If you want, I can:
- Run the local build and start steps and report back errors.
- Create a Render deploy script or CI workflow for automated deploys.
