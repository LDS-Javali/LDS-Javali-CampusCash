"use client";

import { motion } from "framer-motion";
import { 
  StatCard, 
  
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button
} from "@/components/design-system";
import { 
  TrendingUp, 
  Gift, 
  Users, 
  ArrowRight,
  Building2,
  Calendar,
  ShoppingBag,
  BarChart3
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, slideUp } from "@/lib/animations";

export default function EmpresaDashboard() {
  // Mock data - substituir por dados reais da API
  const stats = [
    {
      title: "Vantagens Ativas",
      value: "12",
      trend: { value: 2, label: "este mês" },
      color: "purple" as const,
      icon: Gift,
    },
    {
      title: "Resgates Este Mês",
      value: "47",
      trend: { value: 15, label: "vs mês anterior" },
      color: "green" as const,
      icon: TrendingUp,
    },
    {
      title: "Receita em Moedas",
      value: "8.5K",
      trend: { value: 8, label: "este mês" },
      color: "gold" as const,
      icon: BarChart3,
    },
    {
      title: "Alunos Únicos",
      value: "156",
      trend: { value: 12, label: "novos este mês" },
      color: "blue" as const,
      icon: Users,
    },
  ];

  const resgatesRecentes = [
    {
      id: "1",
      aluno: "João Silva Santos",
      vantagem: "Desconto 30% Livraria Central",
      data: new Date("2024-01-15T10:30:00"),
      status: "usado",
      valor: 200,
    },
    {
      id: "2",
      aluno: "Maria Santos Costa",
      vantagem: "Almoço Grátis Restaurante",
      data: new Date("2024-01-14T14:20:00"),
      status: "pendente",
      valor: 150,
    },
    {
      id: "3",
      aluno: "Pedro Costa Lima",
      vantagem: "Desconto 20% Lanchonete",
      data: new Date("2024-01-13T16:45:00"),
      status: "usado",
      valor: 100,
    },
  ];

  const vantagensMaisPopulares = [
    { nome: "Desconto 30% Livraria", resgates: 23, receita: 4600 },
    { nome: "Almoço Grátis Restaurante", resgates: 18, receita: 2700 },
    { nome: "Desconto 20% Lanchonete", resgates: 15, receita: 1500 },
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
        {/* Resgates Recentes */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Resgates Recentes
              </CardTitle>
              <Link href="/empresa/historico">
                <Button variant="outline" size="sm">
                  Ver Todos
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {resgatesRecentes.map((resgate) => (
                <div
                  key={resgate.id}
                  className="flex items-center gap-4 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-campus-gold-100 to-campus-purple-100 rounded-lg flex items-center justify-center">
                    <Gift className="h-5 w-5 text-campus-gold-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {resgate.vantagem}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {resgate.aluno}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {resgate.data.toLocaleDateString("pt-BR")} às {resgate.data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs px-2 py-1 rounded-full ${
                      resgate.status === "usado" 
                        ? "bg-green-100 text-green-700" 
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {resgate.status === "usado" ? "Usado" : "Pendente"}
                    </div>
                    <div className="text-sm font-semibold text-campus-gold-600 mt-1">
                      {resgate.valor} moedas
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Vantagens Mais Populares */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Vantagens Mais Populares
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {vantagensMaisPopulares.map((vantagem, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">{vantagem.nome}</h4>
                    <span className="text-sm text-campus-gold-600 font-semibold">
                      {vantagem.receita} moedas
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(vantagem.resgates / 25) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {vantagem.resgates} resgates
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Informações Importantes */}
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Informações da Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">
                  Impacto Social
                </h4>
                <p className="text-sm text-green-700">
                  Você já beneficiou mais de 150 alunos diferentes!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
      >
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/empresa/vantagens/nova">
                <Button className="w-full h-20 flex flex-col gap-2 bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 hover:from-campus-purple-600 hover:to-campus-blue-600">
                  <Gift className="h-6 w-6" />
                  <span>Nova Vantagem</span>
                </Button>
              </Link>
              <Link href="/empresa/vantagens">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Building2 className="h-6 w-6" />
                  <span>Gerenciar</span>
                </Button>
              </Link>
              <Link href="/empresa/validar">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Users className="h-6 w-6" />
                  <span>Validar Cupons</span>
                </Button>
              </Link>
              <Link href="/empresa/historico">
                <Button variant="outline" className="w-full h-20 flex flex-col gap-2">
                  <Calendar className="h-6 w-6" />
                  <span>Histórico</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
