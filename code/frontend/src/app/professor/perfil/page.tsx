"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  
  UserAvatar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/design-system";
import { 
  User,
  Mail,
  Phone,
  MapPin,
  GraduationCap,
  Building2,
  Save,
  Upload,
  Edit3,
  Calendar
} from "lucide-react";
import { staggerContainer, slideUp } from "@/lib/animations";
import { toast } from "sonner";

export default function ProfessorPerfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  
  const [perfil, setPerfil] = useState({
    nome: "Prof. Dr. Carlos Eduardo Silva",
    email: "carlos.silva@puc-rio.br",
    cpf: "123.456.789-00",
    telefone: "(21) 99999-9999",
    departamento: "Departamento de Informática",
    instituicao: "PUC-Rio",
    especialidade: "Engenharia de Software",
    formacao: "Doutorado em Ciência da Computação",
    avatar: null as File | null,
  });

  const instituicoes = [
    "PUC-Rio",
    "USP",
    "Unicamp", 
    "UFRJ",
    "UFMG",
    "UFPR",
    "UFSC",
    "UFBA"
  ];

  const departamentos = [
    "Departamento de Informática",
    "Departamento de Matemática",
    "Departamento de Física",
    "Departamento de Química",
    "Departamento de Engenharia",
    "Departamento de Administração",
    "Departamento de Economia",
    "Departamento de Psicologia"
  ];

  const especialidades = [
    "Engenharia de Software",
    "Inteligência Artificial",
    "Ciência de Dados",
    "Segurança da Informação",
    "Desenvolvimento Web",
    "Mobile Development",
    "Machine Learning",
    "Sistemas Distribuídos"
  ];

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
    } catch (error) {
      toast.error("Erro ao salvar perfil. Tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPerfil(prev => ({ ...prev, avatar: file }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
            <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Meu Perfil
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas informações acadêmicas
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar e Info Básica */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="lg:col-span-1"
        >
          <Card>
            <CardContent className="p-6 text-center">
              <div className="space-y-4">
                <div className="relative inline-block">
                  <UserAvatar
                    name={perfil.nome}
                    size="xl"
                    showBorder
                    animated
                  />
                  {isEditing && (
                    <div className="absolute -bottom-2 -right-2">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        id="avatar-upload"
                      />
                      <label htmlFor="avatar-upload">
                        <Button size="sm" className="rounded-full p-2">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold">{perfil.nome}</h2>
                  <p className="text-muted-foreground">{perfil.email}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>{perfil.especialidade}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{perfil.instituicao}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Estatísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Saldo Atual</span>
                <span className="font-semibold text-campus-purple-600">850 moedas</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Distribuído</span>
                <span className="font-semibold text-green-600">1.150 moedas</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Alunos Reconhecidos</span>
                <span className="font-semibold text-blue-600">24 alunos</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Próxima Recarga</span>
                <span className="font-semibold text-campus-gold-600">Julho 2024</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Formulário de Edição */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="lg:col-span-2 space-y-6"
        >
          {/* Dados Pessoais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo</Label>
                  <Input
                    id="nome"
                    value={perfil.nome}
                    onChange={(e) => setPerfil(prev => ({ ...prev, nome: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Institucional</Label>
                  <Input
                    id="email"
                    type="email"
                    value={perfil.email}
                    onChange={(e) => setPerfil(prev => ({ ...prev, email: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    value={perfil.cpf}
                    onChange={(e) => setPerfil(prev => ({ ...prev, cpf: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={perfil.telefone}
                    onChange={(e) => setPerfil(prev => ({ ...prev, telefone: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados Acadêmicos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Dados Acadêmicos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instituicao">Instituição</Label>
                  <Select
                    value={perfil.instituicao}
                    onValueChange={(value) => setPerfil(prev => ({ ...prev, instituicao: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {instituicoes.map((instituicao) => (
                        <SelectItem key={instituicao} value={instituicao}>
                          {instituicao}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento</Label>
                  <Select
                    value={perfil.departamento}
                    onValueChange={(value) => setPerfil(prev => ({ ...prev, departamento: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {departamentos.map((departamento) => (
                        <SelectItem key={departamento} value={departamento}>
                          {departamento}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="especialidade">Especialidade</Label>
                  <Select
                    value={perfil.especialidade}
                    onValueChange={(value) => setPerfil(prev => ({ ...prev, especialidade: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {especialidades.map((especialidade) => (
                        <SelectItem key={especialidade} value={especialidade}>
                          {especialidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formacao">Formação</Label>
                  <Input
                    id="formacao"
                    value={perfil.formacao}
                    onChange={(e) => setPerfil(prev => ({ ...prev, formacao: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informações do Sistema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-campus-purple-50 border border-campus-purple-200 rounded-lg">
                  <h4 className="font-semibold text-campus-purple-800 mb-2">
                    Recarga Semestral
                  </h4>
                  <p className="text-sm text-campus-purple-700">
                    Você recebe 1.000 moedas a cada semestre para distribuir aos seus alunos.
                  </p>
                </div>
                <div className="p-4 bg-campus-gold-50 border border-campus-gold-200 rounded-lg">
                  <h4 className="font-semibold text-campus-gold-800 mb-2">
                    Próxima Recarga
                  </h4>
                  <p className="text-sm text-campus-gold-700">
                    Julho de 2024 - Semestre 2024.2
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botão Salvar */}
          {isEditing && (
            <motion.div
              variants={slideUp}
              initial="initial"
              animate="animate"
              className="flex justify-end"
            >
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 hover:from-campus-purple-600 hover:to-campus-blue-600"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
