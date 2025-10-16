"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Home, 
  Wallet, 
  ShoppingBag, 
  Gift, 
  User, 
  LogOut,
  Menu,
  X,
  GraduationCap,
  Users,
  Building2
} from "lucide-react";
import { useAuthStore } from "@/store";
import { useUIStore } from "@/store";
import { slideUp, staggerChildren } from "@/lib/animations";
import { UserAvatar } from "@/components/design-system";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const pathname = usePathname();

  const getMenuItems = () => {
    if (!user) return [];

    switch (user.role) {
      case "aluno":
        return [
          { href: "/aluno/dashboard", label: "Dashboard", icon: Home },
          { href: "/aluno/extrato", label: "Extrato", icon: Wallet },
          { href: "/aluno/marketplace", label: "Marketplace", icon: ShoppingBag },
          { href: "/aluno/cupons", label: "Meus Cupons", icon: Gift },
          { href: "/aluno/perfil", label: "Perfil", icon: User },
        ];
      case "professor":
        return [
          { href: "/professor/dashboard", label: "Dashboard", icon: Home },
          { href: "/professor/distribuir", label: "Distribuir Moedas", icon: Wallet },
          { href: "/professor/extrato", label: "Extrato", icon: GraduationCap },
          { href: "/professor/perfil", label: "Perfil", icon: User },
        ];
      case "empresa":
        return [
          { href: "/empresa/dashboard", label: "Dashboard", icon: Home },
          { href: "/empresa/vantagens", label: "Vantagens", icon: Gift },
          { href: "/empresa/validar", label: "Validar Cupons", icon: Users },
          { href: "/empresa/historico", label: "Histórico", icon: Building2 },
          { href: "/empresa/perfil", label: "Perfil", icon: User },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
    // Redirect to login page
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        variants={slideUp}
        initial="initial"
        animate="animate"
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-card border-r border-border transition-all duration-300",
          sidebarOpen ? "w-64" : "w-16",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <div className="h-8 w-8 bg-gradient-to-br from-campus-purple-500 to-campus-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-lg">CampusCash</span>
              </motion.div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleSidebar}
              className="p-2"
            >
              {sidebarOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Navigation */}
          <motion.nav
            variants={staggerChildren}
            initial="initial"
            animate="animate"
            className="flex-1 p-4 space-y-2"
          >
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <motion.div key={item.href} variants={slideUp}>
                  <Link href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        sidebarOpen ? "px-3" : "px-2",
                        isActive && "bg-campus-purple-100 text-campus-purple-700 hover:bg-campus-purple-200"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {sidebarOpen && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Button>
                  </Link>
                </motion.div>
              );
            })}
          </motion.nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            {user && (
              <div className="flex items-center gap-3">
                <UserAvatar
                  name={user.name}
                  size="sm"
                  animated
                />
                {sidebarOpen && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex-1 min-w-0"
                  >
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role}
                    </p>
                  </motion.div>
                )}
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className={cn(
                "w-full justify-start gap-3 mt-2 text-red-600 hover:text-red-700 hover:bg-red-50",
                sidebarOpen ? "px-3" : "px-2"
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {sidebarOpen && <span>Sair</span>}
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
