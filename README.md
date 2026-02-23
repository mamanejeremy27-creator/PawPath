# PawPath

A bilingual (English + Hebrew/RTL) dog training PWA. Multi-dog support, training programs with XP/streaks/badges/weekly challenges, training journal with photos, community feed, buddy system, walk tracker, health dashboard, lost dog tracker with maps, leaderboard, and more.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + TypeScript + Tailwind CSS |
| Backend | NestJS + TypeScript + TypeORM |
| Database | PostgreSQL 16 (Docker) |
| Auth | Passport Local + JWT (7-day expiry) |
| i18n | Custom EN/HE with full RTL support |
| Package manager | pnpm (workspace monorepo) |

## Running Locally

### Prerequisites

- Node.js v18+
- pnpm (`npm install -g pnpm`)
- Docker + Docker Compose

### 1. Start the database

```bash
docker compose up -d
```

PostgreSQL 16 on port `5435`, Adminer at http://localhost:8083.

### 2. Install dependencies

```bash
pnpm install
```

Installs both `frontend/` and `backend/` workspaces.

### 3. Start the backend

```bash
cd backend
cp .env.example .env
pnpm run start:dev
```

Or from root: `pnpm --filter pawpath-backend run start:dev`

Backend runs on port `3004`. On first start it auto-creates all DB tables and seeds training programs, badges, challenges, and streak milestones.

### 4. Start the frontend

```bash
cd frontend
pnpm run dev
```

Or from root: `pnpm --filter pawpath-frontend run dev`

App is at http://localhost:5176.

### 5. Run tests

```bash
# Backend (Jest) — ~130 unit + ~40 e2e tests
cd backend && pnpm test
cd backend && pnpm run test:e2e   # requires DB running

# Frontend (Vitest) — 94 tests
cd frontend && pnpm test
```

## Ports

| Service | Port | URL |
|---|---|---|
| Frontend | 5176 | http://localhost:5176 |
| Backend | 3004 | http://localhost:3004/api |
| PostgreSQL | 5435 | localhost:5435 |
| Adminer | 8083 | http://localhost:8083 |

## Project Structure

```
PawPath/
├── docker-compose.yml          # PostgreSQL 16 + Adminer
├── pnpm-workspace.yaml         # pnpm monorepo config
├── docs/                       # Feature specs (implemented)
├── backend/                    # NestJS TypeScript API
│   ├── .env.example
│   └── src/
│       ├── entities/           # 29 TypeORM entities
│       └── modules/            # auth, dogs, training, health, walks,
│                               # community, leaderboard, buddies,
│                               # lost-dogs, feedback, settings, seed
└── frontend/                   # React + Vite + TypeScript PWA
    └── src/
        ├── components/         # 75+ .tsx component files
        ├── context/            # AppContext.tsx — global state
        ├── hooks/              # 9 custom hooks
        ├── lib/                # api.ts, auth.ts, walkTracker.ts
        ├── i18n/               # en.ts, he.ts — bilingual strings
        ├── data/               # Static client-side data
        └── utils/
```

## Docs

- [`docs/weekly-challenges.md`](docs/weekly-challenges.md) — Weekly challenge system spec
- [`docs/streak-rewards.md`](docs/streak-rewards.md) — Streak milestones and rewards spec
- [`docs/smart-difficulty.md`](docs/smart-difficulty.md) — Smart difficulty adjustment spec
- [`docs/feedback-system.md`](docs/feedback-system.md) — In-app feedback system spec
