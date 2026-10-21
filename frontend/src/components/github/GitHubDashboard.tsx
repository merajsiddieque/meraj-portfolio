"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Users,
  FolderGit2,
  Star,
  GitFork,
  GitCommit,
  ExternalLink,
  Search,
  Filter,
  Pin,
  Calendar,
  Globe,
  ArrowUpDown,
  RefreshCw,
  Code2,
} from "lucide-react";
import { getGithubStats } from "@/lib/api";
import { GitHubStats, GitHubRepository, GitHubLanguage } from "@/types";
import { PERSONAL_INFO } from "@/lib/constants";

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

export const GitHubDashboard: React.FC = () => {
  const [stats, setStats] = useState<GitHubStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"pinned" | "updated" | "stars" | "name">("pinned");

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getGithubStats();
      if (data) setStats(data);
    } catch (err) {
      console.error("Error loading GitHub stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const profile = stats?.profile || {
    name: "Meraj Alam",
    username: "merajsiddieque",
    avatar: "https://avatars.githubusercontent.com/u/156106853?v=4",
    followers: 2,
    public_repos: 17,
  };

  const metrics = stats?.stats || {
    stars: stats?.stars || 10,
    commits: stats?.total_commits || 540,
  };

  const allRepositories: GitHubRepository[] = useMemo(() => {
    return stats?.repositories || [];
  }, [stats]);

  // Extract unique languages for filter tabs
  const availableLanguages = useMemo(() => {
    const langs = new Set<string>();
    allRepositories.forEach((r) => {
      if (r.language && r.language !== "Other") langs.add(r.language);
    });
    return ["All", ...Array.from(langs).sort()];
  }, [allRepositories]);

  // Language distribution stats
  const languagesList: GitHubLanguage[] = useMemo(() => {
    if (Array.isArray(stats?.languages) && stats.languages.length > 0) {
      return stats.languages as GitHubLanguage[];
    }
    // Calculate on the fly if needed
    const counts: Record<string, number> = {};
    allRepositories.forEach((r) => {
      const l = r.language || "Other";
      counts[l] = (counts[l] || 0) + 1;
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        percentage: Number(((count / total) * 100).toFixed(1)),
        color: LANGUAGE_COLORS[name] || "#8B949E",
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [stats, allRepositories]);

  // Filter and Sort repositories client-side
  const filteredRepositories = useMemo(() => {
    let list = [...allRepositories];

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q) ||
          r.topics.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Filter by language
    if (selectedLanguage !== "All") {
      list = list.filter((r) => r.language === selectedLanguage);
    }

    // Sort
    list.sort((a, b) => {
      if (sortBy === "pinned") {
        if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      if (sortBy === "updated") {
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
      if (sortBy === "stars") {
        return b.stars - a.stars;
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    return list;
  }, [allRepositories, searchQuery, selectedLanguage, sortBy]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Recent";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return "Recent";
    }
  };

  return (
    <div className="space-y-8 select-none">
      {/* 1. Profile Header */}
      <section className="w-full bg-white dark:bg-[#1A212B]/70 border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-none relative overflow-hidden transition-colors">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          {/* Avatar & User Details */}
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-[#E5E7EB] dark:border-white/10 shadow-sm shrink-0 bg-[#F1F5F9] dark:bg-[#090D15]">
              <Image
                src={profile.avatar || "https://avatars.githubusercontent.com/u/156106853?v=4"}
                alt={profile.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 64px, 80px"
                priority
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                  {profile.name}
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-50 text-[#426B96] border border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 font-medium">
                  Public Profile
                </span>
              </div>
              <a
                href={`https://github.com/${profile.username}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-mono text-[#64748B] hover:text-[#426B96] dark:text-slate-400 dark:hover:text-blue-400 transition-colors mt-0.5"
              >
                @{profile.username}
              </a>
              <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1.5 font-medium">
                AI Engineer • Full-stack Open Source Contributor
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] border border-[#E5E7EB] text-[#64748B] hover:text-[#0F172A] dark:bg-white/[0.03] dark:hover:bg-white/[0.06] dark:border-white/10 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
              title="Refresh GitHub data"
              aria-label="Refresh GitHub data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#426B96] dark:text-blue-400" : ""}`} />
            </button>

            <a
              href={`https://github.com/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#426B96] hover:bg-[#355A81] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors active:scale-95"
            >
              <Github className="w-4 h-4 text-white" />
              <span className="text-white">GitHub Profile</span>
              <ExternalLink className="w-3.5 h-3.5 text-white" />
            </a>
          </div>
        </div>
      </section>

      {/* 2. Compact Horizontal KPI Stats Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Repositories */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A212B]/70 border border-[#E5E7EB] dark:border-white/[0.08] shadow-sm dark:shadow-none flex items-center justify-between transition-colors">
          <div>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-slate-400 uppercase tracking-wider">
              Repositories
            </span>
            <p className="text-2xl font-bold text-[#0F172A] dark:text-white mt-1">
              {allRepositories.length || profile.public_repos}
            </p>
          </div>
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-600/10 border border-blue-100 dark:border-blue-500/20 text-[#426B96] dark:text-blue-400">
            <FolderGit2 className="w-5 h-5" />
          </div>
        </div>

        {/* Stars */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A212B]/70 border border-[#E5E7EB] dark:border-white/[0.08] shadow-sm dark:shadow-none flex items-center justify-between transition-colors">
          <div>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-slate-400 uppercase tracking-wider">
              Total Stars
            </span>
            <p className="text-2xl font-bold text-[#0F172A] dark:text-white mt-1">{metrics.stars}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-amber-500 dark:text-amber-400">
            <Star className="w-5 h-5" />
          </div>
        </div>

        {/* Followers */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A212B]/70 border border-[#E5E7EB] dark:border-white/[0.08] shadow-sm dark:shadow-none flex items-center justify-between transition-colors">
          <div>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-slate-400 uppercase tracking-wider">
              Followers
            </span>
            <p className="text-2xl font-bold text-[#0F172A] dark:text-white mt-1">{profile.followers}</p>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-cyan-600/10 border border-[#E5E7EB] dark:border-cyan-500/20 text-[#64748B] dark:text-cyan-400">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Commit Activity */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#1A212B]/70 border border-[#E5E7EB] dark:border-white/[0.08] shadow-sm dark:shadow-none flex items-center justify-between transition-colors">
          <div>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-slate-400 uppercase tracking-wider">
              Commit Activity
            </span>
            <p className="text-2xl font-bold text-[#16A34A] dark:text-emerald-400 mt-1">{metrics.commits}+</p>
          </div>
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-[#16A34A] dark:text-emerald-400">
            <GitCommit className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* 3. Language Distribution (Clean Horizontal Progress Bars - Minimal Editorial) */}
      <section className="w-full bg-white dark:bg-[#1A212B]/70 border border-[#E5E7EB] dark:border-white/[0.08] rounded-2xl p-6 space-y-4 shadow-sm dark:shadow-none transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-[#426B96] dark:text-blue-400" />
            <h3 className="text-sm font-bold text-[#0F172A] dark:text-white tracking-tight">Language Distribution</h3>
          </div>
          <span className="text-[11px] font-mono text-[#64748B] dark:text-slate-400">Across all public repos</span>
        </div>

        {/* Segmented Horizontal Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#F1F5F9] dark:bg-white/[0.03] border border-[#E5E7EB] dark:border-white/[0.06] p-[1px]">
          {languagesList.map((lang) => (
            <div
              key={lang.name}
              className="h-full transition-all duration-500"
              style={{
                width: `${lang.percentage}%`,
                backgroundColor: lang.color,
              }}
              title={`${lang.name}: ${lang.percentage}%`}
            />
          ))}
        </div>

        {/* Horizontal List of Language Badges */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1">
          {languagesList.map((lang) => (
            <div key={lang.name} className="flex items-center gap-2 text-xs font-mono">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: lang.color }}
              />
              <span className="text-[#0F172A] dark:text-slate-200 font-medium">{lang.name}</span>
              <span className="text-[#64748B] dark:text-slate-500 text-[11px]">{lang.percentage}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Repository Explorer (Header, Search & Filters, and 3-Column Cards Grid) */}
      <section className="space-y-5">
        {/* Header & Controls Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">Repository Explorer</h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-[#F1F5F9] dark:bg-white/[0.04] text-[#64748B] dark:text-slate-300 border border-[#E5E7EB] dark:border-white/10">
                {filteredRepositories.length} {filteredRepositories.length === 1 ? "repo" : "repos"}
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-slate-400 mt-0.5">
              Live index of all public projects and open source software.
            </p>
          </div>

          {/* Search Input & Sort Selector */}
          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] dark:text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search repos, topics..."
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#F1F5F9] dark:bg-white/[0.03] border border-[#E5E7EB] dark:border-white/[0.08] focus:border-[#426B96] dark:focus:border-blue-500/40 text-xs text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-slate-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#0F172A] dark:text-slate-500 dark:hover:text-white text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 h-9 px-2.5 rounded-xl bg-[#F1F5F9] dark:bg-white/[0.03] border border-[#E5E7EB] dark:border-white/[0.08] text-xs text-[#0F172A] dark:text-slate-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#94A3B8] dark:text-slate-400 shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-[#0F172A] dark:text-slate-200 focus:outline-none cursor-pointer pr-1"
              >
                <option value="pinned" className="bg-white text-[#0F172A] dark:bg-[#0B0F17] dark:text-slate-200">
                  Pinned First
                </option>
                <option value="updated" className="bg-white text-[#0F172A] dark:bg-[#0B0F17] dark:text-slate-200">
                  Recently Updated
                </option>
                <option value="stars" className="bg-white text-[#0F172A] dark:bg-[#0B0F17] dark:text-slate-200">
                  Most Stars
                </option>
                <option value="name" className="bg-white text-[#0F172A] dark:bg-[#0B0F17] dark:text-slate-200">
                  Name (A-Z)
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Language Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-mono text-[#64748B] dark:text-slate-500 uppercase mr-1 shrink-0">
            Filter:
          </span>
          {availableLanguages.map((lang) => {
            const active = selectedLanguage === lang;
            const langColor = lang === "All" ? "#426B96" : LANGUAGE_COLORS[lang] || "#8B949E";
            return (
              <button
                key={lang}
                onClick={() => setSelectedLanguage(lang)}
                className={`px-3 py-1 rounded-full text-xs font-mono transition-all shrink-0 cursor-pointer ${
                  active
                    ? "bg-[#F1F5F8] text-[#426B96] border border-[#E2EAF1] font-semibold dark:bg-blue-600/20 dark:text-white dark:border-blue-500/40"
                    : "bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] hover:bg-[#E2E8F0] border border-[#E5E7EB] dark:bg-white/[0.02] dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/[0.05] dark:border-white/[0.06]"
                }`}
              >
                {lang !== "All" && (
                  <span
                    className="inline-block w-2 h-2 rounded-full mr-1.5"
                    style={{ backgroundColor: langColor }}
                  />
                )}
                <span>{lang}</span>
              </button>
            );
          })}
        </div>

        {/* 3-Column Responsive Repository Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          <AnimatePresence>
            {filteredRepositories.map((repo) => {
              const langColor = LANGUAGE_COLORS[repo.language] || LANGUAGE_COLORS.Other;
              return (
                <motion.div
                  key={repo.name}
                  layout
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.18 }}
                  className="bg-white dark:bg-[#1A212B]/80 border border-[#E5E7EB] dark:border-white/[0.08] hover:border-[#426B96] dark:hover:border-blue-500/30 rounded-2xl p-5 flex flex-col justify-between transition-all duration-180 shadow-sm hover:shadow-md dark:shadow-none group select-none"
                >
                  <div>
                    {/* Top Row: Icon & Pinned Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-[#F8FAFC] dark:bg-white/[0.03] border border-[#E5E7EB] dark:border-white/[0.08] flex items-center justify-center text-[#426B96] dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-600/10 group-hover:border-blue-200 dark:group-hover:border-blue-500/20 transition-colors">
                          <FolderGit2 className="w-4 h-4" />
                        </div>
                        {repo.is_pinned && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-medium font-mono">
                            <Pin className="w-2.5 h-2.5 rotate-45" />
                            Pinned
                          </span>
                        )}
                      </div>

                      {/* Stars & Forks Counter */}
                      <div className="flex items-center gap-3 text-[#64748B] dark:text-slate-400 text-xs font-mono">
                        <span className="flex items-center gap-1" title={`${repo.stars} Stars`}>
                          <Star className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-amber-400/20" />
                          <span>{repo.stars}</span>
                        </span>
                        <span className="flex items-center gap-1" title={`${repo.forks} Forks`}>
                          <GitFork className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />
                          <span>{repo.forks}</span>
                        </span>
                      </div>
                    </div>

                    {/* Repository Name */}
                    <h3 className="text-base font-bold text-[#0F172A] dark:text-white tracking-tight group-hover:text-[#426B96] dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                      {repo.name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-[#64748B] dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2 min-h-[36px]">
                      {repo.description || "Public software repository maintained by Meraj Alam."}
                    </p>

                    {/* Topics / Tech Badges (Outline style) */}
                    {repo.topics && repo.topics.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {repo.topics.slice(0, 3).map((topic) => (
                          <span
                            key={topic}
                            className="px-2 py-0.5 rounded-md bg-[#F8FAFC] dark:bg-white/[0.03] border border-[#E5E7EB] dark:border-white/[0.06] text-[#475569] dark:text-slate-400 text-[10px] font-mono"
                          >
                            {topic}
                          </span>
                        ))}
                        {repo.topics.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-[#64748B] dark:text-slate-500">
                            +{repo.topics.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Language & Updated Date */}
                    <div className="flex items-center gap-3 mt-4 text-[11px] font-mono text-[#64748B] dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: langColor }}
                        />
                        <span className="text-[#0F172A] dark:text-slate-300 font-medium">{repo.language || "Code"}</span>
                      </div>
                      <span className="text-[#CBD5E1] dark:text-slate-600">•</span>
                      <div className="flex items-center gap-1 text-[#64748B] dark:text-slate-500 truncate">
                        <Calendar className="w-3 h-3 shrink-0" />
                        <span className="truncate">{formatDate(repo.updated_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E5E7EB] dark:border-white/[0.06]">
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] dark:text-slate-200 text-xs font-medium border border-[#E5E7EB] dark:border-white/10 transition-colors"
                    >
                      <Github className="w-3.5 h-3.5" />
                      <span>View on GitHub</span>
                    </a>

                    {repo.homepage && (
                      <a
                        href={repo.homepage}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#426B96] hover:text-[#355A81] dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Live Demo</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredRepositories.length === 0 && (
          <div className="py-16 text-center rounded-2xl bg-white dark:bg-[#1A212B]/40 border border-[#E5E7EB] dark:border-white/[0.06] shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.03] border border-[#E5E7EB] dark:border-white/10 flex items-center justify-center text-[#64748B] dark:text-slate-500 mx-auto">
              <FolderGit2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-[#0F172A] dark:text-white">No repositories found</h4>
            <p className="text-xs text-[#64748B] dark:text-slate-400 max-w-sm mx-auto">
              No repositories match your current search query or language filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedLanguage("All");
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#F1F5F8] text-[#426B96] border border-[#E2EAF1] text-xs font-semibold hover:bg-blue-100 dark:bg-blue-600/20 dark:text-blue-400 dark:border-blue-500/30 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
