// Types para o sistema CampusCash
export type UserRole = "aluno" | "professor" | "empresa" | "admin";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Aluno extends User {
  role: "aluno";
  cpf: string;
  rg: string;
  endereco: string;
  instituicaoId: string;
  curso: string;
  saldoMoedas: number;
}

export interface Professor extends User {
  role: "professor";
  cpf: string;
  departamento: string;
  instituicaoId: string;
  saldoMoedas: number;
  proximaRecarga: Date;
}

export interface Empresa extends User {
  role: "empresa";
  cnpj: string;
  razaoSocial: string;
  nomeFantasia: string;
  telefone: string;
  endereco: string;
  logo?: string;
  categoria: string;
}

export interface Instituicao {
  id: string;
  nome: string;
  sigla: string;
  endereco: string;
  telefone: string;
  email: string;
}

export interface Transacao {
  id: string;
  tipo: "recebimento" | "resgate";
  valor: number;
  descricao: string;
  data: Date;
  alunoId: string;
  professorId?: string;
  empresaId?: string;
  vantagemId?: string;
  saldoApos: number;
}

export interface Vantagem {
  id: string;
  titulo: string;
  descricao: string;
  custoMoedas: number;
  imagem: string;
  empresaId: string;
  ativa: boolean;
  categoria: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Cupom {
  id: string;
  codigo: string;
  alunoId: string;
  vantagemId: string;
  empresaId: string;
  dataResgate: Date;
  usado: boolean;
  dataUso?: Date;
}

export interface Distribuicao {
  id: string;
  professorId: string;
  alunoId: string;
  quantidade: number;
  motivo: string;
  data: Date;
  saldoApos: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  role: UserRole;
}

export interface CadastroAlunoForm {
  nome: string;
  email: string;
  cpf: string;
  rg: string;
  endereco: string;
  instituicaoId: string;
  curso: string;
  password: string;
}

export interface CadastroEmpresaForm {
  nomeFantasia: string;
  razaoSocial: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  categoria: string;
  password: string;
}

export interface DistribuicaoForm {
  alunoId: string;
  quantidade: number;
  motivo: string;
}

export interface VantagemForm {
  titulo: string;
  descricao: string;
  custoMoedas: number;
  imagem: File | string;
  categoria: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter types
export interface TransactionFilter {
  tipo?: "recebimento" | "resgate";
  dataInicio?: Date;
  dataFim?: Date;
  page?: number;
  limit?: number;
}

export interface VantagemFilter {
  categoria?: string;
  empresaId?: string;
  precoMin?: number;
  precoMax?: number;
  ativa?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

// Dashboard stats
export interface DashboardStats {
  saldoMoedas: number;
  transacoesRecentes: Transacao[];
  proximaRecarga?: Date;
  totalDistribuido?: number;
  totalResgatado?: number;
  vantagensAtivas?: number;
  resgatesMes?: number;
}

// Notification types
export interface Notification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: "info" | "success" | "warning" | "error";
  lida: boolean;
  data: Date;
  userId: string;
}


