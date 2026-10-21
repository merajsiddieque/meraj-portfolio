"use client";

import React from "react";
import { motion } from "framer-motion";
import { Project } from "@/types";
import {
  Github,
  ExternalLink,
  Terminal,
  Activity,
  Workflow,
} from "lucide-react";

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
}) => {
  const getProjectIcon = (slug?: string) => {
    if (!slug) return <Terminal className="w-8 h-8 text-electric-400" />;
    if (slug.includes("code-reviewer")) {
      return <Workflow className="w-8 h-8 text-cyan-400" />;
    }
    if (slug.includes("mental-health")) {
      return <Activity className="w-8 h-8 text-violet-400" />;
    }
    return <Terminal className="w-8 h-8 text-electric-400" />;
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.18 }}
      className="rounded-[24px] bg-white dark:bg-[#0D121F]/70 border border-[#E5E7EB] dark:border-white/10 p-6 sm:p-7 shadow-sm hover:shadow-md dark:shadow-none hover:border-[#2563EB] dark:hover:border-electric-500/40 transition-all group flex flex-col justify-between select-none"
    >
      <div>
        {/* Top Banner Graphic with Monogram/Tech Icon */}
        <div className="relative h-44 rounded-2xl bg-[#F8FAFC] dark:bg-gradient-to-br dark:from-surface-100 dark:via-surface-200 dark:to-surface-300 border border-[#E5E7EB] dark:border-white/10 overflow-hidden mb-6 flex items-center justify-center group-hover:border-[#2563EB]/40 transition-all">
          <div className="absolute inset-0 bg-radial-glow opacity-20 dark:opacity-30 pointer-events-none" />
          
          {/* Central tech illustration */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="p-4 rounded-2xl bg-white dark:bg-surface-400/80 border border-[#E5E7EB] dark:border-white/10 shadow-xs group-hover:scale-105 transition-all duration-200">
              {getProjectIcon(project.slug)}
            </div>
            <span className="mt-2 text-[10px] font-mono tracking-widest text-[#64748B] dark:text-slate-400 uppercase font-semibold">
              {project.category}
            </span>
          </div>

          {/* Top badges */}
          <div className="absolute top-3 left-3">
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-800/50">
              {project.category}
            </span>
          </div>

          {(project.stars ?? 0) > 0 && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-amber-50 dark:bg-surface-400/80 border border-amber-200 dark:border-white/10 text-[11px] font-mono text-amber-700 dark:text-amber-300 flex items-center gap-1 font-semibold">
              ★ {project.stars}
            </div>
          )}
        </div>

        {/* Project Titles */}
        <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-electric-400 transition-colors tracking-tight mb-1.5">
          {project.title}
        </h3>

        <p className="text-xs font-semibold text-[#2563EB] dark:text-cyan-300 mb-2.5 line-clamp-1">
          {project.tagline}
        </p>

        <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 leading-relaxed mb-5 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack Pills (Outline style) */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {project.tech_stack.slice(0, 5).map((tech) => (
            <span
              key={tech}
              className="text-[11px] font-mono text-[#334155] dark:text-slate-300 bg-[#F8FAFC] dark:bg-surface-100 px-2.5 py-1 rounded-lg border border-[#E5E7EB] dark:border-white/5"
            >
              {tech}
            </span>
          ))}
          {project.tech_stack.length > 5 && (
            <span className="text-[10px] font-mono text-[#64748B] dark:text-slate-400 px-2 py-1">
              +{project.tech_stack.length - 5}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-[#E5E7EB] dark:border-white/10 flex items-center justify-end gap-2">
        <div className="flex items-center gap-2">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-xl bg-[#F1F5F9] dark:bg-surface-100 hover:bg-[#E2E8F0] dark:hover:bg-surface-50 border border-[#E5E7EB] dark:border-white/10 text-[#64748B] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white transition-colors"
              aria-label="View Source Code"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F1F5F9] dark:bg-surface-100 hover:bg-[#E2E8F0] dark:hover:bg-surface-50 border border-[#E5E7EB] dark:border-white/10 text-[#2563EB] dark:text-cyan-400 hover:text-[#1D4ED8] text-xs font-semibold transition-colors"
            >
              <span>Demo</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};
