"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { coinSpin } from "@/lib/animations";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  text,
  className,
}: LoadingSpinnerProps) {
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "h-4 w-4";
      case "lg":
        return "h-8 w-8";
      default:
        return "h-6 w-6";
    }
  };

  return (
    <div className={cn("flex flex-col items-center justify-center gap-2", className)}>
      <motion.div
        variants={coinSpin}
        animate="animate"
        className={cn("text-campus-gold-500", getSizeStyles())}
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
          <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2" />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="currentColor"
          >
            $
          </text>
        </svg>
      </motion.div>
      
      {text && (
        <p className="text-sm text-muted-foreground">{text}</p>
      )}
    </div>
  );
}
