import { Project } from "@/types";

export const PERSONAL_INFO = {
  name: "Meraj Alam",
  title: "AI Engineer • ML Engineer • GenAI • Backend Developer",
  tagline: "Engineering autonomous agentic workflows and scalable backend systems with low latency and modern AI architectures.",
  location: "Surat, India",
  status: "Open to Internship & Full-Time opportunities",
  education: {
    institution: "SVNIT Surat (Sardar Vallabhbhai National Institute of Technology)",
    degree: "B.Tech in Artificial Intelligence",
    period: "2023 – 2027",
    details: "Specializing in Large Language Model systems, Agentic workflows, distributed backend design, and high-performance computing."
  },
  socials: {
    github: "https://github.com/merajsiddieque",
    linkedin: "https://linkedin.com/in/merajsiddieque",
    twitter: "https://twitter.com/meraj_alam",
    email: "merajsiddieque@gmail.com",
    resume: process.env.NEXT_PUBLIC_RESUME_URL || "https://kwkemqdccnstkfidzfce.supabase.co/storage/v1/object/public/resume/Meraj_Alam_Resume_Main.pdf",
    avatar: "https://kwkemqdccnstkfidzfce.supabase.co/storage/v1/object/public/project-media/Photo.png"
  }
};

export const SKILL_CATEGORIES = [
  {
    category: "AI & GenAI",
    description: "Multi-agent systems, retrieval pipelines & foundation models",
    color: "from-blue-600/20 to-cyan-500/20",
    borderColor: "border-cyan-500/30",
    skills: [
      { name: "Python", level: "Expert", highlight: true },
      { name: "LangGraph", level: "Advanced", highlight: true },
      { name: "LangChain", level: "Advanced", highlight: false },
      { name: "LLMs (Gemini, Claude, GPT)", level: "Advanced", highlight: true },
      { name: "RAG & Vector DBs", level: "Advanced", highlight: true },
      { name: "Prompt Engineering", level: "Advanced", highlight: false },
      { name: "PyTorch & ML", level: "Intermediate", highlight: false }
    ]
  },
  {
    category: "Backend Architecture",
    description: "High-throughput APIs, microservices & async systems",
    color: "from-blue-700/20 to-violet-600/20",
    borderColor: "border-blue-500/30",
    skills: [
      { name: "FastAPI", level: "Expert", highlight: true },
      { name: "RESTful APIs", level: "Expert", highlight: true },
      { name: "Node.js", level: "Advanced", highlight: false },
      { name: "Express", level: "Advanced", highlight: false },
      { name: "System Design", level: "Intermediate", highlight: true },
      { name: "WebSockets", level: "Advanced", highlight: false }
    ]
  },
  {
    category: "Modern Frontend",
    description: "Interactive AI SaaS interfaces & reactive user experiences",
    color: "from-cyan-600/20 to-blue-500/20",
    borderColor: "border-cyan-400/30",
    skills: [
      { name: "React", level: "Advanced", highlight: true },
      { name: "Next.js 15", level: "Advanced", highlight: true },
      { name: "TypeScript", level: "Advanced", highlight: true },
      { name: "Tailwind CSS", level: "Expert", highlight: false },
      { name: "Framer Motion", level: "Advanced", highlight: false }
    ]
  },
  {
    category: "Database & Cloud DevOps",
    description: "Persistent storage, caching & containerized deployment",
    color: "from-violet-600/20 to-purple-800/20",
    borderColor: "border-violet-500/30",
    skills: [
      { name: "PostgreSQL (Supabase)", level: "Advanced", highlight: true },
      { name: "MongoDB", level: "Advanced", highlight: false },
      { name: "Firebase", level: "Intermediate", highlight: false },
      { name: "Docker", level: "Advanced", highlight: true },
      { name: "Git & CI/CD", level: "Advanced", highlight: false },
      { name: "Redis", level: "Intermediate", highlight: false }
    ]
  }
];

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 1,
    title: "AI Mental Health Chatbot",
    slug: "ai-mental-health-chatbot",
    tagline: "Empathetic conversational AI companion with real-time sign-language recognition",
    description: "Full-stack conversational application integrating the OpenAI API for empathetic dialogue with a real-time MediaPipe computer vision module translating webcam hand gestures into chatbot input.",
    long_description: "Developed with React and Node.js/Express, this application combines evidence-based CBT dialogue frameworks with the OpenAI API. Uses Firebase Authentication for secure user sign-in and Firestore for profile persistence. In addition to standard text input, it integrates a client-side MediaPipe Gesture Recognizer that processes live video frames to translate sign-language gestures into chatbot input, widening accessibility for speech- and hearing-impaired users.",
    category: "AI & GenAI",
    tech_stack: ["React", "Node.js", "Express", "OpenAI API", "MediaPipe", "Firebase", "WebSockets"],
    github_url: "https://github.com/merajsiddieque/Mental-Health-Chatbot",
    live_url: "https://mental-health-chatbot-cncd.onrender.com/login",
    featured: true,
    stars: 94,
    order: 1
  },
  {
    id: 2,
    title: "Agentic Code Reviewer",
    slug: "agentic-code-reviewer",
    tagline: "Autonomous multi-agent LangGraph pipeline for automated PR analysis & security audits",
    description: "Architected a multi-language code review platform using a LangGraph multi-agent pipeline combining deterministic static analysis with Gemini LLM reasoning for security audits, bug detection, and refactoring.",
    long_description: "Engineered with LangGraph and FastAPI, the Agentic Code Reviewer splits review tasks across specialized sub-agents: Router, AST static analysis, OWASP Top 10 Security Vulnerability Scanner, and Dynamic Test Generator. Integrates Google Gemini with context-aware semantic diff chunking and Server-Sent Events (SSE) for streaming review output. Validated against a ground-truth dataset across 10 vulnerability categories and containerized with Docker for production deployment.",
    category: "AI & GenAI",
    tech_stack: ["LangGraph", "FastAPI", "React", "Google Gemini", "Docker", "Python", "PostgreSQL"],
    github_url: "https://github.com/merajsiddieque/agentic-code-reviewer",
    live_url: "https://agentic-code-reviewer-f9cn.onrender.com/",
    featured: true,
    stars: 128,
    order: 2
  },
  {
    id: 3,
    title: "SecureChat - Real-Time Encrypted Messaging",
    slug: "secure-chat",
    tagline: "End-to-end encrypted messaging application with AES-GCM and SHA-512 key derivation",
    description: "Real-time messaging application with client-side message encryption using AES-GCM via the Web Crypto API, deriving per-chat keys with SHA-512 hashing to guarantee zero-knowledge server storage.",
    long_description: "Built with React and Firebase Firestore, synchronizing real-time message states across concurrent active client sessions. Implements zero-knowledge client-side message encryption with AES-GCM using the browser Web Crypto API, deriving cryptographic keys per conversation via SHA-512 hashing so that the database stores only ciphertext. Hardens authentication and credential storage with SHA-512 password hashing.",
    category: "Full Stack",
    tech_stack: ["React", "Firebase Firestore", "Web Crypto API", "AES-GCM", "SHA-512", "TailwindCSS"],
    github_url: "https://github.com/merajsiddieque/SecureChat",
    live_url: "https://securechat-df1m.onrender.com/",
    featured: true,
    stars: 82,
    order: 3
  },
  {
    id: 4,
    title: "Serverless Todo App",
    slug: "serverless-todo-app",
    tagline: "Cloud-native task orchestration with serverless real-time sync and optimistic UI",
    description: "Modern responsive task management platform featuring real-time cloud sync, persistent local caching, fluid micro-interactions, and instant zero-downtime deployment.",
    long_description: "Engineered on a serverless cloud infrastructure with React and Firebase, providing instantaneous sub-millisecond task creation, state toggling, categorization, and search. Designed with optimistic UI updates and reactive state management for offline resilience and immediate feedback.",
    category: "Full Stack",
    tech_stack: ["React", "Firebase", "Serverless", "JavaScript", "HTML5/CSS3", "PWA"],
    github_url: "https://github.com/merajsiddieque/Serverless-Todo-App",
    live_url: "https://mern-e7943.web.app/",
    featured: true,
    stars: 45,
    order: 4
  },
  {
    id: 5,
    title: "Amazon Review & WhatsApp Chat Analysis",
    slug: "amazon-review-whatsapp-chat-analysis",
    tagline: "Exploratory data analysis & NLP sentiment modeling across review & chat datasets",
    description: "Exploratory data analysis and NLP modeling pipeline in Python on Amazon product reviews and WhatsApp conversation datasets to surface customer sentiment, usage trends, and engagement patterns.",
    long_description: "Built with Python, Pandas, NumPy, NLTK, and visualization libraries. Performs end-to-end data cleansing, regex preprocessing, and exploratory data analysis on raw, unstructured textual records. Converts thousands of multi-party messages and customer feedback entries into structured statistical findings, sentiment polarity distributions, and actionable insights.",
    category: "Data & Analytics",
    tech_stack: ["Python", "Pandas", "NumPy", "NLTK", "Scikit-Learn", "Matplotlib", "Seaborn"],
    github_url: "https://github.com/merajsiddieque/Amazon_Review_n_WhatsApp_Chat_Analysis",
    live_url: "",
    featured: true,
    stars: 38,
    order: 5
  }
];

export const TIMELINE_EXPERIENCE = [
  {
    year: "2023 – 2027",
    title: "B.Tech in Artificial Intelligence",
    organization: "SVNIT Surat (Sardar Vallabhbhai National Institute of Technology)",
    badge: "Institute of National Importance",
    description: "Pursuing core computer science & AI curriculum. Specialized research and coursework in Natural Language Processing, Autonomous Multi-Agent Systems, Deep Learning, and Distributed Database Architectures.",
    highlights: ["Core AI Research", "Algorithmic Problem Solving", "Systems Design", "Competitive Programming"]
  },
  {
    year: "2024 – Present",
    title: "AI Systems & GenAI Researcher / Developer",
    organization: "Open Source & Autonomous Agentic Engineering",
    badge: "Independent Engineering",
    description: "Architected LangGraph stateful multi-agent workflows, contextual hybrid RAG search engines with FAISS/Pinecone, and high-performance FastAPI backends for real-time inference.",
    highlights: ["LangGraph & LangChain", "Agentic Code Triaging", "RAG Vector Pipelines", "Dockerized Deployments"]
  },
  {
    year: "2023 – 2024",
    title: "Full-Stack Software Developer",
    organization: "Collaborative Web Engineering",
    badge: "Web & Realtime Platforms",
    description: "Built scalable web apps using Next.js, Node.js, Express, and WebSockets. Implemented event-driven real-time states and modern UI architectures.",
    highlights: ["Next.js & TypeScript", "WebSocket Synchronization", "State Management", "PostgreSQL & MongoDB"]
  }
];
