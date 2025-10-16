// Hook para autenticação mock
import { useAuthStore } from "@/store";
import type { User } from "@/lib/types";

export function useMockAuth() {
  const { login, logout } = useAuthStore();
  
  const loginAsStudent = () => {
    const mockStudent: User = {
      id: "1",
      name: "João Silva",
      email: "joao.silva@email.com",
      role: "aluno",
      avatar: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    login(mockStudent);
  };
  
  const loginAsProfessor = () => {
    const mockProfessor: User = {
      id: "2",
      name: "Prof. Maria Santos", 
      email: "maria.santos@universidade.edu",
      role: "professor",
      avatar: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    login(mockProfessor);
  };
  
  const loginAsCompany = () => {
    const mockCompany: User = {
      id: "3",
      name: "Livraria Central",
      email: "contato@livrariacentral.com",
      role: "empresa",
      avatar: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    login(mockCompany);
  };
  
  return { 
    loginAsStudent, 
    loginAsProfessor, 
    loginAsCompany,
    logout 
  };
}
