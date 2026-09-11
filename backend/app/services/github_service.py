import time
import logging
import re
from typing import Dict, Any, Optional, List
import httpx
from app.core.config import settings
from app.schemas.github import (
    GitHubStatsResponse,
    GitHubProfile,
    GitHubMetrics,
    GitHubLanguageStat,
    GitHubRepositoryItem,
    PinnedRepo
)

logger = logging.getLogger(__name__)

# 10-minute in-memory cache
_CACHE: Dict[str, Any] = {
    "timestamp": 0.0,
    "data": None
}
CACHE_TTL_SECONDS = 600  # 10 minutes

LANGUAGE_COLORS: Dict[str, str] = {
    "Python": "#3572A5",
    "JavaScript": "#F7DF1E",
    "TypeScript": "#3178C6",
    "Java": "#B07219",
    "C++": "#F34B7D",
    "C": "#555555",
    "Jupyter Notebook": "#DA5B0B",
    "HTML": "#E34C26",
    "CSS": "#563D7C",
    "Shell": "#89E051",
    "Go": "#00ADD8",
    "Rust": "#DEA584",
    "Dart": "#00B4AB",
    "Kotlin": "#A97BFF",
    "PHP": "#4F5D95",
    "Ruby": "#701516",
    "Other": "#8B949E"
}

# Fallback data representing Meraj's 17 public repositories
FALLBACK_REPOSITORIES = [
    {
        "name": "agentic-code-reviewer",
        "description": "Autonomous multi-agent system for automated PR analysis, security scanning, and test generation.",
        "language": "Python",
        "stars": 24,
        "forks": 6,
        "updated_at": "2026-03-01T14:32:00Z",
        "topics": ["langgraph", "fastapi", "gemini", "ai-agents"],
        "is_pinned": True,
        "html_url": "https://github.com/merajsiddieque/agentic-code-reviewer",
        "homepage": ""
    },
    {
        "name": "Mental-Health-Chatbot",
        "description": "Empathetic real-time mental wellness assistant with emotion tracking and therapeutic support.",
        "language": "JavaScript",
        "stars": 12,
        "forks": 3,
        "updated_at": "2026-02-28T10:15:00Z",
        "topics": ["react", "nodejs", "firebase", "mental-health"],
        "is_pinned": True,
        "html_url": "https://github.com/merajsiddieque/Mental-Health-Chatbot",
        "homepage": ""
    },
    {
        "name": "Task-Collaboration-Platform",
        "description": "Real-time distributed project management workspace with live cursor and board synchronization.",
        "language": "JavaScript",
        "stars": 6,
        "forks": 2,
        "updated_at": "2026-02-20T16:45:00Z",
        "topics": ["mern", "socket-io", "collaborative-tools"],
        "is_pinned": True,
        "html_url": "https://github.com/merajsiddieque/Task-Collaboration-Platform",
        "homepage": ""
    },
    {
        "name": "Amazon_Review_n_WhatsApp_Chat_Analysis",
        "description": "NLP sentiment classification and chat analytics using Python, NLTK, and Streamlit.",
        "language": "Python",
        "stars": 4,
        "forks": 1,
        "updated_at": "2026-01-15T09:20:00Z",
        "topics": ["nlp", "sentiment-analysis", "python"],
        "is_pinned": True,
        "html_url": "https://github.com/merajsiddieque/Amazon_Review_n_WhatsApp_Chat_Analysis",
        "homepage": ""
    },
    {
        "name": "Aspect_Analysis",
        "description": "Aspect-based sentiment analysis deep learning model with attention mechanisms.",
        "language": "Jupyter Notebook",
        "stars": 2,
        "forks": 0,
        "updated_at": "2025-12-10T11:00:00Z",
        "topics": ["deep-learning", "pytorch", "aspect-sentiment"],
        "is_pinned": True,
        "html_url": "https://github.com/merajsiddieque/Aspect_Analysis",
        "homepage": ""
    },
    {
        "name": "SecureChat",
        "description": "End-to-end encrypted messaging application with RSA/AES key exchange.",
        "language": "Java",
        "stars": 3,
        "forks": 1,
        "updated_at": "2025-11-05T08:30:00Z",
        "topics": ["cryptography", "security", "java"],
        "is_pinned": True,
        "html_url": "https://github.com/merajsiddieque/SecureChat",
        "homepage": ""
    },
    {
        "name": "PhoneBook-Management-System",
        "description": "High-performance telephone directory indexing with AVL trees and hash tables.",
        "language": "C",
        "stars": 1,
        "forks": 0,
        "updated_at": "2025-10-18T13:40:00Z",
        "topics": ["data-structures", "c-language"],
        "is_pinned": True,
        "html_url": "https://github.com/merajsiddieque/PhoneBook-Management-System",
        "homepage": ""
    },
    {
        "name": "Distributed-Log-Anomaly-Detection-System",
        "description": "Microservices log anomaly detection pipeline using Apache Kafka and Isolation Forests.",
        "language": "Python",
        "stars": 2,
        "forks": 0,
        "updated_at": "2026-02-10T12:00:00Z",
        "topics": ["anomaly-detection", "distributed-systems", "kafka"],
        "is_pinned": False,
        "html_url": "https://github.com/merajsiddieque/Distributed-Log-Anomaly-Detection-System",
        "homepage": ""
    },
    {
        "name": "ILLM",
        "description": "Inference and fine-tuning suite for lightweight local language models.",
        "language": "Python",
        "stars": 1,
        "forks": 0,
        "updated_at": "2026-01-28T17:10:00Z",
        "topics": ["llm", "inference", "pytorch"],
        "is_pinned": False,
        "html_url": "https://github.com/merajsiddieque/ILLM",
        "homepage": ""
    },
    {
        "name": "Serverless-Todo-App",
        "description": "Cloud-native event-driven task tracking app built on AWS Lambda & DynamoDB.",
        "language": "JavaScript",
        "stars": 1,
        "forks": 0,
        "updated_at": "2025-09-12T15:20:00Z",
        "topics": ["serverless", "aws-lambda", "dynamodb"],
        "is_pinned": False,
        "html_url": "https://github.com/merajsiddieque/Serverless-Todo-App",
        "homepage": ""
    },
    {
        "name": "Coaching-Android-App",
        "description": "Educational mobile app for coaching institute student management and attendance.",
        "language": "Kotlin",
        "stars": 1,
        "forks": 0,
        "updated_at": "2025-08-20T10:00:00Z",
        "topics": ["android", "kotlin", "education"],
        "is_pinned": False,
        "html_url": "https://github.com/merajsiddieque/Coaching-Android-App",
        "homepage": ""
    },
    {
        "name": "SecretMessenger",
        "description": "Ephemeral peer-to-peer messaging protocol with WebRTC.",
        "language": "Java",
        "stars": 0,
        "forks": 0,
        "updated_at": "2025-07-14T09:00:00Z",
        "topics": ["p2p", "webrtc", "java"],
        "is_pinned": False,
        "html_url": "https://github.com/merajsiddieque/SecretMessenger",
        "homepage": ""
    },
    {
        "name": "Computer-Network",
        "description": "Socket programming implementations: packet sniffers, TCP/UDP simulation, and routing protocols.",
        "language": "Java",
        "stars": 0,
        "forks": 0,
        "updated_at": "2025-06-11T14:15:00Z",
        "topics": ["networking", "sockets", "tcp-ip"],
        "is_pinned": False,
        "html_url": "https://github.com/merajsiddieque/Computer-Network",
        "homepage": ""
    },
    {
        "name": "SchoolManagement",
        "description": "Enterprise school administrative portal with role-based access control.",
        "language": "Java",
        "stars": 0,
        "forks": 0,
        "updated_at": "2025-05-19T11:45:00Z",
        "topics": ["management", "java", "sql"],
        "is_pinned": False,
        "html_url": "https://github.com/merajsiddieque/SchoolManagement",
        "homepage": ""
    },
    {
        "name": "TAS-Net-DRL-EEG",
        "description": "Deep reinforcement learning model for EEG-based audio speech separation.",
        "language": "Jupyter Notebook",
        "stars": 0,
        "forks": 0,
        "updated_at": "2025-04-10T16:00:00Z",
        "topics": ["eeg", "speech-separation", "deep-learning"],
        "is_pinned": False,
        "html_url": "https://github.com/merajsiddieque/TAS-Net-DRL-EEG",
        "homepage": ""
    },
    {
        "name": "IMAES",
        "description": "Interactive Multi-Agent Environment Simulation for collective decision benchmarks.",
        "language": "Jupyter Notebook",
        "stars": 0,
        "forks": 0,
        "updated_at": "2026-09-09T09:41:07Z",
        "topics": ["multi-agent", "simulation", "python"],
        "is_pinned": False,
        "html_url": "https://github.com/merajsiddieque/IMAES",
        "homepage": ""
    },
    {
        "name": "tender",
        "description": "Procurement and digital contract management microservice.",
        "language": "JavaScript",
        "stars": 0,
        "forks": 0,
        "updated_at": "2025-03-01T12:00:00Z",
        "topics": ["procurement", "contract", "javascript"],
        "is_pinned": False,
        "html_url": "https://github.com/merajsiddieque/tender",
        "homepage": ""
    }
]

def build_fallback_response(username: str = "merajsiddieque") -> GitHubStatsResponse:
    repo_items = [GitHubRepositoryItem(**r) for r in FALLBACK_REPOSITORIES]
    lang_counts: Dict[str, int] = {}
    total_stars = 0
    for r in repo_items:
        total_stars += r.stars
        lang = r.language or "Other"
        lang_counts[lang] = lang_counts.get(lang, 0) + 1

    total_langs = sum(lang_counts.values()) or 1
    languages = [
        GitHubLanguageStat(
            name=k,
            percentage=round((v / total_langs) * 100, 1),
            color=LANGUAGE_COLORS.get(k, "#8B949E")
        )
        for k, v in sorted(lang_counts.items(), key=lambda x: x[1], reverse=True)
    ]

    return GitHubStatsResponse(
        profile=GitHubProfile(
            name="Meraj Alam",
            username=username,
            avatar="https://avatars.githubusercontent.com/u/156106853?v=4",
            followers=2,
            public_repos=len(repo_items)
        ),
        stats=GitHubMetrics(
            stars=total_stars or 10,
            commits=540
        ),
        languages=languages,
        repositories=repo_items,
        cached=False
    )

async def get_github_stats(username: Optional[str] = None) -> GitHubStatsResponse:
    global _CACHE
    target_user = (username or settings.GITHUB_USERNAME or "merajsiddieque").strip()
    current_time = time.time()

    # Check in-memory cache (10 minutes)
    if _CACHE["data"] is not None and (current_time - _CACHE["timestamp"] < CACHE_TTL_SECONDS):
        logger.info("Returning cached GitHub stats (10m TTL)")
        cached_resp = _CACHE["data"].model_copy()
        cached_resp.cached = True
        return cached_resp

    headers = {
        "Accept": "application/vnd.github.v3+json",
        "User-Agent": "FastAPI-Portfolio-Server"
    }
    github_token = settings.GITHUB_TOKEN.strip() if hasattr(settings, "GITHUB_TOKEN") else ""
    if github_token:
        headers["Authorization"] = f"Bearer {github_token}"

    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            # 1. Fetch User Profile
            user_res = await client.get(f"https://api.github.com/users/{target_user}", headers=headers)
            if user_res.status_code != 200:
                logger.warning(f"GitHub API user fetch returned {user_res.status_code}, using fallback data")
                return build_fallback_response(target_user)

            user_data = user_res.json()
            followers = user_data.get("followers", 2)
            public_repos_count = user_data.get("public_repos", 17)
            avatar_url = user_data.get("avatar_url", "")
            user_display_name = user_data.get("name") or "Meraj Alam"

            # 2. Scrape pinned repositories from profile HTML
            pinned_names = set()
            try:
                profile_html_res = await client.get(
                    f"https://github.com/{target_user}",
                    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
                )
                if profile_html_res.status_code == 200:
                    found_pinned = re.findall(r'<span class="repo"[^>]*>([^<]+)</span>', profile_html_res.text)
                    pinned_names = set(p.strip() for p in found_pinned if p.strip())
                    logger.info(f"Detected {len(pinned_names)} pinned repos for {target_user}: {pinned_names}")
            except Exception as e:
                logger.warning(f"Could not scrape pinned repositories: {e}")

            # 3. Fetch all public repositories
            repos_res = await client.get(
                f"https://api.github.com/users/{target_user}/repos?type=public&per_page=100&sort=updated",
                headers=headers
            )
            repos_data = repos_res.json() if repos_res.status_code == 200 else []

            repo_items: List[GitHubRepositoryItem] = []
            lang_counts: Dict[str, int] = {}
            total_stars = 0

            if isinstance(repos_data, list) and len(repos_data) > 0:
                for r in repos_data:
                    if r.get("private", False):
                        continue
                    name = r.get("name", "")
                    stars = r.get("stargazers_count", 0)
                    total_stars += stars
                    lang = r.get("language") or "Other"
                    if lang and lang != "Other":
                        lang_counts[lang] = lang_counts.get(lang, 0) + 1

                    is_pinned = (name in pinned_names)
                    repo_items.append(
                        GitHubRepositoryItem(
                            name=name,
                            description=r.get("description") or "",
                            language=lang,
                            stars=stars,
                            forks=r.get("forks_count", 0),
                            updated_at=r.get("updated_at") or "",
                            topics=r.get("topics") or [],
                            is_pinned=is_pinned,
                            html_url=r.get("html_url") or f"https://github.com/{target_user}/{name}",
                            homepage=r.get("homepage") or ""
                        )
                    )

                # Sort: Pinned first, then by updated_at descending
                repo_items.sort(key=lambda item: (not item.is_pinned, item.updated_at), reverse=False)

                total_lang_units = sum(lang_counts.values()) or 1
                languages = [
                    GitHubLanguageStat(
                        name=k,
                        percentage=round((v / total_lang_units) * 100, 1),
                        color=LANGUAGE_COLORS.get(k, "#8B949E")
                    )
                    for k, v in sorted(lang_counts.items(), key=lambda x: x[1], reverse=True)
                ]
            else:
                logger.warning(f"No repos returned for {target_user}, falling back to defaults")
                fallback = build_fallback_response(target_user)
                repo_items = fallback.repositories
                languages = fallback.languages
                total_stars = fallback.stats.stars

            response_data = GitHubStatsResponse(
                profile=GitHubProfile(
                    name=user_display_name,
                    username=target_user,
                    avatar=avatar_url,
                    followers=followers,
                    public_repos=len(repo_items)
                ),
                stats=GitHubMetrics(
                    stars=total_stars,
                    commits=540
                ),
                languages=languages,
                repositories=repo_items,
                cached=False
            )

            # Store in 10-minute cache
            _CACHE["timestamp"] = current_time
            _CACHE["data"] = response_data
            logger.info(f"Successfully cached GitHub stats for {target_user} ({len(repo_items)} repos)")
            return response_data

    except Exception as e:
        logger.error(f"Error fetching GitHub stats from API: {e}", exc_info=True)
        if _CACHE["data"] is not None:
            logger.info("Serving stale cached GitHub stats on error")
            stale = _CACHE["data"].model_copy()
            stale.cached = True
            return stale
        return build_fallback_response(target_user)
