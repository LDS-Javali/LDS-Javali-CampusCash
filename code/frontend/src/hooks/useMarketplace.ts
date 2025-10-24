import { useQuery } from "@tanstack/react-query";
import { marketplaceService } from "@/lib/api";
import type { RewardFilters } from "@/lib/api/types";

export function useRewards(filters?: RewardFilters) {
  return useQuery({
    queryKey: ["marketplace", "rewards", filters],
    queryFn: () => marketplaceService.getRewards(filters),
    retry: false,
  });
}

export function useRewardById(id: number) {
  return useQuery({
    queryKey: ["marketplace", "reward", id],
    queryFn: () => marketplaceService.getRewardById(id),
    enabled: !!id,
    retry: false,
  });
}

export function useInstitutions() {
  return useQuery({
    queryKey: ["marketplace", "institutions"],
    queryFn: () => marketplaceService.getInstitutions(),
    retry: false,
  });
}
