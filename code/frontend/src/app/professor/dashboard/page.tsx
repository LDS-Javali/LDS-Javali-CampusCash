"use client";

import { motion } from "framer-motion";
import {
  CoinBadge,
  StatCard,
  TransactionItem,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/design-system";
import {
  Wallet,
  TrendingUp,
  Users,
  ArrowRight,
  GraduationCap,
  Calendar,
  Gift,
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, slideUp } from "@/lib/animations";
import {
  useProfessorBalance,
  useProfessorStatistics,
  useProfessorTransactions,
} from "@/hooks";
import { DashboardSkeleton } from "@/components/feedback/loading-states";
import { useAuthStore } from "@/store";

export default function ProfessorDashboard() {
  const { user } = useAuthStore();
  const { data: balance, isLoading: balanceLoading } = useProfessorBalance();
  const { data: statistics, isLoading: statsLoading } =
    useProfessorStatistics();
  const { data: transactions, isLoading: transactionsLoading } =
    useProfessorTransactions();

  const isLoading = balanceLoading || statsLoading || transactionsLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Filtrar apenas distribuições do professor para alunos
  // Excluir recargas do sistema (FromUserID = null) e resgates (Type = "redeem")
  // Excluir também distribuições automáticas (créditos semestrais)
  const transacoesFiltradas = transactions?.transactions?.filter(
    (transacao) => 
      transacao.FromUserID != null && 
      Number(transacao.FromUserID) === Number(user?.id) &&
      transacao.Type === "give" &&
      transacao.ToUserID != null &&
      !transacao.Message?.toLowerCase().includes("crédito semestral") &&
      !transacao.Message?.toLowerCase().includes("distribuição automática")
  ) || [];

  // Mapear dados da API para o formato esperado pelo frontend (mesma lógica do extrato)
  const distribuicoes = transacoesFiltradas.map((transacao) => ({
    id: String(transacao.ID),
    alunoId: transacao.ToUserID?.toString() || "",
    alunoNome: transacao.ToUserName || transacao.ToUserEmail || `Aluno ${transacao.ToUserID}`,
    quantidade: transacao.Amount,
    motivo: transacao.Message || "Distribuição de moedas",
    data: new Date(transacao.CreatedAt),
  }));

  // Calcular estatísticas a partir das distribuições (mesma fonte do extrato)
  const saldoMoedas = (balance?.saldoMoedas != null ? Number(balance.saldoMoedas) : null) 
    || (balance?.balance != null ? Number(balance.balance) : null)
    || 0;
  const totalDistribuido = distribuicoes.reduce(
    (sum, dist) => sum + dist.quantidade,
    0
  );
  const totalDistribuicoes = distribuicoes.length;
  const alunosReconhecidos = new Set(distribuicoes.map((d) => d.alunoId)).size;

  const distribuicoesRecentes = distribuicoes
    .slice(0, 5)
    .map((distribuicao) => ({
      id: distribuicao.id,
      data: distribuicao.data,
      nome: distribuicao.alunoNome,
      valor: distribuicao.quantidade,
      message: distribuicao.motivo,
    }));

  const stats = [
    {
      title: "Total Distribuído",
      value: totalDistribuido.toString(),
      color: "green" as const,
      icon: TrendingUp,
    },
    {
      title: "Alunos Reconhecidos",
      value: alunosReconhecidos.toString(),
      color: "purple" as const,
      icon: Users,
    },
    {
      title: "Distribuições",
      value: totalDistribuicoes.toString(),
      color: "blue" as const,
      icon: GraduationCap,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Visão geral da sua conta CampusCash
            </p>
          </div>
        </div>
      </div>

      {/* Saldo Principal */}
      <div 
        className="relative rounded-xl p-6 text-white shadow-lg"
        style={{
          background: 'linear-gradient(to right, #3b82f6, #a855f7)',
          opacity: 1,
          visibility: 'visible',
          display: 'block',
          zIndex: 1
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-white">Seu Saldo</h2>
            <CoinBadge amount={saldoMoedas} variant="large" light />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.title} variants={slideUp}>
              <StatCard
                title={stat.title}
                value={stat.value}
                icon={Icon}
                color={stat.color}
              />
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribuições Recentes */}
        <motion.div variants={slideUp} initial="initial" animate="animate" className="flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Distribuições Recentes
              </CardTitle>
              <Link href="/professor/extrato">
                <Button variant="outline" size="sm">
                  Ver Todas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              {distribuicoesRecentes.length > 0 ? (
                distribuicoesRecentes.map((distribuicao) => (
                  <div
                    key={distribuicao.id}
                    className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-campus-blue-100 to-campus-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-5 w-5 text-campus-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {distribuicao.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Para: {distribuicao.nome}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {distribuicao.data?.toLocaleDateString("pt-BR") ||
                          "Data não disponível"}{" "}
                        às{" "}
                        {distribuicao.data?.toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }) || "Hora não disponível"}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-lg font-semibold text-green-600">
                        +{distribuicao.valor}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">Nenhuma distribuição recente</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Informações Importantes */}
        <motion.div variants={slideUp} initial="initial" animate="animate" className="flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex-1">
              <div className="p-4 bg-campus-blue-50 border border-campus-blue-200 rounded-lg">
                <h4 className="font-semibold text-campus-blue-800 mb-2">
                  Recarga Semestral
                </h4>
                <p className="text-sm text-campus-blue-700">
                  Você recebe moedas automaticamente a cada 15 segundos para distribuir aos
                  seus alunos.
                </p>
              </div>

              <div className="p-4 bg-campus-gold-50 border border-campus-gold-200 rounded-lg">
                <h4 className="font-semibold text-campus-gold-800 mb-2">
                  Dicas para Distribuição
                </h4>
                <ul className="text-sm text-campus-gold-700 space-y-1">
                  <li>• Reconheça participação ativa em aula</li>
                  <li>• Premie trabalhos bem executados</li>
                  <li>• Incentive pontualidade e assiduidade</li>
                  <li>• Valorize colaboração entre alunos</li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  Impacto Positivo
                </h4>
                <p className="text-sm text-green-700">
                  Você já reconheceu {alunosReconhecidos} alunos diferentes este
                  semestre, contribuindo para um ambiente acadêmico mais
                  motivador!
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div variants={slideUp} initial="initial" animate="animate">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/professor/distribuir">
                <Button
                  variant="default"
                  size="lg"
                  className="w-full h-20 flex flex-col gap-2"
                >
                  <Gift className="h-6 w-6" />
                  <span>Distribuir Moedas</span>
                </Button>
              </Link>
              <Link href="/professor/extrato">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full h-20 flex flex-col gap-2"
                >
                  <Wallet className="h-6 w-6" />
                  <span>Ver Extrato</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
