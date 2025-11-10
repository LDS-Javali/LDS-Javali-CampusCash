"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";
import Link from "next/link";
import { slideUp, fadeIn } from "@/lib/animations";
import { useSignupCompany } from "@/hooks";

export default function CadastroEmpresaPage() {
  const signupMutation = useSignupCompany();

  const [form, setForm] = useState({
    name: "",
    email: "",
    cnpj: "",
    description: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    signupMutation.mutate({
      name: form.name,
      email: form.email,
      password: form.password,
      cnpj: form.cnpj,
      description: form.description,
    });
  };

  const isFormValid = () => {
    return (
      form.name &&
      form.email &&
      form.cnpj &&
      form.description &&
      form.password &&
      form.confirmPassword &&
      form.password === form.confirmPassword
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-campus-purple-50 via-white to-campus-blue-50 flex items-center justify-center p-4">
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          className="text-center mb-8"
        >
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <span className="font-bold text-2xl">CampusCash</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Cadastro de Empresa</h1>
          <p className="text-muted-foreground">
            Preencha os dados para criar sua conta empresarial
          </p>
        </motion.div>

        {/* Form Card */}
        <Card className="shadow-card-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Dados da Empresa
            </CardTitle>
            <p className="text-muted-foreground">
              Preencha as informações da sua empresa
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input
                    id="name"
                    placeholder="Nome da empresa"
                    value={form.name}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contato@empresa.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input
                    id="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={form.cnpj}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, cnpj: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição da Empresa</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva brevemente sua empresa..."
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Senha de Acesso</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Mínimo 8 caracteres"
                      value={form.password}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Digite a senha novamente"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>A senha deve conter:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Mínimo 8 caracteres</li>
                    <li>Pelo menos 1 letra maiúscula</li>
                    <li>Pelo menos 1 número</li>
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!isFormValid() || signupMutation.isPending}
                size="lg"
              >
                {signupMutation.isPending
                  ? "Criando conta..."
                  : "Finalizar Cadastro"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="text-campus-purple-600 hover:text-campus-purple-700 font-medium"
            >
              Faça login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
