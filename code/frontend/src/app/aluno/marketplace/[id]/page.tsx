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
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/design-system";
import { 
  ArrowLeft,
  Gift,
  Building2,
  Star,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, slideUp, scaleIn } from "@/lib/animations";
import { toast } from "sonner";

export default function VantagemDetalhesPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isResgatando, setIsResgatando] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  
  const vantagem = {
    id: params.id,
    titulo: "Desconto 30% Livraria Central",
    descricao: "Desconto especial em todos os livros didáticos e literatura. Válido para compras presenciais e online. Não cumulativo com outras promoções.",
    descricaoCompleta: `
      Esta vantagem oferece um desconto de 30% em todos os produtos da Livraria Central, incluindo:
      
      • Livros didáticos e acadêmicos
      • Literatura clássica e contemporânea  
      • Materiais de estudo e apostilas
      • Produtos de papelaria
      
      O desconto é válido tanto para compras presenciais quanto online, e pode ser utilizado uma vez por aluno. Não é cumulativo com outras promoções em andamento.
      
      Para resgatar, apresente o cupom digital na loja ou utilize o código promocional no site da livraria.
    `,
    empresa: "Livraria Central",
    empresaId: "livraria-central",
    custoMoedas: 200,
    categoria: "Educação",
    imagem: "/placeholder-vantagem.jpg",
    ativa: true,
    avaliacao: 4.8,
    resgates: 156,
    dataValidade: new Date("2024-12-31"),
    termos: "Válido até 31/12/2024. Não cumulativo com outras promoções. Apresentar cupom digital na loja.",
  };

  const saldoAtual = 1250; // Mock - substituir por dados reais
  const podeResgatar = saldoAtual >= vantagem.custoMoedas;

  const handleResgatar = async () => {
    setIsResgatando(true);
    try {
      // Simular resgate
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Vantagem resgatada com sucesso!");
      toast.success("Cupom enviado para seu email!");
      
      setShowConfirmModal(false);
      router.push("/aluno/cupons");
    } catch (error) {
      toast.error("Erro ao resgatar vantagem. Tente novamente.");
    } finally {
      setIsResgatando(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
            <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Page Title
            </h1>
            <p className="text-muted-foreground">
              
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Imagem e Info Principal */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="lg:col-span-2 space-y-6"
        >
          {/* Imagem */}
          <Card>
            <div className="aspect-video bg-gradient-to-br from-campus-purple-100 to-campus-blue-100 rounded-t-lg flex items-center justify-center">
              <Gift className="h-24 w-24 text-campus-purple-600" />
            </div>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Badge className="bg-campus-gold-100 text-campus-gold-700">
                  {vantagem.categoria}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-campus-gold-400 text-campus-gold-400" />
                  <span className="text-sm font-medium">{vantagem.avaliacao}</span>
                  <span className="text-sm text-muted-foreground">({vantagem.resgates} resgates)</span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {vantagem.titulo}
              </h1>
              
              <div className="flex items-center gap-2 text-muted-foreground mb-6">
                <Building2 className="h-5 w-5" />
                <span className="text-lg">{vantagem.empresa}</span>
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-lg text-foreground leading-relaxed">
                  {vantagem.descricao}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Descrição Completa */}
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Vantagem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-gray max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-line">
                  {vantagem.descricaoCompleta}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Termos e Condições */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Termos e Condições
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {vantagem.termos}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar - Resgate */}
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="space-y-6"
        >
          {/* Card de Resgate */}
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Resgatar Vantagem
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Preço */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Custo em moedas</p>
                <CoinBadge 
                  amount={vantagem.custoMoedas} 
                  variant="large"
                  animated
                />
              </div>

              {/* Saldo Atual */}
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Seu saldo atual</p>
                <CoinBadge 
                  amount={saldoAtual} 
                  variant="default"
                />
              </div>

              {/* Status */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-700">
                  Saldo suficiente para resgate
                </span>
              </div>

              {/* Validade */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Válido até {vantagem.dataValidade.toLocaleDateString("pt-BR")}</span>
              </div>

              {/* Botão de Resgate */}
              <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
                <DialogTrigger asChild>
                  <Button 
                    className="w-full bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 hover:from-campus-purple-600 hover:to-campus-blue-600"
                    disabled={!podeResgatar}
                  >
                    Resgatar Vantagem
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirmar Resgate</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-center">
                      <Gift className="h-16 w-16 mx-auto text-campus-purple-600 mb-4" />
                      <h3 className="text-lg font-semibold mb-2">{vantagem.titulo}</h3>
                      <p className="text-muted-foreground">{vantagem.empresa}</p>
                    </div>
                    
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span>Custo:</span>
                        <CoinBadge amount={vantagem.custoMoedas} variant="compact" />
                      </div>
                      <div className="flex justify-between">
                        <span>Saldo atual:</span>
                        <CoinBadge amount={saldoAtual} variant="compact" />
                      </div>
                      <div className="flex justify-between font-semibold border-t pt-2">
                        <span>Saldo após resgate:</span>
                        <CoinBadge amount={saldoAtual - vantagem.custoMoedas} variant="compact" />
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground text-center">
                      Após confirmar, um cupom será enviado para seu email e você poderá utilizá-lo presencialmente.
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
                        onClick={handleResgatar}
                        disabled={isResgatando}
                        className="flex-1 bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 hover:from-campus-purple-600 hover:to-campus-blue-600"
                      >
                        {isResgatando ? "Processando..." : "Confirmar Resgate"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Aviso */}
              <p className="text-xs text-muted-foreground text-center">
                Ao resgatar, você concorda com os termos e condições desta vantagem.
              </p>
            </CardContent>
          </Card>

          {/* Voltar */}
          <Link href="/aluno/marketplace">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar ao Marketplace
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
