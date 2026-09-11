"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Github,
  Workflow,
  Activity,
  Lock,
  CheckSquare,
  BarChart3,
  Bot,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Project } from "@/types";
import { CaseStudyModal } from "@/components/projects/CaseStudyModal";

// The 5 curated projects
const FLAGSHIP_PROJECT: Project = {
  id: 1,
  title: "Agentic Code Reviewer",
  slug: "agentic-code-reviewer",
  tagline: "AI-powered multi-language PR review using LangGraph, FastAPI & Gemini.",
  description: "Autonomous multi-agent code review pipeline combining deterministic AST parsing with Gemini LLM reasoning for security audits, bug detection, and automated refactoring.",
  category: "Production AI",
  tech_stack: ["LangGraph", "FastAPI", "React", "Docker"],
  github_url: "https://github.com/merajsiddieque/agentic-code-reviewer",
  live_url: "https://agentic-code-reviewer-f9cn.onrender.com/",
  featured: true,
  order: 1,
};

const ROTATING_PAGES: Project[][] = [
  // Page 1 (1 / 2)
  [
    {
      id: 2,
      title: "AI Mental Health Chatbot",
      slug: "ai-mental-health-chatbot",
      tagline: "Empathetic companion pairing OpenAI dialogue with real-time sign recognition.",
      description: "Conversational assistant with evidence-based CBT dialogue and MediaPipe computer vision for real-time sign-language gesture translation.",
      category: "Conversational AI",
      tech_stack: ["React", "Node.js", "OpenAI", "MediaPipe"],
      github_url: "https://github.com/merajsiddieque/Mental-Health-Chatbot",
      live_url: "https://mental-health-chatbot-cncd.onrender.com/login",
      featured: true,
      order: 2,
    },
    {
      id: 3,
      title: "SecureChat Platform",
      slug: "secure-chat",
      tagline: "Real-time messaging with client-side AES-GCM & SHA-512 encryption.",
      description: "End-to-end encrypted messaging application built with Web Crypto API and Firebase Firestore for zero-knowledge server storage.",
      category: "Full Stack Security",
      tech_stack: ["React", "Firebase", "Web Crypto", "AES-GCM"],
      github_url: "https://github.com/merajsiddieque/SecureChat",
      live_url: "https://securechat-df1m.onrender.com/",
      featured: true,
      order: 3,
    },
  ],
  // Page 2 (2 / 2)
  [
    {
      id: 4,
      title: "Serverless Todo App",
      slug: "serverless-todo-app",
      tagline: "Cloud-native task orchestration with serverless real-time sync.",
      description: "Fast, optimistic task execution workspace backed by Google Firebase with instant offline state syncing and sub-millisecond response.",
      category: "Cloud Native",
      tech_stack: ["React", "Firebase", "Serverless", "PWA"],
      github_url: "https://github.com/merajsiddieque/Serverless-Todo-App",
      live_url: "https://mern-e7943.web.app/",
      featured: true,
      order: 4,
    },
    {
      id: 5,
      title: "Amazon & WhatsApp NLP Analysis",
      slug: "amazon-review-whatsapp-chat-analysis",
      tagline: "Exploratory NLP sentiment and behavioral pattern intelligence pipeline.",
      description: "Exploratory data analysis and NLP modeling pipeline on Amazon product reviews and WhatsApp chats to surface customer sentiment and engagement patterns.",
      category: "Data & Analytics",
      tech_stack: ["Python", "Pandas", "NLTK", "Scikit-Learn"],
      github_url: "https://github.com/merajsiddieque/Amazon_Review_n_WhatsApp_Chat_Analysis",
      live_url: "",
      featured: true,
      order: 5,
    },
  ],
];

// Minimal aesthetic SVG thumbnails inspired by Linear / Vercel
const ProjectThumbnail: React.FC<{ slug?: string; isFlagship?: boolean }> = ({ slug = "", isFlagship }) => {
  if (slug.includes("code-reviewer")) {
    return (
      <div className="w-full h-32 rounded-2xl bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E5E7EB] dark:border-white/[0.06] relative overflow-hidden flex items-center justify-center transition-colors">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(37,99,235,0.08),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.12),transparent_70%)]" />
        {/* Graph representation */}
        <div className="relative z-10 flex items-center gap-2 font-mono text-[10px] text-slate-500 dark:text-slate-400">
          <div className="px-2 py-1 rounded-md bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-300 font-semibold flex items-center gap-1 shadow-xs">
            <Workflow className="w-3 h-3 text-blue-600 dark:text-blue-400" />
            <span>AST</span>
          </div>
          <div className="w-4 h-px bg-slate-300 dark:bg-white/20" />
          <div className="px-2 py-1 rounded-md bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold flex items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />
            <span>Scan</span>
          </div>
          <div className="w-4 h-px bg-slate-300 dark:bg-white/20" />
          <div className="px-2 py-1 rounded-md bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-700 dark:text-violet-300 font-semibold flex items-center gap-1 shadow-xs">
            <Bot className="w-3 h-3 text-violet-600 dark:text-violet-400" />
            <span>Diff</span>
          </div>
        </div>
      </div>
    );
  }

  if (slug.includes("mental-health")) {
    return (
      <div className="w-full h-32 rounded-2xl bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E5E7EB] dark:border-white/[0.06] relative overflow-hidden flex items-center justify-center transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.08),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.1),transparent_70%)]" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 flex items-center justify-center text-violet-600 dark:text-violet-400 shadow-xs">
            <Activity className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-1">
            <div className="w-16 h-1.5 rounded-full bg-violet-400/40" />
            <div className="w-10 h-1.5 rounded-full bg-violet-400/20" />
          </div>
        </div>
      </div>
    );
  }

  if (slug.includes("secure-chat")) {
    return (
      <div className="w-full h-32 rounded-2xl bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E5E7EB] dark:border-white/[0.06] relative overflow-hidden flex items-center justify-center transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.08),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
        <div className="relative z-10 flex items-center gap-3 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
            <Lock className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-semibold text-[#0F172A] dark:text-slate-300">AES-256-GCM</span>
            <span className="text-[10px] text-[#64748B] dark:text-slate-500">SHA-512 Key Derivation</span>
          </div>
        </div>
      </div>
    );
  }

  if (slug.includes("todo")) {
    return (
      <div className="w-full h-32 rounded-2xl bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E5E7EB] dark:border-white/[0.06] relative overflow-hidden flex items-center justify-center transition-colors">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.08),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(245,158,11,0.1),transparent_70%)]" />
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-xs">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="w-20 h-1.5 rounded-full bg-amber-400/50" />
            <div className="w-14 h-1.5 rounded-full bg-amber-400/25" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-32 rounded-2xl bg-[#F8FAFC] dark:bg-[#090D16] border border-[#E5E7EB] dark:border-white/[0.06] relative overflow-hidden flex items-center justify-center transition-colors">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_70%)] dark:bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)]" />
      <div className="relative z-10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-xs">
          <BarChart3 className="w-4 h-4" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="w-16 h-1.5 rounded-full bg-blue-400/50" />
          <div className="w-10 h-1.5 rounded-full bg-blue-400/25" />
        </div>
      </div>
    </div>
  );
};

export const FeaturedProjectsGrid: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [slideDirection, setSlideDirection] = useState<number>(1);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const totalPages = ROTATING_PAGES.length;

  const handlePrev = () => {
    if (currentPage > 1) {
      setSlideDirection(-1);
      setCurrentPage((p) => p - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setSlideDirection(1);
      setCurrentPage((p) => p + 1);
    }
  };

  const currentRotatingProjects = ROTATING_PAGES[currentPage - 1];

  const slideVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 30 : -30,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "tween" as const, ease: "easeInOut", duration: 0.35 },
        opacity: { duration: 0.25 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -30 : 30,
      opacity: 0,
      transition: {
        x: { type: "tween" as const, ease: "easeInOut", duration: 0.35 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const renderCard = (project: Project, isFlagship = false) => {
    return (
      <motion.div
        key={project.id}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.2 }}
        className={`rounded-[24px] p-5 flex flex-col justify-between h-full bg-white dark:bg-[#0D121F]/70 border border-[#E5E7EB] dark:border-white/[0.08] hover:border-[#2563EB] dark:hover:border-white/20 shadow-sm hover:shadow-md dark:shadow-none transition-all duration-200 group relative select-none ${
          isFlagship ? "ring-1 ring-[#2563EB]/20 dark:ring-blue-500/20" : ""
        }`}
      >
        <div>
          {/* 1. Project Thumbnail */}
          <div className="relative mb-4">
            <ProjectThumbnail slug={project.slug} isFlagship={isFlagship} />
            {/* Status badge in top-right */}
            <div className="absolute top-2.5 right-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/90 dark:bg-[#090D16]/90 border border-[#E5E7EB] dark:border-white/10 text-[#0F172A] dark:text-slate-300 shadow-xs">
                {isFlagship ? "Flagship · Live" : project.category}
              </span>
            </div>
          </div>

          {/* 2. Project Title */}
          <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white tracking-tight group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors line-clamp-1">
            {project.title}
          </h3>

          {/* 3. Value proposition */}
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2 min-h-[40px] font-sans">
            {project.tagline || project.description}
          </p>

          {/* 4. Tech badges (Outline style) */}
          <div className="flex flex-wrap gap-1.5 mt-3.5">
            {(project.tech_stack || []).slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 rounded-md bg-[#F8FAFC] dark:bg-white/[0.03] border border-[#E5E7EB] dark:border-white/[0.06] text-[10px] font-mono text-[#334155] dark:text-slate-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* 5. Bottom Actions: GitHub, Live Demo, Case Study Primary CTA */}
        <div className="pt-4 mt-4 border-t border-[#E5E7EB] dark:border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-[#F1F5F9] dark:bg-white/[0.03] hover:bg-[#E2E8F0] dark:hover:bg-white/[0.08] text-[#64748B] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white border border-[#E5E7EB] dark:border-white/[0.08] transition-colors"
                title="View GitHub Repository"
                aria-label={`${project.title} GitHub repository`}
              >
                <Github className="w-3.5 h-3.5" />
              </a>
            )}

            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 rounded-lg bg-[#F1F5F9] dark:bg-white/[0.03] hover:bg-[#E2E8F0] dark:hover:bg-white/[0.08] text-[#64748B] dark:text-slate-400 hover:text-[#2563EB] dark:hover:text-blue-400 border border-[#E5E7EB] dark:border-white/[0.08] transition-colors"
                title="Open Live Deployment"
                aria-label={`${project.title} Live deployment`}
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          <button
            onClick={() => setSelectedProject(project)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <span>Case Study</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 text-white" />
          </button>
        </div>
      </motion.div>
    );
  };

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-2 border-b border-[#E5E7EB] dark:border-white/[0.06]">
        {/* Left Column: Title & Subtitle */}
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">
            Featured Projects
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 font-medium">
            Flagship AI &amp; Backend Engineering
          </p>
        </div>

        {/* Right Column: View All Link & Manual Carousel Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-5">
          <Link
            href="/projects"
            className="text-xs font-medium text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-1 group"
          >
            <span>View all</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          {/* Page Indicator & Left / Right Arrow Controls */}
          <div className="flex items-center gap-2 pl-3 border-l border-[#E5E7EB] dark:border-white/[0.08]">
            <span className="text-xs font-mono text-[#64748B] dark:text-slate-400 select-none mr-1">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              aria-label="Previous featured projects page"
              className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-white/[0.08] bg-white dark:bg-white/[0.02] hover:bg-[#F1F5F9] dark:hover:bg-white/[0.06] text-[#334155] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed cursor-pointer shadow-2xs dark:shadow-none"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              aria-label="Next featured projects page"
              className="p-1.5 rounded-lg border border-[#E5E7EB] dark:border-white/[0.08] bg-white dark:bg-white/[0.02] hover:bg-[#F1F5F9] dark:hover:bg-white/[0.06] text-[#334155] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-white disabled:cursor-not-allowed cursor-pointer shadow-2xs dark:shadow-none"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3-Column Layout: Column 1 = Static Flagship, Columns 2 & 3 = Framer Motion Horizontal Slide */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {/* Column 1: Static Flagship Project (Agentic Code Reviewer permanently visible) */}
        <div className="h-full">
          {renderCard(FLAGSHIP_PROJECT, true)}
        </div>

        {/* Columns 2 & 3: Sliding Rotating Cards */}
        <div className="lg:col-span-2 overflow-hidden">
          <AnimatePresence mode="wait" custom={slideDirection}>
            <motion.div
              key={currentPage}
              custom={slideDirection}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid grid-cols-1 md:grid-cols-2 gap-5 h-full"
            >
              {currentRotatingProjects.map((project) => (
                <div key={project.id} className="h-full">
                  {renderCard(project, false)}
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Case Study Modal */}
      <CaseStudyModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};
