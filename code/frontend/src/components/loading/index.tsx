"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/design-system";
import { Shimmer } from "./animations";

// Skeleton para cards de stats
export function StatCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Shimmer className="w-10 h-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Shimmer className="h-4 w-24" />
              <Shimmer className="h-6 w-16" />
            </div>
          </div>
          <Shimmer className="h-3 w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton para lista de transações
export function TransactionListSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Shimmer className="h-6 w-32" />
      </CardHeader>
      <CardContent className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-4 p-3 rounded-lg border"
          >
            <Shimmer className="w-10 h-10 rounded-lg" />
            <div className="flex-1 space-y-2">
              <Shimmer className="h-4 w-3/4" />
              <Shimmer className="h-3 w-1/2" />
            </div>
            <Shimmer className="h-6 w-16" />
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}

// Skeleton para grid de vantagens
export function VantageGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <div className="aspect-video">
              <Shimmer className="w-full h-full rounded-t-lg" />
            </div>
            <CardContent className="p-4 space-y-3">
              <Shimmer className="h-5 w-3/4" />
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-2/3" />
              <div className="flex justify-between items-center">
                <Shimmer className="h-6 w-16" />
                <Shimmer className="h-8 w-24" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

// Skeleton para formulários
export function FormSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Shimmer className="h-6 w-40" />
      </CardHeader>
      <CardContent className="space-y-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-2">
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-10 w-full" />
          </div>
        ))}
        <div className="flex gap-4">
          <Shimmer className="h-10 w-24" />
          <Shimmer className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton para tabelas
export function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Shimmer className="h-6 w-32" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Header */}
          <div className="grid grid-cols-4 gap-4 p-3 border-b">
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-4 w-24" />
            <Shimmer className="h-4 w-16" />
            <Shimmer className="h-4 w-20" />
          </div>
          {/* Rows */}
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 p-3">
              <Shimmer className="h-4 w-24" />
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-4 w-20" />
              <Shimmer className="h-4 w-16" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton para dashboard
export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <Shimmer className="h-8 w-48" />
        <Shimmer className="h-4 w-64" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransactionListSkeleton />
        <Card>
          <CardHeader>
            <Shimmer className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="space-y-2">
                <Shimmer className="h-4 w-full" />
                <Shimmer className="h-2 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Loading spinner customizado
export function LoadingSpinner({ size = "md", className = "" }: { size?: "sm" | "md" | "lg", className?: string }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <div className="w-full h-full border-2 border-campus-purple-200 border-t-campus-purple-600 rounded-full" />
    </motion.div>
  );
}

// Loading overlay
export function LoadingOverlay({ isLoading, children }: { isLoading: boolean, children: React.ReactNode }) {
  if (!isLoading) return <>{children}</>;

  return (
    <div className="relative">
      {children}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    </div>
  );
}
