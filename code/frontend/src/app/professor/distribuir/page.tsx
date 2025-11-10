"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CoinBadge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Label,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/design-system";
import {
  GraduationCap,
  Users,
  Gift,
  ArrowLeft,
  CheckCircle,
  Search,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, slideUp } from "@/lib/animations";
import { useSearchStudents, useGiveCoins, useProfessorBalance, useProfessorStudents } from "@/hooks";

export default function DistribuirMoedasPage() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const { data: balance } = useProfessorBalance();
  const { data: allStudents, isLoading: allStudentsLoading } = useProfessorStudents();
  const { data: searchedStudents, isLoading: searchedStudentsLoading } =
    useSearchStudents(searchQuery);
  const giveCoinsMutation = useGiveCoins();

  // Se houver busca com pelo menos 2 caracteres, usar resultados da busca
  // Senão, usar lista completa de alunos
  const students = searchQuery.length >= 2 ? searchedStudents : allStudents;
  const studentsLoading = searchQuery.length >= 2 ? searchedStudentsLoading : allStudentsLoading;

  const [formData, setFormData] = useState({
    studentId: "",
    amount: "",
    reason: "",
  });

  // A API retorna saldoMoedas, mas também pode retornar balance
  const saldoAtual = (balance?.saldoMoedas != null ? Number(balance.saldoMoedas) : null) 
    || (balance?.balance != null ? Number(balance.balance) : null)
    || 0;
  const alunoSelecionado = students?.find(
    (aluno) => {
      const id = (aluno.id || aluno.ID)?.toString();
      return id === formData.studentId;
    }
  );
  
  // Normalizar dados do aluno selecionado
  const alunoNormalizado = alunoSelecionado ? {
    name: alunoSelecionado.name || alunoSelecionado.Name || "",
    email: alunoSelecionado.email || alunoSelecionado.Email || "",
  } : null;

  const handleEnviar = async () => {
    if (!formData.studentId || !formData.amount || !formData.reason) {
      return;
    }

    giveCoinsMutation.mutate(
      {
        to_student_id: Number(formData.studentId),
        amount: Number(formData.amount),
        message: formData.reason,
      },
      {
        onSuccess: () => {
          setShowConfirmModal(false);
          setFormData({ studentId: "", amount: "", reason: "" });
          setSearchQuery("");
        },
      }
    );
  };

  const isFormValid = () => {
    return (
      formData.studentId &&
      formData.amount &&
      formData.reason &&
      formData.reason.length >= 20
    );
  };

  const quantidadeNum = parseInt(formData.amount) || 0;
  const saldoInsuficiente = quantidadeNum > saldoAtual;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Distribuir Moedas
            </h1>
            <p className="text-muted-foreground">
              Reconheça o mérito dos seus alunos
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulário */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="lg:col-span-2 space-y-6"
        >
          {/* Saldo Atual */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Seu Saldo Disponível
                  </h3>
                  <CoinBadge amount={saldoAtual} variant="large" />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">
                    Recarga automática
                  </p>
                  <p className="font-semibold">A cada 15 segundos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Formulário de Distribuição */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Nova Distribuição
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Seleção de Aluno com Busca Integrada */}
              <div className="space-y-2">
                <Label htmlFor="aluno">Selecionar Aluno</Label>
                <Select
                  value={formData.studentId}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, studentId: value }));
                    setIsSelectOpen(false);
                    setSearchQuery("");
                  }}
                  onOpenChange={(open) => {
                    setIsSelectOpen(open);
                    if (!open) {
                      setSearchQuery("");
                    }
                  }}
                  open={isSelectOpen}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Busque e selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent className="w-full">
                    {/* Campo de busca dentro do select */}
                    <div className="p-2 border-b">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Digite o nome ou email do aluno..."
                          value={searchQuery}
                          onChange={(e) => {
                            setSearchQuery(e.target.value);
                            if (!isSelectOpen) {
                              setIsSelectOpen(true);
                            }
                          }}
                          className="pl-10"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    {/* Lista de alunos */}
                    <div className="max-h-[300px] overflow-y-auto">
                      {studentsLoading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          Carregando alunos...
                        </div>
                      ) : students && students.length > 0 ? (
                        students
                          .filter((aluno) => {
                            // Se houver busca, filtrar localmente também
                            if (searchQuery.length >= 2) {
                              const query = searchQuery.toLowerCase();
                              const name = aluno.name || aluno.Name || "";
                              const email = aluno.email || aluno.Email || "";
                              return (
                                name.toLowerCase().includes(query) ||
                                email.toLowerCase().includes(query)
                              );
                            }
                            return true;
                          })
                          .map((aluno) => {
                            const id = (aluno.id || aluno.ID)?.toString() || "";
                            const name = aluno.name || aluno.Name || "";
                            const email = aluno.email || aluno.Email || "";
                            return (
                              <SelectItem
                                key={id}
                                value={id}
                                className="cursor-pointer"
                              >
                                <div className="flex flex-col py-1">
                                  <span className="font-medium">{name}</span>
                                  <span className="text-sm text-muted-foreground">
                                    {email}
                                  </span>
                                </div>
                              </SelectItem>
                            );
                          })
                      ) : (
                        <div className="p-4 text-center text-sm text-muted-foreground">
                          {searchQuery.length >= 2
                            ? "Nenhum aluno encontrado"
                            : "Nenhum aluno disponível"}
                        </div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantidade de Moedas */}
              <div className="space-y-2">
                <Label htmlFor="amount">Quantidade de Moedas</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Ex: 50"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    min="1"
                    max={saldoAtual}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                {saldoInsuficiente && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4" />
                    <span>Saldo insuficiente. Máximo: {saldoAtual} moedas</span>
                  </div>
                )}
              </div>

              {/* Motivo */}
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo do Reconhecimento</Label>
                <Textarea
                  id="reason"
                  placeholder="Descreva o motivo pelo qual o aluno está sendo reconhecido (mínimo 20 caracteres)..."
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, reason: e.target.value }))
                  }
                  rows={4}
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Mínimo 20 caracteres
                  </span>
                  <span
                    className={
                      formData.reason.length < 20
                        ? "text-red-600"
                        : "text-green-600"
                    }
                  >
                    {formData.reason.length}/20
                  </span>
                </div>
              </div>

              {/* Preview */}
              {alunoSelecionado && formData.amount && formData.reason && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted/50 rounded-lg space-y-3"
                >
                  <h4 className="font-semibold">Preview da Distribuição</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aluno:</span>
                      <span className="font-medium">
                        {alunoSelecionado.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>{alunoSelecionado.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantidade:</span>
                      <CoinBadge amount={quantidadeNum} variant="compact" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saldo após:</span>
                      <CoinBadge
                        amount={saldoAtual - quantidadeNum}
                        variant="compact"
                      />
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground mb-1">
                      Motivo:
                    </p>
                    <p className="text-sm font-medium">"{formData.reason}"</p>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {/* Card de Envio */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Confirmar Distribuição
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status do Formulário */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      formData.studentId ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={
                      formData.studentId
                        ? "text-green-700"
                        : "text-muted-foreground"
                    }
                  >
                    Aluno selecionado
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      formData.amount && !saldoInsuficiente
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={
                      formData.amount && !saldoInsuficiente
                        ? "text-green-700"
                        : "text-muted-foreground"
                    }
                  >
                    Quantidade válida
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      formData.reason.length >= 20
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                  <span
                    className={
                      formData.reason.length >= 20
                        ? "text-green-700"
                        : "text-muted-foreground"
                    }
                  >
                    Motivo preenchido
                  </span>
                </div>
              </div>

              {/* Botão de Envio */}
              <Dialog
                open={showConfirmModal}
                onOpenChange={setShowConfirmModal}
              >
                <DialogTrigger asChild>
                  <Button
                    className="w-full"
                    disabled={!isFormValid() || giveCoinsMutation.isPending}
                    size="lg"
                  >
                    {giveCoinsMutation.isPending ? (
                      <>Enviando...</>
                    ) : (
                      <>
                        <Gift className="h-4 w-4 mr-2" />
                        Distribuir Moedas
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 flex items-center justify-center">
                        <Gift className="h-6 w-6 text-white" />
                      </div>
                      <DialogTitle className="text-2xl">
                        Confirmar Distribuição
                      </DialogTitle>
                    </div>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Resumo Visual */}
                    <div className="text-center p-6 bg-gradient-to-br from-campus-purple-50 to-campus-blue-50 rounded-xl border border-campus-purple-200">
                      <div className="mb-4">
                        <CoinBadge
                          amount={quantidadeNum}
                          variant="large"
                          animated
                        />
                      </div>
                      <h3 className="text-xl font-bold text-campus-purple-900 mb-2">
                        Distribuir {quantidadeNum} moedas
                      </h3>
                      <p className="text-campus-purple-700 font-medium">
                        Para: {alunoNormalizado?.name}
                      </p>
                    </div>

                    {/* Detalhes */}
                    <div className="bg-card border rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Aluno:</span>
                        <span className="font-semibold">
                          {alunoNormalizado?.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-sm">{alunoNormalizado?.email}</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">
                          Quantidade:
                        </span>
                        <CoinBadge amount={quantidadeNum} variant="compact" />
                      </div>
                      <div className="flex justify-between items-center py-2 border-b">
                        <span className="text-muted-foreground">
                          Saldo atual:
                        </span>
                        <CoinBadge amount={saldoAtual} variant="compact" />
                      </div>
                      <div className="flex justify-between items-center py-2 pt-3 border-t-2 border-campus-purple-200">
                        <span className="font-semibold text-campus-purple-900">
                          Saldo após:
                        </span>
                        <CoinBadge
                          amount={saldoAtual - quantidadeNum}
                          variant="compact"
                        />
                      </div>
                    </div>

                    {/* Motivo */}
                    <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                      <p className="text-sm font-semibold text-blue-900 mb-2">
                        Motivo do Reconhecimento:
                      </p>
                      <p className="text-sm text-blue-800 italic">
                        "{formData.reason}"
                      </p>
                    </div>

                    {/* Aviso */}
                    <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-800">
                        O aluno será notificado automaticamente sobre este
                        reconhecimento.
                      </p>
                    </div>

                    {/* Botões */}
                    <div className="flex gap-3 pt-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowConfirmModal(false)}
                        className="flex-1"
                        disabled={giveCoinsMutation.isPending}
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleEnviar}
                        disabled={giveCoinsMutation.isPending}
                        className="flex-1"
                      >
                        {giveCoinsMutation.isPending ? (
                          <>Enviando...</>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Confirmar
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Aviso */}
              <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Ao distribuir, você concorda que o reconhecimento é justo e
                  merecido.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Voltar */}
          <Link href="/professor/dashboard">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Dashboard
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
