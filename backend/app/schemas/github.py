from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field, model_validator

class PinnedRepo(BaseModel):
    name: str
    description: Optional[str] = ""
    language: Optional[str] = "Python"
    stars: int = 0
    forks: int = 0
    url: str = ""

class GitHubProfile(BaseModel):
    name: str = "Meraj Alam"
    username: str = "merajsiddieque"
    avatar: str = ""
    followers: int = 2
    public_repos: int = 17

class GitHubMetrics(BaseModel):
    stars: int = 10
    commits: int = 540

class GitHubLanguageStat(BaseModel):
    name: str
    percentage: float
    color: str = "#3B82F6"

class GitHubRepositoryItem(BaseModel):
    name: str
    description: Optional[str] = ""
    language: Optional[str] = "Other"
    stars: int = 0
    forks: int = 0
    updated_at: str = ""
    topics: List[str] = Field(default_factory=list)
    is_pinned: bool = False
    html_url: str = ""
    homepage: Optional[str] = ""

class GitHubStatsResponse(BaseModel):
    profile: GitHubProfile = Field(default_factory=GitHubProfile)
    stats: GitHubMetrics = Field(default_factory=GitHubMetrics)
    languages: List[GitHubLanguageStat] = Field(default_factory=list)
    repositories: List[GitHubRepositoryItem] = Field(default_factory=list)

    # Backwards-compatibility fields
    followers: Optional[int] = None
    public_repos: Optional[int] = None
    stars: Optional[int] = None
    total_commits: Optional[int] = None
    top_languages: Optional[List[str]] = None
    recent_repositories: Optional[List[Dict[str, Any]]] = None
    username: Optional[str] = None
    total_repos: Optional[int] = None
    total_stars: Optional[int] = None
    languages_dict: Optional[Dict[str, float]] = None
    recent_commits_count: Optional[int] = None
    pinned_repositories: Optional[List[PinnedRepo]] = None
    cached: bool = False

    @model_validator(mode="after")
    def populate_compat_fields(self):
        if self.followers is None:
            self.followers = self.profile.followers
        if self.public_repos is None:
            self.public_repos = self.profile.public_repos
        if self.total_repos is None:
            self.total_repos = self.profile.public_repos
        if self.username is None:
            self.username = self.profile.username
        if self.stars is None:
            self.stars = self.stats.stars
        if self.total_stars is None:
            self.total_stars = self.stats.stars
        if self.total_commits is None:
            self.total_commits = self.stats.commits
        if self.recent_commits_count is None:
            self.recent_commits_count = self.stats.commits
        if self.top_languages is None:
            self.top_languages = [lang.name for lang in self.languages[:5]]
        if self.languages_dict is None:
            self.languages_dict = {lang.name: lang.percentage for lang in self.languages}
        if self.pinned_repositories is None:
            self.pinned_repositories = [
                PinnedRepo(
                    name=r.name,
                    description=r.description or "",
                    language=r.language or "Other",
                    stars=r.stars,
                    forks=r.forks,
                    url=r.html_url
                )
                for r in self.repositories if r.is_pinned
            ]
        if self.recent_repositories is None:
            self.recent_repositories = [
                {
                    "name": r.name,
                    "description": r.description,
                    "language": r.language,
                    "stars": r.stars,
                    "forks": r.forks,
                    "url": r.html_url,
                    "updated_at": r.updated_at
                }
                for r in self.repositories[:6]
            ]
        return self
