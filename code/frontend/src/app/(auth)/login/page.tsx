"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, Building2, User } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store";
import { slideUp, fadeIn } from "@/lib/animations";
import { toast } from "sonner";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "aluno" as "aluno" | "professor" | "empresa"
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simular login (substituir por API real)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock user data
      const mockUser = {
        id: "1",
        email: formData.email,
        name: formData.email.split("@")[0],
        role: formData.role,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      login(mockUser);
      toast.success("Login realizado com sucesso!");
      
      // Redirect based on role
      router.push(`/${formData.role}/dashboard`);
    } catch (error) {
      toast.error("Erro ao fazer login. Verifique suas credenciais.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "aluno":
        return <GraduationCap className="h-5 w-5" />;
      case "professor":
        return <User className="h-5 w-5" />;
      case "empresa":
        return <Building2 className="h-5 w-5" />;
      default:
        return <User className="h-5 w-5" />;
    }
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
              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">Tipo de usuário</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: "aluno" | "professor" | "empresa") =>
                    setFormData(prev => ({ ...prev, role: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione seu tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aluno">
                      <div className="flex items-center gap-2">
                        {getRoleIcon("aluno")}
                        <span>Aluno</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="professor">
                      <div className="flex items-center gap-2">
                        {getRoleIcon("professor")}
                        <span>Professor</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="empresa">
                      <div className="flex items-center gap-2">
                        {getRoleIcon("empresa")}
                        <span>Empresa Parceira</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, email: e.target.value }))
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
                    setFormData(prev => ({ ...prev, password: e.target.value }))
                  }
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{" "}
                <Link
                  href={`/cadastro/${formData.role}`}
                  className="text-campus-purple-600 hover:text-campus-purple-700 font-medium"
                >
                  Cadastre-se
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

        {/* Demo Credentials */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="mt-6 p-4 bg-muted/50 rounded-lg"
        >
          <h4 className="font-semibold text-sm mb-2">Credenciais de demonstração:</h4>
          <div className="text-xs text-muted-foreground space-y-1">
            <p><strong>Aluno:</strong> aluno@teste.com / senha123</p>
            <p><strong>Professor:</strong> professor@teste.com / senha123</p>
            <p><strong>Empresa:</strong> empresa@teste.com / senha123</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}


