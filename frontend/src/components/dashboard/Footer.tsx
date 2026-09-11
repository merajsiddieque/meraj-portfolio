"use client";

import React from "react";
import { PERSONAL_INFO } from "@/lib/constants";
import { Github, Linkedin, Mail, ArrowUp, Sparkles, CheckCircle2 } from "lucide-react";

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      className="footer px-4 sm:px-6 flex items-center justify-between select-none transition-colors"
      role="contentinfo"
      aria-label="Dashboard Status & Footer"
    >
      {/* Left: System Telemetry & Copyright */}
      <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] font-mono text-[#64748B] dark:text-slate-400">
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#F0FDF4] dark:bg-emerald-500/10 border border-[#BBF7D0] dark:border-emerald-500/20 text-[#16A34A] dark:text-emerald-400">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] dark:bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#16A34A] dark:bg-emerald-500" />
          </span>
          <span className="hidden sm:inline font-semibold">FastAPI &amp; Supabase Active</span>
          <span className="sm:hidden font-semibold">Online</span>
        </div>

        <span className="text-[#CBD5E1] dark:text-slate-600 hidden xs:inline">•</span>

        <span className="hidden xs:inline text-[#64748B] dark:text-slate-400">
          © {new Date().getFullYear()}{" "}
          <span className="text-[#0F172A] dark:text-slate-200 font-semibold">{PERSONAL_INFO.name}</span>
        </span>
      </div>

      {/* Center: Tech Stack & SVNIT Identity */}
      <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono text-[#64748B] dark:text-slate-400">
        <span className="flex items-center gap-1 text-[#64748B] dark:text-slate-400">
          <Sparkles className="w-3 h-3 text-[#2563EB] dark:text-cyan-400" />
          <span>SVNIT Surat B.Tech AI</span>
        </span>
        <span className="text-[#CBD5E1] dark:text-slate-600">•</span>
        <span className="text-[#94A3B8] dark:text-slate-500">Next.js 15 &amp; LangGraph</span>
      </div>

      {/* Right: Social Links & Back-to-Top */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* GitHub */}
        <a
          href={PERSONAL_INFO.socials.github}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors"
          title="GitHub Profile"
          aria-label="GitHub Profile"
        >
          <Github className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>

        {/* LinkedIn */}
        <a
          href={PERSONAL_INFO.socials.linkedin}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0A66C2] hover:bg-[#F1F5F9] dark:text-slate-400 dark:hover:text-cyan-400 dark:hover:bg-white/5 transition-colors"
          title="LinkedIn Profile"
          aria-label="LinkedIn Profile"
        >
          <Linkedin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>

        {/* Email */}
        <a
          href={`mailto:${PERSONAL_INFO.socials.email}`}
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-[#F1F5F9] dark:text-slate-400 dark:hover:text-electric-400 dark:hover:bg-white/5 transition-colors"
          title={`Email: ${PERSONAL_INFO.socials.email}`}
          aria-label="Email Contact"
        >
          <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </a>

        <div className="w-[1px] h-3.5 bg-[#E5E7EB] dark:bg-white/10 mx-0.5 sm:mx-1" />

        {/* Scroll Back to Top */}
        <button
          onClick={scrollToTop}
          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#2563EB] hover:bg-blue-50 dark:text-slate-400 dark:hover:text-electric-400 dark:hover:bg-electric-500/10 transition-all group cursor-pointer"
          title="Scroll to Top"
          aria-label="Scroll back to top"
        >
          <ArrowUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>
    </footer>
  );
};
