"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  CoinBadge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
  Badge,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/design-system";
import {
  Gift,
  Copy,
  Check,
  QrCode,
  Calendar,
  Building2,
  Download,
  Eye,
  EyeOff,
} from "lucide-react";
import { staggerContainer, slideUp } from "@/lib/animations";
import { toast } from "sonner";
import { useStudentCoupons } from "@/hooks";
import QRCode from "react-qr-code";
import { getCategoryIcon } from "@/lib/utils/reward-icons";

export default function MeusCuponsPage() {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [cupomDetalhes, setCupomDetalhes] = useState<any>(null);

  const { data: coupons, isLoading: couponsLoading } = useStudentCoupons();

  // Mapear dados da API para o formato esperado pelo frontend
  const cupons =
    coupons?.map((coupon) => ({
      id: coupon.ID.toString(),
      codigo: coupon.Code,
      hash: coupon.Hash,
      vantagem: {
        titulo: coupon.Reward?.Title || "Vantagem",
        empresa: coupon.Reward?.CompanyName || "Empresa",
        categoria: coupon.Reward?.Category || "",
        descricao: coupon.Reward?.Description || "",
        custoMoedas: coupon.Reward?.Cost || 0,
      },
      dataResgate: new Date(coupon.CreatedAt),
      dataValidade: coupon.ExpiresAt ? new Date(coupon.ExpiresAt) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      usado: coupon.Redeemed,
      dataUso: coupon.UsedAt ? new Date(coupon.UsedAt) : null,
      custoMoedas: coupon.Reward?.Cost || 0,
    })) || [];

  const cuponsFiltrados = cupons.filter((cupom) => {
    if (filtroStatus === "ativos") return !cupom.usado;
    if (filtroStatus === "usados") return cupom.usado;
    return true;
  });

  if (couponsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Meus Cupons</h1>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-campus-purple-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Carregando cupons...</p>
        </div>
      </div>
    );
  }

  const handleCopyCode = async (codigo: string) => {
    try {
      await navigator.clipboard.writeText(codigo);
      setCopiedCode(codigo);
      toast.success("Código copiado!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      toast.error("Erro ao copiar código");
    }
  };

  const handleCopyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      toast.success("Hash copiado!");
      setTimeout(() => setCopiedHash(null), 2000);
    } catch (error) {
      toast.error("Erro ao copiar hash");
    }
  };

  const handleDownloadQR = (hash: string) => {
    try {
      const svg = document.querySelector(`[data-qr-hash="${hash}"]`)?.querySelector('svg');
      if (!svg) {
        toast.error("QR Code não encontrado");
        return;
      }
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      canvas.width = 300;
      canvas.height = 300;
      
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `cupom-${hash.substring(0, 8)}.png`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("QR Code baixado com sucesso!");
          }
        });
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
    } catch (error) {
      toast.error("Erro ao baixar QR Code");
    }
  };

  const isExpirado = (dataValidade: Date) => {
    return new Date() > dataValidade;
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Meus Cupons
            </h1>
            <p className="text-muted-foreground">
              Gerencie seus cupons resgatados
            </p>
          </div>
          <Button
            onClick={() => toast.info("Funcionalidade de download em desenvolvimento")}
            variant="outline"
          >
            Baixar Todos
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <motion.div variants={slideUp} initial="initial" animate="animate">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Filtrar por status:</label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativos">Ativos</SelectItem>
                  <SelectItem value="usados">Usados</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                {cuponsFiltrados.length} cupons encontrados
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de Cupons */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="space-y-4"
      >
        {cuponsFiltrados.map((cupom) => (
          <motion.div key={cupom.id} variants={slideUp}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-campus-purple-100 to-campus-blue-100 rounded-lg flex items-center justify-center">
                        {(() => {
                          const Icone = getCategoryIcon(cupom.vantagem.categoria);
                          return <Icone className="h-6 w-6 text-campus-purple-600" />;
                        })()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {cupom.vantagem.titulo}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>{cupom.vantagem.empresa}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Resgatado:
                        </span>
                        <span className="font-medium">
                          {formatarData(cupom.dataResgate.toISOString())}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Gift className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Moedas:</span>
                        <span className="font-medium text-campus-gold-600">
                          {cupom.custoMoedas}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Código:</span>
                        <div className="flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                          <span className="font-mono text-sm">
                            {cupom.codigo}
                          </span>
                          <button
                            onClick={() => handleCopyCode(cupom.codigo)}
                            className="hover:bg-gray-200 p-1 rounded transition-colors"
                            title="Copiar código"
                          >
                            {copiedCode === cupom.codigo ? (
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          className={
                            cupom.usado
                              ? "bg-green-100 text-green-700"
                              : isExpirado(cupom.dataValidade)
                              ? "bg-red-100 text-red-700"
                              : "bg-campus-purple-100 text-campus-purple-700"
                          }
                        >
                          {cupom.usado
                            ? "Usado"
                            : isExpirado(cupom.dataValidade)
                            ? "Expirado"
                            : "Ativo"}
                        </Badge>
                      </div>
                    </div>

                    {/* Hash e QR Code em linha */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">
                          Hash do Cupom
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 p-2 bg-muted/50 rounded-lg font-mono text-xs break-all">
                            {cupom.hash}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyHash(cupom.hash)}
                            className="shrink-0"
                          >
                            {copiedHash === cupom.hash ? (
                              <Check className="h-3 w-3 text-green-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-muted-foreground">
                          QR Code
                        </label>
                        <div 
                          data-qr-hash={cupom.hash}
                          className="flex items-center justify-center p-2 bg-white border rounded-lg"
                        >
                          <QRCode value={cupom.hash} size={120} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCupomDetalhes(cupom)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ver Detalhes
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadQR(cupom.hash)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar QR Code
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Modal de Detalhes */}
      <Dialog open={!!cupomDetalhes} onOpenChange={(open) => !open && setCupomDetalhes(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {cupomDetalhes && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5 text-campus-purple-600" />
                  Detalhes do Cupom
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Informações Principais */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-campus-purple-100 to-campus-blue-100 rounded-lg flex items-center justify-center">
                    {(() => {
                      const Icone = getCategoryIcon(cupomDetalhes.vantagem.categoria);
                      return <Icone className="h-8 w-8 text-campus-purple-600" />;
                    })()}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-xl">{cupomDetalhes.vantagem.titulo}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Building2 className="h-4 w-4" />
                      <span>{cupomDetalhes.vantagem.empresa}</span>
                    </div>
                  </div>
                  <Badge
                    className={
                      cupomDetalhes.usado
                        ? "bg-green-100 text-green-700"
                        : isExpirado(cupomDetalhes.dataValidade)
                        ? "bg-red-100 text-red-700"
                        : "bg-campus-purple-100 text-campus-purple-700"
                    }
                  >
                    {cupomDetalhes.usado
                      ? "Usado"
                      : isExpirado(cupomDetalhes.dataValidade)
                      ? "Expirado"
                      : "Ativo"}
                  </Badge>
                </div>

                {/* Detalhes da Vantagem */}
                <div className="p-4 bg-muted/30 rounded-lg border space-y-3">
                  <h4 className="text-sm font-semibold">Detalhes da Vantagem</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Categoria:</span>
                      <Badge variant="outline">{cupomDetalhes.vantagem.categoria}</Badge>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Descrição:</span>
                      <p className="mt-1 text-sm">{cupomDetalhes.vantagem.descricao}</p>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Custo:</span>
                      <CoinBadge amount={cupomDetalhes.vantagem.custoMoedas} variant="compact" />
                    </div>
                  </div>
                </div>

                {/* QR Code e Hash */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">QR Code</label>
                    <div 
                      data-qr-hash={cupomDetalhes.hash}
                      className="flex items-center justify-center p-4 bg-white border rounded-lg"
                    >
                      <QRCode value={cupomDetalhes.hash} size={200} />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadQR(cupomDetalhes.hash)}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Baixar QR Code
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Hash do Cupom</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-3 bg-muted/50 rounded-lg font-mono text-xs break-all">
                        {cupomDetalhes.hash}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyHash(cupomDetalhes.hash)}
                        className="shrink-0"
                      >
                        {copiedHash === cupomDetalhes.hash ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <label className="text-sm font-medium">Código do Cupom</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 p-3 bg-muted/50 rounded-lg font-mono text-sm">
                        {cupomDetalhes.codigo}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCopyCode(cupomDetalhes.codigo)}
                        className="shrink-0"
                      >
                        {copiedCode === cupomDetalhes.codigo ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Informações de Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Resgatado em:</span>
                    <span className="font-medium">
                      {formatarData(cupomDetalhes.dataResgate.toISOString())}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Válido até:</span>
                    <span className={`font-medium ${isExpirado(cupomDetalhes.dataValidade) ? "text-red-600" : ""}`}>
                      {cupomDetalhes.dataValidade.toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  {cupomDetalhes.usado && cupomDetalhes.dataUso && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Usado em:</span>
                      <span className="font-medium">
                        {cupomDetalhes.dataUso.toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Empty State */}
      {cuponsFiltrados.length === 0 && (
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="text-center py-12"
        >
          <Gift className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhum cupom encontrado
          </h3>
          <p className="text-muted-foreground mb-4">
            {filtroStatus === "todos"
              ? "Você ainda não resgatou nenhuma vantagem"
              : `Nenhum cupom ${
                  filtroStatus === "ativos" ? "ativo" : "usado"
                } encontrado`}
          </p>
          {filtroStatus === "todos" && (
            <Link href="/aluno/marketplace">
              <Button>Explorar Vantagens</Button>
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}
