import { NextResponse } from "next/server";

export const revalidate = 3600;

const GITHUB_USERNAME = "merajsiddieque";
const GITHUB_API = "https://api.github.com";

interface GitHubStarredRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
}

export async function GET() {
  const repositories: GitHubStarredRepository[] = [];
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  try {
    for (let page = 1; ; page += 1) {
      const response = await fetch(
        `${GITHUB_API}/users/${GITHUB_USERNAME}/starred?per_page=100&page=${page}`,
        { headers, next: { revalidate } }
      );

      if (!response.ok) {
        return NextResponse.json(
          { error: "GitHub could not provide starred repositories." },
          { status: response.status }
        );
      }

      const pageRepositories = (await response.json()) as GitHubStarredRepository[];
      repositories.push(...pageRepositories);
      if (pageRepositories.length < 100) break;
    }

    return NextResponse.json(
      repositories.map((repo) => ({
        id: repo.id,
        title: repo.full_name,
        slug: repo.name.toLowerCase(),
        tagline: [repo.language, `${repo.stargazers_count} stars`, `${repo.forks_count} forks`]
          .filter(Boolean)
          .join(" · "),
        description: repo.description || "No description provided.",
        category: repo.language || "Other",
        tech_stack: repo.topics || [],
        github_url: repo.html_url,
        live_url: repo.homepage || undefined,
        featured: false,
        stars: repo.stargazers_count,
      }))
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to fetch starred repositories from GitHub." },
      { status: 502 }
    );
  }
}
