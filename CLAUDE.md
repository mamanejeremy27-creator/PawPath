# PawPath — Project Context for LLMs

## What Is This

PawPath is a bilingual (English + Hebrew/RTL) dog training PWA. Features include multi-dog support, training programs with exercises, XP/streaks/badges/challenges, journal with photos, community feed, buddy system, walk tracker, health dashboard, lost dog tracker with maps, leaderboard, and more.

## Branch: `refactor`

This branch is a **full-stack migration from Supabase to a self-hosted NestJS + PostgreSQL backend**. The `main` branch was a frontend-only React app that talked directly to Supabase (auth, database, storage). The `refactor` branch introduces a proper backend and restructures the repo into a monorepo.

### What Changed

| Before (`main`) | After (`refactor`) |
|---|---|
| Single `src/` folder — frontend-only React app | Monorepo: `frontend/` + `backend/` + root `docker-compose.yml` |
| Supabase Auth (email/password + magic link) | Passport Local + JWT (7-day expiry) |
| Supabase Postgres (direct client queries via `supabase-js`) | PostgreSQL 16 via Docker + TypeORM entities + NestJS REST API |
| Supabase Storage for photos | Local file uploads served via `/uploads/` |
| 10 frontend lib files (`database.js`, `storage.js`, `syncEngine.js`, `migrate.js`, `supabase.js`, `community.js`, `leaderboard.js`, `healthTracker.js`, `buddyMatching.js`, `lostDog.js`) | All deleted — replaced by `frontend/src/lib/api.js` (centralized REST client) |
| No backend | NestJS backend with 12 modules, 29 entities, DTOs with class-validator, seed service |

### Key Architectural Decisions

- **Auth**: JWT stored in `localStorage` via `frontend/src/lib/auth.js`. Backend issues tokens on login/register, frontend sends `Authorization: Bearer <token>` header on all API calls.
- **API prefix**: All backend routes are under `/api` (set in `backend/src/main.ts`).
- **Vite proxy**: Frontend dev server proxies `/api` and `/uploads` to `localhost:3004`, so no CORS issues during development.
- **DB sync**: TypeORM `synchronize: true` is used for development — the schema auto-updates from entity definitions. For production, switch to migrations.
- **Seed data**: Training programs, badges, challenges, and streak milestones are seeded into the database on startup via `backend/src/modules/seed/`. The seed service runs `onModuleInit` and only inserts if tables are empty.
- **Static file uploads**: Stored in `backend/uploads/`, served at `/uploads/` via `express.static`.

---

## How to Run Locally

### Prerequisites

- **Node.js** (v18+)
- **npm**
- **Docker** and **Docker Compose**

### 1. Start the Database

From the project root:

```bash
docker compose up -d
```

This starts:
- **PostgreSQL 16** on port `5435` (user: `pawpath`, password: `pawpath_dev`, database: `pawpath`)
- **Adminer** (DB admin UI) on port `8083` — open http://localhost:8083

### 2. Set Up the Backend

```bash
cd backend
cp .env.example .env    # defaults are fine for local dev
npm install
npm run start:dev       # starts NestJS in watch mode on port 3004
```

The backend will:
- Auto-create all database tables on first run (TypeORM `synchronize: true`)
- Seed training programs, badges, challenges, and streak milestones into the DB

### 3. Set Up the Frontend

```bash
cd frontend
npm install
npm run dev             # starts Vite dev server on port 5176
```

Open http://localhost:5176 — the app is ready.

### 4. Running Tests

**Backend** (Jest):
```bash
cd backend
npm test                # 11 unit test suites, ~130 tests
npm run test:e2e        # 3 E2E suites, ~40 tests (needs DB running)
```

**Frontend** (Vitest):
```bash
cd frontend
npm test                # 5 test suites, ~94 tests
```

E2E tests use a separate `pawpath_test` database on the same Docker PostgreSQL instance (port 5435).

---

## Project Structure

```
PawPath/
├── docker-compose.yml          # PostgreSQL 16 + Adminer
├── backend/                    # NestJS (TypeScript)
│   ├── .env.example
│   ├── src/
│   │   ├── main.ts             # Bootstrap: validation pipe, CORS, /api prefix, static assets
│   │   ├── app.module.ts       # Root module — imports all feature modules
│   │   ├── entities/           # 29 TypeORM entities
│   │   │   ├── user.entity.ts
│   │   │   ├── dog.entity.ts
│   │   │   ├── training-program.entity.ts
│   │   │   └── ...
│   │   ├── modules/
│   │   │   ├── auth/           # Login, register, JWT strategy, guards
│   │   │   ├── dogs/           # CRUD for dogs per user
│   │   │   ├── training/       # Training progress, exercises, XP
│   │   │   ├── health/         # Weight, vaccinations, vet visits, medications
│   │   │   ├── walks/          # Walk tracking
│   │   │   ├── community/      # Posts, comments, likes
│   │   │   ├── leaderboard/    # XP leaderboard
│   │   │   ├── buddies/        # Buddy matching system
│   │   │   ├── lost-dogs/      # Lost dog reports + sightings
│   │   │   ├── feedback/       # User feedback
│   │   │   ├── settings/       # User settings
│   │   │   └── seed/           # Auto-seeds static data on startup
│   │   └── data/               # (now in seed/data/) programs, badges, challenges, milestones
│   └── test/                   # E2E tests
├── frontend/                   # React + Vite + Tailwind CSS (JavaScript/JSX)
│   ├── src/
│   │   ├── App.jsx             # Screen-based navigation (no React Router)
│   │   ├── context/AppContext.jsx  # Global state (~1,093 lines)
│   │   ├── components/         # 75+ component files
│   │   ├── lib/
│   │   │   ├── api.js          # Centralized REST API layer (replaces all Supabase libs)
│   │   │   ├── auth.js         # JWT token management (get/set/clear token)
│   │   │   ├── walkTracker.js
│   │   │   └── pushNotifications.js
│   │   ├── hooks/useAuth.js    # React hook for auth state
│   │   ├── i18n/               # en.js, he.js — bilingual support
│   │   ├── data/               # Client-side static data (programs, badges, etc.)
│   │   └── utils/
│   └── vite.config.js          # Dev server on 5176, proxies /api + /uploads to 3004
```

## Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend (Vite) | 5176 | http://localhost:5176 |
| Backend (NestJS) | 3004 | http://localhost:3004/api |
| PostgreSQL | 5435 | `localhost:5435` |
| Adminer | 8083 | http://localhost:8083 |

## Backend .env (from .env.example)

```
DB_HOST=localhost
DB_PORT=5435
DB_USERNAME=pawpath
DB_PASSWORD=pawpath_dev
DB_DATABASE=pawpath
JWT_SECRET=change-me-in-production
JWT_EXPIRATION=7d
PORT=3004
FRONTEND_URL=http://localhost:5176
```

## Important Patterns

- **Backend pattern**: Each module follows controller + service + DTOs. Controllers handle HTTP, services handle business logic, DTOs use `class-validator` decorators for validation.
- **Auth**: `JwtAuthGuard` protects routes, `@CurrentUser()` decorator extracts the authenticated user. `LocalAuthGuard` handles login.
- **Frontend API calls**: All go through `frontend/src/lib/api.js` which attaches JWT headers automatically. No direct DB calls.
- **Navigation**: The frontend uses screen-based navigation in `App.jsx` (no React Router). Screen state is managed in `AppContext.jsx`.
- **RTL/Hebrew**: Use CSS logical properties (`margin-inline-start`, `ps-*`/`pe-*` in Tailwind). All user-facing strings go through `i18n/`.

## Known Gotcha

**NEVER use `import type` for DTO classes in NestJS controllers.** `import type` strips the class at compile time, so `ValidationPipe` can't read decorator metadata and rejects all properties as "should not exist". Services CAN use `import type` for DTOs since they only use the shape.
