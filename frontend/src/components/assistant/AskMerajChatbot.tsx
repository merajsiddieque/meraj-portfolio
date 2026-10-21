"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatMessage } from "@/types";
import { sendChatMessage } from "@/lib/api";
import { FormattedBotReply } from "./FormattedBotReply";
import {
  Bot,
  User,
  Send,
  Sparkles,
  RotateCcw,
  Cpu,
  ShieldCheck,
  GraduationCap,
  Briefcase,
  ArrowRight,
} from "lucide-react";

const INITIAL_PROMPTS = [
  {
    icon: Cpu,
    title: "Top Projects",
    prompt: "What are Meraj's top GenAI & LangGraph projects?",
  },
  {
    icon: Sparkles,
    title: "Agent Architecture",
    prompt: "Explain the Agentic Code Reviewer architecture",
  },
  {
    icon: Briefcase,
    title: "Why Hire Meraj?",
    prompt: "Why hire Meraj for a Backend or AI role?",
  },
  {
    icon: GraduationCap,
    title: "Education & Background",
    prompt: "What is Meraj's education and background at SVNIT?",
  },
];

export const AskMerajChatbot: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestedPrompts, setSuggestedPrompts] = useState<string[]>(
    INITIAL_PROMPTS.map((p) => p.prompt)
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: smooth ? "smooth" : "auto",
        block: "end",
      });
    }
  };

  useEffect(() => {
    scrollToBottom(true);
  }, [messages, loading]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (queryToSend?: string) => {
    const text = (queryToSend || input).trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const historyForApi = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await sendChatMessage(text, historyForApi);

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content:
          res.reply ||
          res.response ||
          "I don't have that information in Meraj's portfolio.",
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (res.suggested_prompts && res.suggested_prompts.length > 0) {
        setSuggestedPrompts(res.suggested_prompts.slice(0, 4));
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I encountered a momentary connection issue. You can explore Meraj's projects directly or reach out via LinkedIn!",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setSuggestedPrompts(INITIAL_PROMPTS.map((p) => p.prompt));
    setInput("");
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  return (
    <div className="page-chat w-full select-text">
      {/* 1. Header (Fixed at top of chat container) */}
      <header className="chat-header px-6 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between z-10 select-none transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-[#426B96] dark:text-blue-400 shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs sm:text-sm font-semibold text-[#0F172A] dark:text-white tracking-tight">
                Ask Meraj
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F0FDF4] dark:bg-emerald-500/10 border border-[#BBF7D0] dark:border-emerald-500/20 text-[#16A34A] dark:text-emerald-400 text-[10px] font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] dark:bg-emerald-500 animate-pulse" />
                Online
              </span>
            </div>
            <p className="text-[10px] text-[#64748B] dark:text-slate-400 font-mono hidden sm:block">
              FastAPI • LangGraph • Gemini Knowledge Base
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 0 && (
            <button
              onClick={resetChat}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F1F5F9] dark:bg-white/[0.04] hover:bg-[#E2E8F0] dark:hover:bg-white/[0.08] border border-[#E5E7EB] dark:border-white/[0.08] text-[#0F172A] dark:text-slate-300 text-xs font-mono transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-3 h-3 text-[#64748B] dark:text-slate-400" />
              <span className="hidden xs:inline">New Chat</span>
            </button>
          )}
        </div>
      </header>

      {/* 2. Scrollable Messages Area Only */}
      <div className="chat-messages min-h-0 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-white/10 scrollbar-track-transparent">
        <div className="max-w-3xl mx-auto w-full h-full flex flex-col justify-between">
          {messages.length === 0 ? (
            /* Initial Screen — Minimal Editorial Hero */
            <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center max-w-lg"
              >
                {/* Minimal icon */}
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-gradient-to-br dark:from-blue-500/20 dark:via-cyan-500/10 dark:to-transparent border border-blue-200 dark:border-blue-500/30 flex items-center justify-center text-[#426B96] dark:text-blue-400 shadow-sm mb-4">
                  <Sparkles className="w-7 h-7 text-[#426B96] dark:text-blue-400" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight mb-2">
                  Ask anything about Meraj
                </h1>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-slate-400 max-w-md mb-8 leading-relaxed font-sans">
                  AI copilot trained on Meraj Alam&apos;s engineering background,
                  LangGraph agent architectures, FastAPI backends, and SVNIT coursework.
                </p>

                {/* 4 Suggested Prompt Chips (Initial Screen) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
                  {INITIAL_PROMPTS.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSend(item.prompt)}
                        className="group p-3 sm:p-3.5 rounded-xl bg-white dark:bg-white/[0.03] hover:bg-[#F8FAFC] dark:hover:bg-white/[0.06] border border-[#E5E7EB] dark:border-white/[0.08] hover:border-[#426B96]/40 dark:hover:border-blue-500/40 text-left transition-all duration-150 flex items-start gap-3 active:scale-[0.98] shadow-sm dark:shadow-none cursor-pointer"
                      >
                        <div className="p-1.5 rounded-lg bg-[#F1F5F9] dark:bg-white/[0.03] border border-[#E5E7EB] dark:border-white/[0.06] text-[#64748B] group-hover:text-[#426B96] group-hover:border-[#426B96]/30 dark:text-slate-400 dark:group-hover:text-blue-400 dark:group-hover:border-blue-500/30 transition-colors shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-[#0F172A] dark:text-slate-200 group-hover:text-[#426B96] dark:group-hover:text-white transition-colors mb-0.5">
                            {item.title}
                          </div>
                          <div className="text-[11px] text-[#64748B] dark:text-slate-400 group-hover:text-[#334155] dark:group-hover:text-slate-300 leading-snug line-clamp-2">
                            {item.prompt}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[#94A3B8] dark:text-slate-600 group-hover:text-[#426B96] dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          ) : (
            /* Active Conversation Thread */
            <div className="space-y-5 pb-2">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex gap-3 ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-[#426B96] dark:text-blue-400 shrink-0 mt-0.5 shadow-2xs">
                        <Bot className="w-3.5 h-3.5" />
                      </div>
                    )}

                    <div
                      className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-[#426B96] text-white font-medium rounded-tr-sm shadow-sm"
                          : "bg-white dark:bg-white/[0.04] text-[#0F172A] dark:text-slate-200 border border-[#E5E7EB] dark:border-white/[0.08] rounded-tl-sm shadow-sm"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <div className="whitespace-pre-line break-words font-sans">
                          {msg.content}
                        </div>
                      ) : (
                        <FormattedBotReply content={msg.content} />
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-lg bg-[#E2E8F0] dark:bg-white/[0.06] border border-[#CBD5E1] dark:border-white/[0.1] flex items-center justify-center text-[#334155] dark:text-slate-300 shrink-0 mt-0.5">
                        <User className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Typing Indicator */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start items-center"
                >
                  <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center text-[#426B96] dark:text-blue-400 shrink-0 shadow-2xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                  <div className="rounded-2xl rounded-tl-sm bg-white dark:bg-white/[0.04] border border-[#E5E7EB] dark:border-white/[0.08] px-3.5 py-2.5 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#426B96] dark:bg-blue-400 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 dark:bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-indigo-400 animate-bounce [animation-delay:0.4s]" />
                    <span className="text-[11px] font-mono text-[#64748B] dark:text-slate-400 ml-1.5">
                      Consulting portfolio knowledge base...
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* 3. Sticky Bottom Area (Suggested prompts directly above input + Fixed Input Bar) */}
      <div className="chat-input shrink-0 w-full z-20 transition-colors">
        <div className="max-w-3xl mx-auto w-full space-y-2.5">
          {/* Suggested prompts row (Only when in conversation) */}
          {messages.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
              <span className="text-[10px] font-mono text-[#64748B] dark:text-slate-500 whitespace-nowrap flex items-center gap-1 shrink-0">
                <Sparkles className="w-2.5 h-2.5 text-[#426B96] dark:text-blue-400" />
                Suggested:
              </span>
              {suggestedPrompts.slice(0, 4).map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  disabled={loading}
                  className="text-[11px] font-mono text-[#334155] dark:text-slate-300 hover:text-[#0F172A] dark:hover:text-white bg-[#F1F5F9] dark:bg-white/[0.03] hover:bg-[#E2E8F0] dark:hover:bg-white/[0.08] border border-[#E5E7EB] dark:border-white/[0.08] hover:border-[#426B96]/40 dark:hover:border-blue-500/30 rounded-full px-2.5 py-1 transition-all whitespace-nowrap flex items-center gap-1 shrink-0 disabled:opacity-40 cursor-pointer"
                >
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          )}

          {/* Fixed Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 rounded-2xl bg-[#F8FAFC] dark:bg-white/[0.04] hover:bg-white dark:hover:bg-white/[0.06] border border-[#E5E7EB] dark:border-white/[0.1] focus-within:border-[#426B96] focus-within:ring-1 focus-within:ring-[#426B96]/30 transition-all p-1.5 sm:p-2 shadow-sm"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, architecture, backend skills, or hiring..."
              disabled={loading}
              className="flex-1 bg-transparent border-none text-xs sm:text-sm text-[#0F172A] dark:text-white placeholder:text-[#94A3B8] dark:placeholder:text-slate-500 focus:outline-none px-2 sm:px-3 py-1 font-sans"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2 sm:p-2.5 rounded-xl bg-[#426B96] hover:bg-[#355A81] dark:bg-blue-600 dark:hover:bg-blue-500 text-white disabled:opacity-30 disabled:pointer-events-none transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
              aria-label="Send message"
            >
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </form>

          {/* Subtle micro-footer hint */}
          <div className="flex items-center justify-between text-[10px] text-[#64748B] dark:text-slate-500 font-mono px-1">
            <span>Ask Meraj AI • Powered by FastAPI &amp; LangGraph</span>
            <span className="hidden sm:inline">Press Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
};
