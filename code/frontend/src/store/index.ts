// Zustand stores para estado global
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { User, Notification } from "@/lib/types";

// Auth Store
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        login: (user, token) => set({ user, token, isAuthenticated: true }),
        logout: () => set({ user: null, token: null, isAuthenticated: false }),
        setToken: (token) => set({ token }),
        setUser: (user) => set({ user }),
        setLoading: (isLoading) => set({ isLoading }),
        clearAuth: () =>
          set({ user: null, token: null, isAuthenticated: false }),
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          token: state.token,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    { name: "auth-store" }
  )
);

// UI Store
interface UIState {
  sidebarOpen: boolean;
  theme: "light" | "dark";
  notifications: Notification[];
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: "light" | "dark") => void;
  addNotification: (notification: Omit<Notification, "id" | "data">) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set, get) => ({
        sidebarOpen: true,
        theme: "light",
        notifications: [],
        toggleSidebar: () =>
          set((state) => ({ sidebarOpen: !state.sidebarOpen })),
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        setTheme: (theme) => set({ theme }),
        addNotification: (notification) => {
          const newNotification: Notification = {
            ...notification,
            id: crypto.randomUUID(),
            data: new Date(),
            lida: false,
          };
          set((state) => ({
            notifications: [newNotification, ...state.notifications],
          }));
        },
        markNotificationAsRead: (id) =>
          set((state) => ({
            notifications: state.notifications.map((n) =>
              n.id === id ? { ...n, lida: true } : n
            ),
          })),
        clearNotifications: () => set({ notifications: [] }),
      }),
      {
        name: "ui-storage",
        partialize: (state) => ({
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: "ui-store" }
  )
);

// Form Store para multi-step forms
interface FormState {
  currentStep: number;
  totalSteps: number;
  formData: Record<string, any>;
  errors: Record<string, string>;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (steps: number) => void;
  updateFormData: (data: Record<string, any>) => void;
  setErrors: (errors: Record<string, string>) => void;
  clearForm: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

export const useFormStore = create<FormState>()(
  devtools((set, get) => ({
    currentStep: 0,
    totalSteps: 0,
    formData: {},
    errors: {},
    setCurrentStep: (currentStep) => set({ currentStep }),
    setTotalSteps: (totalSteps) => set({ totalSteps }),
    updateFormData: (data) =>
      set((state) => ({
        formData: { ...state.formData, ...data },
      })),
    setErrors: (errors) => set({ errors }),
    clearForm: () =>
      set({
        currentStep: 0,
        formData: {},
        errors: {},
      }),
    nextStep: () => {
      const { currentStep, totalSteps } = get();
      if (currentStep < totalSteps - 1) {
        set({ currentStep: currentStep + 1 });
      }
    },
    prevStep: () => {
      const { currentStep } = get();
      if (currentStep > 0) {
        set({ currentStep: currentStep - 1 });
      }
    },
  }))
);
