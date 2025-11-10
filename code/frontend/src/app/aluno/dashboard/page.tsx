"use client";

import { motion } from "framer-motion";
import {
  CoinBadge,
  TransactionItem,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  StatCard,
} from "@/components/design-system";
import {
  Wallet,
  Gift,
  ArrowRight,
  ShoppingBag,
  TrendingUp,
  Users,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, slideUp } from "@/lib/animations";
import {
  useStudentBalance,
  useStudentStatistics,
  useStudentTransactions,
  useRewards,
} from "@/hooks";
import { DashboardSkeleton } from "@/components/feedback/loading-states";

export default function AlunoDashboard() {
  const { data: balance, isLoading: balanceLoading } = useStudentBalance();
  const { data: statistics, isLoading: statsLoading } = useStudentStatistics();
  const { data: transactions, isLoading: transactionsLoading } =
    useStudentTransactions();
  const { data: rewards, isLoading: rewardsLoading } = useRewards({});

  const isLoading =
    balanceLoading || statsLoading || transactionsLoading || rewardsLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // A API retorna saldoMoedas (StudentBalanceDTO)
  const saldoMoedas = (balance?.saldoMoedas != null ? Number(balance.saldoMoedas) : null) 
    || (balance?.balance != null ? Number(balance.balance) : null)
    || 0;
  const transacoesRecentes =
    transactions?.transactions?.slice(0, 5).map((transacao) => ({
      id: transacao.ID,
      tipo: transacao.Type === "give" ? "recebimento" : "resgate",
      valor: transacao.Amount,
      descricao: transacao.Message || "Transação",
      data: new Date(transacao.CreatedAt),
      codigo: transacao.Code || undefined,
    })) || [];
  const vantagensDestaque =
    rewards?.slice(0, 3).map((reward) => ({
      id: reward.ID,
      titulo: reward.Title,
      descricao: reward.Description,
      preco: reward.Cost,
      empresa: reward.CompanyName || "Empresa",
      categoria: reward.Category,
      imagem: reward.ImageURL || null,
    })) || [];

  // Mapear dados do backend (StudentStatisticsDTO) para o formato esperado
  const statsData = statistics as any;
  const stats = [
    {
      title: "Moedas Recebidas",
      value: (statsData?.moedasRecebidasMes || 0).toString(),
      color: "green" as const,
      icon: TrendingUp,
    },
    {
      title: "Professores",
      value: (statsData?.professoresUnicos || 0).toString(),
      color: "purple" as const,
      icon: Users,
    },
    {
      title: "Resgates",
      value: (statsData?.resgatesRealizados || 0).toString(),
      color: "blue" as const,
      icon: Gift,
    },
    {
      title: "Rank",
      value: statsData?.rank ? `#${statsData.rank}` : "—",
      color: "gold" as const,
      icon: Trophy,
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
          background: 'linear-gradient(to right, #a855f7, #3b82f6)',
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
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat) => {
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
        {/* Transações Recentes */}
        <motion.div variants={slideUp} initial="initial" animate="animate">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Wallet className="h-5 w-5" />
                Últimas Transações
              </CardTitle>
              <Link href="/aluno/extrato">
                <Button variant="outline" size="sm">
                  Ver Todas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {transacoesRecentes.map((transacao) => (
                <TransactionItem key={transacao.id} {...transacao} />
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Vantagens em Destaque */}
        <motion.div variants={slideUp} initial="initial" animate="animate">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Vantagens em Destaque no Marketplace
              </CardTitle>
              <Link href="/aluno/marketplace">
                <Button variant="outline" size="sm">
                  Ver Todas
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {vantagensDestaque.map((vantagem) => (
                <div
                  key={vantagem.id}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-campus-purple-100 to-campus-blue-100 rounded-lg flex items-center justify-center">
                    <Gift className="h-6 w-6 text-campus-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">
                      {vantagem.titulo}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {vantagem.empresa}
                    </p>
                  </div>
                  <div className="text-right">
                    <CoinBadge amount={vantagem.preco || 0} variant="compact" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
