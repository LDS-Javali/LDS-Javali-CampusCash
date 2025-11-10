import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { studentService, professorService } from "@/lib/api";
import { useAuthStore } from "@/store";

export function useNotifications() {
  const { user } = useAuthStore(); // Using useAuthStore, not useAuth
  const role = user?.role;

  return useQuery({
    queryKey: ["notifications", role],
    queryFn: () => {
      if (role === "student") {
        return studentService.getNotifications();
      } else if (role === "professor") {
        return professorService.getNotifications();
      }
      return [];
    },
    enabled: !!role && (role === "student" || role === "professor"),
    retry: false,
    refetchInterval: 30000, // Refetch a cada 30 segundos
  });
}

export function useUnreadNotificationsCount() {
  const { user } = useAuthStore();
  const role = user?.role;

  return useQuery({
    queryKey: ["notifications", "unread", role],
    queryFn: () => {
      if (role === "student") {
        return studentService.getUnreadNotificationsCount();
      } else if (role === "professor") {
        return professorService.getUnreadNotificationsCount();
      }
      return { count: 0 };
    },
    enabled: !!role && (role === "student" || role === "professor"),
    retry: false,
    refetchInterval: 30000, // Refetch a cada 30 segundos
  });
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const role = user?.role;

  return useMutation({
    mutationFn: (notificationId: number) => {
      if (role === "student") {
        return studentService.markNotificationAsRead(notificationId);
      } else if (role === "professor") {
        return professorService.markNotificationAsRead(notificationId);
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const role = user?.role;

  return useMutation({
    mutationFn: () => {
      if (role === "student") {
        return studentService.markAllNotificationsAsRead();
      } else if (role === "professor") {
        return professorService.markAllNotificationsAsRead();
      }
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unread"] });
    },
  });
}
