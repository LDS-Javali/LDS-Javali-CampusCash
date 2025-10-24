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

export default function ProfessorDashboard() {
  const { data: balance, isLoading: balanceLoading } = useProfessorBalance();
  const { data: statistics, isLoading: statsLoading } =
    useProfessorStatistics();
  const { data: transactions, isLoading: transactionsLoading } =
    useProfessorTransactions();

  const isLoading = balanceLoading || statsLoading || transactionsLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const saldoMoedas = balance?.balance || 0;
  const proximaRecarga = new Date();
  const totalDistribuido = statistics?.totalCoins || 0;
  const alunosReconhecidos = statistics?.totalStudents || 0;

  const distribuicoesRecentes = transactions?.slice(0, 5) || [];

  const stats = [
    {
      title: "Total Distribuído",
      value: totalDistribuido.toString(),
      trend: { value: 0, label: "este semestre" },
      color: "green" as const,
      icon: TrendingUp,
    },
    {
      title: "Alunos Reconhecidos",
      value: alunosReconhecidos.toString(),
      trend: { value: 0, label: "este mês" },
      color: "purple" as const,
      icon: Users,
    },
    {
      title: "Transações",
      value: statistics?.totalTransactions?.toString() || "0",
      trend: { value: 0, label: "este mês" },
      color: "blue" as const,
      icon: GraduationCap,
    },
  ];

  const diasParaRecarga = Math.ceil(
    (proximaRecarga.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

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
        className="bg-gradient-to-r from-campus-blue-500 to-campus-purple-500 rounded-xl p-6 text-white"
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
            <p className="text-white font-semibold">
              {diasParaRecarga > 0
                ? `Em ${diasParaRecarga} dias`
                : "Recarga disponível"}
            </p>
            <p className="text-white/80 text-sm">
              {proximaRecarga.toLocaleDateString("pt-BR")}
            </p>
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
        {/* Distribuições Recentes */}
        <motion.div variants={slideUp} initial="initial" animate="animate">
          <Card>
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
            <CardContent className="space-y-4">
              {distribuicoesRecentes.map((distribuicao) => (
                <div
                  key={distribuicao.id}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-campus-blue-100 to-campus-purple-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-campus-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {distribuicao.descricao}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Para: {distribuicao.nome}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {distribuicao.data.toLocaleDateString("pt-BR")} às{" "}
                      {distribuicao.data.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-green-600">
                      +{distribuicao.valor}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Saldo: {distribuicao.saldoApos}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Informações Importantes */}
        <motion.div variants={slideUp} initial="initial" animate="animate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-campus-blue-50 border border-campus-blue-200 rounded-lg">
                <h4 className="font-semibold text-campus-blue-800 mb-2">
                  Recarga Semestral
                </h4>
                <p className="text-sm text-campus-blue-700 mb-2">
                  Você recebe 1.000 moedas a cada semestre para distribuir aos
                  seus alunos.
                </p>
                <p className="text-sm text-campus-blue-700">
                  Próxima recarga: {proximaRecarga.toLocaleDateString("pt-BR")}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/professor/distribuir">
                <Button className="w-full h-20 flex flex-col gap-2 bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 hover:from-campus-purple-600 hover:to-campus-blue-600">
                  <Gift className="h-6 w-6" />
                  <span>Distribuir Moedas</span>
                </Button>
              </Link>
              <Link href="/professor/extrato">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col gap-2"
                >
                  <Wallet className="h-6 w-6" />
                  <span>Ver Extrato</span>
                </Button>
              </Link>
              <Link href="/professor/perfil">
                <Button
                  variant="outline"
                  className="w-full h-20 flex flex-col gap-2"
                >
                  <Users className="h-6 w-6" />
                  <span>Meu Perfil</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
