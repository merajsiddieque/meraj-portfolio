"use client";

import React from "react";
import { ExperienceTimeline } from "@/components/experience/ExperienceTimeline";
import { GraduationCap } from "lucide-react";

export default function EducationPage() {
  return (
    <div className="space-y-6">
      <div className="dashboard-card p-6 sm:p-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-electric-950 border border-electric-600/30 text-electric-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
              Academic Specialization
            </span>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              SVNIT Surat — B.Tech in Artificial Intelligence
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sardar Vallabhbhai National Institute of Technology • 2023 – 2027
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right font-mono text-xs text-slate-400">
          <div className="text-cyan-300 font-bold">NIT Surat</div>
          <div>Institute of National Importance</div>
        </div>
      </div>

      <ExperienceTimeline />
    </div>
  );
}
