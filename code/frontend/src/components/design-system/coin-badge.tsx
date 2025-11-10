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
  light?: boolean; // Para usar em fundos escuros
}

export function CoinBadge({
  amount,
  variant = "default",
  animated = false,
  className,
  light = false,
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

  const getBadgeStyles = () => {
    if (light) {
      return "bg-white/20 text-white border-white/30 hover:bg-white/30";
    }
    return "bg-campus-gold-50 text-campus-gold-700 border-campus-gold-200 hover:bg-campus-gold-100";
  };

  return (
    <motion.div
      variants={animated ? coinFlip : undefined}
      initial="initial"
      animate="animate"
      whileHover={animated ? "hover" : undefined}
      className={cn("inline-flex items-center gap-2", className)}
    >
      <div className="relative">
        <motion.div
          className={light ? "text-white" : "text-campus-gold-500"}
          style={{
            filter: animated 
              ? light
                ? "drop-shadow(0 0 6px rgba(255, 255, 255, 0.5))"
                : "drop-shadow(0 0 6px rgba(251, 191, 36, 0.4))"
              : undefined,
          }}
        >
          <svg
            width={variant === "large" ? 24 : variant === "compact" ? 16 : 20}
            height={variant === "large" ? 24 : variant === "compact" ? 16 : 20}
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.1" />
            <circle
              cx="12"
              cy="12"
              r="8"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
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
        {animated && (
          <motion.div
            className="absolute inset-0 pointer-events-none overflow-hidden rounded-full"
            style={{
              background: light
                ? `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)`
                : `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25) 0%, transparent 50%)`,
              mixBlendMode: "overlay",
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </div>

      <Badge
        variant="secondary"
        className={cn(getBadgeStyles(), getVariantStyles())}
      >
        {formatAmount(amount)} moedas
      </Badge>
    </motion.div>
  );
}
