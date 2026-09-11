"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import {
  GraduationCap,
  Cpu,
  Server,
  Layers,
  Sparkles,
  CheckCircle2,
  Calendar,
  Compass,
} from "lucide-react";

const journeyMilestones = [
  {
    icon: GraduationCap,
    period: "2023 – 2027",
    title: "AI Engineering Degree at SVNIT Surat",
    subtitle: "Sardar Vallabhbhai National Institute of Technology",
    description:
      "Admitted into SVNIT's specialized Artificial Intelligence B.Tech program. Deep diving into fundamental algorithms, probabilistic machine learning, computational mathematics, and large-scale computing.",
    tags: ["Institute of National Importance", "DSA", "Deep Learning", "Core AI"],
  },
  {
    icon: Server,
    period: "2023 – 2024",
    title: "Backend Engineering & Microservices",
    subtitle: "High-Throughput Systems & Distributed Storage",
    description:
      "Mastered backend architecture using FastAPI, Node.js, and PostgreSQL. Focused on concurrency patterns, connection pooling, Redis caching layers, and resilient RESTful API designs.",
    tags: ["FastAPI", "PostgreSQL", "Redis", "Docker", "AsyncIO"],
  },
  {
    icon: Cpu,
    period: "2024 – Present",
    title: "Agentic AI, RAG & LLM Orchestration",
    subtitle: "Stateful Workflows & Foundation Model Systems",
    description:
      "Pioneered autonomous multi-agent systems using LangGraph, multi-stage RAG pipelines with vector indices, and real-time multimodal emotion tracking engines. Built the Agentic Code Reviewer system.",
    tags: ["LangGraph", "Gemini 1.5 Pro", "RAG", "Vector Search", "Autonomous Agents"],
  },
  {
    icon: Layers,
    period: "Future / Vision",
    title: "Production AI Systems Engineering",
    subtitle: "Bridging Research and Low-Latency Infrastructure",
    description:
      "Dedicated to building dependable, observable, and cost-efficient AI SaaS products. Passionate about solving complex distributed systems challenges at the cutting edge of GenAI.",
    tags: ["Production ML", "System Design", "Scalable SaaS", "Evaluation Frameworks"],
  },
];

export const JourneyTimeline: React.FC = () => {
  return (
    <section id="about" className="py-12 sm:py-16 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-[#2563EB] dark:text-blue-400 text-xs font-mono font-semibold mb-3">
            <Compass className="w-3.5 h-3.5" />
            <span>Engineering Journey</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-white tracking-tight">
            From Algorithms to <span className="gradient-text-electric">Autonomous AI</span>
          </h2>
          <p className="mt-3 text-[#64748B] dark:text-slate-400 text-xs sm:text-sm sm:leading-relaxed max-w-2xl mx-auto">
            AI engineering student at SVNIT Surat with a deep focus on high-concurrency
            backend systems, autonomous LLM agent graphs, and production software design.
          </p>
        </div>

        {/* Timeline Layout */}
        <div className="relative border-l border-[#E5E7EB] dark:border-white/10 ml-4 md:ml-32 md:pl-8 space-y-10">
          {journeyMilestones.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="relative pl-8 md:pl-0"
              >
                {/* Node circle on the timeline rail */}
                <div className="absolute -left-[41px] md:-left-[57px] top-1.5 w-7 h-7 rounded-full bg-white dark:bg-[#0E131F] border-2 border-[#2563EB] dark:border-blue-500 flex items-center justify-center shadow-xs">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2563EB] dark:bg-cyan-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Date badge on desktop */}
                  <div className="hidden md:block md:col-span-3 pt-1">
                    <span className="font-mono text-xs font-semibold text-[#2563EB] dark:text-cyan-400 bg-[#EFF6FF] dark:bg-cyan-950/60 border border-[#DBEAFE] dark:border-cyan-800/50 px-3 py-1.5 rounded-xl inline-block shadow-2xs">
                      {m.period}
                    </span>
                  </div>

                  {/* Card content */}
                  <div className="md:col-span-9">
                    <div className="rounded-2xl bg-white dark:bg-[#0D121F]/70 border border-[#E5E7EB] dark:border-white/10 p-6 md:p-7 shadow-sm dark:shadow-none hover:border-[#2563EB]/40 dark:hover:border-blue-500/30 transition-all">
                      <div className="md:hidden mb-3">
                        <span className="font-mono text-xs font-semibold text-[#2563EB] dark:text-cyan-400 bg-[#EFF6FF] dark:bg-cyan-950/60 border border-[#DBEAFE] dark:border-cyan-800/50 px-2.5 py-1 rounded-lg inline-block">
                          {m.period}
                        </span>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-[#F1F5F9] dark:bg-blue-950/40 border border-[#E5E7EB] dark:border-blue-500/20 text-[#2563EB] dark:text-blue-400 shrink-0 mt-0.5">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
                            {m.title}
                          </h3>
                          <h4 className="text-xs font-medium text-[#64748B] dark:text-slate-400 mt-0.5">
                            {m.subtitle}
                          </h4>
                          <p className="text-xs sm:text-sm text-[#475569] dark:text-slate-300 mt-2.5 leading-relaxed">
                            {m.description}
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-3.5">
                            {m.tags.map((t) => (
                              <span
                                key={t}
                                className="px-2.5 py-0.5 rounded-md bg-[#F8FAFC] dark:bg-white/[0.03] border border-[#E5E7EB] dark:border-white/[0.08] text-[#334155] dark:text-slate-300 text-[11px] font-mono"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
