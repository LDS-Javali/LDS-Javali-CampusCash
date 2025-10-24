"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GraduationCap,
  Coins,
  Building2,
  ArrowRight,
  Users,
  Award,
  Zap,
  TrendingUp,
  Shield,
  Rocket,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const floatingCoinsRef = useRef<HTMLDivElement>(null);

  // Animação simples das moedas flutuantes (bolhas no aquário)
  useEffect(() => {
    if (floatingCoinsRef.current) {
      const coins = floatingCoinsRef.current.querySelectorAll(".floating-coin");
      coins.forEach((coin, index) => {
        const animation = coin.animate(
          [
            { transform: "translateY(0px) translateX(0px) rotate(0deg)" },
            { transform: "translateY(-20px) translateX(10px) rotate(5deg)" },
            { transform: "translateY(0px) translateX(-10px) rotate(-5deg)" },
            { transform: "translateY(10px) translateX(5px) rotate(2deg)" },
            { transform: "translateY(0px) translateX(0px) rotate(0deg)" },
          ],
          {
            duration: 3000 + index * 200,
            iterations: Infinity,
            easing: "ease-in-out",
          }
        );
      });
    }
  }, []);

  const features = [
    {
      icon: GraduationCap,
      title: "Para Alunos",
      description:
        "Receba moedas por bom desempenho e troque por vantagens exclusivas",
      color: "campus-purple",
      gradient: "from-purple-500 to-purple-600",
    },
    {
      icon: Coins,
      title: "Para Professores",
      description: "Distribua moedas para reconhecer o mérito dos seus alunos",
      color: "campus-blue",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: Building2,
      title: "Para Empresas",
      description: "Ofereça vantagens e conecte-se com estudantes talentosos",
      color: "campus-gold",
      gradient: "from-yellow-500 to-orange-500",
    },
  ];

  const stats = [
    { number: 5000, label: "Alunos Ativos", suffix: "+" },
    { number: 300, label: "Professores", suffix: "+" },
    { number: 50, label: "Empresas Parceiras", suffix: "+" },
    { number: 10000, label: "Moedas Distribuídas", suffix: "K+" },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Reconhecimento Instantâneo",
      description: "Recompense o mérito estudantil em tempo real",
    },
    {
      icon: TrendingUp,
      title: "Engajamento Aumentado",
      description: "Motive os alunos com incentivos tangíveis",
    },
    {
      icon: Shield,
      title: "Sistema Seguro",
      description: "Transações protegidas e auditáveis",
    },
    {
      icon: Rocket,
      title: "Fácil de Usar",
      description: "Interface intuitiva e moderna",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-yellow-50">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        </div>

        {/* Floating coins (bolhas no aquário) */}
        <div
          ref={floatingCoinsRef}
          className="absolute inset-0 pointer-events-none"
        >
          {[...Array(20)].map((_, i) => {
            // Posições mais espalhadas e aleatórias
            const positions = [
              { left: "10%", top: "15%" },
              { left: "25%", top: "25%" },
              { left: "40%", top: "10%" },
              { left: "60%", top: "20%" },
              { left: "80%", top: "15%" },
              { left: "15%", top: "40%" },
              { left: "35%", top: "35%" },
              { left: "55%", top: "45%" },
              { left: "75%", top: "40%" },
              { left: "90%", top: "35%" },
              { left: "20%", top: "60%" },
              { left: "45%", top: "65%" },
              { left: "65%", top: "70%" },
              { left: "85%", top: "60%" },
              { left: "5%", top: "80%" },
              { left: "30%", top: "85%" },
              { left: "50%", top: "80%" },
              { left: "70%", top: "85%" },
              { left: "95%", top: "80%" },
              { left: "12%", top: "50%" },
            ];

            const position = positions[i] || { left: "50%", top: "50%" };

            return (
              <div key={i} className="floating-coin absolute" style={position}>
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <Coins className="w-4 h-4 text-white" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full mb-8 shadow-lg">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Sistema de Mérito Estudantil
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
            CampusCash
          </h1>

          <p className="text-xl md:text-3xl text-gray-700 mb-12 max-w-3xl mx-auto font-light">
            Transforme{" "}
            <span className="font-bold text-purple-600">reconhecimento</span> em{" "}
            <span className="font-bold text-blue-600">oportunidades</span> reais
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
              >
                Começar Agora
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                  {stat.number.toLocaleString()}
                  {stat.suffix}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gradient-to-br from-purple-100 via-blue-100 to-yellow-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Uma plataforma completa para todos os envolvidos no ecossistema
              educacional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0"
                >
                  <CardContent className="p-8 relative">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}
                    ></div>

                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">Por Que CampusCash?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mais do que uma plataforma, uma revolução no reconhecimento
              estudantil
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-2xl mb-12 text-white/90 max-w-2xl mx-auto">
            Junte-se à comunidade CampusCash e transforme o reconhecimento
            estudantil
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/cadastro/aluno">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-10 py-6 bg-white text-purple-600 hover:bg-gray-100 shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105"
              >
                Cadastrar como Aluno
                <GraduationCap className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cadastro/empresa">
              <Button
                size="lg"
                className="text-lg px-10 py-6 border-2 border-white text-white bg-transparent hover:bg-white hover:text-purple-600 backdrop-blur transition-all duration-300"
              >
                Cadastrar como Empresa
                <Building2 className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-gray-400">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-white">CampusCash</span>
          </div>
          <p className="mb-4">Transformando reconhecimento em oportunidades</p>
          <p className="text-sm">
            &copy; 2025 CampusCash. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
