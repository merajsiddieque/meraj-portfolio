"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types";
import {
  X,
  Github,
  ExternalLink,
  Layers,
  Cpu,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface CaseStudyModalProps {
  project: Project | null;
  onClose: () => void;
}

export const CaseStudyModal: React.FC<CaseStudyModalProps> = ({
  project,
  onClose,
}) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/40 dark:bg-background/80 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#0D121F] rounded-3xl border border-[#E5E7EB] dark:border-white/15 p-6 sm:p-8 shadow-2xl z-10 select-none"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl bg-[#F1F5F9] dark:bg-surface-200 text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white border border-[#E5E7EB] dark:border-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE] dark:bg-cyan-950/60 dark:text-cyan-400 dark:border-cyan-800/50">
                {project.category}
              </span>
              {(project.stars ?? 0) > 0 && (
                <span className="text-xs text-amber-600 dark:text-amber-400 font-mono flex items-center gap-1 font-semibold">
                  ★ {project.stars} stars
                </span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
              {project.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#2563EB] dark:text-cyan-300 mt-1 font-semibold">
              {project.tagline}
            </p>
          </div>

          {/* Architecture & Deep Dive */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-2 flex items-center gap-1.5 font-semibold">
                <Cpu className="w-4 h-4 text-[#2563EB] dark:text-electric-400" />
                Architectural Breakdown
              </h3>
              <p className="text-xs sm:text-sm text-[#334155] dark:text-slate-300 leading-relaxed bg-[#F8FAFC] dark:bg-surface-200/70 p-4 rounded-2xl border border-[#E5E7EB] dark:border-white/5 font-sans">
                {project.long_description || project.description}
              </p>
            </div>

            {/* Tech Stack */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-2 flex items-center gap-1.5 font-semibold">
                <Layers className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                Technology Stack
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] dark:bg-surface-100 border border-[#E5E7EB] dark:border-white/10 text-[#334155] dark:text-slate-300 text-xs font-mono"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Key Engineering Highlights */}
            <div>
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#64748B] dark:text-slate-400 mb-2 flex items-center gap-1.5 font-semibold">
                <Sparkles className="w-4 h-4 text-[#2563EB] dark:text-cyan-400" />
                Key Achievements
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-[#334155] dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Production-grade modular architecture built for horizontal scalability.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>High-concurrency API integrations with robust fallback resilience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A] dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Comprehensive logging, observability, and containerized Docker workflow.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Action Links */}
          <div className="mt-8 pt-6 border-t border-[#E5E7EB] dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F1F5F9] dark:bg-surface-200 hover:bg-[#E2E8F0] dark:hover:bg-surface-100 text-[#0F172A] dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-white border border-[#E5E7EB] dark:border-white/10 text-xs font-semibold transition-all"
                >
                  <Github className="w-4 h-4" />
                  View GitHub Source
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  <ExternalLink className="w-4 h-4 text-white" />
                  Live Product Demo
                </a>
              )}
            </div>

            <button
              onClick={onClose}
              className="text-xs font-medium text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white px-4 py-2 rounded-xl bg-[#F1F5F9] dark:bg-surface-200/50 border border-[#E5E7EB] dark:border-transparent transition-colors cursor-pointer"
            >
              Close Window
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
