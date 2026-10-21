"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Github, Layers } from "lucide-react";
import { Project } from "@/types";

const RepositoryCard: React.FC<{ project: Project }> = ({ project }) => (
  <article className="w-full min-w-0 overflow-hidden rounded-[24px] p-5 sm:p-6 flex flex-col bg-white dark:bg-[#0D121F]/70 border border-[#E5E7EB] dark:border-white/[0.08] shadow-sm hover:border-[#2563EB] dark:hover:border-white/20 transition-colors">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-300">
          {project.category || "Other"}
        </span>
        <span className="ml-auto text-[10px] font-mono text-amber-600 dark:text-amber-300">★ {project.stars ?? 0}</span>
      </div>

      <h3 className="min-w-0 break-words [overflow-wrap:anywhere] line-clamp-2 text-lg font-bold tracking-tight text-[#0F172A] dark:text-white">
        {project.title}
      </h3>
      <p className="break-words [overflow-wrap:anywhere] mt-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300 line-clamp-2">
        {project.tagline}
      </p>

      <div className="mt-3">
        <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 leading-relaxed line-clamp-3">
          {project.description}
        </p>
        {project.live_url && (
          <a
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex max-w-full items-center gap-1.5 break-all text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-200"
          >
            <span>Live demo</span>
            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
          </a>
        )}
      </div>

      {project.tech_stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-4">
          {project.tech_stack.slice(0, 4).map((topic) => (
            <span key={topic} className="max-w-full break-words rounded-md border border-[#E5E7EB] dark:border-white/[0.06] bg-[#F8FAFC] dark:bg-white/[0.03] px-2 py-0.5 text-[10px] font-mono text-[#334155] dark:text-slate-300">
              {topic}
            </span>
          ))}
        </div>
      )}
    </div>

    <a
      href={project.github_url}
      target="_blank"
      rel="noreferrer"
      className="mt-5 inline-flex w-full items-center gap-2 border-t border-[#E5E7EB] dark:border-white/[0.06] pt-3 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white"
    >
      <Github className="h-4 w-4" />
      <span>View repository</span>
      <ExternalLink className="h-3 w-3" />
    </a>
  </article>
);

export const FeaturedProjectsGrid: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStarredRepositories() {
      try {
        const response = await fetch("/api/starred-repositories");
        if (!response.ok) throw new Error("GitHub starred repositories are temporarily unavailable.");
        setProjects(await response.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not load GitHub starred repositories.");
      } finally {
        setLoading(false);
      }
    }

    loadStarredRepositories();
  }, []);

  return (
    <section className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#E5E7EB] dark:border-white/[0.06]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-[#2563EB] dark:text-blue-400">
            <Layers className="w-3.5 h-3.5" />
            <span>{projects.length} GitHub starred repositories</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
            Starred Projects
          </h2>
        </div>

        <Link
          href="/projects"
          className="text-xs font-medium text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-1 group"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {loading && (
        <p className="py-8 text-center text-sm text-[#64748B] dark:text-slate-400">
          Loading starred repositories from GitHub…
        </p>
      )}
      {!loading && error && (
        <p role="alert" className="py-8 text-center text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      {!loading && !error && projects.length === 0 && (
        <p className="py-8 text-center text-sm text-[#64748B] dark:text-slate-400">
          No public starred repositories found.
        </p>
      )}

      {!loading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
          <div className="min-w-0">
            <RepositoryCard project={projects[0]} />
          </div>
          {projects.length > 1 && (
            <div className="min-w-0 lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
              {projects.slice(1).map((project) => (
                <RepositoryCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
