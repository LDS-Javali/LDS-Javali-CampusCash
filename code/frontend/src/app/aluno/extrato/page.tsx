"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TransactionItem,
  CoinBadge,
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
} from "@/components/design-system";
import { Filter, Calendar, Search, ArrowLeft, ArrowRight } from "lucide-react";
import { staggerContainer, slideUp } from "@/lib/animations";
import { useStudentTransactions, useStudentBalance } from "@/hooks";

export default function AlunoExtrato() {
  const [filtros, setFiltros] = useState({
    tipo: "todos",
    dataInicio: "",
    dataFim: "",
    busca: "",
  });

  const { data: transactions, isLoading: transactionsLoading } =
    useStudentTransactions();
  const { data: balance, isLoading: balanceLoading } = useStudentBalance();

  // Mapear dados da API para o formato esperado pelo frontend
  const transacoes =
    transactions?.transactions?.map((transacao) => ({
      id: transacao.ID,
      tipo:
        transacao.Type === "give"
          ? ("recebimento" as const)
          : ("resgate" as const),
      valor: transacao.Amount,
      descricao: transacao.Message || "Transação",
      data: new Date(transacao.CreatedAt),
      nome:
        transacao.FromUserName ||
        (transacao.FromUserID ? "Professor" : "Sistema"),
      codigo: transacao.Code || undefined,
    })) || [];

  // A API retorna saldoMoedas (StudentBalanceDTO)
  const saldoAtual = (balance?.saldoMoedas != null ? Number(balance.saldoMoedas) : null) 
    || (balance?.balance != null ? Number(balance.balance) : null)
    || 0;

  const transacoesFiltradas = transacoes.filter((transacao) => {
    // Filtro por tipo
    if (filtros.tipo && filtros.tipo !== "todos" && transacao.tipo !== filtros.tipo) {
      return false;
    }

    // Filtro por busca
    if (
      filtros.busca &&
      filtros.busca.trim() !== "" &&
      !transacao.descricao.toLowerCase().includes(filtros.busca.toLowerCase())
    ) {
      return false;
    }

    // Filtro por data início
    if (filtros.dataInicio && filtros.dataInicio.trim() !== "") {
      const dataInicio = new Date(filtros.dataInicio + "T00:00:00");
      const transacaoDate = new Date(transacao.data);
      
      // Comparar apenas a data (ignorar hora)
      const dataInicioOnly = new Date(
        dataInicio.getFullYear(),
        dataInicio.getMonth(),
        dataInicio.getDate()
      );
      const transacaoDateOnly = new Date(
        transacaoDate.getFullYear(),
        transacaoDate.getMonth(),
        transacaoDate.getDate()
      );
      
      if (transacaoDateOnly < dataInicioOnly) {
        return false;
      }
    }

    // Filtro por data fim
    if (filtros.dataFim && filtros.dataFim.trim() !== "") {
      const dataFim = new Date(filtros.dataFim + "T23:59:59");
      const transacaoDate = new Date(transacao.data);
      
      // Comparar apenas a data (ignorar hora)
      const dataFimOnly = new Date(
        dataFim.getFullYear(),
        dataFim.getMonth(),
        dataFim.getDate()
      );
      const transacaoDateOnly = new Date(
        transacaoDate.getFullYear(),
        transacaoDate.getMonth(),
        transacaoDate.getDate()
      );
      
      if (transacaoDateOnly > dataFimOnly) {
        return false;
      }
    }

    return true;
  });

  if (transactionsLoading || balanceLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Extrato</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-campus-purple-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando extrato...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Extrato
            </h1>
            <p className="text-muted-foreground">
              Histórico completo das suas transações
            </p>
          </div>
        </div>
      </div>

      {/* Saldo Atual */}
      <div 
        className="relative rounded-xl p-6 text-white shadow-lg"
        style={{
          background: 'linear-gradient(to right, #a855f7, #3b82f6)',
          opacity: 1,
          visibility: 'visible',
          display: 'block',
          zIndex: 1
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-white">Saldo Atual</h2>
            <CoinBadge amount={saldoAtual} variant="large" light />
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Total de transações</p>
            <p className="text-white font-semibold">{transacoes.length}</p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <motion.div variants={slideUp} initial="initial" animate="animate">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Tipo de Transação */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select
                  value={filtros.tipo}
                  onValueChange={(value) =>
                    setFiltros((prev) => ({ ...prev, tipo: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="recebimento">Recebimentos</SelectItem>
                    <SelectItem value="resgate">Resgates</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data Início */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Início</label>
                <Input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      dataInicio: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Data Fim */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Fim</label>
                <Input
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) =>
                    setFiltros((prev) => ({ ...prev, dataFim: e.target.value }))
                  }
                />
              </div>

              {/* Busca */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Descrição..."
                    value={filtros.busca}
                    onChange={(e) =>
                      setFiltros((prev) => ({ ...prev, busca: e.target.value }))
                    }
                    className="pl-10"
                  />
                </div>
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
      >
        <Card>
          <CardHeader>
            <CardTitle>Transações ({transacoesFiltradas.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transacoesFiltradas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma transação encontrada</p>
                <p className="text-sm">
                  Ajuste os filtros para ver mais resultados
                </p>
              </div>
            ) : (
              transacoesFiltradas.map((transacao) => (
                <TransactionItem key={transacao.id} {...transacao} />
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Paginação */}
      {transacoesFiltradas.length > 0 && (
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            Mostrando {transacoesFiltradas.length} de {transacoes.length}{" "}
            transações
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled>
              Próxima
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
