"use client";

import React from "react";
import { User, Sparkles, Cpu, Server, Database, Container, GraduationCap, Compass } from "lucide-react";

interface SkillGroup {
  name: string;
  icon: React.ElementType;
  color: string;
  skills: string[];
}

const skillGroups: SkillGroup[] = [
  {
    name: "AI & GenAI",
    icon: Cpu,
    color: "text-blue-600 dark:text-cyan-400",
    skills: ["Python", "LangGraph", "LangChain", "LLMs (Gemini/GPT)", "RAG Pipelines", "Vector DBs"],
  },
  {
    name: "Backend",
    icon: Server,
    color: "text-blue-600 dark:text-electric-400",
    skills: ["FastAPI", "RESTful APIs", "Node.js", "Express", "Microservices", "WebSockets"],
  },
  {
    name: "Database",
    icon: Database,
    color: "text-violet-600 dark:text-violet-400",
    skills: ["PostgreSQL (Supabase)", "MongoDB", "Redis", "Firebase Firestore"],
  },
  {
    name: "DevOps & Tools",
    icon: Container,
    color: "text-slate-600 dark:text-sky-400",
    skills: ["Docker", "Git / GitHub", "Linux", "Postman", "CI/CD Workflows"],
  },
];

export const AboutSkillsSplit: React.FC = () => {
  return (
    <section id="about" className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      {/* Left Column: About, Education, Philosophy */}
      <div className="lg:col-span-5 bg-white dark:bg-[#0D121F]/70 border border-[#E5E7EB] dark:border-white/10 rounded-[24px] p-6 sm:p-7 shadow-sm dark:shadow-none flex flex-col justify-between space-y-6 transition-colors">
        <div className="space-y-5">
          {/* Section Label */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#F1F5F9] dark:bg-surface-100 border border-[#E5E7EB] dark:border-white/10 text-[#2563EB] dark:text-cyan-400">
              <User className="w-4 h-4" />
            </div>
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#64748B] dark:text-slate-300 font-semibold">
              About &amp; Background
            </h2>
          </div>

          {/* Heading */}
          <h3 className="text-xl sm:text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight leading-tight">
            Bridging AI Research &amp; Production Backends
          </h3>

          {/* Concise Bio */}
          <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 leading-relaxed font-sans">
            AI engineer specializing in autonomous multi-agent pipelines with LangGraph and high-throughput async microservices with FastAPI.
          </p>

          {/* Education & Philosophy Blocks */}
          <div className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-white/[0.02] border border-[#E5E7EB] dark:border-white/[0.08] flex items-start gap-3">
              <GraduationCap className="w-4 h-4 text-[#2563EB] dark:text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-semibold text-[#0F172A] dark:text-white">SVNIT Surat (2023–2027)</div>
                <div className="text-[#64748B] dark:text-slate-400 text-[11px]">B.Tech in Artificial Intelligence · Core AI &amp; Systems</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-white/[0.02] border border-[#E5E7EB] dark:border-white/[0.08] flex items-start gap-3">
              <Compass className="w-4 h-4 text-[#16A34A] dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-semibold text-[#0F172A] dark:text-white">Engineering Philosophy</div>
                <div className="text-[#64748B] dark:text-slate-400 text-[11px]">Observable, containerized systems built to solve real-world problems.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Strip */}
        <div className="pt-4 border-t border-[#E5E7EB] dark:border-white/5 flex items-center justify-between text-xs font-mono text-[#64748B] dark:text-slate-400">
          <span className="font-medium text-[#0F172A] dark:text-white">Status:</span>
          <span className="text-[#16A34A] dark:text-emerald-400 flex items-center gap-1.5 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] dark:bg-emerald-400 animate-pulse" />
            Open for Internships &amp; Full-Time
          </span>
        </div>
      </div>

      {/* Right Column: Categorized Technical Capabilities */}
      <div className="lg:col-span-7 bg-white dark:bg-[#0D121F]/70 border border-[#E5E7EB] dark:border-white/10 rounded-[24px] p-6 sm:p-7 shadow-sm dark:shadow-none flex flex-col justify-between space-y-5 transition-colors">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#F1F5F9] dark:bg-surface-100 border border-[#E5E7EB] dark:border-white/10 text-[#2563EB] dark:text-electric-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#64748B] dark:text-slate-300 font-semibold">
                Technical Capabilities
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-slate-500">22+ PROFICIENCIES</span>
          </div>

          {/* Grouped Compact Skill Chips */}
          <div className="space-y-4">
            {skillGroups.map((group) => {
              const Icon = group.icon;
              return (
                <div key={group.name} className="flex flex-col sm:flex-row sm:items-center gap-2.5">
                  <div className="w-32 shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#0F172A] dark:text-slate-400 font-mono">
                    <Icon className={`w-3.5 h-3.5 ${group.color}`} />
                    <span>{group.name}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 flex-1">
                    {group.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-[#F8FAFC] dark:bg-white/[0.03] text-[#334155] dark:text-slate-300 border border-[#E5E7EB] dark:border-white/[0.08] hover:border-[#2563EB]/40 dark:hover:border-cyan-400/50 transition-colors cursor-default"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-[#E5E7EB] dark:border-white/5 flex items-center justify-between text-[11px] font-mono text-[#64748B] dark:text-slate-500">
          <span>Engineered with TypeScript, Next.js 15, FastAPI &amp; Supabase</span>
        </div>
      </div>
    </section>
  );
};
