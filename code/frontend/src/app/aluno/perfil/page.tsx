"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
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
  SelectValue,
  Textarea
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
  Edit3
} from "lucide-react";
import { staggerContainer, slideUp } from "@/lib/animations";
import { toast } from "sonner";

export default function AlunoPerfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Mock data - substituir por dados reais da API
  const [perfil, setPerfil] = useState({
    nome: "João Silva Santos",
    email: "joao.silva@email.com",
    cpf: "123.456.789-00",
    rg: "12.345.678-9",
    telefone: "(11) 99999-9999",
    endereco: "Rua das Flores, 123, Centro",
    cidade: "São Paulo",
    estado: "SP",
    cep: "01234-567",
    instituicao: "PUC-Rio",
    curso: "Engenharia de Software",
    periodo: "8º período",
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

  const estados = [
    "SP", "RJ", "MG", "RS", "PR", "SC", "BA", "GO", "PE", "CE"
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
              Gerencie suas informações pessoais
            </p>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? "outline" : "default"}
          >
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
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
                  <div className="w-24 h-24 bg-gradient-to-br from-campus-purple-500 to-campus-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {perfil.nome.charAt(0)}
                  </div>
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
                    <span>{perfil.curso}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{perfil.instituicao}</span>
                  </div>
                </div>
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
                  <Label htmlFor="email">Email</Label>
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
                  <Label htmlFor="rg">RG</Label>
                  <Input
                    id="rg"
                    value={perfil.rg}
                    onChange={(e) => setPerfil(prev => ({ ...prev, rg: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
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
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Endereço
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="endereco">Endereço Completo</Label>
                <Textarea
                  id="endereco"
                  value={perfil.endereco}
                  onChange={(e) => setPerfil(prev => ({ ...prev, endereco: e.target.value }))}
                  disabled={!isEditing}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade">Cidade</Label>
                  <Input
                    id="cidade"
                    value={perfil.cidade}
                    onChange={(e) => setPerfil(prev => ({ ...prev, cidade: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado">Estado</Label>
                  <Select
                    value={perfil.estado}
                    onValueChange={(value) => setPerfil(prev => ({ ...prev, estado: value }))}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {estados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cep">CEP</Label>
                  <Input
                    id="cep"
                    value={perfil.cep}
                    onChange={(e) => setPerfil(prev => ({ ...prev, cep: e.target.value }))}
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
                  <Label htmlFor="instituicao">Instituição de Ensino</Label>
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
                  <Label htmlFor="curso">Curso</Label>
                  <Input
                    id="curso"
                    value={perfil.curso}
                    onChange={(e) => setPerfil(prev => ({ ...prev, curso: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodo">Período</Label>
                <Input
                  id="periodo"
                  value={perfil.periodo}
                  onChange={(e) => setPerfil(prev => ({ ...prev, periodo: e.target.value }))}
                  disabled={!isEditing}
                />
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
