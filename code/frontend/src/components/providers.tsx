"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store";
import { authService } from "@/lib/api";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: (failureCount, error: any) => {
              // Don't retry on 4xx errors
              if (error?.status >= 400 && error?.status < 500) {
                return false;
              }
              return failureCount < 3;
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  const { setUser, setToken, isAuthenticated } = useAuthStore();

  // Load user from token on app startup
  useEffect(() => {
    const loadUserFromToken = async () => {
      const token = authService.getToken();
      if (token && !isAuthenticated) {
        try {
          const user = await authService.getMe();
          setUser(user);
          setToken(token);
        } catch (error) {
          console.error("Failed to load user from token:", error);
          authService.logout();
        }
      }
    };

    loadUserFromToken();
  }, [setUser, setToken, isAuthenticated]);

  // Force light mode
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.add("light");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
