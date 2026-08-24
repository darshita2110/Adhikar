# Adhikar

> AI-powered legal assistant SaaS — helping users understand and navigate legal documents.

---

## Prerequisites

| Tool | Version |
|---|---|
| Node.js | ≥ 20.x |
| npm | ≥ 10.x |
| PostgreSQL | ≥ 15 (with **pgvector** extension) |
| Redis | ≥ 7.x |

---

## Quick Start

### 1. Clone & enter the repo

```bash
git clone <your-repo-url>
cd adhikar
```

### 2. Set up the database

```sql
-- In psql, create the database and enable pgvector
CREATE DATABASE adhikar;
\c adhikar
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. Start Redis

```bash
# Using Docker (recommended)
docker run -d -p 6379:6379 redis:7-alpine

# Or if installed locally
redis-server
```

### 4. Configure environment variables

```bash
# Server
cp server/.env.example server/.env
# Fill in DATABASE_URL, OPENAI_API_KEY, etc.
```

### 5. Run database migrations

```bash
cd server
npm install
npm run db:generate
npm run db:migrate
```

### 6. Start the dev servers

**Terminal 1 — Client:**
```bash
cd client
npm install
npm run dev
# → http://localhost:5173
```

**Terminal 2 — Server:**
```bash
cd server
npm install
npm run dev
# → http://localhost:4000
```

### 7. Verify

Open `http://localhost:5173` — the home page should display **"pong from server"**, confirming the client ↔ server connection works.

---

## Project Structure

```
adhikar/
├── client/          # React 18 + Vite + TypeScript + Tailwind + shadcn/ui
├── server/          # Node.js + Express + TypeScript + Drizzle ORM
├── docs/            # Architecture docs, ADRs, API specs
└── .github/
    └── workflows/   # CI/CD pipelines
```

---

## Tech Stack

### Client
- **React 18** + **Vite** + **TypeScript**
- **Tailwind CSS** + **shadcn/ui**
- **React Router** — client-side routing
- **TanStack Query** — server state management
- **Zustand** — client state management
- **React Hook Form** + **Zod** — forms & validation
- **Axios** — HTTP client

### Server
- **Express** + **TypeScript**
- **Drizzle ORM** + **PostgreSQL** + **pgvector**
- **BullMQ** + **Redis** — background job queues
- **Zod** — request validation

---

## Scripts

### Client
| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Server
| Script | Description |
|---|---|
| `npm run dev` | Start ts-node-dev with hot reload |
| `npm run build` | Compile TypeScript |
| `npm run db:generate` | Generate Drizzle migrations |
| `npm run db:migrate` | Apply migrations |
