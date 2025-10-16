"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  GraduationCap, 
  Coins, 
  Building2, 
  ArrowRight,
  Star,
  Users,
  Award,
  Zap,
  Play,
  Sparkles,
  TrendingUp,
  Shield,
  Rocket,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useMockAuth } from "@/hooks/useMockAuth";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function LandingPage() {
  const { loginAsStudent, loginAsProfessor, loginAsCompany } = useMockAuth();
  const router = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const floatingCoinsRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleMockLogin = (role: string) => {
    switch (role) {
      case 'aluno':
        loginAsStudent();
        router.push('/aluno/dashboard');
        break;
      case 'professor':
        loginAsProfessor();
        router.push('/professor/dashboard');
        break;
      case 'empresa':
        loginAsCompany();
        router.push('/empresa/dashboard');
        break;
    }
  };

  // Animações GSAP
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(".hero-title", {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: "power4.out",
        delay: 0.2
      });

      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power4.out",
        delay: 0.4
      });

      gsap.from(".hero-cta", {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power4.out",
        delay: 0.6
      });

      // Floating coins animation
      if (floatingCoinsRef.current) {
        const coins = floatingCoinsRef.current.querySelectorAll(".floating-coin");
        coins.forEach((coin, index) => {
          gsap.to(coin, {
            y: "random(-30, 30)",
            x: "random(-20, 20)",
            rotation: "random(-15, 15)",
            duration: "random(2, 4)",
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: index * 0.1
          });
        });
      }

      // Stats counter animation
      if (statsRef.current) {
        const stats = statsRef.current.querySelectorAll(".stat-number");
        stats.forEach((stat) => {
          const target = parseInt(stat.getAttribute("data-target") || "0");
          gsap.from(stat, {
            textContent: 0,
            duration: 2,
            ease: "power1.inOut",
            snap: { textContent: 1 },
            scrollTrigger: {
              trigger: stat,
              start: "top 80%",
              toggleActions: "play none none none"
            },
            onUpdate: function() {
              const current = Math.ceil(this.targets()[0].textContent);
              stat.textContent = current.toLocaleString();
            }
          });
        });
      }

      // Features reveal animation
      if (featuresRef.current) {
        const features = featuresRef.current.querySelectorAll(".feature-card");
        gsap.from(features, {
          opacity: 0,
          y: 100,
          stagger: 0.15,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 70%",
            toggleActions: "play none none none"
          }
        });
      }

      // Parallax effect
      gsap.to(".parallax-bg", {
        yPercent: 50,
        ease: "none",
        scrollTrigger: {
          trigger: ".parallax-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: GraduationCap,
      title: "Para Alunos",
      description: "Receba moedas por bom desempenho e troque por vantagens exclusivas",
      color: "campus-purple",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: Coins,
      title: "Para Professores", 
      description: "Distribua moedas para reconhecer o mérito dos seus alunos",
      color: "campus-blue",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: Building2,
      title: "Para Empresas",
      description: "Ofereça vantagens e conecte-se com estudantes talentosos",
      color: "campus-gold",
      gradient: "from-yellow-500 to-orange-500"
    }
  ];

  const stats = [
    { number: 5000, label: "Alunos Ativos", suffix: "+" },
    { number: 300, label: "Professores", suffix: "+" },
    { number: 50, label: "Empresas Parceiras", suffix: "+" },
    { number: 10000, label: "Moedas Distribuídas", suffix: "K+" }
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Reconhecimento Instantâneo",
      description: "Recompense o mérito estudantil em tempo real"
    },
    {
      icon: TrendingUp,
      title: "Engajamento Aumentado",
      description: "Motive os alunos com incentivos tangíveis"
    },
    {
      icon: Shield,
      title: "Sistema Seguro",
      description: "Transações protegidas e auditáveis"
    },
    {
      icon: Rocket,
      title: "Fácil de Usar",
      description: "Interface intuitiva e moderna"
    }
  ];

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section com efeito parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-yellow-50">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        </div>

        {/* Floating coins */}
        <div ref={floatingCoinsRef} className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="floating-coin absolute"
              style={{
                left: `${20 + (i * 7)}%`,
                top: `${15 + (i * 6)}%`,
              }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                <Coins className="w-6 h-6 text-white" />
              </div>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full mb-8 shadow-lg"
          >
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Sistema de Mérito Estudantil
            </span>
          </motion.div>

          <h1 className="hero-title text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-600 via-blue-600 to-yellow-600 bg-clip-text text-transparent leading-tight">
            CampusCash
          </h1>

          <p className="hero-subtitle text-xl md:text-3xl text-gray-700 mb-12 max-w-3xl mx-auto font-light">
            Transforme <span className="font-bold text-purple-600">reconhecimento</span> em{" "}
            <span className="font-bold text-blue-600">oportunidades</span> reais
          </p>

          <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105"
              onClick={() => handleMockLogin('aluno')}
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 hover:bg-white/80 backdrop-blur transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5" />
              Ver Demo
            </Button>
          </div>

          {/* Scroll indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="mt-16"
          >
            <ChevronDown className="w-8 h-8 mx-auto text-gray-400" />
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="stat-number text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2" data-target={stat.number}>
                  0
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section com GSAP */}
      <section ref={featuresRef} className="parallax-section py-32 relative overflow-hidden">
        {/* Parallax background */}
        <div className="parallax-bg absolute inset-0 bg-gradient-to-br from-purple-100 via-blue-100 to-yellow-100 -z-10"></div>

        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Como Funciona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Uma plataforma completa para todos os envolvidos no ecossistema educacional
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="feature-card group hover:shadow-2xl transition-all duration-500 overflow-hidden border-0">
                  <CardContent className="p-8 relative">
                    {/* Animated gradient background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                    
                    <div className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    <div className="mt-6">
                      <Button
                        variant="ghost"
                        className="group-hover:text-purple-600 transition-colors p-0"
                        onClick={() => handleMockLogin(index === 0 ? 'aluno' : index === 1 ? 'professor' : 'empresa')}
                      >
                        Explorar
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition-transform" />
                      </Button>
                    </div>
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
              Mais do que uma plataforma, uma revolução no reconhecimento estudantil
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                >
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-3xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <Icon className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section className="py-32 bg-gradient-to-br from-purple-50 via-blue-50 to-yellow-50">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center gap-2 mb-6">
              <Play className="h-8 w-8 text-purple-600" />
              <h2 className="text-4xl md:text-5xl font-bold">
                Teste o Sistema
              </h2>
            </div>
            <p className="text-xl text-gray-600 mb-12">
              Experimente as funcionalidades como diferentes tipos de usuário
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: GraduationCap, title: "Como Aluno", desc: "Veja seu saldo, resgate vantagens e gerencie cupons", role: 'aluno', gradient: "from-purple-500 to-purple-600" },
                { icon: Coins, title: "Como Professor", desc: "Distribua moedas e acompanhe o histórico", role: 'professor', gradient: "from-blue-500 to-blue-600" },
                { icon: Building2, title: "Como Empresa", desc: "Gerencie vantagens e valide cupons", role: 'empresa', gradient: "from-yellow-500 to-orange-500" }
              ].map((demo, index) => {
                const Icon = demo.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="hover:shadow-2xl transition-all duration-500 group border-0 overflow-hidden">
                      <CardContent className="p-8">
                        <div className={`w-20 h-20 bg-gradient-to-br ${demo.gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-500 shadow-lg`}>
                          <Icon className="h-10 w-10 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{demo.title}</h3>
                        <p className="text-gray-600 mb-6">{demo.desc}</p>
                        <Button 
                          onClick={() => handleMockLogin(demo.role)}
                          className={`w-full bg-gradient-to-r ${demo.gradient} hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
                        >
                          Entrar como {demo.title.replace("Como ", "")}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 text-white relative overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full"
              style={{
                left: `${10 + (i * 4)}%`,
                top: `${10 + (i * 4)}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Pronto para Começar?
          </h2>
          <p className="text-2xl mb-12 text-white/90 max-w-2xl mx-auto">
            Junte-se à comunidade CampusCash e transforme o reconhecimento estudantil
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/cadastro/aluno">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-6 bg-white text-purple-600 hover:bg-gray-100 shadow-2xl hover:shadow-white/50 transition-all duration-300 transform hover:scale-105">
                Cadastrar como Aluno
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/cadastro/empresa">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 border-white text-white hover:bg-white/20 backdrop-blur transition-all duration-300">
                Tornar-se Parceiro
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
          <p className="text-sm">&copy; 2025 CampusCash. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
