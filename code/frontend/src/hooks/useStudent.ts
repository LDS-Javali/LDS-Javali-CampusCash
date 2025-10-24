import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { studentService } from "@/lib/api";
import type { UpdateProfileRequest } from "@/lib/api/types";

export function useStudentProfile() {
  return useQuery({
    queryKey: ["student", "profile"],
    queryFn: () => studentService.getProfile(),
    retry: false,
  });
}

export function useUpdateStudentProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      studentService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "profile"] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar perfil");
    },
  });
}

export function useUploadStudentAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => studentService.uploadAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "profile"] });
      toast.success("Avatar atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao fazer upload do avatar");
    },
  });
}

export function useStudentBalance() {
  return useQuery({
    queryKey: ["student", "balance"],
    queryFn: () => studentService.getBalance(),
    retry: false,
  });
}

export function useStudentStatistics() {
  return useQuery({
    queryKey: ["student", "statistics"],
    queryFn: () => studentService.getStatistics(),
    retry: false,
  });
}

export function useStudentTransactions() {
  return useQuery({
    queryKey: ["student", "transactions"],
    queryFn: () => studentService.getTransactions(),
    retry: false,
  });
}

export function useStudentRewards() {
  return useQuery({
    queryKey: ["student", "rewards"],
    queryFn: () => studentService.getRewards(),
    retry: false,
  });
}

export function useRedeemReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rewardId: number) => studentService.redeemReward(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "balance"] });
      queryClient.invalidateQueries({ queryKey: ["student", "transactions"] });
      queryClient.invalidateQueries({ queryKey: ["student", "coupons"] });
      toast.success("Vantagem resgatada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao resgatar vantagem");
    },
  });
}

export function useStudentCoupons() {
  return useQuery({
    queryKey: ["student", "coupons"],
    queryFn: () => studentService.getCoupons(),
    retry: false,
  });
}
