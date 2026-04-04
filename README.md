# EPIS

EPIS is a MERN monorepo for the Employee Prediction Intelligence System.

## Structure

- `client/` React + Tailwind frontend
- `server/` Express + MongoDB backend

## Quick start

1. Create `server/.env` from `server/.env.example`.
2. Install dependencies with `npm install`.
3. Start both apps with `npm run dev`.

## Environment

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/epis
JWT_SECRET=change-me
CLIENT_URL=http://localhost:5173
DEFAULT_HR_NAME=EPIS HR Admin
DEFAULT_HR_EMAIL=hr@epis.local
DEFAULT_HR_PASSWORD=ChangeMe123!
```

If the default HR variables are provided, the server bootstraps a real HR account on star

Start-Service MongoDB
cd C:\Users\Aditya\OneDrive\Desktop\EPIS
npm run dev
