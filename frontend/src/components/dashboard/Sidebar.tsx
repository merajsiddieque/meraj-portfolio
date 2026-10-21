"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderGit2,
  Bot,
  Github,
  User,
  Mail,
  Moon,
  Sun,
  ChevronDown,
  Check,
  Menu,
  X,
} from "lucide-react";
import { PERSONAL_INFO } from "@/lib/constants";

interface NavItem {
  id: string;
  name: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  { id: "overview", name: "Overview", icon: Home, href: "/" },
  { id: "projects", name: "Projects", icon: FolderGit2, href: "/projects" },
  { id: "assistant", name: "Ask Meraj", icon: Bot, href: "/assistant" },
  { id: "github", name: "GitHub", icon: Github, href: "/github" },
  { id: "about", name: "About", icon: User, href: "/about" },
  { id: "contact", name: "Contact", icon: Mail, href: "/contact" },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [openThemeMenu, setOpenThemeMenu] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);

  // Initialize theme from localStorage (Dark is default)
  useEffect(() => {
    const saved = localStorage.getItem("meraj_theme") as "dark" | "light" | null;
    if (saved === "light") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      setTheme("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Close theme menu on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setOpenThemeMenu(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const handleSelectTheme = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
    setOpenThemeMenu(false);
    if (newTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("meraj_theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("meraj_theme", "dark");
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Menu Trigger Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-3.5 left-3 z-50 p-2 rounded-lg bg-white dark:bg-surface-200/90 border border-[#E5E7EB] dark:border-white/10 text-slate-600 dark:text-slate-300 shadow-sm"
        aria-label="Toggle navigation menu"
      >
        {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="md:hidden fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Persistent Left Sidebar — Fixed Panel */}
      <aside
        className={`sidebar flex flex-col justify-between py-4 px-3 select-none transition-all duration-180 shadow-sm dark:shadow-none ${
          mobileOpen
            ? "fixed z-50 left-0 top-0 bottom-0 w-64 translate-x-0 border-r border-[var(--border)] bg-[var(--surface)]"
            : "fixed z-50 -translate-x-full md:translate-x-0 md:relative md:z-auto md:w-full md:h-full"
        }`}
      >
        {/* Top: Logo & Nav List */}
        <div className="flex flex-col gap-6">
          {/* Logo / Brand */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-[#F1F5F9] dark:hover:bg-white/[0.03] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#426B96] flex items-center justify-center font-bold text-white text-sm shadow-sm">
              M
            </div>
            <span className="font-semibold text-[#0F172A] dark:text-white text-sm tracking-tight">
              {PERSONAL_INFO.name.split(" ")[0]}
            </span>
          </Link>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActiveRoute(item.href);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                    active
                      ? "bg-[#F1F5F8] text-[#426B96] border border-[#E2EAF1] font-semibold dark:bg-blue-600/15 dark:text-blue-400 dark:border-blue-500/20"
                      : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] border border-transparent dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-white/[0.04]"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      active
                        ? "text-[#426B96] dark:text-blue-400"
                        : "text-[#94A3B8] dark:text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Theme Dropdown (Dark default, Light provided) */}
        <div ref={themeRef} className="pt-3 border-t border-[#E5E7EB] dark:border-white/[0.08] relative">
          <button
            onClick={() => setOpenThemeMenu(!openThemeMenu)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-[#F1F5F9] dark:bg-white/[0.02] hover:bg-[#E2E8F0] dark:hover:bg-white/[0.05] border border-[#E5E7EB] dark:border-white/[0.06] text-xs text-[#0F172A] dark:text-slate-300 transition-all cursor-pointer select-none"
            title="Switch appearance theme"
            aria-label="Toggle theme dropdown"
          >
            <span className="flex items-center gap-2 font-medium capitalize">
              {theme === "dark" ? (
                <Moon className="w-3.5 h-3.5 text-blue-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
              <span>{theme === "dark" ? "Dark" : "Light"}</span>
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 dark:text-slate-500 transition-transform duration-150 ${
                openThemeMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Floating Theme Menu */}
          {openThemeMenu && (
            <div className="absolute bottom-full left-0 right-0 mb-2 p-1 rounded-xl bg-white dark:bg-[#1A212B] border border-[#E5E7EB] dark:border-white/10 shadow-xl z-50 flex flex-col gap-0.5 backdrop-blur-2xl">
              <button
                onClick={() => handleSelectTheme("dark")}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  theme === "dark"
                    ? "bg-[#F1F5F8] text-[#426B96] font-semibold dark:bg-blue-600/20 dark:text-blue-400"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.04]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Moon className="w-3.5 h-3.5 text-blue-400" />
                  <span>Dark (Default)</span>
                </span>
                {theme === "dark" && <Check className="w-3 h-3 text-[#426B96] dark:text-blue-400" />}
              </button>

              <button
                onClick={() => handleSelectTheme("light")}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  theme === "light"
                    ? "bg-[#F1F5F8] text-[#426B96] font-semibold dark:bg-blue-600/20 dark:text-blue-400"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] dark:text-slate-300 dark:hover:text-white dark:hover:bg-white/[0.04]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span>Light</span>
                </span>
                {theme === "light" && <Check className="w-3 h-3 text-[#426B96] dark:text-blue-400" />}
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
