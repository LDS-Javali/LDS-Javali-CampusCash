export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "professor" | "company";
  createdAt: string;
  updatedAt: string;
}

export interface Student extends User {
  role: "student";
  cpf: string;
  registration: string;
  course: string;
  institution: string;
  avatarData?: string;
  balance: number;
}

export interface Professor extends User {
  role: "professor";
  cpf: string;
  department: string;
  institution: string;
  avatarData?: string;
  balance: number;
}

export interface Company extends User {
  role: "company";
  cnpj: string;
  description: string;
  logoData?: string;
  balance: number;
}

export interface Reward {
  id: number;
  title: string;
  description: string;
  cost: number;
  category: string;
  active: boolean;
  imageData?: string;
  companyId: number;
  company?: Company;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  type: "credit" | "debit";
  amount: number;
  description: string;
  userId: number;
  createdAt: string;
}

export interface Coupon {
  id: number;
  code: string;
  rewardId: number;
  reward?: Reward;
  studentId: number;
  student?: Student;
  used: boolean;
  usedAt?: string;
  createdAt: string;
}

export interface Institution {
  id: number;
  name: string;
  type: "university" | "college" | "school";
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface SignupStudentRequest {
  name: string;
  email: string;
  password: string;
  cpf: string;
  registration: string;
  course: string;
  institution: string;
}

export interface SignupCompanyRequest {
  name: string;
  email: string;
  password: string;
  cnpj: string;
  description: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  cpf?: string;
  registration?: string;
  course?: string;
  institution?: string;
  department?: string;
  description?: string;
}

export interface GiveCoinsRequest {
  studentId: number;
  amount: number;
  reason: string;
}

export interface CreateRewardRequest {
  title: string;
  description: string;
  cost: number;
  category: string;
}

export interface ValidateCouponRequest {
  code: string;
}

export interface ValidateCouponResponse {
  valid: boolean;
  coupon?: Coupon;
  message: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface RewardFilters {
  categoria?: string;
  precoMin?: number;
  precoMax?: number;
  ordenacao?: "preco_menor" | "preco_maior" | "nome" | "data";
}

export interface Statistics {
  totalCoins: number;
  totalTransactions: number;
  totalRewards?: number;
  totalStudents?: number;
  totalValidations?: number;
  recentActivity?: Transaction[];
}
