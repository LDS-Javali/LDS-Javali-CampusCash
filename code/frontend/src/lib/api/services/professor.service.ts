import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import {
  Professor,
  UpdateProfileRequest,
  Statistics,
  Transaction,
  Student,
  GiveCoinsRequest,
} from "../types";

export class ProfessorService {
  async getProfile(): Promise<Professor> {
    return apiClient.get<Professor>(API_ENDPOINTS.PROFESSOR.PROFILE);
  }

  async updateProfile(data: UpdateProfileRequest): Promise<Professor> {
    return apiClient.put<Professor>(API_ENDPOINTS.PROFESSOR.PROFILE, data);
  }

  async getBalance(): Promise<{ balance: number }> {
    return apiClient.get<{ balance: number }>(API_ENDPOINTS.PROFESSOR.BALANCE);
  }

  async getStatistics(): Promise<Statistics> {
    return apiClient.get<Statistics>(API_ENDPOINTS.PROFESSOR.STATISTICS);
  }

  async getTransactions(): Promise<Transaction[]> {
    return apiClient.get<Transaction[]>(API_ENDPOINTS.PROFESSOR.TRANSACTIONS);
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

  async transferCoins(data: {
    studentId: number;
    amount: number;
    reason: string;
  }): Promise<any> {
    return apiClient.post<any>(API_ENDPOINTS.PROFESSOR.TRANSFER, data);
  }

  async giveCoins(data: GiveCoinsRequest): Promise<any> {
    return apiClient.post<any>(API_ENDPOINTS.PROFESSOR.GIVE_COINS, data);
  }
}

export const professorService = new ProfessorService();
