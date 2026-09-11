from typing import Optional
from fastapi import APIRouter, Query
from app.schemas.github import GitHubStatsResponse
from app.services.github_service import get_github_stats

router = APIRouter(prefix="/github-stats", tags=["GitHub Analytics"])

@router.get("", response_model=GitHubStatsResponse)
async def fetch_github_statistics(
    username: Optional[str] = Query(None, description="Optional GitHub username override")
):
    stats = await get_github_stats(username=username)
    return stats
