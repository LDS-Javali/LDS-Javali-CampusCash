// Animações e variants para Framer Motion e GSAP
import { Variants } from "framer-motion";

// Framer Motion Variants
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: -20, opacity: 0 },
};

export const slideDown: Variants = {
  initial: { y: -20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  exit: { y: 20, opacity: 0 },
};

export const scaleIn: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 },
};

export const staggerChildren: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Page transitions
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

// Card hover animations
export const cardHover: Variants = {
  initial: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: { duration: 0.2, ease: "easeOut" }
  },
};

// Button animations
export const buttonTap: Variants = {
  tap: { scale: 0.98 },
};

// Modal animations
export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 20 },
};

// Loading animations
export const shimmer: Variants = {
  animate: {
    x: ["-100%", "100%"],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Coin specific animations
export const coinFlip: Variants = {
  initial: { rotateY: 0 },
  animate: { rotateY: 360 },
  hover: { 
    rotateY: 180,
    transition: { duration: 0.6, ease: "easeInOut" }
  },
};

export const coinSpin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Counter animation
export const counterAnimation: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  },
};

// GSAP Animation Configurations
export const gsapConfig = {
  // Coin flip 3D
  coinFlip3D: {
    duration: 0.6,
    ease: "power2.inOut",
    rotationY: 360,
  },
  
  // Counter smooth increment
  counterIncrement: {
    duration: 1,
    ease: "power2.out",
  },
  
  // Parallax scroll
  parallax: {
    duration: 0.3,
    ease: "none",
  },
  
  // Shimmer effect
  shimmer: {
    duration: 2,
    ease: "none",
    repeat: -1,
  },
  
  // Glow pulse
  glowPulse: {
    duration: 2,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true,
  },
};

// Animation presets
export const animationPresets = {
  fadeIn,
  slideUp,
  slideDown,
  scaleIn,
  staggerChildren,
  staggerContainer,
  pageTransition,
  cardHover,
  buttonTap,
  modalBackdrop,
  modalContent,
  shimmer,
  coinFlip,
  coinSpin,
  counterAnimation,
} as const;

export type AnimationPreset = keyof typeof animationPresets;


