"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Wallet,
  ShoppingBag,
  Gift,
  LogOut,
  Menu,
  X,
  GraduationCap,
  Users,
  Building2,
} from "lucide-react";
import { useAuthStore } from "@/store";
import { useUIStore } from "@/store";
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
      case "student":
        return [
          { href: "/aluno/dashboard", label: "Dashboard", icon: Home },
          { href: "/aluno/extrato", label: "Extrato", icon: Wallet },
          {
            href: "/aluno/marketplace",
            label: "Marketplace",
            icon: ShoppingBag,
          },
          { href: "/aluno/cupons", label: "Meus Cupons", icon: Gift },
        ];
      case "professor":
        return [
          { href: "/professor/dashboard", label: "Dashboard", icon: Home },
          {
            href: "/professor/distribuir",
            label: "Distribuir Moedas",
            icon: Wallet,
          },
          { href: "/professor/extrato", label: "Extrato", icon: GraduationCap },
        ];
      case "company":
        return [
          { href: "/empresa/dashboard", label: "Dashboard", icon: Home },
          { href: "/empresa/vantagens", label: "Vantagens", icon: Gift },
          { href: "/empresa/validar", label: "Validar Cupons", icon: Users },
          { href: "/empresa/historico", label: "Histórico", icon: Building2 },
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
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-card border-r border-border transition-all duration-300",
          // Desktop: sempre visível, alterna entre expandida (w-64) e colapsada (w-16)
          "hidden lg:block",
          sidebarOpen ? "lg:w-64" : "lg:w-16",
          // Mobile: overlay que aparece/desaparece
          sidebarOpen && "block w-64",
          className
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            {sidebarOpen && (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 bg-gradient-to-br from-campus-purple-500 to-campus-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">C</span>
                </div>
                <span className="font-bold text-lg">CampusCash</span>
              </div>
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
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={cn(
                        "w-full justify-start gap-3",
                        sidebarOpen ? "px-3" : "px-2",
                        isActive &&
                          "bg-campus-purple-100 text-campus-purple-700 hover:bg-campus-purple-200"
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {sidebarOpen && (
                        <span className="truncate">{item.label}</span>
                      )}
                    </Button>
                  </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-border">
            {user && (
              <div className="flex items-center gap-3">
                <UserAvatar name={user.name || "Usuário"} size="sm" />
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user.name || "Usuário"}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {user.role === "student"
                        ? "Aluno"
                        : user.role === "professor"
                        ? "Professor"
                        : "Empresa"}
                    </p>
                  </div>
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
      </aside>
    </>
  );
}
