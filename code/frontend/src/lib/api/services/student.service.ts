import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import {
  Student,
  UpdateProfileRequest,
  Statistics,
  Transaction,
  TransactionListResponse,
  Coupon,
  Notification,
} from "../types";

export class StudentService {
  async getProfile(): Promise<Student> {
    return apiClient.get<Student>(API_ENDPOINTS.STUDENT.PROFILE);
  }

  async updateProfile(data: UpdateProfileRequest): Promise<Student> {
    return apiClient.put<Student>(API_ENDPOINTS.STUDENT.PROFILE, data);
  }

  async uploadAvatar(file: File): Promise<Student> {
    return apiClient.upload<Student>(API_ENDPOINTS.STUDENT.AVATAR, file, "avatar");
  }

  async getBalance(): Promise<{ balance?: number; saldoMoedas?: number }> {
    return apiClient.get<{ balance?: number; saldoMoedas?: number }>(API_ENDPOINTS.STUDENT.BALANCE);
  }

  async getStatistics(): Promise<Statistics> {
    return apiClient.get<Statistics>(API_ENDPOINTS.STUDENT.STATISTICS);
  }

  async getTransactions(params?: {
    limit?: number;
    offset?: number;
    type?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<TransactionListResponse> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());
    if (params?.type) queryParams.append("type", params.type);
    if (params?.from_date) queryParams.append("from_date", params.from_date);
    if (params?.to_date) queryParams.append("to_date", params.to_date);
    
    const queryString = queryParams.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.STUDENT.TRANSACTIONS}?${queryString}`
      : API_ENDPOINTS.STUDENT.TRANSACTIONS;
    
    return apiClient.get<TransactionListResponse>(endpoint);
  }

  async redeemReward(rewardId: number): Promise<Coupon> {
    return apiClient.post<Coupon>(API_ENDPOINTS.STUDENT.REDEEM, {
      reward_id: rewardId,
    });
  }

  async getNotifications(): Promise<Notification[]> {
    return apiClient.get<Notification[]>(API_ENDPOINTS.STUDENT.NOTIFICATIONS);
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    return apiClient.patch<void>(
      `${API_ENDPOINTS.STUDENT.MARK_NOTIFICATION_READ}/${notificationId}/read`
    );
  }

  async markAllNotificationsAsRead(): Promise<void> {
    return apiClient.patch<void>(API_ENDPOINTS.STUDENT.MARK_ALL_NOTIFICATIONS_READ, {});
  }

  async getUnreadNotificationsCount(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>(API_ENDPOINTS.STUDENT.UNREAD_COUNT);
  }

  async getCoupons(): Promise<Coupon[]> {
    return apiClient.get<Coupon[]>(API_ENDPOINTS.STUDENT.COUPONS);
  }
}

export const studentService = new StudentService();
