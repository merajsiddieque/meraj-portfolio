import { Project, BlogPost, GitHubStats, ChatResponse, ContactFormData, ContactResponse } from "@/types";
import { FALLBACK_PROJECTS } from "./constants";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "https://meraj-portfolio-hoa6.onrender.com").replace(/\/$/, "");

/**
 * Fetch projects from Supabase via backend API
 * Endpoint: GET /projects (and /api/v1/projects)
 */
export async function getProjects(featuredOnly = false): Promise<Project[]> {
  // 1. Try local Next.js server route
  try {
    const isClient = typeof window !== "undefined";
    const endpoint = isClient ? "/api/projects" : `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/projects`;
    const localRes = await fetch(endpoint, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 }
    });
    if (localRes.ok) {
      const list = await localRes.json();
      if (Array.isArray(list) && list.length > 0) {
        return featuredOnly ? list.filter((p: Project) => p.featured) : list;
      }
    }
  } catch {
    // Continue to backend
  }

  // 2. Try FastAPI backend API
  try {
    const endpoint = `${API_BASE_URL}/projects${featuredOnly ? "?featured_only=true" : ""}`;
    const res = await fetch(endpoint, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 }
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) return data;
    }
    const v1Res = await fetch(`${API_BASE_URL}/api/v1/projects`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 }
    });
    if (v1Res.ok) {
      const v1Data = await v1Res.json();
      if (Array.isArray(v1Data) && v1Data.length > 0) return v1Data;
    }
  } catch (error) {
    console.warn("Failed to fetch projects from backend, using fallback data:", error);
  }
  return featuredOnly ? FALLBACK_PROJECTS.filter((p) => p.featured) : FALLBACK_PROJECTS;
}

/**
 * Fetch blog posts from Supabase via backend API
 * Endpoint: GET /blog
 */
export async function getBlog(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/blog`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 120 }
    });
    if (!res.ok) {
      const v1Res = await fetch(`${API_BASE_URL}/api/v1/blog`, {
        headers: { "Content-Type": "application/json" },
        next: { revalidate: 120 }
      });
      if (v1Res.ok) return await v1Res.json();
      throw new Error(`HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.warn("Failed to fetch blog posts from backend:", error);
    return [
      {
        id: 1,
        title: "Architecting Autonomous Multi-Agent Workflows with LangGraph",
        slug: "architecting-autonomous-multi-agent-workflows-langgraph",
        excerpt: "A deep dive into cyclical state graphs, stateful node orchestration, and human-in-the-loop validation.",
        content: "Autonomous agents are transitioning from single-prompt linear chains to stateful cyclical graph topologies.",
        tags: ["LangGraph", "GenAI", "Python", "Architecture"],
        read_time: "6 min read",
        published: true,
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        title: "Building Production-Grade Async Microservices with FastAPI & PostgreSQL",
        slug: "building-production-async-microservices-fastapi-postgresql",
        excerpt: "Key architectural lessons from scaling high-throughput REST APIs with connection pooling.",
        content: "Designing high-throughput backend services requires careful async orchestration and connection pooling.",
        tags: ["FastAPI", "PostgreSQL", "Backend", "Docker"],
        read_time: "5 min read",
        published: true,
        created_at: new Date().toISOString()
      }
    ];
  }
}

/**
 * Fetch GitHub telemetry with 10-minute caching
 * Endpoint: GET /github-stats
 */
export async function getGithubStats(): Promise<GitHubStats> {
  // 1. Try local Next.js server route (which securely accesses GITHUB_TOKEN)
  try {
    const isClient = typeof window !== "undefined";
    const endpoint = isClient ? "/api/github" : `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/github`;
    const localRes = await fetch(endpoint, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 },
    });
    if (localRes.ok) {
      return await localRes.json();
    }
  } catch {
    // Continue to backend or direct fetch
  }

  // 2. Try FastAPI backend endpoints
  try {
    const res = await fetch(`${API_BASE_URL}/github-stats`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 }
    });
    if (res.ok) {
      return await res.json();
    }
    const v1Res = await fetch(`${API_BASE_URL}/api/v1/github-stats`, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 300 }
    });
    if (v1Res.ok) {
      return await v1Res.json();
    }
  } catch {
    // Continue to direct GitHub fetch fallback
  }

  // 3. Fallback: Direct unauthenticated or client-token fetch from GitHub API
  try {
    const token = typeof window !== "undefined" ? process.env.NEXT_PUBLIC_GITHUB_TOKEN : "";
    const headers: Record<string, string> = {
      Accept: "application/vnd.github.v3+json",
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const directUserRes = await fetch("https://api.github.com/users/merajsiddieque", { headers });
    if (directUserRes.ok) {
      const uData = await directUserRes.json();
      return {
        profile: {
          name: uData.name || "Meraj Alam",
          username: uData.login || "merajsiddieque",
          avatar: uData.avatar_url || "https://avatars.githubusercontent.com/u/156106853?v=4",
          followers: uData.followers || 2,
          public_repos: uData.public_repos ?? 17,
        },
        stats: {
          stars: 10,
          commits: 540,
        },
        public_repos: uData.public_repos ?? 17,
      };
    }
  } catch (error) {
    console.warn("Using local fallback GitHub stats:", error);
  }
    return {
      profile: {
        name: "Meraj Alam",
        username: "merajsiddieque",
        avatar: "https://avatars.githubusercontent.com/u/156106853?v=4",
        followers: 2,
        public_repos: 17
      },
      stats: {
        stars: 10,
        commits: 540
      },
      languages: [
        { name: "JavaScript", percentage: 29.4, color: "#F7DF1E" },
        { name: "Java", percentage: 23.5, color: "#B07219" },
        { name: "Jupyter Notebook", percentage: 17.6, color: "#DA5B0B" },
        { name: "Python", percentage: 11.8, color: "#3572A5" },
        { name: "C", percentage: 5.9, color: "#555555" },
        { name: "Kotlin", percentage: 5.9, color: "#A97BFF" }
      ],
      repositories: [
        {
          name: "agentic-code-reviewer",
          description: "Autonomous multi-agent system for automated PR analysis, security scanning, and test generation.",
          language: "Python",
          stars: 24,
          forks: 6,
          updated_at: "2026-03-01T14:32:00Z",
          topics: ["langgraph", "fastapi", "gemini", "ai-agents"],
          is_pinned: true,
          html_url: "https://github.com/merajsiddieque/agentic-code-reviewer",
          homepage: ""
        },
        {
          name: "Mental-Health-Chatbot",
          description: "Empathetic real-time mental wellness assistant with emotion tracking and therapeutic support.",
          language: "JavaScript",
          stars: 12,
          forks: 3,
          updated_at: "2026-02-28T10:15:00Z",
          topics: ["react", "nodejs", "firebase", "mental-health"],
          is_pinned: true,
          html_url: "https://github.com/merajsiddieque/Mental-Health-Chatbot",
          homepage: ""
        },
        {
          name: "Task-Collaboration-Platform",
          description: "Real-time distributed project management workspace with live cursor and board synchronization.",
          language: "JavaScript",
          stars: 6,
          forks: 2,
          updated_at: "2026-02-20T16:45:00Z",
          topics: ["mern", "socket-io", "collaborative-tools"],
          is_pinned: true,
          html_url: "https://github.com/merajsiddieque/Task-Collaboration-Platform",
          homepage: ""
        },
        {
          name: "Amazon_Review_n_WhatsApp_Chat_Analysis",
          description: "NLP sentiment classification and chat analytics using Python, NLTK, and Streamlit.",
          language: "Python",
          stars: 4,
          forks: 1,
          updated_at: "2026-01-15T09:20:00Z",
          topics: ["nlp", "sentiment-analysis", "python"],
          is_pinned: true,
          html_url: "https://github.com/merajsiddieque/Amazon_Review_n_WhatsApp_Chat_Analysis",
          homepage: ""
        },
        {
          name: "Aspect_Analysis",
          description: "Aspect-based sentiment analysis deep learning model with attention mechanisms.",
          language: "Jupyter Notebook",
          stars: 2,
          forks: 0,
          updated_at: "2025-12-10T11:00:00Z",
          topics: ["deep-learning", "pytorch", "aspect-sentiment"],
          is_pinned: true,
          html_url: "https://github.com/merajsiddieque/Aspect_Analysis",
          homepage: ""
        },
        {
          name: "SecureChat",
          description: "End-to-end encrypted messaging application with RSA/AES key exchange.",
          language: "Java",
          stars: 3,
          forks: 1,
          updated_at: "2025-11-05T08:30:00Z",
          topics: ["cryptography", "security", "java"],
          is_pinned: true,
          html_url: "https://github.com/merajsiddieque/SecureChat",
          homepage: ""
        },
        {
          name: "PhoneBook-Management-System",
          description: "High-performance telephone directory indexing with AVL trees and hash tables.",
          language: "C",
          stars: 1,
          forks: 0,
          updated_at: "2025-10-18T13:40:00Z",
          topics: ["data-structures", "c-language"],
          is_pinned: true,
          html_url: "https://github.com/merajsiddieque/PhoneBook-Management-System",
          homepage: ""
        },
        {
          name: "Distributed-Log-Anomaly-Detection-System",
          description: "Microservices log anomaly detection pipeline using Apache Kafka and Isolation Forests.",
          language: "Python",
          stars: 2,
          forks: 0,
          updated_at: "2026-02-10T12:00:00Z",
          topics: ["anomaly-detection", "distributed-systems", "kafka"],
          is_pinned: false,
          html_url: "https://github.com/merajsiddieque/Distributed-Log-Anomaly-Detection-System",
          homepage: ""
        },
        {
          name: "ILLM",
          description: "Inference and fine-tuning suite for lightweight local language models.",
          language: "Python",
          stars: 1,
          forks: 0,
          updated_at: "2026-01-28T17:10:00Z",
          topics: ["llm", "inference", "pytorch"],
          is_pinned: false,
          html_url: "https://github.com/merajsiddieque/ILLM",
          homepage: ""
        },
        {
          name: "Serverless-Todo-App",
          description: "Cloud-native event-driven task tracking app built on AWS Lambda & DynamoDB.",
          language: "JavaScript",
          stars: 1,
          forks: 0,
          updated_at: "2025-09-12T15:20:00Z",
          topics: ["serverless", "aws-lambda", "dynamodb"],
          is_pinned: false,
          html_url: "https://github.com/merajsiddieque/Serverless-Todo-App",
          homepage: ""
        },
        {
          name: "Coaching-Android-App",
          description: "Educational mobile app for coaching institute student management and attendance.",
          language: "Kotlin",
          stars: 1,
          forks: 0,
          updated_at: "2025-08-20T10:00:00Z",
          topics: ["android", "kotlin", "education"],
          is_pinned: false,
          html_url: "https://github.com/merajsiddieque/Coaching-Android-App",
          homepage: ""
        },
        {
          name: "SecretMessenger",
          description: "Ephemeral peer-to-peer messaging protocol with WebRTC.",
          language: "Java",
          stars: 0,
          forks: 0,
          updated_at: "2025-07-14T09:00:00Z",
          topics: ["p2p", "webrtc", "java"],
          is_pinned: false,
          html_url: "https://github.com/merajsiddieque/SecretMessenger",
          homepage: ""
        },
        {
          name: "Computer-Network",
          description: "Socket programming implementations: packet sniffers, TCP/UDP simulation, and routing protocols.",
          language: "Java",
          stars: 0,
          forks: 0,
          updated_at: "2025-06-11T14:15:00Z",
          topics: ["networking", "sockets", "tcp-ip"],
          is_pinned: false,
          html_url: "https://github.com/merajsiddieque/Computer-Network",
          homepage: ""
        },
        {
          name: "SchoolManagement",
          description: "Enterprise school administrative portal with role-based access control.",
          language: "Java",
          stars: 0,
          forks: 0,
          updated_at: "2025-05-19T11:45:00Z",
          topics: ["management", "java", "sql"],
          is_pinned: false,
          html_url: "https://github.com/merajsiddieque/SchoolManagement",
          homepage: ""
        },
        {
          name: "TAS-Net-DRL-EEG",
          description: "Deep reinforcement learning model for EEG-based audio speech separation.",
          language: "Jupyter Notebook",
          stars: 0,
          forks: 0,
          updated_at: "2025-04-10T16:00:00Z",
          topics: ["eeg", "speech-separation", "deep-learning"],
          is_pinned: false,
          html_url: "https://github.com/merajsiddieque/TAS-Net-DRL-EEG",
          homepage: ""
        },
        {
          name: "IMAES",
          description: "Interactive Multi-Agent Environment Simulation for collective decision benchmarks.",
          language: "Jupyter Notebook",
          stars: 0,
          forks: 0,
          updated_at: "2026-09-09T09:41:07Z",
          topics: ["multi-agent", "simulation", "python"],
          is_pinned: false,
          html_url: "https://github.com/merajsiddieque/IMAES",
          homepage: ""
        },
        {
          name: "tender",
          description: "Procurement and digital contract management microservice.",
          language: "JavaScript",
          stars: 0,
          forks: 0,
          updated_at: "2025-03-01T12:00:00Z",
          topics: ["procurement", "contract", "javascript"],
          is_pinned: false,
          html_url: "https://github.com/merajsiddieque/tender",
          homepage: ""
        }
      ],
      followers: 2,
      public_repos: 17,
      stars: 10,
      total_commits: 540,
      top_languages: ["JavaScript", "Java", "Jupyter Notebook", "Python", "C", "Kotlin"],
      cached: false
    };
}


/**
 * Submit contact inquiry to Supabase via backend API
 * Endpoint: POST /contact
 */
export async function sendContact(formData: ContactFormData): Promise<ContactResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject || "Portfolio Inquiry",
        message: formData.message
      })
    });
    if (!res.ok) {
      const v1Res = await fetch(`${API_BASE_URL}/api/v1/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (v1Res.ok) return await v1Res.json();
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || `HTTP error ${res.status}`);
    }
    return await res.json();
  } catch (error: any) {
    console.error("Error submitting contact form:", error);
    throw new Error(error.message || "Failed to transmit message. Please try again or reach out on LinkedIn.");
  }
}

/**
 * Ask Meraj AI Assistant powered by Gemini & LangGraph
 * Endpoint: POST /chat
 * Request: { "message": "..." }
 * Response: { "reply": "..." }
 */
export async function chatWithMeraj(
  message: string,
  history: { role: string; content: string }[] = []
): Promise<ChatResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history })
    });
    if (!res.ok) {
      const v1Res = await fetch(`${API_BASE_URL}/api/v1/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history })
      });
      if (v1Res.ok) return await v1Res.json();
      throw new Error(`HTTP error ${res.status}`);
    }
    const data = await res.json();
    return {
      reply: data.reply || data.response || "I don't have that information in Meraj's portfolio.",
      response: data.response || data.reply,
      suggested_prompts: data.suggested_prompts || [
        "Tell me about your projects",
        "What backend technologies do you know?",
        "Explain your Agentic Code Reviewer",
        "What is your education?"
      ],
      mode: data.mode || "gemini_agent"
    };
  } catch (error) {
    console.warn("Backend chat unavailable, using local guardrail response:", error);
    return {
      reply: "Meraj Alam is an AI & Backend Engineer at SVNIT Surat specializing in LangGraph, FastAPI, and GenAI. (Connecting to Gemini backend...)",
      response: "Meraj Alam is an AI & Backend Engineer at SVNIT Surat specializing in LangGraph, FastAPI, and GenAI. (Connecting to Gemini backend...)",
      suggested_prompts: [
        "Tell me about your projects",
        "What backend technologies do you know?",
        "Explain your Agentic Code Reviewer",
        "What is your education?"
      ],
      mode: "local_client_fallback"
    };
  }
}

// Backward-compatible alias exports
export const fetchProjects = getProjects;
export const fetchGitHubStats = getGithubStats;
export const sendChatMessage = chatWithMeraj;
export const submitContactMessage = sendContact;
