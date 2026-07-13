# Digital Panchayat Service Portal (CSP Village Portal)

## Problem Statement

In many rural areas, access to Panchayat services and essential information remains limited due to manual processes, lack of transparency, and fragmented communication channels. Villagers often need to visit offices multiple times to obtain service details, apply for schemes, or collect required forms, leading to delays, inconvenience, and reduced awareness of available government benefits.

The Digital Panchayat Service Portal aims to provide a centralized, user-friendly digital platform so citizens can access Panchayat services, view announcements, explore schemes, and access village/secretariat information online.

## Project Overview

This repository implements a full-stack web application with:
- `src/` — the React + TypeScript frontend
- `backend/` — the Express TypeScript backend
- `db.json` — local JSON data store used by the backend

The app is multilingual (English/Telugu) and supports village selection, portal navigation, admin authentication, and content updates.

## Objectives

- Provide a centralized digital portal for Panchayat and village information
- Reduce in-person visits for basic service details
- Increase transparency through published announcements and civic data
- Support bilingual access for wider accessibility
- Enable secure administration of portal data and staff records

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- Tailwind CSS (via `@tailwindcss/vite`)
- lucide-react for icons

**Backend**
- Node.js
- Express
- TypeScript
- JWT-based authentication for admin routes
- CORS and dotenv for environment-based configuration

**Data**
- `db.json` acts as the local data store for villages, staff, announcements, gallery content, and portal data
- Backend read/write operations are handled through Express API endpoints

## Features

- Village selector for portal personalization
- Multi-page navigation: Home, About, Administration, Infrastructure, Welfare, Voters, Gallery, Contact
- Multilingual support (English/Telugu)
- Admin login with JWT authentication
- Protected admin endpoints for secure content updates
- Staff CRUD operations and portal content management
- Local persistence via `db.json`

## Prerequisites

- Node.js 18 or newer
- npm

## Local Setup

1. Install root dependencies:

   ```bash
   npm install
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   cd ..
   ```

3. Start the backend in one terminal:

   ```bash
   cd backend
   npm run dev
   ```

   The backend defaults to `http://localhost:3000` and uses the local `backend/db.json` file when run from the `backend` folder.

4. Start the frontend in another terminal:

   ```bash
   cd ..
   npm run dev
   ```

5. Open the Vite app URL shown in the frontend terminal.

## Scripts

**Root repository**
- `npm run dev` — start the Vite frontend
- `npm run build` — build the frontend to `dist`
- `npm run lint` — run TypeScript type checking
- `npm run clean` — remove build outputs

**Backend (`backend/`)**
- `npm run dev` — run the backend with `tsx`
- `npm run build` — bundle the backend server
- `npm run start` — start the bundled backend server
- `npm run lint` — run TypeScript type checking for backend code

> Note: The root package includes a `build:server` script, but the backend is maintained in `backend/package.json`. For reliable backend packaging, use the scripts inside `backend/`.

## Backend Configuration

The backend reads and writes `db.json` relative to the working directory. When started from `backend/`, it uses `backend/db.json`.

Supported environment variables:
- `PORT` — backend port (default `3000`)
- `JWT_SECRET` — secret used to sign JWT tokens
- `CORS_ORIGIN` — comma-separated list of allowed origins for CORS

## Admin Access

Default local development admin credentials:
- username: `admin`
- password: `password123`

The `/api/auth/login` endpoint issues a JWT token that is required for protected admin and staff-management routes.

## Deployment Notes

- Frontend can deploy as a static Vite app on Vercel, Netlify, or similar hosts.
- Backend can deploy as a Node service on Render, Heroku, Fly, or other Node hosting platforms.
- Persist `db.json` in production if data must survive restarts.
- The frontend can use `VITE_API_BASE` to point to the deployed backend base URL.

## Project Structure

- `src/` — React app source code
- `src/App.tsx` — main application entry point and page routing
- `src/pages/` — portal page components
- `src/components/` — reusable UI components and context providers
- `src/config/api.ts` — API base URL utility used by frontend requests
- `backend/` — backend server source and package files
- `backend/server.ts` — Express backend server implementation
- `backend/package.json` — backend-specific scripts and dependencies
- `db.json` — local JSON data store used by the backend when run from the repository root
- `backend/db.json` — local JSON data store used when backend is run from `backend/`

## Notes

- This README is the main project documentation.
- `README_DEPLOY.md` contains deployment-specific guidance.
- Keep the frontend and backend running in separate terminals during development.
