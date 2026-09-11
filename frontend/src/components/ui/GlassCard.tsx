"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  glow?: "none" | "electric" | "cyan" | "violet";
  interactive?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = "none",
  interactive = false,
  ...props
}) => {
  const glowStyles = {
    none: "",
    electric: "hover:border-electric-500/40 hover:shadow-neon-blue",
    cyan: "hover:border-cyan-500/40 hover:shadow-neon-cyan",
    violet: "hover:border-violet-500/40 hover:shadow-neon-violet",
  };

  return (
    <motion.div
      whileHover={interactive ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={cn(
        "relative rounded-2xl bg-surface-200/60 backdrop-blur-xl border border-white/10 p-6 transition-all duration-300",
        glowStyles[glow],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};
