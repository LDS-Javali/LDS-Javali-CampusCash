"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Menu } from "lucide-react";
import { useAuthStore, useUIStore } from "@/store";
import { UserAvatar } from "@/components/design-system";
import { slideDown } from "@/lib/animations";
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead } from "@/hooks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopBarProps {
  className?: string;
}

export function TopBar({ className }: TopBarProps) {
  const { user } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const { data: notifications = [], isLoading: notificationsLoading } = useNotifications();
  const markAsReadMutation = useMarkNotificationAsRead();
  const markAllAsReadMutation = useMarkAllNotificationsAsRead();

  const unreadNotifications = notifications.filter((n) => !n.Read).length;

  const handleMarkAsRead = async (notificationId: number, e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (notifications.find(n => n.ID === notificationId)?.Read) return;
    
    try {
      await markAsReadMutation.mutateAsync(notificationId);
    } catch (error) {
      console.error("Erro ao marcar notificação como lida:", error);
    }
  };

  return (
    <motion.header
      variants={slideDown}
      initial="initial"
      animate="animate"
      className={cn(
        "sticky top-0 z-40 h-16 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border",
        className
      )}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="relative h-9 w-9 p-0"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {unreadNotifications > 9 ? "9+" : unreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <div className="p-2 border-b flex items-center justify-between">
                <h4 className="font-semibold text-sm">Notificações</h4>
                {unreadNotifications > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={async (e) => {
                      e.stopPropagation();
                      try {
                        await markAllAsReadMutation.mutateAsync();
                      } catch (error) {
                        console.error("Erro ao marcar todas como lidas:", error);
                      }
                    }}
                    disabled={markAllAsReadMutation.isPending}
                  >
                    {markAllAsReadMutation.isPending ? "Marcando..." : "Marcar todas como lidas"}
                  </Button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notificationsLoading ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Carregando...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    Nenhuma notificação
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <DropdownMenuItem 
                      key={notification.ID} 
                      className={`p-3 cursor-pointer ${!notification.Read ? 'bg-muted/50 hover:bg-muted' : ''}`}
                      onClick={(e) => handleMarkAsRead(notification.ID, e)}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-sm font-medium flex-1 ${!notification.Read ? 'font-semibold' : ''}`}>
                            {notification.Title}
                          </p>
                          {!notification.Read && (
                            <span className="h-2 w-2 bg-blue-500 rounded-full mt-1 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {notification.Message}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(notification.CreatedAt).toLocaleDateString(
                            "pt-BR"
                          )}
                        </p>
                      </div>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-9 px-2">
                <UserAvatar
                  name={user?.name || "Usuário"}
                  size="sm"
                  showBorder
                />
                <span className="ml-2 hidden md:block">{user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="p-2">
                <p className="font-semibold text-sm">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user?.role}
                </p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.header>
  );
}
