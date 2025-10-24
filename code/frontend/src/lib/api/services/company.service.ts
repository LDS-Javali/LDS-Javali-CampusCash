import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import {
  Company,
  UpdateProfileRequest,
  Statistics,
  Reward,
  CreateRewardRequest,
  ValidateCouponRequest,
  ValidateCouponResponse,
} from "../types";

export class CompanyService {
  async getProfile(): Promise<Company> {
    return apiClient.get<Company>(API_ENDPOINTS.COMPANY.PROFILE);
  }

  async updateProfile(data: UpdateProfileRequest): Promise<Company> {
    return apiClient.put<Company>(API_ENDPOINTS.COMPANY.PROFILE, data);
  }

  async uploadLogo(file: File): Promise<Company> {
    return apiClient.upload<Company>(API_ENDPOINTS.COMPANY.LOGO, file);
  }

  async getStatistics(): Promise<Statistics> {
    return apiClient.get<Statistics>(API_ENDPOINTS.COMPANY.STATISTICS);
  }

  async getValidations(): Promise<any[]> {
    return apiClient.get<any[]>(API_ENDPOINTS.COMPANY.VALIDATIONS);
  }

  async getRewards(): Promise<Reward[]> {
    return apiClient.get<Reward[]>(API_ENDPOINTS.COMPANY.REWARDS);
  }

  async createReward(data: CreateRewardRequest): Promise<Reward> {
    return apiClient.post<Reward>(API_ENDPOINTS.COMPANY.REWARDS, data);
  }

  async uploadRewardImage(rewardId: number, file: File): Promise<Reward> {
    return apiClient.upload<Reward>(
      `${API_ENDPOINTS.COMPANY.REWARDS}/${rewardId}/image`,
      file
    );
  }

  async updateReward(rewardId: number, data: Partial<Reward>): Promise<Reward> {
    return apiClient.patch<Reward>(
      `${API_ENDPOINTS.COMPANY.REWARDS}/${rewardId}`,
      data
    );
  }

  async updateRewardStatus(rewardId: number, active: boolean): Promise<Reward> {
    return apiClient.patch<Reward>(
      `${API_ENDPOINTS.COMPANY.REWARDS}/${rewardId}/status`,
      { active }
    );
  }

  async deleteReward(rewardId: number): Promise<void> {
    return apiClient.delete<void>(
      `${API_ENDPOINTS.COMPANY.REWARDS}/${rewardId}`
    );
  }

  async getHistory(): Promise<any[]> {
    return apiClient.get<any[]>(API_ENDPOINTS.COMPANY.HISTORY);
  }

  async validateCoupon(
    data: ValidateCouponRequest
  ): Promise<ValidateCouponResponse> {
    return apiClient.post<ValidateCouponResponse>(
      API_ENDPOINTS.COMPANY.VALIDATE_COUPON,
      data
    );
  }
}

export const companyService = new CompanyService();
