"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { TIMELINE_EXPERIENCE } from "@/lib/constants";
import {
  GraduationCap,
  Briefcase,
  Award,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export const ExperienceTimeline: React.FC = () => {
  return (
    <section id="education" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="cyan" className="mb-4">
            <GraduationCap className="w-3.5 h-3.5 mr-1" />
            Education &amp; Background
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Academic Foundation &amp; <span className="gradient-text-electric">Experience</span>
          </h2>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            Rigorous undergraduate AI training at SVNIT Surat paired with hands-on systems
            development, autonomous agents, and scalable backend design.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="max-w-4xl mx-auto space-y-8">
          {TIMELINE_EXPERIENCE.map((item, idx) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <GlassCard glow="electric" className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-electric-950 border border-electric-600/30 text-electric-400">
                      {idx === 0 ? (
                        <GraduationCap className="w-5 h-5" />
                      ) : (
                        <Briefcase className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs sm:text-sm font-medium text-cyan-300">
                        {item.organization}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-400 bg-surface-100 px-3 py-1 rounded-full border border-white/10 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-cyan-400" />
                      {item.year}
                    </span>
                    <Badge variant="cyan" size="sm">
                      {item.badge}
                    </Badge>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {item.highlights.map((hl) => (
                    <span
                      key={hl}
                      className="inline-flex items-center gap-1 text-[11px] text-slate-300 font-medium bg-surface-100/70 border border-white/5 px-2.5 py-1 rounded-lg"
                    >
                      <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                      {hl}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
