# System Architecture - Meraj Alam AI Portfolio & Platform

## Overview
This platform is an AI-first engineering portfolio and interactive platform designed like an AI SaaS product. It provides a real-time conversational agent ("Ask Meraj"), dynamic project inspection, contact persistence, and GitHub telemetry.

```
+-------------------------------------------------------------+
|                      Client Browser                         |
|  - Next.js 15 App Router (TypeScript + Tailwind CSS)        |
|  - Framer Motion Dynamic Aesthetics & Glassmorphism         |
|  - "Ask Meraj" ChatGPT-like UI with Suggested Prompts       |
+------------------------------+------------------------------+
                               |
               HTTP / REST API | (CORS enabled)
                               v
+-------------------------------------------------------------+
|                     FastAPI Backend                         |
|  - Pydantic Settings & Schema Validation                    |
|  - LangGraph / Gemini QA Agent with RAG Resume Knowledge    |
|  - SQLAlchemy 2.0 ORM Engine                                |
|  - In-Memory Cached GitHub Telemetry Service                |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
|                    Data & Cloud Layer                       |
|  - Supabase PostgreSQL (or local SQLite fallback)           |
|  - Google Gemini API (Gemini 1.5 / 2.0 / Flash)             |
|  - GitHub Public REST API                                   |
+-------------------------------------------------------------+
```

## Service Architecture

### 1. Frontend (`/frontend`)
- **Framework:** Next.js 15 with App Router (`src/app/page.tsx`).
- **Styling:** Custom Tailwind tokens with dark futuristic colors:
  - Electric Blue: `#2563EB`
  - Cyan: `#06B6D4`
  - Violet: `#8B5CF6`
  - Canvas Jet: `#07090E`
  - Surface Glass: `rgba(15, 23, 42, 0.65)` with backdrop blur.
- **State & Communication:** Resilient typed client (`src/lib/api.ts`) with automatic fallback data to ensure zero UI crashes even when offline.

### 2. Backend (`/backend`)
- **Core Engine:** FastAPI with async routes.
- **Endpoints:**
  - `GET /api/v1/projects`: Project catalog with stack badges, links, and detailed metrics.
  - `POST /api/v1/contact`: Validates input and persists messages to `messages` table.
  - `GET /api/v1/github-stats`: Live stats (repos, languages, contributions, pinned projects) with intelligent 15-minute caching.
  - `POST /api/v1/chat`: Multi-turn conversational agent with domain knowledge of Meraj's background, SVNIT coursework, and technical skills.
  - `GET /health`: System readiness and latency check.

### 3. Database Layer
- **ORM:** SQLAlchemy 2.0.
- **Tables:**
  - `projects`: id, title, slug, description, long_description, tech_stack, github_url, live_url, category, metrics, stars, created_at.
  - `messages`: id, name, email, subject, message, is_read, ip_address, created_at.
  - `blog`: id, title, slug, excerpt, content, tags, read_time, published, created_at.

### 4. Deployment Topology
- **Frontend:** Vercel with edge caching and automatic environment configuration.
- **Backend:** Render or Railway with Docker container or native Python environment.
- **Database:** Supabase Managed PostgreSQL.
