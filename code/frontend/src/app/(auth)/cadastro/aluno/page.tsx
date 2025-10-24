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
import { Textarea } from "@/components/ui/textarea";
import { GraduationCap, ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useFormStore } from "@/store";
import { slideUp, fadeIn } from "@/lib/animations";
import { useSignupStudent, useInstitutions } from "@/hooks";

const steps = [
  { id: 1, title: "Dados Pessoais", description: "Informações básicas" },
  { id: 2, title: "Dados Acadêmicos", description: "Instituição e curso" },
  { id: 3, title: "Senha", description: "Criar senha" },
];

export default function CadastroAlunoPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    formData,
    updateFormData,
    setCurrentStep: setFormStep,
  } = useFormStore();
  const signupMutation = useSignupStudent();
  const { data: institutions = [] } = useInstitutions();

  const [form, setForm] = useState({
    name: "",
    email: "",
    cpf: "",
    registration: "",
    course: "",
    institution: "",
    password: "",
    confirmPassword: "",
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      setFormStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setFormStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    signupMutation.mutate({
      name: form.name,
      email: form.email,
      password: form.password,
      cpf: form.cpf,
      registration: form.registration,
      course: form.course,
      institution: form.institution,
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Seu nome completo"
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
                placeholder="seu@email.com"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={form.cpf}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, cpf: e.target.value }))
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="registration">Matrícula</Label>
                <Input
                  id="registration"
                  placeholder="Sua matrícula"
                  value={form.registration}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      registration: e.target.value,
                    }))
                  }
                  required
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="institution">Instituição de Ensino</Label>
              <Select
                value={form.institution}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, institution: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua instituição" />
                </SelectTrigger>
                <SelectContent>
                  {institutions.map((institution) => (
                    <SelectItem key={institution.ID} value={institution.Name}>
                      {institution.Name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="course">Curso</Label>
              <Input
                id="course"
                placeholder="Nome do seu curso"
                value={form.course}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, course: e.target.value }))
                }
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
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
            <div className="text-sm text-muted-foreground">
              <p>A senha deve conter:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Mínimo 8 caracteres</li>
                <li>Pelo menos 1 letra maiúscula</li>
                <li>Pelo menos 1 número</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return form.name && form.email && form.cpf && form.registration;
      case 1:
        return form.institution && form.course;
      case 2:
        return (
          form.password &&
          form.confirmPassword &&
          form.password === form.confirmPassword
        );
      default:
        return false;
    }
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
            <div className="h-12 w-12 bg-gradient-to-br from-campus-purple-500 to-campus-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="font-bold text-2xl">CampusCash</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Cadastro de Aluno</h1>
          <p className="text-muted-foreground">
            Preencha os dados para criar sua conta
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStep
                        ? "bg-campus-purple-500 text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 h-px bg-border mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <Card className="shadow-card-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              {steps[currentStep].title}
            </CardTitle>
            <p className="text-muted-foreground">
              {steps[currentStep].description}
            </p>
          </CardHeader>
          <CardContent>
            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrev}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>

              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || signupMutation.isPending}
                  className="bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 hover:from-campus-purple-600 hover:to-campus-blue-600"
                >
                  {signupMutation.isPending
                    ? "Criando conta..."
                    : "Finalizar Cadastro"}
                </Button>
              ) : (
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
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
