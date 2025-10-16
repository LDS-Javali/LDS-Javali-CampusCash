"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CoinBadge } from "@/components/design-system";
import { Coins, TrendingUp, Users, Gift } from "lucide-react";

// Registrar plugins do GSAP
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Componente de contador animado
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function AnimatedCounter({ 
  value, 
  duration = 2, 
  className = "",
  prefix = "",
  suffix = ""
}: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const counter = counterRef.current;
    if (!counter) return;

    gsap.to(counter, {
      innerHTML: value,
      duration,
      ease: "power2.out",
      snap: { innerHTML: 1 },
      onUpdate: function() {
        setDisplayValue(Math.ceil(this.targets()[0].innerHTML));
      }
    });
  }, [value, duration]);

  return (
    <span ref={counterRef} className={className}>
      {prefix}{displayValue}{suffix}
    </span>
  );
}

// Componente de moeda com animação de flip
interface AnimatedCoinProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function AnimatedCoin({ amount, size = "md", className = "" }: AnimatedCoinProps) {
  const coinRef = useRef<HTMLDivElement>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12", 
    lg: "w-16 h-16"
  };

  const handleClick = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const coin = coinRef.current;
    if (!coin) return;

    gsap.to(coin, {
      rotationY: 360,
      duration: 1,
      ease: "power2.inOut",
      onComplete: () => {
        setIsAnimating(false);
      }
    });
  };

  return (
    <div 
      ref={coinRef}
      onClick={handleClick}
      className={`${sizeClasses[size]} cursor-pointer ${className}`}
    >
      <CoinBadge amount={amount} variant={size === "lg" ? "large" : "default"} />
    </div>
  );
}

// Componente de card com hover effects
interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  hoverRotate?: number;
}

export function AnimatedCard({ 
  children, 
  className = "",
  hoverScale = 1.05,
  hoverRotate = 0
}: AnimatedCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: hoverScale,
        rotation: hoverRotate,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        rotation: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [hoverScale, hoverRotate]);

  return (
    <div ref={cardRef} className={className}>
      {children}
    </div>
  );
}

// Componente de shimmer loading
interface ShimmerProps {
  className?: string;
  width?: string;
  height?: string;
}

export function Shimmer({ className = "", width = "100%", height = "20px" }: ShimmerProps) {
  const shimmerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shimmer = shimmerRef.current;
    if (!shimmer) return;

    gsap.to(shimmer, {
      backgroundPosition: "200% 0",
      duration: 1.5,
      ease: "none",
      repeat: -1,
      yoyo: true
    });
  }, []);

  return (
    <div
      ref={shimmerRef}
      className={`bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] rounded ${className}`}
      style={{ width, height }}
    />
  );
}

// Componente de confetti effect
interface ConfettiProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const confettiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trigger) return;

    const confetti = confettiRef.current;
    if (!confetti) return;

    // Criar partículas de confetti
    const particles = Array.from({ length: 50 }, (_, i) => {
      const particle = document.createElement("div");
      particle.className = "absolute w-2 h-2 rounded-full";
      particle.style.backgroundColor = [
        "#8B5CF6", "#3B82F6", "#F59E0B", "#10B981", "#EF4444"
      ][i % 5];
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = "0";
      confetti.appendChild(particle);

      return particle;
    });

    // Animar partículas
    particles.forEach((particle, index) => {
      gsap.to(particle, {
        y: window.innerHeight + 100,
        x: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
        duration: 2 + Math.random() * 2,
        delay: index * 0.02,
        ease: "power2.out",
        onComplete: () => {
          particle.remove();
          if (index === particles.length - 1 && onComplete) {
            onComplete();
          }
        }
      });
    });
  }, [trigger, onComplete]);

  return (
    <div
      ref={confettiRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ display: trigger ? "block" : "none" }}
    />
  );
}

// Componente de parallax scroll
interface ParallaxProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
}

export function Parallax({ children, speed = 0.5, className = "" }: ParallaxProps) {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const parallax = parallaxRef.current;
    if (!parallax) return;

    ScrollTrigger.create({
      trigger: parallax,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        gsap.to(parallax, {
          y: self.progress * 100 * speed,
          ease: "none"
        });
      }
    });
  }, [speed]);

  return (
    <div ref={parallaxRef} className={className}>
      {children}
    </div>
  );
}

// Componente de stats com animação de entrada
interface AnimatedStatsProps {
  stats: {
    title: string;
    value: number;
    icon: React.ComponentType<any>;
    color: string;
  }[];
}

export function AnimatedStats({ stats }: AnimatedStatsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true });

  useEffect(() => {
    if (!isInView) return;

    const elements = containerRef.current?.querySelectorAll(".stat-item");
    if (!elements) return;

    gsap.fromTo(elements, 
      { 
        opacity: 0, 
        y: 50,
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
      }
    );
  }, [isInView]);

  return (
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={index}
            className="stat-item"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, delay: index * 0.2 }}
          >
            <div className="p-6 text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-lg flex items-center justify-center bg-${stat.color}-100`}>
                <Icon className={`h-6 w-6 text-${stat.color}-600`} />
              </div>
              <div className={`text-2xl font-bold text-${stat.color}-600 mb-2`}>
                <AnimatedCounter value={stat.value} />
              </div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Componente de progress bar animada
interface AnimatedProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
}

export function AnimatedProgress({ 
  value, 
  max = 100, 
  className = "",
  showLabel = true
}: AnimatedProgressProps) {
  const progressRef = useRef<HTMLDivElement>(null);
  const percentage = (value / max) * 100;

  useEffect(() => {
    const progress = progressRef.current;
    if (!progress) return;

    gsap.fromTo(progress, 
      { width: "0%" },
      { 
        width: `${percentage}%`,
        duration: 1.5,
        ease: "power2.out"
      }
    );
  }, [percentage]);

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          ref={progressRef}
          className="bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 h-2 rounded-full"
        />
      </div>
    </div>
  );
}
