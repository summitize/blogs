# Summitize MERN App (Under react/)

This folder contains the MERN migration of the static site while keeping the outer static version untouched.

## Structure

- `client/` - React + Vite frontend
- `server/` - Express + MongoDB backend API

## Quick Start

1. `cd react`
2. `npm install`
3. Create env files:
   - `server/.env` from `server/.env.example`
   - `client/.env` from `client/.env.example` (optional if using Vite proxy)
4. `npm run dev`

## Default URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Feedback API: `POST /api/feedback`

## Notes

- The frontend uses `BrowserRouter` with static-host deep-link fallback via `client/public/404.html`.
- Feedback is stored in MongoDB when connected; otherwise the API falls back to in-memory storage.
