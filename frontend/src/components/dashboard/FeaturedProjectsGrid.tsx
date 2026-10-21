"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Layers } from "lucide-react";
import { Project } from "@/types";
import { ProjectCard } from "@/components/projects/ProjectCard";

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
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 items-stretch">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
};
