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
  SelectValue
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
  EyeOff
} from "lucide-react";
import { staggerContainer, slideUp } from "@/lib/animations";
import { toast } from "sonner";

export default function MeusCuponsPage() {
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  
  const cupons = [
    {
      id: "1",
      codigo: "CAMPUS-2024-001",
      vantagem: {
        titulo: "Desconto 30% Livraria Central",
        empresa: "Livraria Central",
        imagem: "/placeholder-vantagem.jpg",
      },
      dataResgate: new Date("2024-01-15T10:30:00"),
      dataValidade: new Date("2024-12-31"),
      usado: false,
      dataUso: null,
      custoMoedas: 200,
    },
    {
      id: "2",
      codigo: "CAMPUS-2024-002", 
      vantagem: {
        titulo: "Almoço Grátis Restaurante Universitário",
        empresa: "Restaurante Universitário",
        imagem: "/placeholder-vantagem.jpg",
      },
      dataResgate: new Date("2024-01-14T14:20:00"),
      dataValidade: new Date("2024-06-30"),
      usado: true,
      dataUso: new Date("2024-01-16T12:00:00"),
      custoMoedas: 150,
    },
    {
      id: "3",
      codigo: "CAMPUS-2024-003",
      vantagem: {
        titulo: "Desconto 20% Lanchonete",
        empresa: "Lanchonete Central", 
        imagem: "/placeholder-vantagem.jpg",
      },
      dataResgate: new Date("2024-01-12T09:15:00"),
      dataValidade: new Date("2024-03-31"),
      usado: false,
      dataUso: null,
      custoMoedas: 100,
    },
  ];

  const cuponsFiltrados = cupons.filter((cupom) => {
    if (filtroStatus === "ativos") return !cupom.usado;
    if (filtroStatus === "usados") return cupom.usado;
    return true;
  });

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

  const handleDownloadQR = (cupom: typeof cupons[0]) => {
    // Implementar download do QR code
    toast.success("QR Code baixado!");
  };

  const isExpirado = (dataValidade: Date) => {
    return new Date() > dataValidade;
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
            onClick={() => toast.success("Cupons baixados!")}
            variant="outline"
          >
            Baixar Todos
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
      >
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <label className="text-sm font-medium">Filtrar por status:</label>
              <Select
                value={filtroStatus}
                onValueChange={setFiltroStatus}
              >
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

      {/* Grid de Cupons */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cuponsFiltrados.map((cupom) => (
          <motion.div key={cupom.id} variants={slideUp}>
            <Card className="h-full flex flex-col hover:shadow-card-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-campus-purple-600" />
                    <CardTitle className="text-lg line-clamp-2">
                      {cupom.vantagem.titulo}
                    </CardTitle>
                  </div>
                  <Badge 
                    variant={cupom.usado ? "secondary" : "default"}
                    className={cupom.usado ? "bg-green-100 text-green-700" : "bg-campus-purple-100 text-campus-purple-700"}
                  >
                    {cupom.usado ? "Usado" : "Ativo"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4 flex-1 flex flex-col">
                {/* Empresa */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{cupom.vantagem.empresa}</span>
                </div>

                {/* Código do Cupom */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Código do Cupom</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-3 bg-muted/50 rounded-lg font-mono text-sm font-semibold">
                      {cupom.codigo}
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyCode(cupom.codigo)}
                    >
                      {copiedCode === cupom.codigo ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* QR Code */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">QR Code</label>
                  <div className="flex items-center justify-center p-4 bg-white border rounded-lg">
                    <div className="w-24 h-24 bg-gradient-to-br from-campus-purple-100 to-campus-blue-100 rounded-lg flex items-center justify-center">
                      <QrCode className="h-12 w-12 text-campus-purple-600" />
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadQR(cupom)}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Baixar QR Code
                  </Button>
                </div>

                {/* Informações */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Resgatado em:</span>
                    <span>{cupom.dataResgate.toLocaleDateString("pt-BR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Válido até:</span>
                    <span className={isExpirado(cupom.dataValidade) ? "text-red-600" : ""}>
                      {cupom.dataValidade.toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Custo:</span>
                    <CoinBadge amount={cupom.custoMoedas} variant="compact" />
                  </div>
                  {cupom.usado && cupom.dataUso && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Usado em:</span>
                      <span>{cupom.dataUso.toLocaleDateString("pt-BR")}</span>
                    </div>
                  )}
                </div>

                {/* Status de Validade */}
                <div className="mt-auto">
                  {!cupom.usado && isExpirado(cupom.dataValidade) && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center gap-2 text-red-700">
                        <EyeOff className="h-4 w-4" />
                        <span className="text-sm font-medium">Cupom Expirado</span>
                      </div>
                    </div>
                  )}

                  {!cupom.usado && !isExpirado(cupom.dataValidade) && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <Eye className="h-4 w-4" />
                        <span className="text-sm font-medium">Pronto para uso</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

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
              : `Nenhum cupom ${filtroStatus === "ativos" ? "ativo" : "usado"} encontrado`
            }
          </p>
          {filtroStatus === "todos" && (
            <Link href="/aluno/marketplace">
              <Button>
                Explorar Vantagens
              </Button>
            </Link>
          )}
        </motion.div>
      )}
    </div>
  );
}
