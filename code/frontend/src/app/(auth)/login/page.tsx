"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GraduationCap, Building2, User } from "lucide-react";
import Link from "next/link";
import { slideUp, fadeIn } from "@/lib/animations";
import { useLogin } from "@/hooks";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({
      email: formData.email,
      password: formData.password,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-campus-purple-50 via-white to-campus-blue-50 flex items-center justify-center p-4">
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="h-12 w-12 bg-gradient-to-br from-campus-purple-500 to-campus-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-2xl">CampusCash</span>
          </Link>
        </motion.div>

        {/* Login Form */}
        <Card className="shadow-card-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
            <p className="text-muted-foreground">
              Acesse sua conta no CampusCash
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link
                  href="/cadastro/aluno"
                  className="text-campus-purple-600 hover:text-campus-purple-700 font-medium"
                >
                  Cadastre-se como Aluno
                </Link>
                {" ou "}
                <Link
                  href="/cadastro/empresa"
                  className="text-campus-purple-600 hover:text-campus-purple-700 font-medium"
                >
                  Empresa
                </Link>
              </p>
              <Link
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Voltar ao início
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
