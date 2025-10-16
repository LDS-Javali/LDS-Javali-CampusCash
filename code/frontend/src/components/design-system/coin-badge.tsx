"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { coinFlip } from "@/lib/animations";

interface CoinBadgeProps {
  amount: number;
  variant?: "default" | "large" | "compact";
  animated?: boolean;
  className?: string;
}

export function CoinBadge({ 
  amount, 
  variant = "default", 
  animated = false,
  className 
}: CoinBadgeProps) {
  const formatAmount = (value: number) => {
    return new Intl.NumberFormat("pt-BR").format(value);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "large":
        return "px-4 py-2 text-lg font-semibold";
      case "compact":
        return "px-2 py-1 text-sm";
      default:
        return "px-3 py-1.5 text-base font-medium";
    }
  };

  return (
    <motion.div
      variants={animated ? coinFlip : undefined}
      initial="initial"
      animate="animate"
      whileHover={animated ? "hover" : undefined}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <motion.div
        className="text-campus-gold-500"
        animate={animated ? { rotate: [0, 360] } : undefined}
        transition={animated ? { duration: 2, repeat: Infinity, ease: "linear" } : undefined}
      >
        <svg
          width={variant === "large" ? 24 : variant === "compact" ? 16 : 20}
          height={variant === "large" ? 24 : variant === "compact" ? 16 : 20}
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
      
      <Badge 
        variant="secondary" 
        className={cn(
          "bg-campus-gold-50 text-campus-gold-700 border-campus-gold-200 hover:bg-campus-gold-100",
          getVariantStyles()
        )}
      >
        {formatAmount(amount)} moedas
      </Badge>
    </motion.div>
  );
}
