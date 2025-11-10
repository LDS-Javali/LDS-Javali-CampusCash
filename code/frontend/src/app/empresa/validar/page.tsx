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
  CoinBadge,
} from "@/components/design-system";
import {
  QrCode,
  Search,
  CheckCircle,
  XCircle,
  User,
  Calendar,
  Building2,
  Sparkles,
} from "lucide-react";
import { slideUp } from "@/lib/animations";
import { toast } from "sonner";
import { useValidateCoupon } from "@/hooks";
import { getCategoryIcon } from "@/lib/utils/reward-icons";

export default function ValidarCuponsPage() {
  const [codigoInput, setCodigoInput] = useState("");
  const [hashInput, setHashInput] = useState("");
  const [isValidando, setIsValidando] = useState(false);
  const [cupomValidado, setCupomValidado] = useState<any>(null);

  const validateCouponMutation = useValidateCoupon();

  const handleValidarCodigo = async () => {
    if (!codigoInput.trim() && !hashInput.trim()) {
      toast.error("Digite um código ou hash para validar");
      return;
    }

    setIsValidando(true);
    try {
      const response = await validateCouponMutation.mutateAsync({
        codigo: codigoInput.trim() || undefined,
        hash: hashInput.trim() || undefined,
      });
      
      if (response.success && response.coupon) {
        // Mapear resposta para formato esperado
        setCupomValidado({
          codigo: response.coupon.Code,
          hash: response.coupon.Hash,
          aluno: response.student?.name || `Aluno ${response.student?.id || ""}`,
          vantagem: {
            titulo: response.coupon.Reward?.Title || "Vantagem",
            categoria: response.coupon.Reward?.Category || "",
            descricao: response.coupon.Reward?.Description || "",
            custoMoedas: response.coupon.Reward?.Cost || 0,
          },
          dataResgate: new Date(response.coupon.CreatedAt),
          dataValidade: response.coupon.ExpiresAt ? new Date(response.coupon.ExpiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          usado: response.coupon.Redeemed,
        });
        toast.success("Cupom validado e marcado como usado!");
        setCodigoInput("");
        setHashInput("");
      }
    } catch (error: any) {
      toast.error(error.message || "Cupom não encontrado ou inválido");
    } finally {
      setIsValidando(false);
    }
  };

  const handleConfirmarUso = async () => {
    // A validação já marca como usado, apenas limpar o estado
    setCupomValidado(null);
    setCodigoInput("");
    setHashInput("");
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-campus-purple-100 to-campus-blue-100 mb-4">
          <QrCode className="h-8 w-8 text-campus-purple-600" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Validar Cupons
        </h1>
        <p className="text-muted-foreground text-lg">
          Valide cupons resgatados pelos estudantes
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Validação */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="lg:col-span-2 space-y-6"
        >
          {/* Input de Código */}
          <Card className="border-2">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Sparkles className="h-5 w-5 text-campus-purple-600" />
                Validar Cupom
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-semibold flex items-center gap-2">
                  <QrCode className="h-4 w-4" />
                  Hash do Cupom
                </label>
                <Input
                  placeholder="Cole o hash do cupom aqui..."
                  value={hashInput}
                  onChange={(e) => setHashInput(e.target.value.trim())}
                  className="w-full font-mono text-sm h-12"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (hashInput.trim() || codigoInput.trim())) {
                      handleValidarCodigo();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  O hash é o identificador único do cupom, geralmente fornecido via QR Code
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">ou</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold">Código do Cupom (alternativo)</label>
                <Input
                  placeholder="Digite o código do cupom (ex: CC-1234567890-123)"
                  value={codigoInput}
                  onChange={(e) =>
                    setCodigoInput(e.target.value.toUpperCase())
                  }
                  className="h-12"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (hashInput.trim() || codigoInput.trim())) {
                      handleValidarCodigo();
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Use o código como alternativa caso não tenha o hash
                </p>
                <Button
                  onClick={handleValidarCodigo}
                  disabled={isValidando || (!hashInput.trim() && !codigoInput.trim())}
                  size="lg"
                  className="w-full"
                >
                  {isValidando ? (
                    "Validando..."
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Validar
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Resultado da Validação */}
          {cupomValidado && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-2 border-green-200 bg-green-50/50">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    Cupom Encontrado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Hash e Status */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">
                        Hash do Cupom
                      </label>
                      <div className="font-mono text-xs break-all bg-background p-3 rounded-lg border">
                        {cupomValidado.hash}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-muted-foreground">
                        Status
                      </label>
                      <div>
                        <Badge 
                          className={`text-sm px-3 py-1.5 ${
                            cupomValidado.usado 
                              ? "bg-red-100 text-red-700 border-red-200" 
                              : "bg-green-100 text-green-700 border-green-200"
                          }`}
                        >
                          {cupomValidado.usado ? (
                            <>
                              <XCircle className="h-3.5 w-3.5 mr-1.5 inline" />
                              Já Utilizado
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-3.5 w-3.5 mr-1.5 inline" />
                              Válido
                            </>
                          )}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Detalhes da Vantagem */}
                  <div className="p-5 bg-background rounded-xl border-2 space-y-4">
                    <h4 className="text-base font-semibold flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-campus-purple-600" />
                      Detalhes da Vantagem
                    </h4>
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-campus-purple-100 to-campus-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        {(() => {
                          const Icone = getCategoryIcon(cupomValidado.vantagem?.categoria);
                          return <Icone className="h-10 w-10 text-campus-purple-600" />;
                        })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-lg mb-1">{cupomValidado.vantagem?.titulo || "Vantagem"}</h5>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {cupomValidado.vantagem?.descricao || ""}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge variant="outline" className="text-xs px-2.5 py-1">
                            {cupomValidado.vantagem?.categoria || ""}
                          </Badge>
                          {cupomValidado.vantagem?.custoMoedas && (
                            <CoinBadge amount={cupomValidado.vantagem.custoMoedas} variant="compact" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Informações do Aluno e Datas */}
                  <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-campus-purple-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-campus-purple-600" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Aluno</p>
                        <p className="font-semibold">{cupomValidado.aluno}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Resgatado em</p>
                          <p className="text-sm font-medium">
                            {cupomValidado.dataResgate.toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Válido até</p>
                          <p className="text-sm font-medium">
                            {cupomValidado.dataValidade.toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!cupomValidado.usado ? (
                    <div className="pt-4 border-t">
                      <Button
                        onClick={handleConfirmarUso}
                        size="lg"
                        className="w-full bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 hover:from-campus-purple-600 hover:to-campus-blue-600 text-white h-12 text-base font-semibold"
                      >
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Confirmar Uso do Cupom
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-center gap-2 text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                        <XCircle className="h-5 w-5" />
                        <span className="font-semibold">
                          Cupom já foi utilizado anteriormente
                        </span>
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
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-campus-purple-600" />
                Como Validar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-campus-purple-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-campus-purple-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Digite o Código</h4>
                    <p className="text-sm text-muted-foreground">
                      Cole o hash ou digite o código do cupom fornecido pelo aluno.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-campus-blue-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-campus-blue-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Verifique os Dados</h4>
                    <p className="text-sm text-muted-foreground">
                      Confirme se o cupom é válido e não foi usado anteriormente.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1">Confirme o Uso</h4>
                    <p className="text-sm text-muted-foreground">
                      Após validar, confirme o uso para marcar o cupom como utilizado.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
