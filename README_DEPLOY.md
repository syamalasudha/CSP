Render + Vercel deployment notes

Overview
- This repo contains a frontend (Vite/React) in the repo root and a backend Express server in `backend/`.
- Deploy the backend to Render (Node service) and the frontend to Vercel (static site). The backend uses `backend/db.json` for persistent data — attach a Render Disk.

Backend (Render)
1. In Render: create a Web Service
   - Root Directory: `backend`
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Env vars: `NODE_ENV=production`, add `JWT_SECRET` if desired
   - Add a Disk and mount path: `/opt/render/project/src/backend` (so `backend/db.json` persists)
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
