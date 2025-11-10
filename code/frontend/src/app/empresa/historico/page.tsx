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
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Building2,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { staggerContainer, slideUp } from "@/lib/animations";
import { useCompanyHistory } from "@/hooks";

export default function HistoricoPage() {
  const [filtros, setFiltros] = useState({
    periodo: "todos",
    status: "todos",
    busca: "",
    ordenacao: "mais-recente",
  });
  const [transacaoDetalhes, setTransacaoDetalhes] = useState<any>(null);

  const { data: history, isLoading: historyLoading } = useCompanyHistory();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = async (codigo: string) => {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiedCode(codigo);
      toast.success("Código copiado!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error("Erro ao copiar código");
    }
  };

  // Mapear dados da API para o formato esperado pelo frontend
  const transacoes =
    history?.map((transaction) => ({
      id: transaction.ID?.toString() || "",
      aluno:
        transaction.FromUserName ||
        transaction.FromUserEmail ||
        `Aluno ${transaction.FromUserID || ""}`,
      alunoEmail: transaction.FromUserEmail || "",
      alunoId: transaction.FromUserID?.toString() || "",
      vantagem: transaction.RewardTitle || "Vantagem",
      vantagemId: transaction.RewardID?.toString() || "",
      moedas: transaction.Amount || 0,
      status: transaction.Type === "redeem" ? "resgatado" : "pendente",
      dataResgate: transaction.CreatedAt || "",
      dataValidacao: null, // Não temos esse campo na Transaction
      codigoCupom: transaction.Code || "",
      observacoes: transaction.Message || "",
    })) || [];

  const periodos = [
    "todos",
    "hoje",
    "esta-semana",
    "este-mes",
    "ultimos-3-meses",
    "ultimos-6-meses",
    "este-ano",
  ];

  const statusOptions = ["todos", "resgatado", "pendente", "cancelado"];

  if (historyLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Histórico de Transações</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-campus-purple-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando histórico...</p>
        </div>
      </div>
    );
  }

  const transacoesFiltradas = transacoes.filter((transacao) => {
    // Filtro por status
    if (
      filtros.status &&
      filtros.status !== "todos" &&
      transacao.status !== filtros.status
    ) {
      return false;
    }

    // Filtro por busca
    if (
      filtros.busca &&
      filtros.busca.trim() !== "" &&
      !transacao.aluno.toLowerCase().includes(filtros.busca.toLowerCase()) &&
      !transacao.vantagem.toLowerCase().includes(filtros.busca.toLowerCase())
    ) {
      return false;
    }

    // Filtro por período
    if (filtros.periodo && filtros.periodo !== "todos") {
      const dataTransacao = new Date(transacao.dataResgate);
      const agora = new Date();
      const inicioDia = new Date(
        agora.getFullYear(),
        agora.getMonth(),
        agora.getDate()
      );

      let dataLimite: Date;
      switch (filtros.periodo) {
        case "hoje":
          dataLimite = inicioDia;
          break;
        case "esta-semana":
          dataLimite = new Date(inicioDia);
          dataLimite.setDate(dataLimite.getDate() - 7);
          break;
        case "este-mes":
          dataLimite = new Date(agora.getFullYear(), agora.getMonth(), 1);
          break;
        case "ultimos-3-meses":
          dataLimite = new Date(
            agora.getFullYear(),
            agora.getMonth() - 3,
            agora.getDate()
          );
          break;
        case "ultimos-6-meses":
          dataLimite = new Date(
            agora.getFullYear(),
            agora.getMonth() - 6,
            agora.getDate()
          );
          break;
        case "este-ano":
          dataLimite = new Date(agora.getFullYear(), 0, 1);
          break;
        default:
          return true;
      }

      if (dataTransacao < dataLimite) {
        return false;
      }
    }

    return true;
  });

  // Ordenação
  const transacoesOrdenadas = [...transacoesFiltradas].sort((a, b) => {
    switch (filtros.ordenacao) {
      case "mais-recente":
        return (
          new Date(b.dataResgate).getTime() - new Date(a.dataResgate).getTime()
        );
      case "mais-antigo":
        return (
          new Date(a.dataResgate).getTime() - new Date(b.dataResgate).getTime()
        );
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
        return (
          <Badge className="bg-yellow-100 text-yellow-700">Pendente</Badge>
        );
      case "cancelado":
        return <Badge className="bg-red-100 text-red-700">Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatarData = (data: string | Date) => {
    const date = typeof data === "string" ? new Date(data) : data;
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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
        </div>
      </div>

      {/* Filtros */}
      <motion.div variants={slideUp} initial="initial" animate="animate">
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
                    onChange={(e) =>
                      setFiltros((prev) => ({ ...prev, busca: e.target.value }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Período */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Período</label>
                <Select
                  value={filtros.periodo}
                  onValueChange={(value) =>
                    setFiltros((prev) => ({ ...prev, periodo: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {periodos.map((periodo) => (
                      <SelectItem key={periodo} value={periodo}>
                        {periodo === "todos"
                          ? "Todos os períodos"
                          : periodo === "hoje"
                          ? "Hoje"
                          : periodo === "esta-semana"
                          ? "Esta semana"
                          : periodo === "este-mes"
                          ? "Este mês"
                          : periodo === "ultimos-3-meses"
                          ? "Últimos 3 meses"
                          : periodo === "ultimos-6-meses"
                          ? "Últimos 6 meses"
                          : periodo === "este-ano"
                          ? "Este ano"
                          : periodo}
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
                  onValueChange={(value) =>
                    setFiltros((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status === "todos"
                          ? "Todos os status"
                          : status === "resgatado"
                          ? "Resgatado"
                          : status === "pendente"
                          ? "Pendente"
                          : status === "cancelado"
                          ? "Cancelado"
                          : status}
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
                  onValueChange={(value) =>
                    setFiltros((prev) => ({ ...prev, ordenacao: value }))
                  }
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
      {transacoesOrdenadas.length > 0 ? (
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
                          <h3 className="font-semibold text-lg">
                            {transacao.vantagem}
                          </h3>
                          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span className="font-medium">
                                {transacao.aluno}
                              </span>
                            </div>
                            {transacao.alunoEmail && (
                              <span className="text-xs ml-6">
                                {transacao.alunoEmail}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Resgatado:
                          </span>
                          <span className="font-medium">
                            {formatarData(transacao.dataResgate)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Moedas:</span>
                          <span className="font-medium text-campus-gold-600">
                            {transacao.moedas}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Código:</span>
                          <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                            <span className="font-mono text-sm">
                              {transacao.codigoCupom}
                            </span>
                            <button
                              onClick={() =>
                                handleCopyCode(transacao.codigoCupom)
                              }
                              className="hover:bg-gray-200 p-1 rounded transition-colors"
                              title="Copiar código"
                            >
                              {copiedCode === transacao.codigoCupom ? (
                                <Check className="h-3.5 w-3.5 text-green-600" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {getStatusBadge(transacao.status)}
                        </div>
                      </div>

                      {transacao.observacoes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            {transacao.observacoes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTransacaoDetalhes(transacao)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      {transacao.status === "pendente" && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
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
      ) : null}

      {/* Modal de Detalhes */}
      <Dialog
        open={!!transacaoDetalhes}
        onOpenChange={(open) => !open && setTransacaoDetalhes(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {transacaoDetalhes && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-campus-purple-600" />
                  Detalhes da Transação
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* Informações Principais */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-campus-purple-100 to-campus-blue-100 rounded-lg flex items-center justify-center">
                    <Gift className="h-8 w-8 text-campus-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl">
                      {transacaoDetalhes.vantagem}
                    </h3>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span className="font-medium">
                          {transacaoDetalhes.aluno}
                        </span>
                      </div>
                      {transacaoDetalhes.alunoEmail && (
                        <span className="ml-6 text-xs">
                          {transacaoDetalhes.alunoEmail}
                        </span>
                      )}
                    </div>
                  </div>
                  <Badge
                    className={
                      transacaoDetalhes.status === "resgatado"
                        ? "bg-green-100 text-green-700"
                        : transacaoDetalhes.status === "cancelado"
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }
                  >
                    {transacaoDetalhes.status === "resgatado"
                      ? "Resgatado"
                      : transacaoDetalhes.status === "cancelado"
                      ? "Cancelado"
                      : "Pendente"}
                  </Badge>
                </div>

                {/* Informações da Transação */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Resgatado em</span>
                      </div>
                      <p className="font-medium">
                        {formatarData(
                          typeof transacaoDetalhes.dataResgate === "string"
                            ? transacaoDetalhes.dataResgate
                            : transacaoDetalhes.dataResgate instanceof Date
                            ? transacaoDetalhes.dataResgate.toISOString()
                            : String(transacaoDetalhes.dataResgate)
                        )}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Gift className="h-4 w-4" />
                        <span>Moedas</span>
                      </div>
                      <p className="font-medium text-campus-gold-600">
                        {transacaoDetalhes.moedas}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">
                      Código do Cupom
                    </label>
                    <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                      <span className="font-mono text-sm flex-1 break-all">
                        {transacaoDetalhes.codigoCupom}
                      </span>
                      <button
                        onClick={() =>
                          handleCopyCode(transacaoDetalhes.codigoCupom)
                        }
                        className="hover:bg-gray-200 p-1.5 rounded transition-colors flex-shrink-0"
                        title="Copiar código"
                      >
                        {copiedCode === transacaoDetalhes.codigoCupom ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  {transacaoDetalhes.dataValidacao && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Validado em</span>
                      </div>
                      <p className="font-medium">
                        {formatarData(
                          typeof transacaoDetalhes.dataValidacao === "string"
                            ? transacaoDetalhes.dataValidacao
                            : transacaoDetalhes.dataValidacao instanceof Date
                            ? transacaoDetalhes.dataValidacao.toISOString()
                            : String(transacaoDetalhes.dataValidacao)
                        )}
                      </p>
                    </div>
                  )}
                </div>

                {transacaoDetalhes.observacoes && (
                  <div className="p-4 bg-muted/30 rounded-lg border">
                    <h4 className="text-sm font-semibold mb-2">Observações</h4>
                    <p className="text-sm text-muted-foreground">
                      {transacaoDetalhes.observacoes}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
            onClick={() =>
              setFiltros({
                periodo: "todos",
                status: "todos",
                busca: "",
                ordenacao: "mais-recente",
              })
            }
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
            Mostrando {transacoesOrdenadas.length} de {transacoes.length}{" "}
            transações
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
