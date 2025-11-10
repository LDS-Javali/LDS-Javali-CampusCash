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
  cpf?: string;
  registration?: string;
  course?: string;
  institution?: string;
  rg?: string;
  address?: string;
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
  ID: number;
  Title: string;
  Description: string;
  Cost: number;
  Category: string;
  Active: boolean;
  ImageData?: string;
  ImageURL?: string;
  CompanyID: number;
  CompanyName?: string;
  Company?: Company;
  CreatedAt: string;
  UpdatedAt: string;
  ResgatesCount?: number;
}

export interface Transaction {
  ID: number;
  FromUserID?: number;
  ToUserID?: number;
  Amount: number;
  Message: string;
  Type: "give" | "redeem";
  RewardID?: number;
  CreatedAt: string;
  Code?: string;
  FromUserName?: string;
  FromUserEmail?: string;
  ToUserName?: string;
  RewardTitle?: string;
}

export interface TransactionListResponse {
  transactions: Transaction[];
  total: number;
  limit: number;
  offset: number;
}

export interface Coupon {
  ID: number;
  Code: string;
  Hash: string;
  RewardID: number;
  Reward?: Reward;
  StudentID: number;
  Student?: Student;
  Redeemed: boolean;
  UsedAt?: string;
  CreatedAt: string;
  ExpiresAt?: string;
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
  rg?: string;
  address?: string;
  registration?: string;
  course?: string;
  institution?: string;
  department?: string;
  description?: string;
}

export interface GiveCoinsRequest {
  to_student_id: number;
  amount: number;
  message: string;
}

export interface CreateRewardRequest {
  titulo: string;
  descricao: string;
  custoMoedas: number;
  categoria: string;
  imagem?: string;
}

export interface ValidateCouponRequest {
  codigo?: string;
  hash?: string;
}

export interface ValidateCouponResponse {
  success: boolean;
  coupon?: Coupon;
  student?: {
    id: number;
    name: string;
  };
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
  // Campos específicos do professor
  moedasDistribuidas?: number;
  alunosBeneficiados?: number;
  distribuicoesMes?: number;
  // Campos específicos do aluno
  moedasRecebidasMes?: number;
  professoresUnicos?: number;
  rank?: number;
  resgatesRealizados?: number;
}

export interface CompanyStatistics {
  vantagensAtivas: number;
  resgatesMes: number;
  receitaMoedas: number;
  alunosUnicos: number;
  totalVantagens: number;
  resgatesPendentes: number;
  vantagensAtivasPercentual?: number;
  resgatesMesPercentual?: number;
  receitaMoedasPercentual?: number;
  alunosUnicosPercentual?: number;
}

export interface Notification {
  ID: number;
  UserID: number;
  Type: "redeem" | "receive_coins" | "distribute";
  Title: string;
  Message: string;
  Read: boolean;
  CreatedAt: string;
  ReadAt?: string;
}
