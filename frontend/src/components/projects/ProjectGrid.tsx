"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { Github, Layers, FolderGit2, ArrowRight } from "lucide-react";

export const ProjectGrid: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/starred-repositories");
        if (!response.ok) throw new Error("GitHub repositories are temporarily unavailable.");
        setProjects(await response.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load starred repositories.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ["All", ...Array.from(new Set(projects.map((project) => project.category || "Other"))).sort()];

  const filteredProjects = projects.filter((p) => {
    if (selectedCategory === "All") return true;
    return (p.category || "Other") === selectedCategory;
  });

  return (
    <section id="projects" className="py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-[#426B96] dark:text-blue-400 text-xs font-mono font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            <span>Synced from GitHub starred repositories</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            GitHub <span className="gradient-text-electric">Starred Projects</span>
          </h2>
          <p className="mt-3 text-[#64748B] dark:text-slate-400 text-xs sm:text-sm sm:leading-relaxed">
            Every repository you have starred on GitHub, fetched automatically and grouped by language.
          </p>
        </div>

        {categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all border cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#426B96] text-white border-[#426B96] shadow-sm"
                    : "bg-white dark:bg-surface-200/70 text-[#64748B] dark:text-slate-400 border-[#E5E7EB] dark:border-white/10 hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F8FAFC] shadow-2xs dark:shadow-none"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <p className="text-center text-sm text-[#64748B] dark:text-slate-400">
            Loading starred repositories from GitHub…
          </p>
        )}
        {!loading && error && (
          <p role="alert" className="text-center text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        {!loading && !error && projects.length === 0 && (
          <p className="text-center text-sm text-[#64748B] dark:text-slate-400">
            No public starred repositories found.
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
            />
          ))}
        </div>

        {/* GitHub profile link */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#1A212B]/80 border border-[#E5E7EB] dark:border-white/[0.08] backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-xl transition-colors">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-[#426B96] dark:text-blue-400 text-xs font-mono mb-1 font-medium">
              <Github className="w-3.5 h-3.5" />
              <span>{projects.length} Starred Repositories</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">
              Want to explore more on GitHub?
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-xl leading-relaxed">
              This list refreshes from GitHub automatically. Open the profile to browse repositories and activity.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <Link
              href="https://github.com/merajsiddieque?tab=stars"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#426B96] hover:bg-[#355A81] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all active:scale-95"
            >
              <FolderGit2 className="w-4 h-4 text-white" />
              <span className="text-white">Explore GitHub Stars</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
            <a
              href="https://github.com/merajsiddieque"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-[#E5E7EB] dark:border-white/10 text-[#0F172A] dark:text-slate-300 hover:text-[#426B96] dark:hover:text-white text-xs sm:text-sm font-semibold shadow-2xs dark:shadow-none transition-all active:scale-95"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Profile</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
