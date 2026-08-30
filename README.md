# PayTrack

Backend-first implementation of the CIS weekly-pay assignment.

## Backend setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` to a PostgreSQL database.
2. Run `npm install`.
3. Run `npm run prisma:generate`.
4. Run `npm run prisma:migrate`.
5. Run `npm run prisma:seed` to create example workers.
6. Run `npm run start:dev`.

The API listens on port `3001` by default. It currently exposes only the required endpoints:

- `POST /timesheets`
- `POST /timesheets/:id/transition`
- `GET /timesheets/:id`

Run the pure-domain and state-machine test suite with `npm test`.
