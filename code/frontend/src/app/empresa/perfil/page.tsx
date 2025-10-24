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
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/design-system";
import { 
  Building2,
  Mail,
  Phone,
  MapPin,
  Save,
  Upload,
  Edit3,
  Calendar,
  Users,
  Gift
} from "lucide-react";
import { staggerContainer, slideUp } from "@/lib/animations";
import { toast } from "sonner";

export default function EmpresaPerfilPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  
  const [perfil, setPerfil] = useState({
    nome: "Livraria Central",
    email: "contato@livrariacentral.com.br",
    telefone: "(21) 99999-9999",
    endereco: "Rua das Flores, 123, Centro",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    cep: "20000-000",
    cnpj: "12.345.678/0001-90",
    descricao: "Livraria especializada em livros acadêmicos e didáticos, oferecendo descontos exclusivos para estudantes universitários.",
    categoria: "Educação",
    avatar: null as File | null,
  });

  const categorias = [
    "Alimentação",
    "Educação",
    "Esportes",
    "Serviços",
    "Tecnologia",
    "Saúde",
    "Beleza",
    "Entretenimento",
    "Varejo",
    "Outros"
  ];

  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
    "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
    "RS", "RO", "RR", "SC", "SP", "SE", "TO"
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
              Perfil da Empresa
            </h1>
            <p className="text-muted-foreground">
              Gerencie as informações da sua empresa
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
                      <label 
                        htmlFor="avatar-upload"
                        className="inline-flex items-center justify-center rounded-full p-2 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer transition-colors"
                      >
                        <Upload className="h-4 w-4" />
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
                    <Building2 className="h-4 w-4" />
                    <span>{perfil.categoria}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{perfil.cidade}, {perfil.estado}</span>
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
                <span className="text-sm text-muted-foreground">Vantagens Ativas</span>
                <span className="font-semibold text-campus-purple-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Resgates Este Mês</span>
                <span className="font-semibold text-green-600">47</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Receita Total</span>
                <span className="font-semibold text-campus-gold-600">8.5K moedas</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Alunos Únicos</span>
                <span className="font-semibold text-blue-600">156</span>
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
          {/* Dados da Empresa */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Dados da Empresa
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome da Empresa</Label>
                  <Input
                    id="nome"
                    value={perfil.nome}
                    onChange={(e) => setPerfil(prev => ({ ...prev, nome: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    value={perfil.cnpj}
                    onChange={(e) => setPerfil(prev => ({ ...prev, cnpj: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select
                  value={perfil.categoria}
                  onValueChange={(value) => setPerfil(prev => ({ ...prev, categoria: value }))}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição da Empresa</Label>
                <Textarea
                  id="descricao"
                  placeholder="Descreva sua empresa e os serviços oferecidos..."
                  value={perfil.descricao}
                  onChange={(e) => setPerfil(prev => ({ ...prev, descricao: e.target.value }))}
                  rows={4}
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

          {/* Informações da Parceria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações da Parceria
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-campus-purple-50 border border-campus-purple-200 rounded-lg">
                  <h4 className="font-semibold text-campus-purple-800 mb-2">
                    Parceria Ativa
                  </h4>
                  <p className="text-sm text-campus-purple-700">
                    Sua empresa está ativa no CampusCash desde Janeiro de 2024.
                  </p>
                </div>
                <div className="p-4 bg-campus-gold-50 border border-campus-gold-200 rounded-lg">
                  <h4 className="font-semibold text-campus-gold-800 mb-2">
                    Performance
                  </h4>
                  <p className="text-sm text-campus-gold-700">
                    Suas vantagens têm excelente aceitação entre os estudantes.
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
