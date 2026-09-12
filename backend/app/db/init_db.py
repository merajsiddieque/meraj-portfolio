import logging
from sqlalchemy.orm import Session
from app.db.session import engine, Base, SessionLocal
from app.models.project import Project
from app.models.blog import BlogPost

logger = logging.getLogger(__name__)

INITIAL_PROJECTS = [
    {
        "title": "AI Mental Health Chatbot",
        "slug": "ai-mental-health-chatbot",
        "tagline": "Empathetic conversational AI companion with real-time sign-language recognition",
        "description": "Full-stack conversational application integrating the OpenAI API for empathetic dialogue with a real-time MediaPipe computer vision module translating webcam hand gestures into chatbot input.",
        "long_description": "Developed with React and Node.js/Express, this application combines evidence-based CBT dialogue frameworks with the OpenAI API. Uses Firebase Authentication for secure user sign-in and Firestore for profile persistence. In addition to standard text input, it integrates a client-side MediaPipe Gesture Recognizer that processes live video frames to translate sign-language gestures into chatbot input, widening accessibility for speech- and hearing-impaired users.",
        "category": "AI & GenAI",
        "tech_stack": "React,Node.js,Express,OpenAI API,MediaPipe,Firebase,WebSockets",
        "github_url": "https://github.com/merajsiddieque/Mental-Health-Chatbot",
        "live_url": "https://mental-health-chatbot-47un.onrender.com/",
        "image_url": "/projects/mental-health.png",
        "featured": True,
        "stars": 94,
        "order": 1
    },
    {
        "title": "Agentic Code Reviewer",
        "slug": "agentic-code-reviewer",
        "tagline": "Autonomous multi-agent LangGraph pipeline for automated PR analysis & security audits",
        "description": "Architected a multi-language code review platform using a LangGraph multi-agent pipeline combining deterministic static analysis with Gemini LLM reasoning for security audits, bug detection, and refactoring.",
        "long_description": "Engineered with LangGraph and FastAPI, the Agentic Code Reviewer splits review tasks across specialized sub-agents: Router, AST static analysis, OWASP Top 10 Security Vulnerability Scanner, and Dynamic Test Generator. Integrates Google Gemini with context-aware semantic diff chunking and Server-Sent Events (SSE) for streaming review output. Validated against a ground-truth dataset across 10 vulnerability categories and containerized with Docker for production deployment.",
        "category": "AI & GenAI",
        "tech_stack": "LangGraph,FastAPI,React,Google Gemini,Docker,Python,PostgreSQL",
        "github_url": "https://github.com/merajsiddieque/agentic-code-reviewer",
        "live_url": "https://agentic-code-reviewer-f9cn.onrender.com/",
        "image_url": "/projects/code-reviewer.png",
        "featured": True,
        "stars": 128,
        "order": 2
    },
    {
        "title": "SecureChat - Real-Time Encrypted Messaging",
        "slug": "secure-chat",
        "tagline": "End-to-end encrypted messaging application with AES-GCM and SHA-512 key derivation",
        "description": "Real-time messaging application with client-side message encryption using AES-GCM via the Web Crypto API, deriving per-chat keys with SHA-512 hashing to guarantee zero-knowledge server storage.",
        "long_description": "Built with React and Firebase Firestore, synchronizing real-time message states across concurrent active client sessions. Implements zero-knowledge client-side message encryption with AES-GCM using the browser Web Crypto API, deriving cryptographic keys per conversation via SHA-512 hashing so that the database stores only ciphertext. Hardens authentication and credential storage with SHA-512 password hashing.",
        "category": "Full Stack",
        "tech_stack": "React,Firebase Firestore,Web Crypto API,AES-GCM,SHA-512,TailwindCSS",
        "github_url": "https://github.com/merajsiddieque/SecureChat",
        "live_url": "https://securechat-df1m.onrender.com/",
        "image_url": "/projects/securechat.png",
        "featured": True,
        "stars": 82,
        "order": 3
    },
    {
        "title": "Serverless Todo App",
        "slug": "serverless-todo-app",
        "tagline": "Cloud-native task orchestration with serverless real-time sync and optimistic UI",
        "description": "Modern responsive task management platform featuring real-time cloud sync, persistent local caching, fluid micro-interactions, and instant zero-downtime deployment.",
        "long_description": "Engineered on a serverless cloud infrastructure with React and Firebase, providing instantaneous sub-millisecond task creation, state toggling, categorization, and search. Designed with optimistic UI updates and reactive state management for offline resilience and immediate feedback.",
        "category": "Full Stack",
        "tech_stack": "React,Firebase,Serverless,JavaScript,HTML5/CSS3,PWA",
        "github_url": "https://github.com/merajsiddieque/Serverless-Todo-App",
        "live_url": "https://mern-e7943.web.app/",
        "image_url": "/projects/todo.png",
        "featured": True,
        "stars": 45,
        "order": 4
    },
    {
        "title": "Amazon Review & WhatsApp Chat Analysis",
        "slug": "amazon-review-whatsapp-chat-analysis",
        "tagline": "Exploratory data analysis & NLP sentiment modeling across review & chat datasets",
        "description": "Exploratory data analysis and NLP modeling pipeline in Python on Amazon product reviews and WhatsApp conversation datasets to surface customer sentiment, usage trends, and engagement patterns.",
        "long_description": "Built with Python, Pandas, NumPy, NLTK, and visualization libraries. Performs end-to-end data cleansing, regex preprocessing, and exploratory data analysis on raw, unstructured textual records. Converts thousands of multi-party messages and customer feedback entries into structured statistical findings, sentiment polarity distributions, and actionable insights.",
        "category": "Data & Analytics",
        "tech_stack": "Python,Pandas,NumPy,NLTK,Scikit-Learn,Matplotlib,Seaborn",
        "github_url": "https://github.com/merajsiddieque/Amazon_Review_n_WhatsApp_Chat_Analysis",
        "live_url": "",
        "image_url": "/projects/analysis.png",
        "featured": True,
        "stars": 38,
        "order": 5
    }
]

INITIAL_BLOG_POSTS = [
    {
        "title": "Architecting Autonomous Multi-Agent Workflows with LangGraph",
        "slug": "architecting-autonomous-multi-agent-workflows-langgraph",
        "excerpt": "A deep dive into cyclical state graphs, stateful node orchestration, and human-in-the-loop validation.",
        "content": "Autonomous agents are transitioning from single-prompt linear chains to stateful cyclical graph topologies. With LangGraph, we can define directed graphs where nodes represent specialized reasoning units (linter, security scanner, synthesizer) and edges evaluate conditional branches.",
        "tags": "LangGraph,GenAI,Python,Architecture",
        "read_time": "6 min read",
        "published": True
    },
    {
        "title": "Building Production-Grade Async Microservices with FastAPI & PostgreSQL",
        "slug": "building-production-async-microservices-fastapi-postgresql",
        "excerpt": "Key architectural lessons from scaling high-throughput REST APIs with connection pooling and async SQLAlchemy.",
        "content": "Designing high-throughput backend services requires careful async orchestration, connection pooling, and schema isolation. Here's how to structure FastAPI services for maximum resilience under concurrent load.",
        "tags": "FastAPI,PostgreSQL,Backend,Docker",
        "read_time": "5 min read",
        "published": True
    }
]

def init_db(db: Session = None) -> None:
    # Create all tables if they don't exist
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        logger.warning(f"Metadata create_all encountered error: {e}")
        try:
            from app.models.message import Message
            Message.__table__.create(bind=engine, checkfirst=True)
            logger.info("Created messages table specifically.")
        except Exception as msg_err:
            logger.warning(f"Could not create messages table specifically: {msg_err}")
    
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True
        
    try:
        # Check if projects exist
        existing_projects = db.query(Project).count()
        if existing_projects == 0:
            logger.info("Seeding initial projects...")
            valid_project_cols = {"title", "slug", "description", "github_url", "demo_url", "tech_stack", "featured"}
            for proj_data in INITIAL_PROJECTS:
                filtered = {k: v for k, v in proj_data.items() if k in valid_project_cols}
                if "live_url" in proj_data and "demo_url" not in filtered:
                    filtered["demo_url"] = proj_data["live_url"]
                if isinstance(filtered.get("tech_stack"), str):
                    filtered["tech_stack"] = [t.strip() for t in filtered["tech_stack"].split(",") if t.strip()]
                project = Project(**filtered)
                db.add(project)
            db.commit()
            logger.info("Seeded initial projects successfully.")

        # Check if blog posts exist
        existing_blogs = db.query(BlogPost).count()
        if existing_blogs == 0:
            logger.info("Seeding initial blog posts...")
            valid_blog_cols = {"title", "slug", "content", "tags"}
            for post_data in INITIAL_BLOG_POSTS:
                filtered = {k: v for k, v in post_data.items() if k in valid_blog_cols}
                if isinstance(filtered.get("tags"), str):
                    filtered["tags"] = [t.strip() for t in filtered["tags"].split(",") if t.strip()]
                post = BlogPost(**filtered)
                db.add(post)
            db.commit()
            logger.info("Seeded initial blog posts successfully.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")
        db.rollback()
    finally:
        if close_db:
            db.close()

if __name__ == "__main__":
    init_db()
