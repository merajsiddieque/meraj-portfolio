"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  ArrowRight,
  Sparkles,
  Github,
  GraduationCap,
  Briefcase,
  Zap,
  Bot,
  Database,
  Stars,
} from "lucide-react";
import { PERSONAL_INFO } from "@/lib/constants";
import { getGithubStats } from "@/lib/api";
import { motion } from "framer-motion";

export const MinimalHero: React.FC = () => {
  const [avatarSrc, setAvatarSrc] = useState<string>(PERSONAL_INFO.socials.avatar);
  const [repoCount, setRepoCount] = useState<number | null>(null);
  const [loadingRepos, setLoadingRepos] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchStats() {
      try {
        const data = await getGithubStats();
        if (isMounted) {
          const count = data?.profile?.public_repos ?? data?.public_repos ?? 17;
          setRepoCount(count);
        }
      } catch (err) {
        console.error("Failed to load GitHub stats:", err);
        if (isMounted) setRepoCount(17);
      } finally {
        if (isMounted) setLoadingRepos(false);
      }
    }
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="w-full bg-white dark:bg-[#1A212B]/60 border border-[#E5E7EB] dark:border-white/[0.08] rounded-[24px] p-6 sm:p-8 relative overflow-hidden shadow-sm dark:shadow-none transition-colors duration-180"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Biography & Tech Highlights */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-4">
          {/* Track Badge */}
          <div className="text-[11px] font-mono tracking-widest text-[#64748B] dark:text-slate-400 uppercase font-semibold">
            AI ENGINEER · SVNIT SURAT
          </div>

          {/* Main Name — 56px Bold */}
          <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold text-[#0F172A] dark:text-white tracking-tight leading-tight">
            {PERSONAL_INFO.name}
          </h1>

          {/* Value Proposition Headline — 20px Heading */}
          <p className="text-lg sm:text-[20px] font-semibold text-[#1E293B] dark:text-slate-200 leading-snug">
            Building AI systems that solve real problems.
          </p>

          {/* Specialization Tags — 16px Description */}
          <p className="text-sm sm:text-[16px] text-[#64748B] dark:text-slate-400 leading-relaxed font-sans">
            GenAI · Multi-agent Systems · Backend Engineering
          </p>

          {/* Core Tech Stack Badges (Outlined in light mode) */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {/* FastAPI */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFC] dark:bg-[#202833] border border-[#E5E7EB] dark:border-blue-500/30 text-[#0F172A] dark:text-blue-400 text-xs font-mono transition-colors">
              <Zap className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>FastAPI</span>
            </div>

            {/* LangGraph */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFC] dark:bg-[#202833] border border-[#E5E7EB] dark:border-blue-500/30 text-[#0F172A] dark:text-blue-400 text-xs font-mono transition-colors">
              <Bot className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>LangGraph</span>
            </div>

            {/* Supabase */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFC] dark:bg-[#202833] border border-[#E5E7EB] dark:border-blue-500/30 text-[#0F172A] dark:text-blue-400 text-xs font-mono transition-colors">
              <Database className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>Supabase</span>
            </div>

            {/* Gemini */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F8FAFC] dark:bg-[#202833] border border-[#E5E7EB] dark:border-blue-500/30 text-[#0F172A] dark:text-blue-400 text-xs font-mono transition-colors">
              <Stars className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              <span>Gemini</span>
            </div>
          </div>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={PERSONAL_INFO.socials.resume}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#426B96] hover:bg-[#355A81] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors active:scale-95"
            >
              <FileText className="w-4 h-4 text-white" />
              <span>View Resume</span>
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F1F5F9] hover:bg-[#E2E8F0] dark:bg-white/[0.04] dark:hover:bg-white/[0.08] border border-[#E5E7EB] dark:border-white/10 text-[#0F172A] dark:text-slate-200 font-semibold text-xs sm:text-sm transition-colors active:scale-95"
            >
              <span>Get in Touch</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#64748B] dark:text-slate-400" />
            </Link>
          </div>
        </div>

        {/* Right: Bordered Profile Frame & 4 Mini Cards */}
        <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-row items-center gap-5 justify-end">
          {/* Portrait inside a bordered frame */}
          <div className="relative w-44 sm:w-48 aspect-square rounded-[20px] overflow-hidden border-2 border-[#E5E7EB] dark:border-white/10 bg-[#F1F5F9] dark:bg-[#090D15] shadow-sm shrink-0 group">
            <Image
              src={avatarSrc}
              alt="Meraj Alam - AI Engineer"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 176px, 192px"
              priority
              onError={() => setAvatarSrc("/images/meraj_hero_profile.jpg")}
            />
            {/* Subtle Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 dark:from-[#0B0F17]/90 via-transparent to-transparent pointer-events-none" />

            {/* Handwritten Script Overlay */}
            <div className="absolute bottom-2.5 right-3 font-mono italic text-xs tracking-wider text-white drop-shadow-md select-none text-right">
              &ldquo;Build<br />Learn<br />Iterate&rdquo;
            </div>
          </div>

          {/* 4 Independent White Mini Cards */}
          <div className="flex flex-col gap-2.5 w-full sm:w-48 shrink-0">
            {/* 1. Projects & Repos */}
            <Link
              href="/projects"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-white/[0.02] hover:bg-[#F8FAFC] dark:hover:bg-white/[0.06] border border-[#E5E7EB] dark:border-white/[0.08] hover:border-[#426B96]/40 dark:hover:border-white/20 shadow-sm dark:shadow-none transition-all group/proj cursor-pointer"
              title="View all 17+ engineering projects across GitHub"
            >
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-600/10 text-[#426B96] dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 transition-colors">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#0F172A] dark:text-white leading-tight">
                  {loadingRepos ? (
                    <span className="inline-block h-4 w-8 bg-slate-200 dark:bg-white/10 rounded animate-pulse" />
                  ) : (
                    `${repoCount !== null ? repoCount : 17}+`
                  )}
                </span>
                <span className="text-[11px] text-[#64748B] dark:text-slate-400 group-hover/proj:text-[#0F172A] dark:group-hover/proj:text-slate-300 font-medium transition-colors">
                  Projects &amp; Repos
                </span>
              </div>
            </Link>

            {/* 2. Major Highlights */}
            <Link
              href="/projects"
              className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-white/[0.02] hover:bg-[#F8FAFC] dark:hover:bg-white/[0.06] border border-[#E5E7EB] dark:border-white/[0.08] hover:border-[#426B96]/40 dark:hover:border-white/20 shadow-sm dark:shadow-none transition-all group/repo cursor-pointer"
              title="View the 5 major highlighted flagship projects"
            >
              <div className="p-2 rounded-lg bg-slate-50 dark:bg-white/[0.04] text-[#475569] dark:text-slate-300 border border-[#E5E7EB] dark:border-white/10 transition-colors">
                <Github className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#0F172A] dark:text-white leading-tight">5 Major</span>
                <span className="text-[11px] text-[#64748B] dark:text-slate-400 group-hover/repo:text-[#0F172A] dark:group-hover/repo:text-slate-300 font-medium transition-colors">
                  Highlights
                </span>
              </div>
            </Link>

            {/* 3. SVNIT Surat */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-white/[0.02] border border-[#E5E7EB] dark:border-white/[0.08] shadow-sm dark:shadow-none">
              <div className="p-2 rounded-lg bg-violet-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-[#0F172A] dark:text-white leading-tight">SVNIT Surat</span>
                <span className="text-[10px] text-[#64748B] dark:text-slate-400 font-medium">B.Tech AI (2023–2027)</span>
              </div>
            </div>

            {/* 4. Open Status */}
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-white/[0.02] border border-[#E5E7EB] dark:border-white/[0.08] shadow-sm dark:shadow-none">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-600/10 text-[#16A34A] dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#16A34A] dark:text-emerald-400 leading-tight">Open</span>
                <span className="text-[10px] text-[#64748B] dark:text-slate-400 font-medium">Internships &amp; Full-Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};
