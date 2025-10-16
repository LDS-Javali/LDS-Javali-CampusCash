"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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
  DialogTrigger
} from "@/components/design-system";
import { 
  GraduationCap,
  Users,
  Gift,
  ArrowLeft,
  CheckCircle,
  Search,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, slideUp } from "@/lib/animations";
import { toast } from "sonner";

export default function DistribuirMoedasPage() {
  const router = useRouter();
  const [isEnviando, setIsEnviando] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const [formData, setFormData] = useState({
    alunoId: "",
    quantidade: "",
    motivo: "",
  });

  const saldoAtual = 850; // Mock - substituir por dados reais

  // Mock data - substituir por dados reais da API
  const alunos = [
    { id: "1", nome: "João Silva Santos", curso: "Engenharia de Software", email: "joao.silva@email.com" },
    { id: "2", nome: "Maria Santos Costa", curso: "Ciência da Computação", email: "maria.santos@email.com" },
    { id: "3", nome: "Pedro Costa Lima", curso: "Sistemas de Informação", email: "pedro.costa@email.com" },
    { id: "4", nome: "Ana Lima Oliveira", curso: "Engenharia de Software", email: "ana.lima@email.com" },
    { id: "5", nome: "Carlos Oliveira Silva", curso: "Ciência da Computação", email: "carlos.oliveira@email.com" },
  ];

  const alunoSelecionado = alunos.find(aluno => aluno.id === formData.alunoId);

  const handleEnviar = async () => {
    setIsEnviando(true);
    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Moedas distribuídas com sucesso!");
      toast.success("Aluno notificado por email!");
      
      setShowConfirmModal(false);
      router.push("/professor/dashboard");
    } catch (error) {
      toast.error("Erro ao distribuir moedas. Tente novamente.");
    } finally {
      setIsEnviando(false);
    }
  };

  const isFormValid = () => {
    return formData.alunoId && formData.quantidade && formData.motivo && formData.motivo.length >= 20;
  };

  const quantidadeNum = parseInt(formData.quantidade) || 0;
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
                  <h3 className="text-lg font-semibold mb-2">Seu Saldo Disponível</h3>
                  <CoinBadge 
                    amount={saldoAtual} 
                    variant="large"
                    animated
                  />
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Próxima recarga</p>
                  <p className="font-semibold">Julho 2024</p>
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
              {/* Seleção do Aluno */}
              <div className="space-y-2">
                <Label htmlFor="aluno">Selecionar Aluno</Label>
                <Select
                  value={formData.alunoId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, alunoId: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Busque e selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    {alunos.map((aluno) => (
                      <SelectItem key={aluno.id} value={aluno.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{aluno.nome}</span>
                          <span className="text-sm text-muted-foreground">{aluno.curso}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantidade de Moedas */}
              <div className="space-y-2">
                <Label htmlFor="quantidade">Quantidade de Moedas</Label>
                <div className="relative">
                  <Input
                    id="quantidade"
                    type="number"
                    placeholder="Ex: 50"
                    value={formData.quantidade}
                    onChange={(e) => setFormData(prev => ({ ...prev, quantidade: e.target.value }))}
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
                <Label htmlFor="motivo">Motivo do Reconhecimento</Label>
                <Textarea
                  id="motivo"
                  placeholder="Descreva o motivo pelo qual o aluno está sendo reconhecido (mínimo 20 caracteres)..."
                  value={formData.motivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, motivo: e.target.value }))}
                  rows={4}
                />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Mínimo 20 caracteres
                  </span>
                  <span className={formData.motivo.length < 20 ? "text-red-600" : "text-green-600"}>
                    {formData.motivo.length}/20
                  </span>
                </div>
              </div>

              {/* Preview */}
              {alunoSelecionado && formData.quantidade && formData.motivo && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-muted/50 rounded-lg space-y-3"
                >
                  <h4 className="font-semibold">Preview da Distribuição</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aluno:</span>
                      <span className="font-medium">{alunoSelecionado.nome}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Curso:</span>
                      <span>{alunoSelecionado.curso}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantidade:</span>
                      <CoinBadge amount={quantidadeNum} variant="compact" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Saldo após:</span>
                      <CoinBadge amount={saldoAtual - quantidadeNum} variant="compact" />
                    </div>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Motivo:</p>
                    <p className="text-sm font-medium">"{formData.motivo}"</p>
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
                  <div className={`w-2 h-2 rounded-full ${formData.alunoId ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className={formData.alunoId ? "text-green-700" : "text-muted-foreground"}>
                    Aluno selecionado
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${formData.quantidade && !saldoInsuficiente ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className={formData.quantidade && !saldoInsuficiente ? "text-green-700" : "text-muted-foreground"}>
                    Quantidade válida
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${formData.motivo.length >= 20 ? "bg-green-500" : "bg-gray-300"}`} />
                  <span className={formData.motivo.length >= 20 ? "text-green-700" : "text-muted-foreground"}>
                    Motivo preenchido
                  </span>
                </div>
              </div>

              {/* Botão de Envio */}
              <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 hover:from-campus-purple-600 hover:to-campus-blue-600"
                    disabled={!isFormValid()}
                  >
                    Distribuir Moedas
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar Distribuição</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-center">
                      <Gift className="h-16 w-16 mx-auto text-campus-purple-600 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Distribuir {quantidadeNum} moedas
                      </h3>
                      <p className="text-muted-foreground">
                        Para: {alunoSelecionado?.nome}
                      </p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Aluno:</span>
                        <span className="font-medium">{alunoSelecionado?.nome}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Curso:</span>
                        <span>{alunoSelecionado?.curso}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Quantidade:</span>
                        <CoinBadge amount={quantidadeNum} variant="compact" />
                      </div>
                      <div className="flex justify-between">
                        <span>Saldo atual:</span>
                        <CoinBadge amount={saldoAtual} variant="compact" />
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Saldo após:</span>
                        <CoinBadge amount={saldoAtual - quantidadeNum} variant="compact" />
                      </div>
                    </div>

                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-700">
                        <strong>Motivo:</strong> "{formData.motivo}"
                      </p>
                    </div>

                    <p className="text-sm text-muted-foreground text-center">
                      O aluno será notificado por email sobre o reconhecimento.
                    </p>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowConfirmModal(false)}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                      <Button
                        onClick={handleEnviar}
                        disabled={isEnviando}
                        className="flex-1 bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 hover:from-campus-purple-600 hover:to-campus-blue-600"
                      >
                        {isEnviando ? "Enviando..." : "Confirmar"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Aviso */}
              <p className="text-xs text-muted-foreground text-center">
                Ao distribuir, você concorda que o reconhecimento é justo e merecido.
              </p>
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
