import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "@/lib/api";
import { useAuthStore } from "@/store";
import type {
  LoginRequest,
  SignupStudentRequest,
  SignupCompanyRequest,
} from "@/lib/api/types";

export function useLogin() {
  const { login } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      authService.setToken(response.token);
      login(response.user, response.token);
      toast.success("Login realizado com sucesso!");

      // Redirecionar baseado no role
      switch (response.user.role) {
        case "student":
          router.push("/aluno/dashboard");
          break;
        case "professor":
          router.push("/professor/dashboard");
          break;
        case "company":
          router.push("/empresa/dashboard");
          break;
        default:
          router.push("/");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao fazer login");
    },
  });
}

export function useSignupStudent() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupStudentRequest) => authService.signupStudent(data),
    onSuccess: () => {
      toast.success(
        "Cadastro realizado com sucesso! Faça login para continuar."
      );
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao realizar cadastro");
    },
  });
}

export function useSignupCompany() {
  const router = useRouter();

  return useMutation({
    mutationFn: (data: SignupCompanyRequest) => authService.signupCompany(data),
    onSuccess: () => {
      toast.success(
        "Cadastro realizado com sucesso! Faça login para continuar."
      );
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao realizar cadastro");
    },
  });
}

export function useMe() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authService.getMe(),
    enabled: isAuthenticated,
    retry: false,
  });
}

export function useLogout() {
  const { logout } = useAuthStore();
  const router = useRouter();

  return () => {
    authService.logout();
    logout();
    toast.success("Logout realizado com sucesso!");
    router.push("/");
  };
}
