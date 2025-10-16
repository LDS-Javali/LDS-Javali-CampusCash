"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Sidebar } from "./sidebar";
import { TopBar } from "./top-bar";
import { useUIStore } from "@/store";
import { slideUp } from "@/lib/animations";

interface DashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardLayout({ children, className }: DashboardLayoutProps) {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className={cn(
        "transition-all duration-300 ease-in-out",
        sidebarOpen ? "ml-64" : "ml-16"
      )}>
        {/* Top Bar */}
        <TopBar />
        
        {/* Page Content */}
        <motion.main
          variants={slideUp}
          initial="initial"
          animate="animate"
          className={cn(
            "min-h-[calc(100vh-4rem)] p-6",
            className
          )}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
