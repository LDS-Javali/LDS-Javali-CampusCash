import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Configuração para produção
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
