# PawPath — Project Context for LLMs

## What Is This

PawPath is a bilingual (English + Hebrew/RTL) dog training PWA. Features include multi-dog support, training programs with exercises, XP/streaks/badges/weekly challenges, journal with photos, community feed, buddy system, walk tracker, health dashboard, lost dog tracker with maps, leaderboard, and more.

## Architecture

**Monorepo:** `frontend/` (React + Vite + TypeScript) + `backend/` (NestJS + TypeScript) + root `docker-compose.yml` and `pnpm-workspace.yaml`.

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript (.tsx/.ts) + Tailwind CSS |
| Backend | NestJS + TypeScript + TypeORM |
| Database | PostgreSQL 16 via Docker |
| Auth | Passport Local + JWT (7-day expiry), token in `localStorage` |
| Package manager | pnpm (workspace monorepo) |

### Key Architectural Decisions

- **Auth**: JWT stored in `localStorage` via `frontend/src/lib/auth.ts`. Backend issues tokens on login/register, frontend sends `Authorization: Bearer <token>` header on all API calls.
- **API prefix**: All backend routes are under `/api` (set in `backend/src/main.ts`).
- **Vite proxy**: Frontend dev server proxies `/api` and `/uploads` to `localhost:3004`, so no CORS issues during development.
- **DB sync**: TypeORM `synchronize: true` is used for development — the schema auto-updates from entity definitions. For production, switch to migrations.
- **Seed data**: Training programs, badges, challenges, and streak milestones are seeded on startup via `backend/src/modules/seed/`. The seed service runs `onModuleInit` and only inserts if tables are empty.
- **Static file uploads**: Stored in `backend/uploads/`, served at `/uploads/` via `express.static`.

---

## How to Run Locally

> **This is a pnpm monorepo.** From the project root, `pnpm install` installs all workspace dependencies (frontend + backend) at once.

### Prerequisites

- **Node.js** (v18+)
- **pnpm** (`npm install -g pnpm`)
- **Docker** and **Docker Compose**

### 1. Start the Database

```bash
docker compose up -d
```

- **PostgreSQL 16** on port `5435` (user: `pawpath`, password: `pawpath_dev`, database: `pawpath`)
- **Adminer** on port `8083` — http://localhost:8083

### 2. Install All Dependencies

```bash
pnpm install
```

### 3. Set Up the Backend

```bash
cd backend
cp .env.example .env    # defaults are fine for local dev
pnpm run start:dev       # starts NestJS in watch mode on port 3004
```

Or from root: `pnpm --filter pawpath-backend run start:dev`

### 4. Set Up the Frontend

```bash
cd frontend
pnpm run dev             # starts Vite dev server on port 5176
```

Or from root: `pnpm --filter pawpath-frontend run dev`

Open http://localhost:5176 — the app is ready.

### 5. Running Tests

**Backend** (Jest):
```bash
cd backend
pnpm test                # 11 unit test suites, ~130 tests
pnpm run test:e2e        # 3 E2E suites, ~40 tests (needs DB running)
```

**Frontend** (Vitest):
```bash
cd frontend
pnpm test                # 5 test suites, 94 tests
```

E2E tests use a separate `pawpath_test` database on the same Docker PostgreSQL instance (port 5435).

---

## Project Structure

```
PawPath/
├── docker-compose.yml          # PostgreSQL 16 + Adminer
├── pnpm-workspace.yaml         # pnpm monorepo config
├── docs/                       # Feature specs (see below)
├── backend/                    # NestJS (TypeScript)
│   ├── .env.example
│   └── src/
│       ├── main.ts             # Bootstrap: validation pipe, CORS, /api prefix, static assets
│       ├── app.module.ts       # Root module — imports all feature modules
│       ├── entities/           # 29 TypeORM entities
│       ├── modules/
│       │   ├── auth/           # Login, register, JWT strategy, guards
│       │   ├── dogs/           # CRUD for dogs per user
│       │   ├── training/       # Training progress, exercises, XP
│       │   ├── health/         # Weight, vaccinations, vet visits, medications
│       │   ├── walks/          # Walk tracking
│       │   ├── community/      # Posts, comments, likes
│       │   ├── leaderboard/    # XP leaderboard
│       │   ├── buddies/        # Buddy matching system
│       │   ├── lost-dogs/      # Lost dog reports + sightings
│       │   ├── feedback/       # User feedback
│       │   ├── settings/       # User settings
│       │   └── seed/           # Auto-seeds static data on startup
│       └── data/               # Seed source data
└── frontend/                   # React + Vite + TypeScript PWA
    └── src/
        ├── App.tsx             # Screen-based navigation (no React Router)
        ├── context/
        │   └── AppContext.tsx  # Global state (~804 lines)
        ├── hooks/              # 9 custom hooks extracted from AppContext:
        │                       # useAuth, useChallengeData, useChallengeSync,
        │                       # useDailyPlan, useDifficultyTracking,
        │                       # useElevenLabsTts, useReminderCheck,
        │                       # useSkillHealth, useStreakBreakDetection,
        │                       # useVoiceMode
        ├── components/         # 75+ .tsx component files
        ├── lib/
        │   ├── api.ts          # Centralized REST API layer
        │   ├── auth.ts         # JWT token management (get/set/clear)
        │   ├── walkTracker.ts
        │   └── pushNotifications.ts
        ├── i18n/               # en.ts, he.ts — bilingual strings
        ├── data/               # Client-side static data (programs, badges, etc.)
        └── utils/
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
- **Frontend API calls**: All go through `frontend/src/lib/api.ts` which attaches JWT headers automatically. No direct DB calls.
- **Navigation**: The frontend uses screen-based navigation in `App.tsx` (no React Router). Screen state is managed in `AppContext.tsx`.
- **RTL/Hebrew**: Use CSS logical properties (`margin-inline-start`, `ps-*`/`pe-*` in Tailwind). All user-facing strings go through `i18n/`.
- **Frontend state**: Global state lives in `AppContext.tsx`. Complex logic is extracted into custom hooks in `hooks/` that `AppContext` imports and delegates to.

## Known Gotcha

**NEVER use `import type` for DTO classes in NestJS controllers.** `import type` strips the class at compile time, so `ValidationPipe` can't read decorator metadata and rejects all properties as "should not exist". Services CAN use `import type` for DTOs since they only use the shape.

## Workflow

### Git

- **Always create a branch** before starting any work — feature, bug fix, refactor, whatever. No working directly on `main` or `staging`.
- **Branch naming**:
  - `feat/<short-description>` — new feature
  - `fix/<short-description>` — bug fix
  - `chore/<short-description>` — non-feature work (refactor, infra, deps)
  - `docs/<short-description>` — documentation only
  - If there's a Linear ticket ID, include it: `feat/PAW-42-training-screen-redesign`
- **Never merge to `staging`** without explicitly asking the user first.
- **Never merge to `main`** — ever. Main is sacred; only the user controls it.
- **Never force-push** to shared branches (`staging`, `main`).
- Keep commits atomic and meaningful. Use conventional commit format (`feat:`, `fix:`, `chore:`, etc.).

### Linear

**Team**: PawPath — ticket prefix `PAW` (e.g. `PAW-42`)

Use Linear to track all meaningful work. When starting or identifying a task, create a ticket if one doesn't exist.

**Ticket types and when to use them:**

| Type | Label | When to use |
|------|-------|-------------|
| Feature | `Feature` | New user-facing functionality |
| Bug | `Bug` | Something broken or behaving incorrectly |
| Improvement | `Improvement` | Enhancement to an existing feature |
| Chore | `Chore` | Refactor, dependency update, infra, cleanup |
| Design | `Design` | UI/UX work without new backend logic |

**Creating a ticket:**
- Title: short, imperative (e.g. "Add XP animation on exercise complete")
- Description: what it is, why it matters, acceptance criteria if clear
- Link the git branch in the ticket (Linear auto-detects branch names with ticket IDs)
- Set priority: Urgent → blockers only; High → current sprint; Normal → default; Low → nice-to-have

---

## Docs

Implemented feature specs live in `docs/`:

- [`docs/weekly-challenges.md`](docs/weekly-challenges.md)
- [`docs/streak-rewards.md`](docs/streak-rewards.md)
- [`docs/smart-difficulty.md`](docs/smart-difficulty.md)
- [`docs/feedback-system.md`](docs/feedback-system.md)
