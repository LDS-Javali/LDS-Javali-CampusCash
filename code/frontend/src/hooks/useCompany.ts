import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companyService } from "@/lib/api";
import type {
  UpdateProfileRequest,
  CreateRewardRequest,
  ValidateCouponRequest,
} from "@/lib/api/types";

export function useCompanyProfile() {
  return useQuery({
    queryKey: ["company", "profile"],
    queryFn: () => companyService.getProfile(),
    retry: false,
  });
}

export function useUpdateCompanyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      companyService.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "profile"] });
      toast.success("Perfil atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar perfil");
    },
  });
}

export function useUploadCompanyLogo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => companyService.uploadLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "profile"] });
      toast.success("Logo atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao fazer upload do logo");
    },
  });
}

export function useCompanyStatistics() {
  return useQuery({
    queryKey: ["company", "statistics"],
    queryFn: () => companyService.getStatistics(),
    retry: false,
  });
}

export function useCompanyValidations() {
  return useQuery({
    queryKey: ["company", "validations"],
    queryFn: () => companyService.getValidations(),
    retry: false,
  });
}

export function useCompanyRewards() {
  return useQuery({
    queryKey: ["company", "rewards"],
    queryFn: () => companyService.getRewards(),
    retry: false,
  });
}

export function useCreateReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRewardRequest) =>
      companyService.createReward(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "rewards"] });
      queryClient.invalidateQueries({ queryKey: ["company", "statistics"] });
      toast.success("Vantagem criada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar vantagem");
    },
  });
}

export function useUploadRewardImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rewardId, file }: { rewardId: number; file: File }) =>
      companyService.uploadRewardImage(rewardId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "rewards"] });
      toast.success("Imagem da vantagem atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao fazer upload da imagem");
    },
  });
}

export function useUpdateReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rewardId, data }: { rewardId: number; data: any }) =>
      companyService.updateReward(rewardId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "rewards"] });
      toast.success("Vantagem atualizada com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar vantagem");
    },
  });
}

export function useUpdateRewardStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rewardId, active }: { rewardId: number; active: boolean }) =>
      companyService.updateRewardStatus(rewardId, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "rewards"] });
      toast.success("Status da vantagem atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar status da vantagem");
    },
  });
}

export function useDeleteReward() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (rewardId: number) => companyService.deleteReward(rewardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", "rewards"] });
      queryClient.invalidateQueries({ queryKey: ["company", "statistics"] });
      toast.success("Vantagem excluída com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao excluir vantagem");
    },
  });
}

export function useCompanyHistory() {
  return useQuery({
    queryKey: ["company", "history"],
    queryFn: () => companyService.getHistory(),
    retry: false,
  });
}

export function useValidateCoupon() {
  return useMutation({
    mutationFn: (data: ValidateCouponRequest) =>
      companyService.validateCoupon(data),
    onSuccess: (response) => {
      if (response.valid) {
        toast.success("Cupom válido!");
      } else {
        toast.error(response.message || "Cupom inválido");
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao validar cupom");
    },
  });
}
