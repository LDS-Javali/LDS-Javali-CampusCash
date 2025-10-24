import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import { Reward, Institution, RewardFilters } from "../types";

export class MarketplaceService {
  async getRewards(filters?: RewardFilters): Promise<Reward[]> {
    const params = new URLSearchParams();

    if (filters?.categoria && filters.categoria !== "todas") {
      params.append("categoria", filters.categoria);
    }

    if (filters?.precoMin) {
      params.append("precoMin", filters.precoMin.toString());
    }

    if (filters?.precoMax) {
      params.append("precoMax", filters.precoMax.toString());
    }

    if (filters?.ordenacao) {
      params.append("ordenacao", filters.ordenacao);
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.MARKETPLACE.REWARDS}?${queryString}`
      : API_ENDPOINTS.MARKETPLACE.REWARDS;

    return apiClient.get<Reward[]>(endpoint);
  }

  async getRewardById(id: number): Promise<Reward> {
    return apiClient.get<Reward>(`${API_ENDPOINTS.MARKETPLACE.REWARDS}/${id}`);
  }

  async getInstitutions(): Promise<Institution[]> {
    return apiClient.get<Institution[]>(API_ENDPOINTS.MARKETPLACE.INSTITUTIONS);
  }
}

export const marketplaceService = new MarketplaceService();
