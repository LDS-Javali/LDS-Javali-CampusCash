// Configurações de acessibilidade e responsividade

export const breakpoints = {
  sm: "640px",
  md: "768px", 
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px"
} as const;

export const spacing = {
  xs: "0.25rem", // 4px
  sm: "0.5rem",  // 8px
  md: "1rem",    // 16px
  lg: "1.5rem",  // 24px
  xl: "2rem",    // 32px
  "2xl": "3rem", // 48px
  "3xl": "4rem", // 64px
} as const;

export const touchTargets = {
  min: "44px", // WCAG AA minimum
  recommended: "48px", // Recommended size
} as const;

export const focusStyles = {
  ring: "2px solid hsl(var(--ring))",
  ringOffset: "2px",
  ringOffsetColor: "hsl(var(--background))",
} as const;

export const colorContrast = {
  normal: "4.5:1", // WCAG AA
  large: "3:1",    // WCAG AA for large text
  enhanced: "7:1",  // WCAG AAA
} as const;

// Utilitários para acessibilidade
export const a11y = {
  // Focus management
  focusVisible: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  
  // Screen reader only
  srOnly: "sr-only",
  
  // Skip links
  skipLink: "absolute -top-40 left-6 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-md focus:top-6 transition-all",
  
  // High contrast mode
  highContrast: "forced-colors:border-[ButtonText]",
  
  // Reduced motion
  reducedMotion: "motion-reduce:transition-none motion-reduce:animate-none",
} as const;

// Utilitários para responsividade
export const responsive = {
  // Container queries
  container: "container mx-auto px-4 sm:px-6 lg:px-8",
  
  // Grid systems
  grid: {
    cols1: "grid-cols-1",
    cols2: "grid-cols-1 md:grid-cols-2",
    cols3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    cols4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  },
  
  // Typography scaling
  text: {
    xs: "text-xs sm:text-sm",
    sm: "text-sm sm:text-base", 
    base: "text-base sm:text-lg",
    lg: "text-lg sm:text-xl",
    xl: "text-xl sm:text-2xl",
    "2xl": "text-2xl sm:text-3xl",
    "3xl": "text-3xl sm:text-4xl",
  },
  
  // Spacing scaling
  padding: {
    xs: "p-2 sm:p-3",
    sm: "p-3 sm:p-4", 
    md: "p-4 sm:p-6",
    lg: "p-6 sm:p-8",
    xl: "p-8 sm:p-12",
  },
  
  // Margin scaling
  margin: {
    xs: "m-2 sm:m-3",
    sm: "m-3 sm:m-4",
    md: "m-4 sm:m-6", 
    lg: "m-6 sm:m-8",
    xl: "m-8 sm:m-12",
  },
} as const;

// Utilitários para performance
export const performance = {
  // Image optimization
  image: "object-cover object-center",
  
  // Lazy loading
  lazy: "loading-lazy",
  
  // Critical CSS
  critical: "critical",
  
  // Non-critical CSS
  nonCritical: "non-critical",
} as const;

// Utilitários para SEO
export const seo = {
  // Meta tags
  meta: {
    title: "CampusCash - Sistema de Moeda Estudantil",
    description: "Sistema para estimular o reconhecimento do mérito estudantil através de uma moeda virtual",
    keywords: ["moeda virtual", "estudantil", "mérito", "universidade", "campus"],
    author: "CampusCash Team",
  },
  
  // Open Graph
  openGraph: {
    type: "website",
    siteName: "CampusCash",
    locale: "pt_BR",
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    creator: "@campuscash",
  },
} as const;

// Utilitários para validação de formulários
export const validation = {
  // Patterns
  patterns: {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    phone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    cep: /^\d{5}-\d{3}$/,
  },
  
  // Messages
  messages: {
    required: "Este campo é obrigatório",
    email: "Email inválido",
    minLength: (min: number) => `Mínimo ${min} caracteres`,
    maxLength: (max: number) => `Máximo ${max} caracteres`,
    pattern: "Formato inválido",
  },
} as const;

// Utilitários para animações
export const animations = {
  // Durations
  duration: {
    fast: "150ms",
    normal: "300ms", 
    slow: "500ms",
  },
  
  // Easing
  easing: {
    ease: "cubic-bezier(0.4, 0, 0.2, 1)",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
  
  // Reduced motion
  reducedMotion: "@media (prefers-reduced-motion: reduce) { animation: none !important; }",
} as const;

// Utilitários para temas
export const themes = {
  // Dark mode
  dark: "dark",
  
  // Light mode  
  light: "light",
  
  // System preference
  system: "system",
  
  // Theme colors
  colors: {
    primary: "hsl(var(--primary))",
    secondary: "hsl(var(--secondary))",
    accent: "hsl(var(--accent))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
  },
} as const;
