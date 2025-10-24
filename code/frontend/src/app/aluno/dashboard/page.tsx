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
  Gift,
  ArrowRight,
  Star,
  ShoppingBag,
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

  const saldoMoedas = balance?.balance || 0;
  const transacoesRecentes = transactions?.slice(0, 5) || [];
  const vantagensDestaque = rewards?.slice(0, 3) || [];

  const stats = [
    {
      title: "Moedas Recebidas",
      value: statistics?.totalCoins?.toString() || "0",
      trend: { value: 0, label: "este mês" },
      color: "green" as const,
      icon: TrendingUp,
    },
    {
      title: "Vantagens Resgatadas",
      value: statistics?.totalRewards?.toString() || "0",
      trend: { value: 0, label: "este mês" },
      color: "purple" as const,
      icon: Gift,
    },
    {
      title: "Transações",
      value: statistics?.totalTransactions?.toString() || "0",
      trend: { value: 0, label: "este mês" },
      color: "blue" as const,
      icon: Star,
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
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        className="bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 rounded-xl p-6 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Seu Saldo</h2>
            <CoinBadge
              amount={saldoMoedas}
              variant="large"
              animated
              className="text-white"
            />
          </div>
          <div className="text-right">
            <p className="text-white/80 text-sm">Próxima recarga</p>
            <p className="text-white font-semibold">Semestre 2024.2</p>
          </div>
        </div>
      </motion.div>

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
                trend={stat.trend}
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
                Vantagens em Destaque
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
                    <CoinBadge
                      amount={vantagem.custoMoedas}
                      variant="compact"
                    />
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
