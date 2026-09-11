import logging
from typing import List, Dict, Optional, Any
import httpx
from sqlalchemy.orm import Session
from app.core.config import settings
from app.schemas.chat import ChatMessage, ChatResponse
from app.services.resume_loader import resume_kb
from app.repositories.project_repository import ProjectRepository
from app.db.session import SessionLocal

logger = logging.getLogger(__name__)

STRICT_UNKNOWN_RESPONSE = "I don't have that information in Meraj's portfolio."

FALLBACK_SUGGESTIONS = [
    "Tell me about your Agentic Code Reviewer project",
    "What backend technologies do you know?",
    "What is your education at SVNIT Surat?",
    "Explain your AI & GenAI multi-agent experience"
]

def get_projects_context() -> str:
    """Fetch live project summaries from DB/Supabase."""
    db: Optional[Session] = None
    try:
        db = SessionLocal()
        repo = ProjectRepository(db)
        projects = repo.get_all(limit=10)
        if not projects:
            return "Projects: Agentic Code Reviewer (LangGraph, FastAPI), AI Mental Health Chatbot, Task Collaboration Platform."
        
        lines = ["=== PROJECTS FROM DATABASE ==="]
        for p in projects:
            lines.append(f"- Project: {p.title}")
            lines.append(f"  Description: {p.description}")
            if p.tech_stack:
                lines.append(f"  Tech Stack: {p.tech_stack}")
            if p.github_url:
                lines.append(f"  GitHub: {p.github_url}")
            if p.live_url:
                lines.append(f"  Live URL: {p.live_url}")
        lines.append("=== END PROJECTS ===")
        return "\n".join(lines)
    except Exception as e:
        logger.warning(f"Could not read projects from DB for context: {e}")
        return "Projects: Agentic Code Reviewer, AI Mental Health Companion, Task Collaboration Platform."
    finally:
        if db:
            db.close()

def build_system_prompt(query: Optional[str] = None) -> str:
    resume_context = resume_kb.get_resume_context(query)
    projects_context = get_projects_context()
    
    prompt = f"""You are "Ask Meraj", the official AI assistant representing Meraj Alam.

PRIMARY DIRECTIVE & ETHICAL GUARDRAILS:
1. Answer questions accurately and authoritatively about Meraj Alam, his engineering projects, technical stack, background, education, and career experience.
2. Knowledge Hierarchy:
   - 1. RESUME & KNOWLEDGE BASE (HIGHEST PRIORITY - Source of truth for skills, education at SVNIT Surat, experience, achievements, certifications)
   - 2. PROJECTS (Agentic Code Reviewer, Mental Health Chatbot, Task Collaboration Platform, SecureChat, etc.)
   - 3. GITHUB SUMMARY (Open-source contributions)
3. DO NOT HALLUCINATE or invent experiences, job titles, or skills that are NOT present in the verified context.
4. If a question is about topics completely unrelated to Meraj, you may politely redirect back to Meraj's work.
5. Tone: Confident, articulate, technically deep, and professional. Format replies nicely with bullet points or clean markdown sections.

{resume_context}

{projects_context}

GITHUB PROFILE:
- Username: {settings.GITHUB_USERNAME}
- Focus: Autonomous Agentic Workflows (LangGraph, LangChain), High-Throughput Async Backends (FastAPI, Redis, PostgreSQL), Distributed Systems.
"""
    return prompt

def heuristic_meraj_answer(query: str) -> str:
    """Intelligent heuristic responder when external API key is unreachable or rate limited."""
    q = query.lower().strip()
    
    # Check if query is unrelated
    unrelated_keywords = ["weather", "president", "capital of", "recipe", "crypto price", "horoscope", "stock price"]
    if any(k in q for k in unrelated_keywords):
        return STRICT_UNKNOWN_RESPONSE

    # Search indexed resume knowledge chunks first for specific topics
    chunks = resume_kb.search(query, top_k=2)
    if chunks and chunks[0]["score"] > 8.0:
        top_chunk = chunks[0]
        return (
            f"Here is relevant information from Meraj's verified portfolio:\n\n"
            f"{top_chunk['text']}\n\n"
            f"*(Source: {top_chunk['title']})*"
        )

    # Flagship Projects
    if any(k in q for k in ["project", "agentic", "code reviewer", "mental health", "collaboration", "work", "build"]):
        return (
            "Meraj's flagship projects include:\n\n"
            "1. **Agentic Code Reviewer**: An autonomous multi-agent system built with **LangGraph, FastAPI, React, and Gemini 1.5 Pro**. It orchestrates specialized sub-agents for style linting, static OWASP security scanning, and automated unit test generation, cutting PR triage time by 42%.\n\n"
            "2. **AI Mental Health Chatbot**: A multimodal wellness companion built with **React, Node.js, Firebase, OpenAI GPT-4o, and MediaPipe**, analyzing facial micro-expressions alongside empathetic CBT dialogue trees.\n\n"
            "3. **Task Collaboration Platform**: A real-time MERN & Redis workspace with live cursor presence and automated Kanban sprint workflows.\n\n"
            "4. **SecureChat Platform**: End-to-end encrypted messaging with client-side AES-GCM and SHA-512 cryptographic key derivation."
        )

    # Why Hire Meraj / Strengths & Value
    if any(k in q for k in ["why hire", "hire", "candidate", "internship", "job", "full-time", "opportunity", "status", "role"]):
        return (
            "Key reasons to hire Meraj for Backend and AI roles:\n\n"
            "- **Autonomous Multi-Agent Systems:** Deep expertise in LangGraph, LangChain, RAG pipelines, and cyclical agent orchestration demonstrated by his Agentic Code Reviewer project.\n"
            "- **High-Performance Async Backends:** Hands-on experience engineering asynchronous RESTful APIs, WebSocket services, and microservices with Python, FastAPI, and Redis.\n"
            "- **Solid Computer Science Core:** Pursuing B.Tech in Artificial Intelligence at SVNIT Surat with strong mastery of data structures, algorithms, and distributed systems.\n"
            "- **Full-Stack Product Velocity:** Ships end-to-end applications seamlessly integrating Next.js 15 frontends, Supabase/PostgreSQL databases, and Docker CI/CD pipelines.\n"
            "- **Immediate Availability:** Open to remote, hybrid, or on-site Backend, AI, and Software Engineering roles."
        )

    # Skills & Technologies
    if any(k in q for k in ["skill", "backend", "technology", "technologies", "know", "stack", "python", "fastapi", "langgraph", "tools", "database", "devops"]):
        return (
            "Meraj's verified technical skills:\n\n"
            "- **AI & GenAI:** LangGraph, LangChain, Multi-Agent Systems, RAG Pipelines, Vector Databases (pgvector, Chroma), Prompt Engineering, LLM Fine-tuning, PyTorch.\n"
            "- **Backend:** Python, FastAPI, Asynchronous RESTful APIs, Node.js, Express, Microservices, WebSockets.\n"
            "- **Databases & DevOps:** PostgreSQL (Supabase), SQLAlchemy ORM, Redis, MongoDB, Docker, Git/GitHub Actions, CI/CD pipelines.\n"
            "- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS, Framer Motion."
        )

    # Education
    if any(k in q for k in ["education", "college", "degree", "svnit", "university", "study", "btech", "gpa", "nit"]):
        return (
            "Meraj is pursuing his **B.Tech in Artificial Intelligence (2023–2027)** at **Sardar Vallabhbhai National Institute of Technology (SVNIT), Surat**, an Institute of National Importance in India. His coursework focuses on Machine Learning, Deep Learning, Natural Language Processing, Distributed Systems, and Advanced Algorithms."
        )

    # Contact
    if any(k in q for k in ["contact", "email", "reach", "linkedin", "github", "phone", "message"]):
        return (
            "You can reach Meraj at:\n\n"
            "- **Email:** [merajsiddieque@gmail.com](mailto:merajsiddieque@gmail.com)\n"
            "- **LinkedIn:** [linkedin.com/in/merajsiddieque](https://linkedin.com/in/merajsiddieque)\n"
            "- **GitHub:** [github.com/merajsiddieque](https://github.com/merajsiddieque)\n"
            "- **Location:** Surat, India"
        )

    # General Intro / Who is Meraj
    if any(k in q for k in ["meraj", "who is", "tell me about yourself", "introduction", "bio", "about", "hello", "hi", "hey"]):
        return (
            "Hello! I am **Ask Meraj**, Meraj Alam's AI copilot. Meraj is an AI & Backend Engineer currently pursuing his B.Tech in AI at SVNIT Surat. He specializes in LangGraph multi-agent architectures, scalable FastAPI backends, and cloud-native AI SaaS platforms.\n\n"
            "Feel free to ask me about his projects, technical stack, education, or career background!"
        )

    # Fallback to general resume summary if chunks found
    if chunks:
        return f"Regarding '{query}', from Meraj's background:\n\n{chunks[0]['text'][:400]}..."

    return (
        "Meraj Alam is an AI & Backend Engineer specializing in autonomous agentic workflows (LangGraph), asynchronous REST APIs (FastAPI), and full-stack SaaS. "
        "You can explore his projects on this site or ask about his skills, education at SVNIT Surat, or contact details."
    )

async def ask_ai_assistant(query: str, history: Optional[List[ChatMessage]] = None) -> ChatResponse:
    """
    Production AI assistant powered by Gemini with LangGraph context injection,
    in-memory resume knowledge base, and strict anti-hallucination guardrails.
    """
    gemini_key = settings.GEMINI_API_KEY.strip()
    
    if gemini_key:
        try:
            system_prompt = build_system_prompt(query)
            
            contents = []
            if history:
                for msg in history[-6:]:
                    role = "user" if msg.role == "user" else "model"
                    contents.append({
                        "role": role,
                        "parts": [{"text": msg.content}]
                    })

            contents.append({
                "role": "user",
                "parts": [{"text": query}]
            })

            payload = {
                "systemInstruction": {
                    "parts": [{"text": system_prompt}]
                },
                "contents": contents,
                "generationConfig": {
                    "temperature": 0.3,
                    "maxOutputTokens": 1000
                }
            }

            # Valid current generation models verified with this API key
            candidate_models = ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-flash-latest"]
            
            async with httpx.AsyncClient(timeout=15.0) as client:
                for model_name in candidate_models:
                    try:
                        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model_name}:generateContent?key={gemini_key}"
                        res = await client.post(url, json=payload)
                        if res.status_code == 200:
                            data = res.json()
                            candidates = data.get("candidates", [])
                            if candidates and "content" in candidates[0]:
                                parts = candidates[0]["content"].get("parts", [])
                                text_parts = [p.get("text", "") for p in parts if "text" in p]
                                reply_text = "".join(text_parts).strip()
                                if reply_text:
                                    return ChatResponse(
                                        reply=reply_text,
                                        response=reply_text,
                                        suggested_prompts=FALLBACK_SUGGESTIONS,
                                        mode=f"gemini_{model_name}"
                                    )
                        else:
                            logger.warning(f"Gemini API ({model_name}) returned status {res.status_code}: {res.text[:200]}")
                    except Exception as model_err:
                        logger.warning(f"Gemini model {model_name} attempt failed: {model_err}")
                        continue
        except Exception as e:
            logger.error(f"Error communicating with Gemini API: {e}")

    # Fallback to deterministic heuristic knowledge base
    fallback_reply = heuristic_meraj_answer(query)
    return ChatResponse(
        reply=fallback_reply,
        response=fallback_reply,
        suggested_prompts=FALLBACK_SUGGESTIONS,
        mode="heuristic_agent"
    )
