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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@/components/design-system";
import {
  Search,
  Filter,
  ShoppingBag,
  Gift,
  Building2,
  Star,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, slideUp } from "@/lib/animations";
import { useRewards, useRedeemReward } from "@/hooks";
import { MarketplaceSkeleton } from "@/components/feedback/loading-states";
import { getCategoryIcon } from "@/lib/utils/reward-icons";

export default function MarketplacePage() {
  const [filtros, setFiltros] = useState({
    categoria: "todas",
    empresa: "todas",
    precoMin: "",
    precoMax: "",
    busca: "",
    ordenacao: "relevancia",
  });

  const { data: vantagens, isLoading } = useRewards({
    categoria: filtros.categoria !== "todas" ? filtros.categoria : undefined,
    precoMin: filtros.precoMin ? Number(filtros.precoMin) : undefined,
    precoMax: filtros.precoMax ? Number(filtros.precoMax) : undefined,
    ordenacao: filtros.ordenacao as any,
  });

  const redeemMutation = useRedeemReward();

  if (isLoading) {
    return <MarketplaceSkeleton />;
  }

  const categorias = [
    "todas",
    "Alimentação",
    "Educação",
    "Esportes",
    "Serviços",
    "Tecnologia",
    "Saúde",
    "Beleza",
    "Entretenimento",
  ];

  const empresas = [
    "todas",
    "Livraria Central",
    "Restaurante Universitário",
    "Universidade",
    "Academia Campus",
    "Lanchonete Central",
    "Tech Academy",
  ];

  // Mapear dados da API para o formato esperado pelo frontend
  const vantagensMapeadas =
    vantagens?.map((reward) => ({
      id: reward.ID,
      titulo: reward.Title,
      descricao: reward.Description,
      custoMoedas: reward.Cost,
      categoria: reward.Category,
      ativa: reward.Active,
      empresa: reward.CompanyName || "Empresa",
    })) || [];

  const vantagensFiltradas = vantagensMapeadas.filter((vantagem) => {
    // Sempre mostrar apenas vantagens ativas
    if (!vantagem.ativa) {
      return false;
    }
    
    if (
      filtros.categoria &&
      filtros.categoria !== "todas" &&
      vantagem.categoria !== filtros.categoria
    ) {
      return false;
    }
    if (
      filtros.empresa &&
      filtros.empresa !== "todas" &&
      vantagem.empresa !== filtros.empresa
    ) {
      return false;
    }
    if (
      filtros.precoMin &&
      filtros.precoMin.trim() !== "" &&
      vantagem.custoMoedas < parseInt(filtros.precoMin)
    ) {
      return false;
    }
    if (
      filtros.precoMax &&
      filtros.precoMax.trim() !== "" &&
      vantagem.custoMoedas > parseInt(filtros.precoMax)
    ) {
      return false;
    }
    if (
      filtros.busca &&
      filtros.busca.trim() !== "" &&
      !vantagem.titulo.toLowerCase().includes(filtros.busca.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  // Ordenação
  const vantagensOrdenadas = [...vantagensFiltradas].sort((a, b) => {
    switch (filtros.ordenacao) {
      case "menor-preco":
        return a.custoMoedas - b.custoMoedas;
      case "maior-preco":
        return b.custoMoedas - a.custoMoedas;
      case "nome":
        return a.titulo.localeCompare(b.titulo);
      default:
        return 0;
    }
  });

  const handleRedeem = (rewardId: number) => {
    redeemMutation.mutate(rewardId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Marketplace
            </h1>
            <p className="text-muted-foreground">
              Troque suas moedas por vantagens exclusivas
            </p>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <motion.div variants={slideUp} initial="initial" animate="animate">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros e Busca
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {/* Busca */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Nome da vantagem..."
                    value={filtros.busca}
                    onChange={(e) =>
                      setFiltros((prev) => ({ ...prev, busca: e.target.value }))
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={filtros.categoria}
                  onValueChange={(value) =>
                    setFiltros((prev) => ({ ...prev, categoria: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria === "todas"
                          ? "Todas as categorias"
                          : categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Empresa */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Empresa</label>
                <Select
                  value={filtros.empresa}
                  onValueChange={(value) =>
                    setFiltros((prev) => ({ ...prev, empresa: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {empresas.map((empresa) => (
                      <SelectItem key={empresa} value={empresa}>
                        {empresa === "todas" ? "Todas as empresas" : empresa}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Preço Mínimo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Preço Mín.</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={filtros.precoMin}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      precoMin: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Preço Máximo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Preço Máx.</label>
                <Input
                  type="number"
                  placeholder="1000"
                  value={filtros.precoMax}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      precoMax: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Ordenação */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Ordenar por:</label>
                <Select
                  value={filtros.ordenacao}
                  onValueChange={(value) =>
                    setFiltros((prev) => ({ ...prev, ordenacao: value }))
                  }
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevancia">Relevância</SelectItem>
                    <SelectItem value="menor-preco">Menor Preço</SelectItem>
                    <SelectItem value="maior-preco">Maior Preço</SelectItem>
                    <SelectItem value="nome">
                      Nome (A-Z)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-sm text-muted-foreground">
                {vantagensOrdenadas.length} vantagens encontradas
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Grid de Vantagens */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {vantagensOrdenadas.map((vantagem) => (
          <motion.div key={vantagem.id} variants={slideUp}>
            <Card className="h-full flex flex-col hover:shadow-card-lg transition-all duration-300 hover:-translate-y-1 group">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-campus-purple-100 to-campus-blue-100 rounded-t-lg flex items-center justify-center">
                  {(() => {
                    const Icone = getCategoryIcon(vantagem.categoria);
                    return <Icone className="h-16 w-16 text-campus-purple-600" />;
                  })()}
                </div>
                <Badge className="absolute top-3 left-3 bg-campus-gold-100 text-campus-gold-700">
                  {vantagem.categoria}
                </Badge>
              </div>

              <CardContent className="p-4 flex-1 flex flex-col">
                <div className="space-y-3 flex-1 flex flex-col">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-campus-purple-600 transition-colors">
                      {vantagem.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {vantagem.descricao}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{vantagem.empresa}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-campus-gold-100 text-campus-gold-700 px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold">
                        {vantagem.custoMoedas}
                      </span>
                      <span className="text-xs">moedas</span>
                    </div>
                  </div>

                  <div className="mt-auto space-y-2">
                    <Button
                      className="w-full group-hover:bg-campus-purple-600 transition-colors"
                      onClick={() => handleRedeem(vantagem.id)}
                      disabled={redeemMutation.isPending}
                    >
                      {redeemMutation.isPending ? "Resgatando..." : "Resgatar"}
                      <Gift className="h-4 w-4 ml-2" />
                    </Button>
                    <Link href={`/aluno/marketplace/${vantagem.id}`}>
                      <Button variant="outline" className="w-full">
                        Ver Detalhes
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {vantagensOrdenadas.length === 0 && (
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="text-center py-12"
        >
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhuma vantagem encontrada
          </h3>
          <p className="text-muted-foreground mb-4">
            Tente ajustar os filtros para ver mais resultados
          </p>
          <Button
            variant="outline"
            onClick={() =>
              setFiltros({
                categoria: "todas",
                empresa: "todas",
                precoMin: "",
                precoMax: "",
                busca: "",
                ordenacao: "relevancia",
              })
            }
          >
            Limpar Filtros
          </Button>
        </motion.div>
      )}
    </div>
  );
}
