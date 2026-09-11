"use client";

import React from "react";
import { Lightbulb, GraduationCap, MapPin, Mail, Github, Linkedin, Twitter } from "lucide-react";
import { PERSONAL_INFO } from "@/lib/constants";

export const KeyInfoCards: React.FC = () => {
  return (
    <section className="space-y-6">
      {/* 4 Compact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Currently Exploring */}
        <div className="p-4 rounded-2xl bg-[#0D121F]/70 border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-amber-400 mb-2">
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-semibold text-white">Currently Exploring</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">
            Agentic AI, LLM Systems, Distributed Architectures
          </p>
        </div>

        {/* 2. Education */}
        <div className="p-4 rounded-2xl bg-[#0D121F]/70 border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <GraduationCap className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-white">Education</span>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed font-medium">
            <p className="font-semibold text-slate-200">B.Tech AI</p>
            <p className="text-slate-400 text-[11px]">SVNIT Surat (2023–2027)</p>
          </div>
        </div>

        {/* 3. Location */}
        <div className="p-4 rounded-2xl bg-[#0D121F]/70 border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-semibold text-white">Location</span>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed font-medium">
            <p className="font-semibold text-slate-200">Surat, India</p>
            <p className="text-slate-400 text-[11px]">Open to Relocate</p>
          </div>
        </div>

        {/* 4. Contact */}
        <div className="p-4 rounded-2xl bg-[#0D121F]/70 border border-white/[0.08] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Mail className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-white">Contact</span>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={`mailto:${PERSONAL_INFO.socials.email}`}
              className="text-xs text-slate-300 hover:text-blue-400 transition-colors truncate font-mono"
              title={PERSONAL_INFO.socials.email}
            >
              {PERSONAL_INFO.socials.email}
            </a>
            <div className="flex items-center gap-3 text-slate-400">
              <a
                href={PERSONAL_INFO.socials.github}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="GitHub Profile"
              >
                <Github className="w-3.5 h-3.5" />
              </a>
              <a
                href={PERSONAL_INFO.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0077B5] transition-colors"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
              <a
                href={PERSONAL_INFO.socials.twitter}
                target="_blank"
                rel="noreferrer"
                className="hover:text-white transition-colors"
                aria-label="Twitter/X Profile"
              >
                <Twitter className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Quote / Footer Philosophy */}
      <div className="text-center py-4 space-y-1">
        <blockquote className="text-xs sm:text-sm text-slate-400 italic">
          &ldquo;Better tools for a more intelligent tomorrow.&rdquo;
        </blockquote>
        <p className="text-[11px] font-mono text-slate-500">— {PERSONAL_INFO.name}</p>
      </div>
    </section>
  );
};
