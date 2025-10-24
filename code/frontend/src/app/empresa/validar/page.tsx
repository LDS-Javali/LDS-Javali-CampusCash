"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Input,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/design-system";
import { 
  QrCode,
  Search,
  CheckCircle,
  XCircle,
  Camera,
  ArrowLeft,
  Gift,
  User,
  Calendar,
  Building2
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, slideUp } from "@/lib/animations";
import { toast } from "sonner";

export default function ValidarCuponsPage() {
  const [codigoInput, setCodigoInput] = useState("");
  const [isValidando, setIsValidando] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [cupomValidado, setCupomValidado] = useState<any>(null);

  
  const validacoesRecentes = [
    {
      id: "1",
      codigo: "CAMPUS-2024-001",
      aluno: "João Silva Santos",
      vantagem: "Desconto 30% Livraria Central",
      dataValidacao: new Date("2024-01-15T10:30:00"),
      status: "validado",
    },
    {
      id: "2",
      codigo: "CAMPUS-2024-002",
      aluno: "Maria Santos Costa",
      vantagem: "Almoço Grátis Restaurante",
      dataValidacao: new Date("2024-01-14T14:20:00"),
      status: "validado",
    },
    {
      id: "3",
      codigo: "CAMPUS-2024-003",
      aluno: "Pedro Costa Lima",
      vantagem: "Desconto 20% Lanchonete",
      dataValidacao: new Date("2024-01-13T16:45:00"),
      status: "expirado",
    },
  ];

  const handleValidarCodigo = async () => {
    if (!codigoInput.trim()) {
      toast.error("Digite um código para validar");
      return;
    }

    setIsValidando(true);
    try {
      // Simular validação
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock de cupom encontrado
      const cupomMock = {
        codigo: codigoInput,
        aluno: "Ana Lima Oliveira",
        vantagem: "Desconto 30% Livraria Central",
        dataResgate: new Date("2024-01-12T09:15:00"),
        dataValidade: new Date("2024-12-31"),
        usado: false,
        custoMoedas: 200,
      };

      setCupomValidado(cupomMock);
      toast.success("Cupom encontrado!");
    } catch (error) {
      toast.error("Cupom não encontrado ou inválido");
    } finally {
      setIsValidando(false);
    }
  };

  const handleConfirmarUso = async () => {
    try {
      // Simular confirmação
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Cupom validado e marcado como usado!");
      setCupomValidado(null);
      setCodigoInput("");
    } catch (error) {
      toast.error("Erro ao validar cupom");
    }
  };

  const handleScanResult = (result: string) => {
    setCodigoInput(result);
    setShowScanner(false);
    handleValidarCodigo();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Validar Cupons
            </h1>
            <p className="text-muted-foreground">
              Valide cupons resgatados pelos estudantes
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Validação */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="lg:col-span-2 space-y-6"
        >
          {/* Input de Código */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Validar Cupom
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Código do Cupom</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite o código do cupom..."
                    value={codigoInput}
                    onChange={(e) => setCodigoInput(e.target.value.toUpperCase())}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleValidarCodigo}
                    disabled={isValidando || !codigoInput.trim()}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">ou</p>
                <Dialog open={showScanner} onOpenChange={setShowScanner}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Camera className="h-4 w-4 mr-2" />
                      Escanear QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Escanear QR Code</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <QrCode className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                          <p className="text-sm text-muted-foreground">
                            Posicione o QR code na câmera
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowScanner(false)}
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                        <Button
                          onClick={() => handleScanResult("CAMPUS-2024-001")}
                          className="flex-1"
                        >
                          Simular Escaneamento
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>

          {/* Resultado da Validação */}
          {cupomValidado && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Cupom Encontrado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Código</label>
                      <p className="font-mono text-lg font-semibold">{cupomValidado.codigo}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <Badge className="bg-green-100 text-green-700">
                        {cupomValidado.usado ? "Usado" : "Válido"}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{cupomValidado.aluno}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{cupomValidado.vantagem}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Resgatado em: {cupomValidado.dataResgate.toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        Válido até: {cupomValidado.dataValidade.toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  {!cupomValidado.usado ? (
                    <div className="pt-4 border-t">
                      <Button
                        onClick={handleConfirmarUso}
                        className="w-full bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 hover:from-campus-purple-600 hover:to-campus-blue-600"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirmar Uso do Cupom
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-4 w-4" />
                        <span className="text-sm font-medium">Cupom já foi utilizado</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Sidebar */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {/* Instruções */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Como Validar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Digite o Código</h4>
                <p className="text-muted-foreground">
                  O aluno deve apresentar o código do cupom ou QR code.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">2. Verifique os Dados</h4>
                <p className="text-muted-foreground">
                  Confirme se o cupom é válido e não foi usado anteriormente.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">3. Confirme o Uso</h4>
                <p className="text-muted-foreground">
                  Após validar, confirme o uso para marcar o cupom como utilizado.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Validações Recentes */}
          <Card>
            <CardHeader>
              <CardTitle>Validações Recentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {validacoesRecentes.map((validacao) => (
                <div
                  key={validacao.id}
                  className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    validacao.status === "validado" 
                      ? "bg-green-100 text-green-600" 
                      : "bg-red-100 text-red-600"
                  }`}>
                    {validacao.status === "validado" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {validacao.codigo}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {validacao.aluno}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {validacao.dataValidacao.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Voltar */}
          <Link href="/empresa/dashboard">
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
