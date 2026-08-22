# GlobeTrotter — Backend API

> A personalized, intelligent, and collaborative travel-planning application.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-5.x-blue)](https://www.prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue)](https://www.postgresql.org)

---

## Table of Contents

1. [Project Description](#project-description)
2. [Technology Stack](#technology-stack)
3. [Prerequisites](#prerequisites)
4. [PostgreSQL Setup](#postgresql-setup)
5. [Environment Variables](#environment-variables)
6. [Installation](#installation)
7. [Running Locally](#running-locally)
8. [Database Migrations](#database-migrations)
9. [Testing](#testing)
10. [Available API Endpoints](#available-api-endpoints)
11. [Project Structure](#project-structure)
12. [Current Sprint](#current-sprint)
13. [Sprint Roadmap](#sprint-roadmap)

---

## Project Description

GlobeTrotter is a travel planning platform that allows users to:

- Create customized multi-city itineraries
- Assign travel dates, activities, and budgets
- Discover activities and destinations through search
- View cost breakdowns and visual calendars
- Share travel plans publicly or with friends
- Collaborate within a travel community

This is the **backend REST API** for GlobeTrotter, built with Node.js, TypeScript, Express.js, and PostgreSQL (via Prisma ORM).

---

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| TypeScript | 5.x | Type safety |
| Express.js | 4.x | HTTP framework |
| Prisma | 5.x | ORM / migrations |
| PostgreSQL | 15+ | Relational database |
| Zod | 3.x | Request validation |
| Jest + Supertest | 29.x | Testing |
| Helmet | 8.x | Security headers |
| Morgan | 1.x | HTTP request logging |

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([download](https://nodejs.org))
- **npm** >= 9.0.0 (comes with Node.js)
- **PostgreSQL** >= 15 ([download](https://www.postgresql.org/download/))

---

## PostgreSQL Setup

### 1. Install PostgreSQL

Download and install from [postgresql.org](https://www.postgresql.org/download/).

### 2. Create the development database

Open `psql` or your preferred PostgreSQL client and run:

```sql
-- Create the database
CREATE DATABASE globetrotter_dev;

-- (Optional) Create a dedicated user
CREATE USER globetrotter WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE globetrotter_dev TO globetrotter;
```

### 3. (Optional) Create the test database

```sql
CREATE DATABASE globetrotter_test;
GRANT ALL PRIVILEGES ON DATABASE globetrotter_test TO globetrotter;
```

---

## Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | No | `development` | `development`, `production`, or `test` |
| `PORT` | No | `5000` | Port the server listens on |
| `DATABASE_URL` | **Yes** | — | PostgreSQL connection string |
| `ALLOWED_ORIGINS` | No | `http://localhost:5173,http://localhost:3000` | Comma-separated CORS origins |
| `RATE_LIMIT_WINDOW_MS` | No | `900000` | Rate-limit window in milliseconds |
| `RATE_LIMIT_MAX` | No | `100` | Max requests per window per IP |

### Example `DATABASE_URL` format

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
postgresql://postgres:password@localhost:5432/globetrotter_dev?schema=public
```

---

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd GlobeTrotter-ldce/server

# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate
```

---

## Running Locally

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm run start

# Type-check without emitting
npm run typecheck
```

The server will start at `http://localhost:5000` (or your configured `PORT`).

---

## Database Migrations

```bash
# Create and apply a migration (development)
npm run prisma:migrate

# Apply pending migrations (production/CI)
npm run prisma:migrate:prod

# Generate Prisma client after schema changes
npm run prisma:generate

# Open Prisma Studio (browser-based database explorer)
npm run prisma:studio

# Reset database (drops all data — development only!)
npm run prisma:reset
```

---

## Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test matrix (Sprint 1)

| Test | File | Description |
|---|---|---|
| Health endpoint | `tests/integration/health.test.ts` | Verifies `GET /api/health` returns 200 with correct shape |
| DB health endpoint | `tests/integration/health.test.ts` | Verifies `GET /api/health/db` returns 200 or 503 |
| 404 handling | `tests/integration/notFound.test.ts` | Unknown routes return structured 404 response |
| Error middleware | `tests/integration/error.test.ts` | AppError, ValidationError, generic errors handled correctly |
| App startup | `tests/integration/error.test.ts` | App factory does not throw on creation |

> **Note:** The database health test (`GET /api/health/db`) will return `503` if PostgreSQL is not running — this is expected and correct behaviour.

---

## Available API Endpoints

### Sprint 1 — Foundation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Application liveness check |
| `GET` | `/api/health/db` | Database connectivity check |

> All other endpoints will be added in future sprints.

### Standard Response Format

**Success:**
```json
{
  "success": true,
  "message": "Request successful",
  "data": {}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Something went wrong",
  "error": {
    "code": "INTERNAL_SERVER_ERROR"
  }
}
```

---

## Project Structure

```
server/
├── prisma/
│   └── schema.prisma         # Database schema (entities added per sprint)
├── src/
│   ├── config/
│   │   ├── env.ts            # Environment variable loading & validation
│   │   └── database.ts       # Singleton Prisma client
│   ├── controllers/
│   │   └── health.controller.ts
│   ├── errors/
│   │   └── AppError.ts       # AppError class + convenience subclasses
│   ├── middlewares/
│   │   ├── error.middleware.ts    # Central error handler
│   │   ├── notFound.middleware.ts # 404 handler
│   │   └── validate.middleware.ts # Zod validation factory
│   ├── repositories/
│   │   └── health.repository.ts  # DB ping
│   ├── routes/
│   │   ├── index.ts          # Root API router
│   │   └── health.routes.ts
│   ├── services/
│   │   └── health.service.ts
│   ├── types/
│   │   └── index.ts          # Shared TypeScript types & enums
│   ├── utils/
│   │   ├── logger.util.ts    # Structured logger
│   │   └── response.util.ts  # Response helper functions
│   ├── validators/
│   │   ├── auth.validator.ts  # (Sprint 2 stub)
│   │   ├── city.validator.ts  # (Sprint 3 stub)
│   │   └── trip.validator.ts  # (Sprint 4 stub)
│   ├── app.ts                # Express app factory
│   └── server.ts             # Server bootstrap & graceful shutdown
├── tests/
│   ├── setup.ts              # Jest environment setup
│   └── integration/
│       ├── health.test.ts
│       ├── notFound.test.ts
│       └── error.test.ts
├── .env.example
├── .gitignore
├── jest.config.json
├── package.json
└── tsconfig.json
```

---

## Current Sprint

**Sprint 3 — Trip Management & Itinerary Engine** ✅

Builds on Sprint 2 with authenticated trip management, multi-city stops, day-wise itinerary planning, and scheduled activities.

**What is implemented:**
- TypeScript + Express project scaffolding
- Singleton Prisma client with PostgreSQL
- Environment variable validation
- Health check endpoints (`/api/health`, `/api/health/db`)
- Centralized error middleware (handles AppError, Zod, Prisma, unknown errors)
- 404 middleware
- Zod validation middleware factory
- Structured logger
- Standard API response helpers
- AppError class with convenience subclasses
- Rate limiting, CORS, Helmet, Compression
- Graceful shutdown (SIGTERM/SIGINT)
- Jest + Supertest test foundation
- JWT authentication and role-based access control
- User registration, login, profile, and management endpoints
- Country, city, and activity read endpoints with filtering and pagination
- Prisma seed data for Sprint 2 entities
- Trip CRUD with computed UPCOMING, ONGOING, and COMPLETED status
- Owned trip stops with date validation, overlap protection, and atomic reorder
- Unique itinerary days with date-boundary validation
- Trip-specific activities with time validation, city consistency, and atomic reorder
- Complete ordered itinerary endpoint

**What is NOT implemented (future sprints):**
- Budget / expenses
- Calendar / timeline
- Community
- Public sharing
- Admin analytics

---

## Sprint Roadmap

| Sprint | Focus |
|---|---|
| ✅ 1 | Backend Foundation |
| ✅ 2 | Authentication, Users & Travel Data |
| ✅ 3 | Trip Management, Multi-City Stops & Itinerary |
| 4 | Budget, Expenses, Calendar & Dashboard |
| 5 | Public Sharing, Community & Admin |
| 6 | Security, Optimization, Testing & Frontend Integration |

## Sprint 3 API Endpoints

All endpoints below require `Authorization: Bearer <token>`.

| Method | Endpoint | Purpose |
|---|---|---|
| POST/GET | `/api/trips` | Create or list owned trips |
| GET/PATCH/DELETE | `/api/trips/:id` | Retrieve, update, or delete a trip |
| POST/GET | `/api/trips/:id/stops` | Add or list city stops |
| GET/PATCH/DELETE | `/api/trips/:id/stops/:stopId` | Manage one stop |
| PATCH | `/api/trips/:id/stops/reorder` | Atomically reorder stops |
| POST/GET | `/api/trips/:id/days` | Create or list itinerary days |
| GET/PATCH/DELETE | `/api/trips/:id/days/:dayId` | Manage one itinerary day |
| POST | `/api/trips/:id/days/:dayId/activities` | Schedule an activity |
| PATCH/DELETE | `/api/trip-activities/:id` | Update or remove a scheduled activity |
| PATCH | `/api/trip-activities/reorder` | Atomically reorder day activities |
| GET | `/api/trips/:id/itinerary` | Fetch the ordered complete itinerary |
