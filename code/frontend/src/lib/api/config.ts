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
    REDEEM: "/api/student/redeem",
    COUPONS: "/api/student/coupons",
    NOTIFICATIONS: "/api/student/notifications",
    MARK_NOTIFICATION_READ: "/api/student/notifications",
    MARK_ALL_NOTIFICATIONS_READ: "/api/student/notifications/read-all",
    UNREAD_COUNT: "/api/student/notifications/unread/count",
  },
  PROFESSOR: {
    PROFILE: "/api/professor/profile",
    BALANCE: "/api/professor/balance",
    STATISTICS: "/api/professor/statistics",
    TRANSACTIONS: "/api/professor/transactions",
    STUDENTS: "/api/professor/students",
    SEARCH_STUDENTS: "/api/professor/students/search",
    GIVE_COINS: "/api/professor/give-coins",
    NOTIFICATIONS: "/api/professor/notifications",
    MARK_NOTIFICATION_READ: "/api/professor/notifications",
    MARK_ALL_NOTIFICATIONS_READ: "/api/professor/notifications/read-all",
    UNREAD_COUNT: "/api/professor/notifications/unread/count",
  },
  COMPANY: {
    PROFILE: "/api/company/profile",
    LOGO: "/api/company/profile/logo",
    STATISTICS: "/api/company/statistics",
    VALIDATIONS: "/api/company/validations",
    REWARDS: "/api/company/rewards",
    HISTORY: "/api/company/history",
    VALIDATE_COUPON: "/api/company/validate-coupon",
    GET_COUPON_BY_HASH: "/api/company/coupon",
  },
  MARKETPLACE: {
    REWARDS: "/api/rewards",
    INSTITUTIONS: "/api/institutions",
  },
  IMAGES: "/api/images",
} as const;
