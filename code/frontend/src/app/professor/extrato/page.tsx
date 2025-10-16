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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge
} from "@/components/design-system";
import { 
  Download, 
  Filter, 
  Calendar,
  Search,
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  Users,
  Eye,
  EyeOff
} from "lucide-react";
import { staggerContainer, slideUp } from "@/lib/animations";

export default function ProfessorExtrato() {
  const [filtros, setFiltros] = useState({
    aluno: "",
    dataInicio: "",
    dataFim: "",
    busca: "",
  });
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Mock data - substituir por dados reais da API
  const distribuicoes = [
    {
      id: "1",
      alunoId: "1",
      alunoNome: "João Silva Santos",
      alunoCurso: "Engenharia de Software",
      quantidade: 50,
      motivo: "Excelente participação na aula de Matemática. Demonstrou conhecimento sólido dos conceitos e contribuiu ativamente para as discussões em sala.",
      data: new Date("2024-01-15T10:30:00"),
      saldoApos: 850,
    },
    {
      id: "2",
      alunoId: "2", 
      alunoNome: "Maria Santos Costa",
      alunoCurso: "Ciência da Computação",
      quantidade: 75,
      motivo: "Boa apresentação do projeto final. O trabalho demonstrou criatividade e domínio técnico dos conceitos estudados.",
      data: new Date("2024-01-14T14:20:00"),
      saldoApos: 900,
    },
    {
      id: "3",
      alunoId: "3",
      alunoNome: "Pedro Costa Lima",
      alunoCurso: "Sistemas de Informação",
      quantidade: 25,
      motivo: "Pontualidade exemplar nas aulas e participação consistente ao longo do semestre.",
      data: new Date("2024-01-13T16:45:00"),
      saldoApos: 925,
    },
    {
      id: "4",
      alunoId: "4",
      alunoNome: "Ana Lima Oliveira",
      alunoCurso: "Engenharia de Software",
      quantidade: 100,
      motivo: "Trabalho em equipe excepcional. Liderou o grupo com eficiência e contribuiu significativamente para o sucesso do projeto.",
      data: new Date("2024-01-12T09:15:00"),
      saldoApos: 1025,
    },
    {
      id: "5",
      alunoId: "5",
      alunoNome: "Carlos Oliveira Silva",
      alunoCurso: "Ciência da Computação",
      quantidade: 60,
      motivo: "Resolução criativa de problemas complexos durante as atividades práticas. Demonstrou pensamento analítico avançado.",
      data: new Date("2024-01-11T08:00:00"),
      saldoApos: 1085,
    },
  ];

  const saldoAtual = 850;
  const totalDistribuido = distribuicoes.reduce((sum, dist) => sum + dist.quantidade, 0);
  const totalDistribuicoes = distribuicoes.length;
  const alunosUnicos = new Set(distribuicoes.map(d => d.alunoId)).size;

  const distribuicoesFiltradas = distribuicoes.filter((distribuicao) => {
    if (filtros.aluno && !distribuicao.alunoNome.toLowerCase().includes(filtros.aluno.toLowerCase())) {
      return false;
    }
    if (filtros.busca && !distribuicao.motivo.toLowerCase().includes(filtros.busca.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleExpandRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const handleExport = () => {
    // Implementar exportação para CSV/PDF
    console.log("Exportando extrato...");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
            <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Extrato de Distribuições
            </h1>
            <p className="text-muted-foreground">
              Histórico completo das suas distribuições
            </p>
          </div>
        </div>
      </div>

      {/* Resumo */}
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-campus-purple-600 mb-2">
              {saldoAtual}
            </div>
            <p className="text-sm text-muted-foreground">Saldo Atual</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {totalDistribuido}
            </div>
            <p className="text-sm text-muted-foreground">Total Distribuído</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {totalDistribuicoes}
            </div>
            <p className="text-sm text-muted-foreground">Distribuições</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-2xl font-bold text-campus-gold-600 mb-2">
              {alunosUnicos}
            </div>
            <p className="text-sm text-muted-foreground">Alunos Reconhecidos</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filtros */}
      <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Busca por Aluno */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar Aluno</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Nome do aluno..."
                    value={filtros.aluno}
                    onChange={(e) => setFiltros(prev => ({ ...prev, aluno: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Data Início */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Início</label>
                <Input
                  type="date"
                  value={filtros.dataInicio}
                  onChange={(e) => setFiltros(prev => ({ ...prev, dataInicio: e.target.value }))}
                />
              </div>

              {/* Data Fim */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Fim</label>
                <Input
                  type="date"
                  value={filtros.dataFim}
                  onChange={(e) => setFiltros(prev => ({ ...prev, dataFim: e.target.value }))}
                />
              </div>

              {/* Busca por Motivo */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar Motivo</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Palavra-chave..."
                    value={filtros.busca}
                    onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Lista de Distribuições */}
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <Card>
          <CardHeader>
            <CardTitle>
              Distribuições ({distribuicoesFiltradas.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {distribuicoesFiltradas.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma distribuição encontrada</p>
                <p className="text-sm">Ajuste os filtros para ver mais resultados</p>
              </div>
            ) : (
              distribuicoesFiltradas.map((distribuicao) => (
                <motion.div
                  key={distribuicao.id}
                  variants={slideUp}
                  className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-campus-blue-100 to-campus-purple-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-5 w-5 text-campus-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-foreground">
                            {distribuicao.alunoNome}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            {distribuicao.alunoCurso}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {distribuicao.data.toLocaleDateString("pt-BR")} às {distribuicao.data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {distribuicao.motivo}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">
                          +{distribuicao.quantidade}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Saldo: {distribuicao.saldoApos}
                        </div>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleExpandRow(distribuicao.id)}
                      >
                        {expandedRows.has(distribuicao.id) ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Motivo Expandido */}
                  {expandedRows.has(distribuicao.id) && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 pt-4 border-t"
                    >
                      <div className="space-y-2">
                        <h5 className="font-medium text-sm">Motivo Completo:</h5>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {distribuicao.motivo}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Paginação */}
      {distribuicoesFiltradas.length > 0 && (
        <motion.div
          variants={slideUp}
          initial="initial"
          animate="animate"
          className="flex items-center justify-between"
        >
          <p className="text-sm text-muted-foreground">
            Mostrando {distribuicoesFiltradas.length} de {distribuicoes.length} distribuições
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <ArrowLeft className="h-4 w-4" />
              Anterior
            </Button>
            <Button variant="outline" size="sm" disabled>
              Próxima
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
