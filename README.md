# RetroElectro

AI-first mobile recommendation platform that combines:

- Structured filters (hard budget in INR)
- Semantic ranking (multilingual-e5-large embeddings)
- Neon PostgreSQL + pgvector for top-K retrieval

## Architecture

- Client: React + Vite in client
- API: Express + Prisma in server
- Data and embeddings: FastAPI + Python ETL in recommender
- Database: Neon PostgreSQL with pgvector

## Environment Setup

1. Copy server/.env.example to server/.env and fill values.
2. Copy client/.env.example to client/.env if needed.
3. Ensure your Neon connection string is set as DATABASE_URL in server/.env.

Required server env keys:

- DATABASE_URL
- EMBEDDING_SERVICE_URL (default local: http://localhost:8000)
- PORT (default 5000)
- NODE_ENV (development)

## Install Dependencies

Server:

```bash
cd server
npm install
npm run prisma:generate
```

Client:

```bash
cd client
npm install
```

Recommender service:

```bash
cd recommender
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## Database Migration

Run Prisma migrations against Neon:

```bash
cd server
npm run prisma:deploy
```

This creates:

- products table with embedding vector(1024)
- query_logs table for query analytics
- pgvector and vector index

## Run Embedding Service

```bash
cd recommender
uvicorn service.main:app --host 0.0.0.0 --port 8000 --reload
```

Health endpoint:

- GET http://localhost:8000/health

Embedding endpoint:

- POST http://localhost:8000/embed

## Seed Data from CSV

Use cleaned mobile-only ingestion from recommender/Mobiles Dataset (2025).csv:

```bash
cd server
npm run db:seed
```

Optional (seed without embeddings):

```bash
cd server
node utils/seeder.js --skip-embeddings
```

## Start API and Client

API:

```bash
cd server
npm run dev
```

Client:

```bash
cd client
npm run dev
```

## Recommendation API

Endpoint:

- POST /api/recommend
- POST /api/recommend/top-k

Request example:

```json
{
  "query": "I want a mobile phone under 20000 with good battery life",
  "topK": 5,
  "budgetInr": 20000,
  "filters": {
    "minBatteryMah": 5000
  }
}
```

Response includes:

- parsed query interpretation
- scored products
- normalized product fields for UI cards

## Current Scope

- Mobile phone recommendations only
- Hard budget filtering in INR
- Semantic ranking with multilingual-e5-large
- Top-K retrieval with pgvector

## Next Suggested Enhancements

- Add auth and user profiles
- Add comparison persistence and history
- Add caching for query embeddings
- Add integration tests for recommendation quality
