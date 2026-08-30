# PayTrack

A full-stack weekly pay timesheet app with a NestJS backend and a Next.js frontend.

## Project structure

```text
paytrack/
├── README.md
├── .gitignore
├── backend/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   ├── prisma/
│   ├── requests/
│   ├── src/
│   └── ...
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── ...
├── TechDojo_Technical_Assignment.pdf
└── .git
```

## Tech stack

- Backend: NestJS + Prisma + PostgreSQL
- Frontend: Next.js

## Prerequisites

- Node.js 18+
- PostgreSQL running locally
- npm

## Backend setup

From the backend folder:

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

Backend API runs on:

- http://localhost:3001

Available endpoints include:

- POST /timesheets
- POST /timesheets/:id/transition
- GET /timesheets/:id

## Frontend setup

From the frontend folder:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

- http://localhost:3000

The frontend is configured to proxy `/api/*` requests to the backend at port 3001.

## Run both together

Open two terminals:

Terminal 1:

```bash
cd backend
npm run start:dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

## Notes

- Keep backend environment variables in `backend/.env`
- Keep frontend environment variables in `frontend/.env.local` when needed
- The PDF assignment file remains at the repo root for reference
