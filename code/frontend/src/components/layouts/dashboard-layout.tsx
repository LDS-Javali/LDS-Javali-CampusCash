"use client";

import { useEffect } from "react";
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

  // Ajusta sidebar baseado no tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    // Configura estado inicial
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          sidebarOpen ? "lg:ml-64" : "lg:ml-16",
          "ml-0"
        )}
      >
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <motion.main
          variants={slideUp}
          initial="initial"
          animate="animate"
          className={cn("min-h-[calc(100vh-4rem)] p-4 md:p-6", className)}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
