import { apiClient } from "../client";
import { API_ENDPOINTS } from "../config";
import {
  LoginRequest,
  LoginResponse,
  SignupStudentRequest,
  SignupCompanyRequest,
  User,
} from "../types";

export class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
  }

  async signupStudent(data: SignupStudentRequest): Promise<User> {
    return apiClient.post<User>(API_ENDPOINTS.AUTH.SIGNUP_STUDENT, data);
  }

  async signupCompany(data: SignupCompanyRequest): Promise<User> {
    return apiClient.post<User>(API_ENDPOINTS.AUTH.SIGNUP_COMPANY, data);
  }

  async getMe(): Promise<User> {
    return apiClient.get<User>(API_ENDPOINTS.AUTH.ME);
  }

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  }

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
