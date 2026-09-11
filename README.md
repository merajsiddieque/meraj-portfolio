# Meraj Alam — AI Portfolio & Engineering Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://docker.com)

A high-performance, dark futuristic AI SaaS portfolio platform designed for **Meraj Alam** (AI Engineer • ML Engineer • GenAI • Backend Developer). Built with an AI-first engineering aesthetic, interactive "Ask Meraj" conversational assistant, dynamic project inspection, contact persistence, and live GitHub telemetry.

---

## 🌟 Key Features

- ⚡ **Dark Futuristic Aesthetic:** Custom glassmorphism, glowing accents in Electric Blue (`#2563EB`), Cyan (`#06B6D4`), and Violet (`#8B5CF6`).
- 🤖 **"Ask Meraj" Conversational AI Assistant:** Embedded ChatGPT-style UI querying Meraj's skills, projects, SVNIT AI degree, and system design background (powered by LangGraph / Google Gemini with intelligent local fallback).
- 🛠️ **Categorized Skills Matrix:** Interactive badges for GenAI (LangGraph, RAG, LLMs), Backend (FastAPI, REST APIs, Node.js), Frontend (React, Next.js, TypeScript), and DevOps/Databases (PostgreSQL, Docker).
- 🚀 **Featured Project Deep-Dives:**
  1. **Agentic Code Reviewer** (LangGraph, FastAPI, React, Docker, Gemini)
  2. **AI Mental Health Chatbot** (React, Node.js, Firebase, OpenAI, MediaPipe)
  3. **Task Collaboration Platform** (MERN)
- 📊 **GitHub Analytics Dashboard:** Visual commit activity, language breakdown, contribution grid, and pinned repositories.
- 🎓 **Education & Milestones:** Interactive SVNIT Surat B.Tech AI (2023–2027) journey.
- 📬 **Live Contact System:** Validated Pydantic schema writing to Supabase PostgreSQL database.
- 🐳 **Docker-Ready:** Complete Dockerfile and `docker-compose.yml` for zero-friction deployment.

---

## 📂 Project Structure

```
meraj-portfolio/
│
├── frontend/                     # Next.js 15 App Router + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── app/                  # Layout, page, styling
│   │   ├── components/           # Hero, About, Skills, Projects, Chatbot, GitHub, Contact
│   │   ├── lib/                  # API client, static defaults, utility helpers
│   │   └── types/                # TypeScript interfaces
│   ├── Dockerfile
│   └── package.json
│
├── backend/                      # FastAPI + SQLAlchemy + LangGraph + Supabase
│   ├── app/
│   │   ├── api/                  # /projects, /contact, /github-stats, /chat
│   │   ├── core/                 # Configuration & environment variables
│   │   ├── db/                   # SQLAlchemy session & seed script
│   │   ├── models/               # Project, Message, Blog ORM models
│   │   ├── schemas/              # Pydantic request/response schemas
│   │   └── services/             # AI Assistant (LangGraph/Gemini) & GitHub telemetry
│   ├── Dockerfile
│   └── requirements.txt
│
├── docs/                         # Architecture specs and Mermaid diagrams
├── docker-compose.yml            # Multi-container orchestration
└── README.md
```

---

## 🚀 Quick Start

### 1. Local Development (Standard)

#### Backend:
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API will be running at `http://localhost:8000` (Interactive docs at `http://localhost:8000/docs`).

#### Frontend:
```bash
cd frontend
npm install
npm run dev
```
Frontend will be running at `http://localhost:3000`.

---

### 2. Docker Compose (One-Click)

```bash
docker-compose up --build
```
This boots both the FastAPI backend on port `8000` and the Next.js frontend on port `3000`.

---

## 🔧 Environment Variables

### Backend (`backend/.env`):
```ini
ENVIRONMENT=development
DATABASE_URL=sqlite:///./local_portfolio.db # Or Supabase: postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres
GEMINI_API_KEY=your_gemini_api_key_here
GITHUB_USERNAME=merajsiddieque
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Frontend (`frontend/.env.local`):
```ini
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 🌐 Production Deployment

- **Frontend:** Deploy `frontend/` on [Vercel](https://vercel.com).
- **Backend:** Deploy `backend/` on [Render](https://render.com) or [Railway](https://railway.app).
- **Database:** Provision a free PostgreSQL instance on [Supabase](https://supabase.com).
