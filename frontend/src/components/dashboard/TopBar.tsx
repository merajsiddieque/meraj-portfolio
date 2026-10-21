"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Search, FileText, ArrowRight } from "lucide-react";
import { PERSONAL_INFO } from "@/lib/constants";

export const TopBar: React.FC = () => {
  const router = useRouter();

  const handleSearchClick = () => {
    router.push("/assistant");
  };

  return (
    <header className="header px-4 sm:px-6 flex items-center justify-between gap-4 select-none transition-colors duration-180">
      {/* Search Input (Centered / Left on Desktop) */}
      <div className="flex-1 max-w-md ml-8 md:ml-0">
        <button
          onClick={handleSearchClick}
          className="w-full h-9 rounded-xl bg-[#F1F5F9] dark:bg-white/[0.03] hover:bg-[#E2E8F0] dark:hover:bg-white/[0.06] border border-[#E5E7EB] dark:border-white/[0.08] dark:hover:border-blue-500/30 px-3 flex items-center justify-between text-xs text-[#64748B] dark:text-slate-400 transition-all duration-180 group cursor-pointer"
          title="Search projects, skills, or ask anything"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] dark:text-slate-500 group-hover:text-[#426B96] dark:group-hover:text-blue-400 transition-colors" />
            <span className="text-[#64748B] dark:text-slate-400 group-hover:text-[#0F172A] dark:group-hover:text-slate-200 transition-colors text-[11px] sm:text-xs font-sans">
              Search projects, skills, or ask anything...
            </span>
          </div>
          <div className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white dark:bg-white/[0.08] border border-[#E2E8F0] dark:border-white/[0.12] text-[#64748B] group-hover:text-[#426B96] group-hover:border-blue-300 dark:text-slate-300 dark:group-hover:text-blue-400 dark:group-hover:border-blue-500/40 transition-all shadow-2xs">
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>

      {/* Right: Availability Status & Resume CTA */}
      <div className="flex items-center gap-3">
        {/* Availability Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0FDF4] dark:bg-emerald-500/10 border border-[#BBF7D0] dark:border-emerald-500/20 text-[#16A34A] dark:text-emerald-400 text-xs font-medium">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] dark:bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#16A34A] dark:bg-emerald-500" />
          </span>
          <span className="text-[11px] font-medium tracking-tight">Available for Opportunities</span>
        </div>

        {/* Resume Button */}
        <a
          href={PERSONAL_INFO.socials.resume}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 h-8 px-3.5 rounded-lg bg-[#426B96] hover:bg-[#355A81] dark:bg-blue-600 dark:hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors active:scale-95"
        >
          <FileText className="w-3.5 h-3.5 text-white" />
          <span className="text-white">Resume</span>
        </a>
      </div>
    </header>
  );
};
