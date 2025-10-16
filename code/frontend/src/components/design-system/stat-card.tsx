"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cardHover, slideUp } from "@/lib/animations";

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
  color?: "purple" | "blue" | "gold" | "green" | "red";
  loading?: boolean;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  color = "purple",
  loading = false,
  className,
}: StatCardProps) {
  const getColorStyles = () => {
    switch (color) {
      case "blue":
        return {
          bg: "bg-campus-blue-50",
          border: "border-campus-blue-200",
          icon: "text-campus-blue-600",
          trend: "text-campus-blue-600",
        };
      case "gold":
        return {
          bg: "bg-campus-gold-50",
          border: "border-campus-gold-200",
          icon: "text-campus-gold-600",
          trend: "text-campus-gold-600",
        };
      case "green":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: "text-green-600",
          trend: "text-green-600",
        };
      case "red":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: "text-red-600",
          trend: "text-red-600",
        };
      default:
        return {
          bg: "bg-campus-purple-50",
          border: "border-campus-purple-200",
          icon: "text-campus-purple-600",
          trend: "text-campus-purple-600",
        };
    }
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    
    if (trend.value > 0) return TrendingUp;
    if (trend.value < 0) return TrendingDown;
    return Minus;
  };

  const getTrendColor = () => {
    if (!trend) return "";
    
    if (trend.value > 0) return "text-green-600";
    if (trend.value < 0) return "text-red-600";
    return "text-gray-600";
  };

  const colors = getColorStyles();
  const TrendIcon = getTrendIcon();

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Card 
        className={cn(
          "transition-all duration-200 hover:shadow-card-md",
          colors.bg,
          colors.border,
          className
        )}
        variants={cardHover}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              {trend && (
                <div className="flex items-center gap-1">
                  <TrendIcon className={cn("h-4 w-4", getTrendColor())} />
                  <span className={cn("text-sm font-medium", getTrendColor())}>
                    {trend.value > 0 ? "+" : ""}{trend.value}%
                  </span>
                  <span className="text-sm text-gray-500">{trend.label}</span>
                </div>
              )}
            </div>
            {Icon && (
              <div className={cn("p-3 rounded-lg", colors.bg)}>
                <Icon className={cn("h-6 w-6", colors.icon)} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
