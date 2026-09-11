export interface Project {
  id: number;
  title: string;
  slug?: string;
  tagline?: string;
  description: string;
  long_description?: string;
  category?: string;
  tech_stack: string[];
  github_url?: string;
  live_url?: string;
  demo_video?: string;
  image_url?: string;
  featured: boolean;
  stars?: number;
  order?: number;
  created_at?: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  tags: string[];
  read_time?: string;
  published?: boolean;
  created_at?: string;
}

export interface PinnedRepo {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  url: string;
}

export interface RecentRepo {
  name: string;
  description?: string;
  language?: string;
  stars?: number;
  forks?: number;
  url?: string;
  updated_at?: string;
}

export interface GitHubRepository {
  name: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  updated_at: string;
  topics: string[];
  is_pinned: boolean;
  html_url: string;
  homepage?: string;
}

export interface GitHubLanguage {
  name: string;
  percentage: number;
  color: string;
}

export interface GitHubProfile {
  name: string;
  username: string;
  avatar: string;
  followers: number;
  public_repos: number;
}

export interface GitHubMetrics {
  stars: number;
  commits: number;
}

export interface GitHubStats {
  profile?: GitHubProfile;
  stats?: GitHubMetrics;
  languages?: GitHubLanguage[] | Record<string, number>;
  repositories?: GitHubRepository[];

  // Backwards compatibility fields
  followers?: number;
  public_repos?: number;
  stars?: number;
  total_commits?: number;
  top_languages?: string[];
  recent_repositories?: RecentRepo[];
  username?: string;
  total_repos?: number;
  total_stars?: number;
  languages_dict?: Record<string, number>;
  recent_commits_count?: number;
  pinned_repositories?: PinnedRepo[];
  cached?: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface ChatResponse {
  reply: string;
  response?: string;
  suggested_prompts?: string[];
  mode?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  contact_id?: number;
}
