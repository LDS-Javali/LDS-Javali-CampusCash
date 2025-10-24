import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { professorService } from "@/lib/api";
import type { UpdateProfileRequest, GiveCoinsRequest } from "@/lib/api/types";

export function useProfessorProfile() {
  return useQuery({
    queryKey: ["professor", "profile"],
    queryFn: () => professorService.getProfile(),
    retry: false,
  });
}

export function useUpdateProfessorProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      professorService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professor", "profile"] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar perfil");
    },
  });
}

export function useProfessorBalance() {
  return useQuery({
    queryKey: ["professor", "balance"],
    queryFn: () => professorService.getBalance(),
    retry: false,
  });
}

export function useProfessorStatistics() {
  return useQuery({
    queryKey: ["professor", "statistics"],
    queryFn: () => professorService.getStatistics(),
    retry: false,
  });
}

export function useProfessorTransactions() {
  return useQuery({
    queryKey: ["professor", "transactions"],
    queryFn: () => professorService.getTransactions(),
    retry: false,
  });
}

export function useProfessorStudents() {
  return useQuery({
    queryKey: ["professor", "students"],
    queryFn: () => professorService.getStudents(),
    retry: false,
  });
}

export function useSearchStudents(query: string) {
  return useQuery({
    queryKey: ["professor", "search-students", query],
    queryFn: () => professorService.searchStudents(query),
    enabled: query.length > 2,
    retry: false,
  });
}

export function useTransferCoins() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { studentId: number; amount: number; reason: string }) =>
      professorService.transferCoins(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professor", "balance"] });
      queryClient.invalidateQueries({
        queryKey: ["professor", "transactions"],
      });
      queryClient.invalidateQueries({ queryKey: ["professor", "statistics"] });
      toast.success("Moedas transferidas com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao transferir moedas");
    },
  });
}

export function useGiveCoins() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GiveCoinsRequest) => professorService.giveCoins(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["professor", "balance"] });
      queryClient.invalidateQueries({
        queryKey: ["professor", "transactions"],
      });
      queryClient.invalidateQueries({ queryKey: ["professor", "statistics"] });
      toast.success("Moedas distribuídas com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao distribuir moedas");
    },
  });
}
