import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "cyan" | "violet" | "outline" | "success";
  size?: "sm" | "md";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "default",
  size = "md",
  ...props
}) => {
  const variantStyles = {
    default: "bg-electric-950/60 text-electric-300 border-electric-700/40",
    cyan: "bg-cyan-950/60 text-cyan-300 border-cyan-700/40",
    violet: "bg-violet-950/60 text-violet-300 border-violet-700/40",
    outline: "bg-surface-100/50 text-slate-300 border-white/10",
    success: "bg-emerald-950/60 text-emerald-400 border-emerald-600/40",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-xs px-2.5 py-1 font-medium",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md transition-colors",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
