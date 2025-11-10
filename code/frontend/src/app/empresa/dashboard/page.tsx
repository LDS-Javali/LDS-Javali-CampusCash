"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  StatCard,
  CoinBadge,
} from "@/components/design-system";
import {
  Gift,
  ArrowRight,
  Building2,
  Calendar,
  ShoppingBag,
  Users,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, slideUp } from "@/lib/animations";
import { useCompanyHistory, useCompanyStatistics } from "@/hooks";
import { DashboardSkeleton } from "@/components/feedback/loading-states";

export default function EmpresaDashboard() {
  const { data: history, isLoading: historyLoading } = useCompanyHistory();
  const { data: statistics, isLoading: statsLoading } = useCompanyStatistics();

  if (historyLoading || statsLoading) {
    return <DashboardSkeleton />;
  }

  // Mapear histórico de transações - mostrar todos os resgates
  const resgatesRecentes =
    history?.map((transaction) => ({
      id: transaction.ID?.toString() || "",
      aluno: transaction.FromUserName || transaction.FromUserEmail || `Aluno ${transaction.FromUserID || ""}`,
      alunoEmail: transaction.FromUserEmail || "",
      vantagem: transaction.RewardTitle || "Vantagem",
      moedas: transaction.Amount || 0,
      data: transaction.CreatedAt || "",
    })) || [];

  const stats = [
    {
      title: "Vantagens Ativas",
      value: (statistics?.vantagensAtivas || 0).toString(),
      color: "green" as const,
      icon: Gift,
    },
    {
      title: "Resgates Este Mês",
      value: (statistics?.resgatesMes || 0).toString(),
      color: "blue" as const,
      icon: ShoppingBag,
    },
    {
      title: "Receita em Moedas",
      value: (statistics?.receitaMoedas || 0).toString(),
      color: "gold" as const,
      icon: DollarSign,
    },
    {
      title: "Alunos Únicos",
      value: (statistics?.alunosUnicos || 0).toString(),
      color: "purple" as const,
      icon: Users,
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
              Visão geral da sua empresa no CampusCash
            </p>
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

      {/* Histórico de Resgates */}
      <motion.div variants={slideUp} initial="initial" animate="animate">
        <Card className="h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Histórico de Resgates
            </CardTitle>
            <Link href="/empresa/historico">
              <Button variant="outline" size="sm">
                Ver Todos
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
            {resgatesRecentes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-sm">Nenhum resgate encontrado</p>
                <p className="text-xs mt-2">Os resgates aparecerão aqui quando houver</p>
              </div>
            ) : (
              resgatesRecentes.map((resgate) => (
                <div
                  key={resgate.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{resgate.vantagem}</p>
                    <p className="text-xs font-medium text-foreground truncate">
                      {resgate.aluno}
                    </p>
                    {resgate.alunoEmail && (
                      <p className="text-xs text-muted-foreground truncate">
                        {resgate.alunoEmail}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(resgate.data).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <CoinBadge amount={resgate.moedas} variant="compact" />
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Ações Rápidas */}
      <motion.div variants={slideUp} initial="initial" animate="animate">
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/empresa/vantagens/nova" className="block">
                <Button className="w-full h-24 flex flex-col items-center justify-center gap-2">
                  <Gift className="h-6 w-6" />
                  <span className="text-sm font-medium">Nova Vantagem</span>
                </Button>
              </Link>
              <Link href="/empresa/vantagens" className="block">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2"
                >
                  <Building2 className="h-6 w-6" />
                  <span className="text-sm font-medium">Gerenciar</span>
                </Button>
              </Link>
              <Link href="/empresa/validar" className="block">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2"
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm font-medium">Validar Cupons</span>
                </Button>
              </Link>
              <Link href="/empresa/historico" className="block">
                <Button
                  variant="outline"
                  className="w-full h-24 flex flex-col items-center justify-center gap-2"
                >
                  <Calendar className="h-6 w-6" />
                  <span className="text-sm font-medium">Histórico</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
