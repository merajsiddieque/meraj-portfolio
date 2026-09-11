import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Footer } from "@/components/dashboard/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meraj Alam — AI Engineer • ML • GenAI • Backend Developer",
  description:
    "Portfolio of Meraj Alam, AI & Backend Engineer at SVNIT Surat specializing in LangGraph multi-agent systems, scalable FastAPI backends, and full-stack AI SaaS platforms.",
  keywords: [
    "Meraj Alam",
    "AI Engineer",
    "ML Engineer",
    "GenAI",
    "Backend Developer",
    "FastAPI",
    "LangGraph",
    "Next.js 15",
    "SVNIT Surat",
    "Autonomous Agents",
    "RAG",
    "Python",
    "TypeScript",
  ],
  authors: [{ name: "Meraj Alam" }],
  creator: "Meraj Alam",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://meraj.dev",
    title: "Meraj Alam — AI Engineer • ML • GenAI • Backend Developer",
    description:
      "Explore autonomous AI workflows, multi-agent code reviewers, and high-performance backend architectures engineered by Meraj Alam.",
    siteName: "Meraj Alam Portfolio",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-background text-foreground font-sans antialiased selection:bg-electric-500 selection:text-white">
        <div className="app-shell">
          {/* 1. Sidebar (Fixed: grid-row 1 / span 3, grid-column 1) */}
          <Sidebar />

          {/* 2. Header (Fixed: grid-row 1, grid-column 2) */}
          <TopBar />

          {/* 3. Main Shell (Fixed: grid-row 2, grid-column 2) */}
          <main className="main-shell linear-grid relative">
            {children}
          </main>

          {/* 4. Footer (Fixed: grid-row 3, grid-column 2) */}
          <Footer />
        </div>
      </body>
    </html>
  );
}
