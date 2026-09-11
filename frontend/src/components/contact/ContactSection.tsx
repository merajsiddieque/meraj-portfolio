"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PERSONAL_INFO } from "@/lib/constants";
import { submitContactMessage } from "@/lib/api";
import {
  Mail,
  Send,
  Github,
  Linkedin,
  MapPin,
  Clock,
  FileText,
  Check,
  Copy,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowUpRight,
} from "lucide-react";

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (status.type) setStatus({ type: null, message: "" });
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(PERSONAL_INFO.socials.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject.trim() || !formData.message.trim()) {
      setStatus({
        type: "error",
        message: "Please complete all fields to send your inquiry.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await submitContactMessage(formData);
      setStatus({
        type: "success",
        message: res.message || "Message dispatched successfully! Meraj will follow up promptly.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: any) {
      setStatus({
        type: "error",
        message:
          err.message ||
          "Message could not be transmitted. Please email directly or connect on LinkedIn.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-contact w-full select-text">
      {/* Contact Header */}
      <header className="flex items-center justify-between pb-3 border-b border-[var(--border)] shrink-0">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">
            Contact &amp; Direct Channels
          </h1>
          <p className="text-xs text-[#64748B] dark:text-slate-400 font-mono">
            FastAPI message dispatch • Direct response within 24 hours
          </p>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0FDF4] dark:bg-emerald-500/10 border border-[#BBF7D0] dark:border-emerald-500/20 text-[#16A34A] dark:text-emerald-400 text-xs font-mono font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] dark:bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A] dark:bg-emerald-500" />
          </span>
          <span>Available for Opportunities</span>
        </div>
      </header>

      {/* 2. Grid with 2 Panels */}
      <div className="contact-grid">
        {/* 1. LEFT PANEL: Contact Info */}
        <div className="contact-info flex flex-col justify-between">
          <div>
            {/* Card Header */}
            <div className="pb-3 mb-3 border-b border-[var(--border)]">
              <h2 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
                Contact Info
              </h2>
              <p className="text-xs text-[#64748B] dark:text-slate-400 font-mono">
                Direct Reach &amp; Identity
              </p>
            </div>

          {/* Channels List */}
          <div className="space-y-2.5">
            {/* Email */}
            <div className="group p-2.5 sm:p-3 rounded-2xl bg-[var(--surface-alt)] border border-[var(--border)] hover:border-[#2563EB]/40 dark:hover:border-white/20 transition-all flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/[0.04] border border-[var(--border)] flex items-center justify-center text-[#2563EB] dark:text-blue-400 shrink-0 shadow-2xs">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-[#64748B] dark:text-slate-500 uppercase">Email</div>
                  <a
                    href={`mailto:${PERSONAL_INFO.socials.email}`}
                    className="text-xs font-semibold text-[#0F172A] dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-white transition-colors truncate block"
                    title={PERSONAL_INFO.socials.email}
                  >
                    {PERSONAL_INFO.socials.email}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopyEmail}
                className="p-1.5 rounded-lg bg-white dark:bg-white/[0.04] hover:bg-[#E2E8F0] dark:hover:bg-white/[0.08] text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white border border-[var(--border)] transition-colors shrink-0 cursor-pointer"
                title="Copy email address"
                aria-label="Copy email"
              >
                {copiedEmail ? (
                  <Check className="w-3.5 h-3.5 text-[#16A34A] dark:text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* LinkedIn */}
            <a
              href={PERSONAL_INFO.socials.linkedin}
              target="_blank"
              rel="noreferrer"
              className="group p-2.5 sm:p-3 rounded-2xl bg-[var(--surface-alt)] border border-[var(--border)] hover:border-[#2563EB]/40 dark:hover:border-white/20 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/[0.04] border border-[var(--border)] flex items-center justify-center text-[#0A66C2] shrink-0 shadow-2xs">
                  <Linkedin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-[#64748B] dark:text-slate-500 uppercase">LinkedIn</div>
                  <span className="text-xs font-semibold text-[#0F172A] dark:text-slate-200 group-hover:text-[#2563EB] dark:group-hover:text-white transition-colors truncate block">
                    in/merajsiddieque
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#94A3B8] dark:text-slate-500 group-hover:text-[#2563EB] dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </a>

            {/* GitHub */}
            <a
              href={PERSONAL_INFO.socials.github}
              target="_blank"
              rel="noreferrer"
              className="group p-2.5 sm:p-3 rounded-2xl bg-[var(--surface-alt)] border border-[var(--border)] hover:border-[#2563EB]/40 dark:hover:border-white/20 transition-all flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/[0.04] border border-[var(--border)] flex items-center justify-center text-[#0F172A] dark:text-slate-300 shrink-0 shadow-2xs">
                  <Github className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-mono text-[#64748B] dark:text-slate-500 uppercase">GitHub</div>
                  <span className="text-xs font-semibold text-[#0F172A] dark:text-slate-200 group-hover:text-[#2563EB] dark:group-hover:text-white transition-colors truncate block">
                    github.com/merajsiddieque (17+ Repos)
                  </span>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#94A3B8] dark:text-slate-500 group-hover:text-[#2563EB] dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all shrink-0" />
            </a>

            {/* Location */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-[var(--surface-alt)] border border-[var(--border)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/[0.04] border border-[var(--border)] flex items-center justify-center text-[#2563EB] dark:text-cyan-400 shrink-0 shadow-2xs">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-[#64748B] dark:text-slate-500 uppercase">Location</div>
                <span className="text-xs font-semibold text-[#0F172A] dark:text-slate-200 block truncate">
                  {PERSONAL_INFO.location} • Open to Relocate / Remote
                </span>
              </div>
            </div>

            {/* Availability */}
            <div className="p-2.5 sm:p-3 rounded-2xl bg-[var(--surface-alt)] border border-[var(--border)] flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-white dark:bg-white/[0.04] border border-[var(--border)] flex items-center justify-center text-[#16A34A] dark:text-emerald-400 shrink-0 shadow-2xs">
                <Clock className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-mono text-[#64748B] dark:text-slate-500 uppercase">Availability</div>
                <span className="text-xs font-semibold text-[#0F172A] dark:text-slate-200 block truncate">
                  Immediate • Internships &amp; Full-Time AI/Backend
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Resume Action */}
        <div className="pt-3.5 border-t border-[var(--border)] mt-3">
          <a
            href={PERSONAL_INFO.socials.resume}
            target="_blank"
            rel="noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 h-10 px-4 rounded-xl bg-[var(--surface-alt)] hover:bg-[#E2E8F0] dark:hover:bg-white/[0.08] text-[#0F172A] dark:text-slate-300 hover:text-[#2563EB] dark:hover:text-white border border-[var(--border)] hover:border-[#2563EB]/40 dark:hover:border-white/20 text-xs font-mono font-medium transition-all active:scale-[0.99]"
          >
            <FileText className="w-3.5 h-3.5 text-[#2563EB] dark:text-blue-400" />
            <span>Download Official Resume (PDF)</span>
            <ExternalLink className="w-3 h-3 text-[#94A3B8] dark:text-slate-500 ml-1" />
          </a>
        </div>
      </div>

      {/* 2. RIGHT PANEL: Send Message Form */}
      <div className="contact-form flex flex-col justify-between overflow-hidden">
        <div>
          {/* Card Header */}
          <div className="pb-3.5 mb-3.5 border-b border-[var(--border)]">
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] dark:text-white tracking-tight">
              Send Message
            </h2>
            <p className="text-xs text-[#64748B] dark:text-slate-400">
              Fills directly into Meraj&apos;s priority queue and persists to Supabase.
            </p>
          </div>

          {/* Status Feedback Toast Banner */}
          <AnimatePresence>
            {status.type && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className={`p-3 rounded-2xl text-xs flex items-center gap-2.5 border mb-3.5 ${
                  status.type === "success"
                    ? "bg-emerald-50 text-[#16A34A] border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-500/30"
                    : "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:border-rose-500/30"
                }`}
              >
                {status.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A] dark:text-emerald-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
                )}
                <span className="font-medium">{status.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Row 1: Name & Email Equal Height Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-mono text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Sarah Connor"
                  className="w-full h-10 rounded-xl bg-[var(--surface-alt)] hover:bg-white dark:hover:bg-white/[0.05] border border-[var(--border)] focus:border-[#2563EB] dark:focus:border-blue-500/50 focus:ring-1 focus:ring-[#2563EB]/20 dark:focus:ring-blue-500/30 px-3.5 text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-slate-500 focus:outline-none transition-all font-sans"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g. sarah@acme-ai.com"
                  className="w-full h-10 rounded-xl bg-[var(--surface-alt)] hover:bg-white dark:hover:bg-white/[0.05] border border-[var(--border)] focus:border-[#2563EB] dark:focus:border-blue-500/50 focus:ring-1 focus:ring-[#2563EB]/20 dark:focus:ring-blue-500/30 px-3.5 text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-slate-500 focus:outline-none transition-all font-sans"
                />
              </div>
            </div>

            {/* Row 2: Subject */}
            <div>
              <label className="block text-[10px] font-mono text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. AI / Backend Engineer Role at Acme Corp"
                className="w-full h-10 rounded-xl bg-[var(--surface-alt)] hover:bg-white dark:hover:bg-white/[0.05] border border-[var(--border)] focus:border-[#2563EB] dark:focus:border-blue-500/50 focus:ring-1 focus:ring-[#2563EB]/20 dark:focus:ring-blue-500/30 px-3.5 text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-slate-500 focus:outline-none transition-all font-sans"
              />
            </div>

            {/* Row 3: Message */}
            <div>
              <label className="block text-[10px] font-mono text-[#64748B] dark:text-slate-400 uppercase tracking-wider mb-1">
                Message *
              </label>
              <textarea
                name="message"
                required
                rows={3}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your team, tech stack, or engineering project..."
                className="w-full h-22 sm:h-24 rounded-xl bg-[var(--surface-alt)] hover:bg-white dark:hover:bg-white/[0.05] border border-[var(--border)] focus:border-[#2563EB] dark:focus:border-blue-500/50 focus:ring-1 focus:ring-[#2563EB]/20 dark:focus:ring-blue-500/30 p-3 text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-slate-500 focus:outline-none transition-all resize-none font-sans"
              />
            </div>

            {/* Large Primary Send Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-10 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] dark:bg-blue-600 dark:hover:bg-blue-500 active:scale-[0.99] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed select-none"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-white">Transmitting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  <span className="text-white">Send Message</span>
                </>
              )}
            </button>

            <p className="text-[10px] text-[#64748B] dark:text-slate-500 text-center font-mono pt-0.5">
              Direct transmission to Meraj • Persisted securely via FastAPI &amp; Supabase
            </p>
          </form>
        </div>
      </div>
    </div>
  </div>
  );
};
