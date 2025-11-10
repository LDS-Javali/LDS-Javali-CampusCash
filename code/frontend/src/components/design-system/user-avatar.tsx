"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { coinFlip } from "@/lib/animations";

interface UserAvatarProps {
  src?: string;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  showBorder?: boolean;
  animated?: boolean;
  className?: string;
}

export function UserAvatar({
  src,
  name,
  size = "md",
  showBorder = false,
  animated = false,
  className,
}: UserAvatarProps) {
  const getSizeStyles = () => {
    switch (size) {
      case "xs":
        return "h-6 w-6 text-xs";
      case "sm":
        return "h-8 w-8 text-sm";
      case "lg":
        return "h-12 w-12 text-lg";
      case "xl":
        return "h-16 w-16 text-xl";
      default:
        return "h-10 w-10 text-base";
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const sizeStyles = getSizeStyles();

  return (
    <motion.div
      variants={animated ? coinFlip : undefined}
      initial="initial"
      animate="animate"
      whileHover={animated ? "hover" : undefined}
    >
      <Avatar 
        className={cn(
          sizeStyles,
          showBorder && "ring-2 ring-campus-purple-200",
          className
        )}
      >
        <AvatarImage src={src} alt={name} />
        <AvatarFallback className="bg-campus-purple-100 text-campus-purple-700 font-semibold">
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
    </motion.div>
  );
}
