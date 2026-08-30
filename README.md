# PayTrack

This project implements the weekly pay timesheet requirement from the Tech Dojo Technical Screening Assignment. It is a small full-stack app built with a NestJS backend and a Next.js frontend, using PostgreSQL via Prisma.

## Stack

- Backend: NestJS + TypeScript + Prisma + PostgreSQL
- Frontend: Next.js (App Router) + React
- Tests: Jest

## Repository layout

```text
paytrack/
├── README.md
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── prisma/
│   ├── src/
│   └── ...
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── package.json
│   └── ...
└── .gitignore
```

## How to run it

From a clean clone:

```bash
git clone <repo-url>
cd paytrack

# 1) install backend dependencies
cd backend
npm install
copy .env.example .env
# edit backend/.env and set a valid PostgreSQL DATABASE_URL, for example:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/paytrack?schema=public"
# PORT=3001

npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run start:dev
```

Open a second terminal:

```bash
cd paytrack/frontend
npm install
npm run dev
```

Then open:

- Backend: http://localhost:3001
- Frontend: http://localhost:3000

The frontend proxies to the backend for API calls.

## Required setup notes

- PostgreSQL must be running locally before Prisma migration.
- The database must already exist or Prisma must be able to create it through the connection string.
- If the local database is stale, reset it before re-seeding:

```bash
cd backend
npx prisma migrate reset
npm run prisma:seed
```

## What the app does

The app implements the payroll workflow described in the assignment:

- Creates a timesheet in DRAFT state
- Validates the week ending is a Sunday
- Enforces the valid status transitions
- Prevents changes after PAID
- Rejects invalid transitions with user-facing payroll-style messages
- Calculates:
  - labour total
  - materials total
  - expenses total
  - gross pay
  - CIS deduction
  - net pay before and after advance repayment
  - carried-forward advance
- Displays the result on a single timesheet page with money formatted as £ and pence, and dates shown as DD/MM/YYYY

## AI use

I used GitHub Copilot in VS Code as the main AI coding assistant for scaffolding, refactors, and validation work. Roughly a large portion of the project structure and repeated boilerplate was generated or accelerated by the agent, but every critical business rule was reviewed and corrected manually.

One concrete example of an agent mistake: the frontend initially used a hardcoded worker ID that became stale after the database was reset. The agent suggested keeping the old ID, but I corrected that by fetching the live worker list from the backend and binding the form to the actual seeded workers. That was the correct fix because the worker IDs are database-generated and therefore cannot be treated as stable static values.

## Wrong example from the assignment

The incorrect example is Example 5.

It breaks Rule R7: "The deduction base is labourTotalPence and only labourTotalPence." Materials and expenses are not part of the CIS base.

Example 5 states:

- labourTotalPence = 64800
- materialsTotalPence = 8998
- grossPence = 73798
- cisDeductionPence = 14759
- netPayPence = 59039

That is incorrect. The valid calculation is:

- labourTotalPence = 64800
- cisDeductionPence = roundDown(64800 × 20 / 100) = roundDown(12960) = 12960
- netPayPence = 73798 - 12960 = 60838

I spotted it by checking the assignment's stated rule that the deduction is based only on labour, not materials, and by validating against the formula in section 5.3.

## Ambiguities and assumptions

There are a few places in the assignment where the wording is under-specified, and the README should flag those instead of silently guessing:

1. The assignment defines the UI requirement but does not specify how worker selection is populated in the frontend. I assumed the backend should expose a worker list endpoint and the form should show a worker dropdown populated from the database.
2. The document says "One page — /timesheets/[id] is fine" but does not define whether the page should support editing or only viewing. I assumed a read-only display with the calculation breakdown, plus the allowed transition buttons, is sufficient for the assignment.
3. The doc says the API should validate inputs, but it does not prescribe exactly which validation errors should be shaped like. I kept the errors user-facing and payroll-clerk friendly, rather than exposing raw stack traces or internal constant names.

Flagging these choices is better than silently guessing, and it is exactly the kind of judgment the assignment asks for.

## What I cut

Because this is a three-hour technical screening task, I intentionally kept the scope to the domain logic and the required thin slice around it. I did not build:

- authentication or authorisation
- multi-page navigation
- list pages or search pages
- UI editing of existing lines
- Docker, deployment, or CI pipelines
- a design system or polished styling
- extra administrative screens or features beyond the required timesheet flow

If I had two more hours, the next improvements would be:

- more exhaustive edge-case tests around the 40.00-hour threshold and zero values
- stronger UI validation for line input and transition states
- more polished formatting and accessibility, while keeping the same core logic and API contracts

## Testing

The backend includes Jest tests for the core calculation and state-machine rules. The project is intended to be validated with the real API flow as well:

```bash
cd backend
npm test
```

And then run the frontend and backend together as above to exercise the end-to-end timesheet flow.

## Notes for submission

This project is designed to satisfy the Tech Dojo screening assignment and keep the work focused on correctness rather than unnecessary product scope. The key evaluation areas are calculation correctness, integer pence discipline, the state machine, the README quality, and clear handling of the ambiguity in the specification.
