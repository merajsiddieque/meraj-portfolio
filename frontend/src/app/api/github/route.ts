import { NextResponse } from "next/server";
import { GitHubStats, GitHubRepository, GitHubLanguage } from "@/types";

export const revalidate = 300; // Cache for 5 minutes

const LANGUAGE_COLORS: Record<string, string> = {
  Python: "#3572A5",
  JavaScript: "#F7DF1E",
  TypeScript: "#3178C6",
  Java: "#B07219",
  "C++": "#F34B7D",
  C: "#555555",
  "Jupyter Notebook": "#DA5B0B",
  HTML: "#E34C26",
  CSS: "#563D7C",
  Shell: "#89E051",
  Go: "#00ADD8",
  Rust: "#DEA584",
  Kotlin: "#A97BFF",
  Other: "#8B949E",
};

const DEFAULT_PINNED = [
  "agentic-code-reviewer",
  "Mental-Health-Chatbot",
  "Task-Collaboration-Platform",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const targetUser = searchParams.get("username") || process.env.GITHUB_USERNAME || "merajsiddieque";

  const token = (process.env.GITHUB_TOKEN || process.env.NEXT_PUBLIC_GITHUB_TOKEN || "").trim();

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "Meraj-Portfolio-NextJS",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    // 1. Fetch user profile
    const userRes = await fetch(`https://api.github.com/users/${targetUser}`, {
      headers,
      next: { revalidate: 300 },
    });

    if (!userRes.ok) {
      console.warn(`GitHub user API returned ${userRes.status}.`);
    }

    const userData = userRes.ok ? await userRes.json() : null;

    // 2. Fetch pinned repos from GitHub public profile page HTML
    let pinnedNames = new Set<string>(DEFAULT_PINNED);
    try {
      const profileHtmlRes = await fetch(`https://github.com/${targetUser}`, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)" },
        next: { revalidate: 600 },
      });
      if (profileHtmlRes.ok) {
        const html = await profileHtmlRes.text();
        const matches = [...html.matchAll(/<span class="repo"[^>]*>([^<]+)<\/span>/g)];
        if (matches.length > 0) {
          pinnedNames = new Set(matches.map((m) => m[1].trim()));
        }
      }
    } catch {
      // Keep default pinned
    }

    // 3. Fetch all public repositories (strictly type=public)
    const reposRes = await fetch(
      `https://api.github.com/users/${targetUser}/repos?type=public&per_page=100&sort=updated`,
      {
        headers,
        next: { revalidate: 300 },
      }
    );

    const rawRepos = reposRes.ok ? await reposRes.json() : [];

    // Filter strictly for public repositories
    const publicReposList = Array.isArray(rawRepos)
      ? rawRepos.filter((r: any) => !r.private && !r.is_template_private)
      : [];

    let totalStars = 0;
    const langCounts: Record<string, number> = {};

    const repositories: GitHubRepository[] = publicReposList.map((r: any) => {
      const stars = Number(r.stargazers_count || 0);
      totalStars += stars;

      const lang = r.language || "Other";
      if (lang && lang !== "Other") {
        langCounts[lang] = (langCounts[lang] || 0) + 1;
      }

      return {
        name: r.name || "",
        description: r.description || "",
        language: lang,
        stars,
        forks: Number(r.forks_count || 0),
        updated_at: r.updated_at || new Date().toISOString(),
        topics: Array.isArray(r.topics) ? r.topics : [],
        is_pinned: pinnedNames.has(r.name),
        html_url: r.html_url || `https://github.com/${targetUser}/${r.name}`,
        homepage: r.homepage || "",
      };
    });

    // Sort: Pinned first, then updated_at descending
    repositories.sort((a, b) => {
      if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    // Compute language percentages
    const totalLangCount = Object.values(langCounts).reduce((a, b) => a + b, 0) || 1;
    const languages: GitHubLanguage[] = Object.entries(langCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        percentage: Math.round((count / totalLangCount) * 1000) / 10,
        color: LANGUAGE_COLORS[name] || "#8B949E",
      }));

    // Actual live public repos count:
    // If publicReposList is populated, use its length; otherwise use userData.public_repos
    const publicRepoCount =
      publicReposList.length > 0
        ? publicReposList.length
        : Number(userData?.public_repos || 17);

    const statsResponse: GitHubStats = {
      profile: {
        name: userData?.name || "Meraj Alam",
        username: targetUser,
        avatar: userData?.avatar_url || "https://avatars.githubusercontent.com/u/156106853?v=4",
        followers: Number(userData?.followers || 2),
        public_repos: publicRepoCount,
      },
      stats: {
        stars: totalStars || 10,
        commits: 540,
      },
      languages,
      repositories,
      // Backwards compatibility
      public_repos: publicRepoCount,
      stars: totalStars || 10,
      total_commits: 540,
    };

    return NextResponse.json(statsResponse);
  } catch (error) {
    console.error("Error fetching live GitHub statistics:", error);
    return NextResponse.json(
      {
        profile: {
          name: "Meraj Alam",
          username: targetUser,
          avatar: "https://avatars.githubusercontent.com/u/156106853?v=4",
          followers: 2,
          public_repos: 17,
        },
        stats: { stars: 10, commits: 540 },
        languages: [],
        repositories: [],
        public_repos: 17,
      },
      { status: 200 }
    );
  }
}
