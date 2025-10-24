export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    SIGNUP_STUDENT: "/api/auth/signup/student",
    SIGNUP_COMPANY: "/api/auth/signup/company",
    ME: "/api/auth/me",
  },
  STUDENT: {
    PROFILE: "/api/student/profile",
    AVATAR: "/api/student/profile/avatar",
    BALANCE: "/api/student/balance",
    STATISTICS: "/api/student/statistics",
    TRANSACTIONS: "/api/student/transactions",
    REWARDS: "/api/student/rewards",
    REDEEM: "/api/student/redeem",
    COUPONS: "/api/student/coupons",
  },
  PROFESSOR: {
    PROFILE: "/api/professor/profile",
    BALANCE: "/api/professor/balance",
    STATISTICS: "/api/professor/statistics",
    TRANSACTIONS: "/api/professor/transactions",
    STUDENTS: "/api/professor/students",
    SEARCH_STUDENTS: "/api/professor/students/search",
    TRANSFER: "/api/professor/transfer",
    GIVE_COINS: "/api/professor/give-coins",
  },
  COMPANY: {
    PROFILE: "/api/company/profile",
    LOGO: "/api/company/profile/logo",
    STATISTICS: "/api/company/statistics",
    VALIDATIONS: "/api/company/validations",
    REWARDS: "/api/company/rewards",
    HISTORY: "/api/company/history",
    VALIDATE_COUPON: "/api/company/validate-coupon",
  },
  MARKETPLACE: {
    REWARDS: "/api/rewards",
    INSTITUTIONS: "/api/institutions",
  },
  IMAGES: "/api/images",
} as const;
