import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import {
  Student,
  UpdateProfileRequest,
  Statistics,
  Transaction,
  Coupon,
} from "../types";

export class StudentService {
  async getProfile(): Promise<Student> {
    return apiClient.get<Student>(API_ENDPOINTS.STUDENT.PROFILE);
  }

  async updateProfile(data: UpdateProfileRequest): Promise<Student> {
    return apiClient.put<Student>(API_ENDPOINTS.STUDENT.PROFILE, data);
  }

  async uploadAvatar(file: File): Promise<Student> {
    return apiClient.upload<Student>(API_ENDPOINTS.STUDENT.AVATAR, file);
  }

  async getBalance(): Promise<{ balance: number }> {
    return apiClient.get<{ balance: number }>(API_ENDPOINTS.STUDENT.BALANCE);
  }

  async getStatistics(): Promise<Statistics> {
    return apiClient.get<Statistics>(API_ENDPOINTS.STUDENT.STATISTICS);
  }

  async getTransactions(): Promise<Transaction[]> {
    return apiClient.get<Transaction[]>(API_ENDPOINTS.STUDENT.TRANSACTIONS);
  }

  async getRewards(): Promise<any[]> {
    return apiClient.get<any[]>(API_ENDPOINTS.STUDENT.REWARDS);
  }

  async redeemReward(rewardId: number): Promise<Coupon> {
    return apiClient.post<Coupon>(API_ENDPOINTS.STUDENT.REDEEM, { rewardId });
  }

  async getCoupons(): Promise<Coupon[]> {
    return apiClient.get<Coupon[]>(API_ENDPOINTS.STUDENT.COUPONS);
  }
}

export const studentService = new StudentService();
