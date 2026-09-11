import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  isLoading = false,
  disabled,
  ...props
}) => {
  const variantStyles = {
    primary:
      "bg-gradient-to-r from-electric-600 to-electric-700 hover:from-electric-500 hover:to-electric-600 text-white shadow-neon-blue border border-electric-400/30",
    secondary:
      "bg-surface-100 hover:bg-surface-50 text-slate-100 border border-white/10 hover:border-white/20",
    outline:
      "bg-transparent hover:bg-white/5 text-slate-200 border border-white/15 hover:border-white/30",
    ghost: "bg-transparent hover:bg-white/5 text-slate-300 hover:text-white border-transparent",
  };

  const sizeStyles = {
    sm: "text-xs px-3 py-1.5 rounded-lg",
    md: "text-sm px-4 py-2.5 rounded-xl font-medium",
    lg: "text-base px-6 py-3.5 rounded-xl font-semibold",
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <>
          {icon && iconPosition === "left" && icon}
          {children}
          {icon && iconPosition === "right" && icon}
        </>
      )}
    </button>
  );
};
