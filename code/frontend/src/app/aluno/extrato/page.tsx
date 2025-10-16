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
  SelectValue
} from "@/components/design-system";
import { 
  Download, 
  Filter, 
  Calendar,
  Search,
  ArrowLeft,
  ArrowRight
} from "lucide-react";
import { staggerContainer, slideUp } from "@/lib/animations";

export default function AlunoExtrato() {
  const [filtros, setFiltros] = useState({
    tipo: "todos",
    dataInicio: "",
    dataFim: "",
    busca: "",
  });

  // Mock data - substituir por dados reais da API
  const transacoes = [
    {
      id: "1",
      tipo: "recebimento" as const,
      valor: 50,
      descricao: "Excelente participação na aula de Matemática",
      data: new Date("2024-01-15T10:30:00"),
      nome: "Prof. Silva",
      saldoApos: 1250,
    },
    {
      id: "2", 
      tipo: "resgate" as const,
      valor: 100,
      descricao: "Desconto 20% Restaurante Universitário",
      data: new Date("2024-01-14T14:20:00"),
      nome: "Restaurante Central",
      saldoApos: 1200,
    },
    {
      id: "3",
      tipo: "recebimento" as const,
      valor: 75,
      descricao: "Boa apresentação do projeto",
      data: new Date("2024-01-13T16:45:00"),
      nome: "Prof. Santos",
      saldoApos: 1300,
    },
    {
      id: "4",
      tipo: "resgate" as const,
      valor: 200,
      descricao: "Desconto 30% Livraria Central",
      data: new Date("2024-01-12T09:15:00"),
      nome: "Livraria Central",
      saldoApos: 1225,
    },
    {
      id: "5",
      tipo: "recebimento" as const,
      valor: 25,
      descricao: "Pontualidade nas aulas",
      data: new Date("2024-01-11T08:00:00"),
      nome: "Prof. Costa",
      saldoApos: 1425,
    },
  ];

  const saldoAtual = 1250;

  const handleExport = () => {
    // Implementar exportação para CSV/PDF
    console.log("Exportando extrato...");
  };

  const transacoesFiltradas = transacoes.filter((transacao) => {
    if (filtros.tipo !== "todos" && transacao.tipo !== filtros.tipo) {
      return false;
    }
    if (filtros.busca && !transacao.descricao.toLowerCase().includes(filtros.busca.toLowerCase())) {
      return false;
    }
    return true;
  });

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
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        className="bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Saldo Atual</h2>
            <CoinBadge 
              amount={saldoAtual} 
              variant="large" 
              animated 
              className="text-white"
            />
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Total de transações</p>
            <p className="text-white font-semibold">{transacoes.length}</p>
          </div>
        </div>
      </motion.div>

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
                  onValueChange={(value) => setFiltros(prev => ({ ...prev, tipo: value }))}
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
                  onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                />
              </div>

              {/* Data Fim */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Fim</label>
                <Input
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
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
                    onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
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
            <CardTitle>
              Transações ({transacoesFiltradas.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {transacoesFiltradas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma transação encontrada</p>
                <p className="text-sm">Ajuste os filtros para ver mais resultados</p>
              </div>
            ) : (
              transacoesFiltradas.map((transacao) => (
                <TransactionItem
                  key={transacao.id}
                  {...transacao}
                />
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
            Mostrando {transacoesFiltradas.length} de {transacoes.length} transações
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
