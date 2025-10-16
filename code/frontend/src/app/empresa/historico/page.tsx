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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge
} from "@/components/design-system";
import { 
  Download, 
  Filter, 
  Calendar,
  Search,
  ArrowLeft,
  ArrowRight,
  Gift,
  User,
  Eye,
  CheckCircle,
  Clock,
  Building2
} from "lucide-react";
import { staggerContainer, slideUp } from "@/lib/animations";

export default function HistoricoPage() {
  const [filtros, setFiltros] = useState({
    periodo: "todos",
    status: "todos",
    busca: "",
    ordenacao: "mais-recente",
  });

  // Mock data - substituir por dados reais da API
  const transacoes = [
    {
      id: "1",
      aluno: "João Silva",
      alunoId: "joao-silva",
      vantagem: "Desconto 30% Livraria Central",
      vantagemId: "desconto-livraria",
      moedas: 200,
      status: "resgatado",
      dataResgate: "2024-10-15T10:30:00Z",
      dataValidacao: "2024-10-15T11:00:00Z",
      codigoCupom: "CAMPUS2024-001",
      observacoes: "Cupom validado com sucesso"
    },
    {
      id: "2",
      aluno: "Maria Santos",
      alunoId: "maria-santos",
      vantagem: "Almoço Grátis Restaurante Universitário",
      vantagemId: "almoco-gratis",
      moedas: 150,
      status: "pendente",
      dataResgate: "2024-10-14T14:20:00Z",
      dataValidacao: null,
      codigoCupom: "CAMPUS2024-002",
      observacoes: "Aguardando validação"
    },
    {
      id: "3",
      aluno: "Pedro Costa",
      alunoId: "pedro-costa",
      vantagem: "Acesso Premium Academia",
      vantagemId: "academia-premium",
      moedas: 300,
      status: "resgatado",
      dataResgate: "2024-10-13T09:15:00Z",
      dataValidacao: "2024-10-13T09:30:00Z",
      codigoCupom: "CAMPUS2024-003",
      observacoes: "Acesso liberado"
    },
    {
      id: "4",
      aluno: "Ana Oliveira",
      alunoId: "ana-oliveira",
      vantagem: "Desconto 25% Lanchonete",
      vantagemId: "desconto-lanchonete",
      moedas: 100,
      status: "cancelado",
      dataResgate: "2024-10-12T16:45:00Z",
      dataValidacao: null,
      codigoCupom: "CAMPUS2024-004",
      observacoes: "Cupom cancelado pelo aluno"
    }
  ];

  const periodos = [
    "todos",
    "hoje",
    "esta-semana",
    "este-mes",
    "ultimos-3-meses",
    "ultimos-6-meses",
    "este-ano"
  ];

  const statusOptions = [
    "todos",
    "resgatado",
    "pendente",
    "cancelado"
  ];

  const transacoesFiltradas = transacoes.filter((transacao) => {
    if (filtros.status !== "todos" && transacao.status !== filtros.status) {
      return false;
    }
    if (filtros.busca && !transacao.aluno.toLowerCase().includes(filtros.busca.toLowerCase()) && 
        !transacao.vantagem.toLowerCase().includes(filtros.busca.toLowerCase())) {
      return false;
    }
    return true;
  });

  // Ordenação
  const transacoesOrdenadas = [...transacoesFiltradas].sort((a, b) => {
    switch (filtros.ordenacao) {
      case "mais-recente":
        return new Date(b.dataResgate).getTime() - new Date(a.dataResgate).getTime();
      case "mais-antigo":
        return new Date(a.dataResgate).getTime() - new Date(b.dataResgate).getTime();
      case "maior-valor":
        return b.moedas - a.moedas;
      case "menor-valor":
        return a.moedas - b.moedas;
      default:
        return 0;
    }
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resgatado":
        return <Badge className="bg-green-100 text-green-700">Resgatado</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>;
      case "cancelado":
        return <Badge className="bg-red-100 text-red-700">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Histórico de Resgates
            </h1>
            <p className="text-muted-foreground">
              Acompanhe todos os resgates realizados pelos alunos
            </p>
          </div>
          <Button
            onClick={() => console.log("Exportar dados")}
            variant="outline"
          >
            Exportar Dados
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Busca */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Nome do aluno ou vantagem..."
                    value={filtros.busca}
                    onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Período */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <Select
                  value={filtros.periodo}
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, periodo: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periodos.map((periodo) => (
                      <SelectItem key={periodo} value={periodo}>
                        {periodo === "todos" ? "Todos os períodos" : 
                         periodo === "hoje" ? "Hoje" :
                         periodo === "esta-semana" ? "Esta semana" :
                         periodo === "este-mes" ? "Este mês" :
                         periodo === "ultimos-3-meses" ? "Últimos 3 meses" :
                         periodo === "ultimos-6-meses" ? "Últimos 6 meses" :
                         periodo === "este-ano" ? "Este ano" : periodo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filtros.status}
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "todos" ? "Todos os status" : 
                         status === "resgatado" ? "Resgatado" :
                         status === "pendente" ? "Pendente" :
                         status === "cancelado" ? "Cancelado" : status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Ordenação */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Ordenar por</label>
                <Select
                  value={filtros.ordenacao}
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, ordenacao: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mais-recente">Mais recente</SelectItem>
                    <SelectItem value="mais-antigo">Mais antigo</SelectItem>
                    <SelectItem value="maior-valor">Maior valor</SelectItem>
                    <SelectItem value="menor-valor">Menor valor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de Transações */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        {transacoesOrdenadas.map((transacao) => (
          <motion.div key={transacao.id} variants={slideUp}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-campus-purple-100 to-campus-blue-100 rounded-lg flex items-center justify-center">
                        <Gift className="h-6 w-6 text-campus-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{transacao.vantagem}</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <User className="h-4 w-4" />
                          <span>{transacao.aluno}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Resgatado:</span>
                        <span className="font-medium">{formatarData(transacao.dataResgate)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Moedas:</span>
                        <span className="font-medium text-campus-gold-600">{transacao.moedas}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Código:</span>
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {transacao.codigoCupom}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(transacao.status)}
                      </div>
                    </div>

                    {transacao.observacoes && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-muted-foreground">{transacao.observacoes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    {transacao.status === "pendente" && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Validar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {transacoesOrdenadas.length === 0 && (
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="text-center py-12"
        >
          <Gift className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhuma transação encontrada
          </h3>
          <p className="text-muted-foreground mb-4">
            Tente ajustar os filtros para ver mais resultados
          </p>
          <Button
            variant="outline"
            onClick={() => setFiltros({
              periodo: "todos",
              status: "todos",
              busca: "",
              ordenacao: "mais-recente",
            })}
          >
            Limpar Filtros
          </Button>
        </motion.div>
      )}

      {/* Paginação */}
      {transacoesOrdenadas.length > 0 && (
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            Mostrando {transacoesOrdenadas.length} de {transacoes.length} transações
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled>
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
