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
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/design-system";
import { 
  Gift,
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Search,
  Filter,
  ArrowRight,
  Building2,
  Calendar
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { staggerContainer, slideUp } from "@/lib/animations";
import { toast } from "sonner";

export default function GerenciarVantagensPage() {
  const [filtroStatus, setFiltroStatus] = useState("todas");
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  
  const vantagens = [
    {
      id: "1",
      titulo: "Desconto 30% Livraria Central",
      descricao: "Desconto especial em todos os livros didáticos e literatura",
      custoMoedas: 200,
      categoria: "Educação",
      imagem: "/placeholder-vantagem.jpg",
      ativa: true,
      resgates: 23,
      receita: 4600,
      dataCriacao: new Date("2024-01-01"),
    },
    {
      id: "2",
      titulo: "Almoço Grátis Restaurante Universitário",
      descricao: "Refeição completa no restaurante universitário",
      custoMoedas: 150,
      categoria: "Alimentação",
      imagem: "/placeholder-vantagem.jpg",
      ativa: true,
      resgates: 18,
      receita: 2700,
      dataCriacao: new Date("2024-01-05"),
    },
    {
      id: "3",
      titulo: "Desconto 20% Lanchonete",
      descricao: "Desconto em lanches e bebidas",
      custoMoedas: 100,
      categoria: "Alimentação",
      imagem: "/placeholder-vantagem.jpg",
      ativa: false,
      resgates: 15,
      receita: 1500,
      dataCriacao: new Date("2024-01-10"),
    },
    {
      id: "4",
      titulo: "Acesso Premium Academia",
      descricao: "1 mês de acesso premium à academia do campus",
      custoMoedas: 300,
      categoria: "Esportes",
      imagem: "/placeholder-vantagem.jpg",
      ativa: true,
      resgates: 8,
      receita: 2400,
      dataCriacao: new Date("2024-01-15"),
    },
  ];

  const vantagensFiltradas = vantagens.filter((vantagem) => {
    if (filtroStatus === "ativas") return vantagem.ativa;
    if (filtroStatus === "inativas") return !vantagem.ativa;
    return true;
  });

  const handleToggleStatus = async (id: string) => {
    try {
      // Simular toggle
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("Status atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar status");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      // Simular exclusão
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Vantagem excluída com sucesso!");
      setShowDeleteModal(null);
    } catch (error) {
      toast.error("Erro ao excluir vantagem");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Gerenciar Vantagens
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas vantagens oferecidas aos estudantes
            </p>
          </div>
          <Button
            onClick={() => {}}
            variant="default"
          >
            Nova Vantagem
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
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filtrar por status:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filtroStatus === "todas" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("todas")}
                >
                  Todas ({vantagens.length})
                </Button>
                <Button
                  variant={filtroStatus === "ativas" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("ativas")}
                >
                  Ativas ({vantagens.filter(v => v.ativa).length})
                </Button>
                <Button
                  variant={filtroStatus === "inativas" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFiltroStatus("inativas")}
                >
                  Inativas ({vantagens.filter(v => !v.ativa).length})
                </Button>
              </div>
              <div className="text-sm text-muted-foreground ml-auto">
                {vantagensFiltradas.length} vantagens encontradas
              </div>
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
        {vantagensFiltradas.map((vantagem) => (
          <motion.div key={vantagem.id} variants={slideUp}>
            <Card className="h-full hover:shadow-card-lg transition-all duration-300 group">
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-campus-purple-100 to-campus-blue-100 rounded-t-lg flex items-center justify-center">
                  <Gift className="h-12 w-12 text-campus-purple-600" />
                </div>
                <Badge className="absolute top-3 left-3 bg-campus-gold-100 text-campus-gold-700">
                  {vantagem.categoria}
                </Badge>
                <Badge 
                  className={`absolute top-3 right-3 ${
                    vantagem.ativa 
                      ? "bg-green-100 text-green-700" 
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {vantagem.ativa ? "Ativa" : "Inativa"}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-campus-purple-600 transition-colors">
                      {vantagem.titulo}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {vantagem.descricao}
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Custo:</span>
                      <CoinBadge amount={vantagem.custoMoedas} variant="compact" />
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Resgates:</span>
                      <span className="font-medium">{vantagem.resgates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Receita:</span>
                      <span className="font-medium text-campus-gold-600">
                        {vantagem.receita} moedas
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Criada em:</span>
                      <span className="text-xs">
                        {vantagem.dataCriacao.toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(vantagem.id)}
                      className="flex-1"
                    >
                      {vantagem.ativa ? (
                        <>
                          <EyeOff className="h-4 w-4 mr-2" />
                          Desativar
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          Ativar
                        </>
                      )}
                    </Button>
                    
                    <Link href={`/empresa/vantagens/${vantagem.id}/editar`}>
                      <Button variant="outline" size="sm">
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Dialog open={showDeleteModal === vantagem.id} onOpenChange={(open) => setShowDeleteModal(open ? vantagem.id : null)}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirmar Exclusão</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p className="text-muted-foreground">
                            Tem certeza que deseja excluir a vantagem "{vantagem.titulo}"?
                          </p>
                          <p className="text-sm text-red-600">
                            Esta ação não pode ser desfeita e todos os dados relacionados serão perdidos.
                          </p>
                          <div className="flex gap-3">
                            <Button
                              variant="outline"
                              onClick={() => setShowDeleteModal(null)}
                              className="flex-1"
                            >
                              Cancelar
                            </Button>
                            <Button
                              variant="destructive"
                              onClick={() => handleDelete(vantagem.id)}
                              className="flex-1"
                            >
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {vantagensFiltradas.length === 0 && (
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="text-center py-12"
        >
          <Gift className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Nenhuma vantagem encontrada
          </h3>
          <p className="text-muted-foreground mb-4">
            {filtroStatus === "todas" 
              ? "Você ainda não criou nenhuma vantagem"
              : `Nenhuma vantagem ${filtroStatus === "ativas" ? "ativa" : "inativa"} encontrada`
            }
          </p>
          {filtroStatus === "todas" && (
            <Link href="/empresa/vantagens/nova">
              <Button className="bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 hover:from-campus-purple-600 hover:to-campus-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Vantagem
              </Button>
            </Link>
          )}
        </motion.div>
      )}

      {/* Nova Vantagem CTA */}
      {vantagensFiltradas.length > 0 && (
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="text-center"
        >
          <Card className="bg-gradient-to-r from-campus-purple-50 to-campus-blue-50 border-campus-purple-200">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Quer oferecer mais vantagens?
              </h3>
              <p className="text-muted-foreground mb-4">
                Crie novas vantagens para atrair mais estudantes
              </p>
              <Link href="/empresa/vantagens/nova">
                <Button className="bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 hover:from-campus-purple-600 hover:to-campus-blue-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Vantagem
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
