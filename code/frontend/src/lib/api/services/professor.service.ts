import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import {
  Professor,
  UpdateProfileRequest,
  Statistics,
  Transaction,
  TransactionListResponse,
  Student,
  GiveCoinsRequest,
  Notification,
} from "../types";

export class ProfessorService {
  async getProfile(): Promise<Professor> {
    return apiClient.get<Professor>(API_ENDPOINTS.PROFESSOR.PROFILE);
  }

  async updateProfile(data: UpdateProfileRequest): Promise<Professor> {
    return apiClient.put<Professor>(API_ENDPOINTS.PROFESSOR.PROFILE, data);
  }

  async getBalance(): Promise<{ balance?: number; saldoMoedas?: number }> {
    return apiClient.get<{ balance?: number; saldoMoedas?: number }>(API_ENDPOINTS.PROFESSOR.BALANCE);
  }

  async getStatistics(): Promise<Statistics> {
    return apiClient.get<Statistics>(API_ENDPOINTS.PROFESSOR.STATISTICS);
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
      ? `${API_ENDPOINTS.PROFESSOR.TRANSACTIONS}?${queryString}`
      : API_ENDPOINTS.PROFESSOR.TRANSACTIONS;

    return apiClient.get<TransactionListResponse>(endpoint);
  }

  async getStudents(): Promise<Student[]> {
    return apiClient.get<Student[]>(API_ENDPOINTS.PROFESSOR.STUDENTS);
  }

  async searchStudents(query: string): Promise<Student[]> {
    return apiClient.get<Student[]>(
      `${API_ENDPOINTS.PROFESSOR.SEARCH_STUDENTS}?q=${encodeURIComponent(
        query
      )}`
    );
  }

  async giveCoins(data: GiveCoinsRequest): Promise<any> {
    return apiClient.post<any>(API_ENDPOINTS.PROFESSOR.GIVE_COINS, data);
  }

  async getNotifications(): Promise<Notification[]> {
    return apiClient.get<Notification[]>(API_ENDPOINTS.PROFESSOR.NOTIFICATIONS);
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    return apiClient.patch<void>(
      `${API_ENDPOINTS.PROFESSOR.MARK_NOTIFICATION_READ}/${notificationId}/read`
    );
  }

  async markAllNotificationsAsRead(): Promise<void> {
    return apiClient.patch<void>(API_ENDPOINTS.PROFESSOR.MARK_ALL_NOTIFICATIONS_READ, {});
  }

  async getUnreadNotificationsCount(): Promise<{ count: number }> {
    return apiClient.get<{ count: number }>(API_ENDPOINTS.PROFESSOR.UNREAD_COUNT);
  }
}

export const professorService = new ProfessorService();
