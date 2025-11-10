"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { 
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
  Badge
} from "@/components/design-system";
import { 
  Gift,
  Upload,
  ArrowLeft,
  Save,
  Image as ImageIcon,
  Building2
} from "lucide-react";
import Link from "next/link";
import { staggerContainer, slideUp } from "@/lib/animations";
import { toast } from "sonner";
import { useCompanyRewards, useUpdateReward, useUploadRewardImage } from "@/hooks";

export default function EditarVantagemPage() {
  const router = useRouter();
  const params = useParams();
  const rewardId = parseInt(params.id as string);
  
  const [isSalvando, setIsSalvando] = useState(false);
  const [imagemPreview, setImagemPreview] = useState<string | null>(null);
  const [imagemNova, setImagemNova] = useState<File | null>(null);

  const { data: rewards, isLoading: rewardsLoading } = useCompanyRewards();
  const updateRewardMutation = useUpdateReward();
  const uploadImageMutation = useUploadRewardImage();

  const reward = rewards?.find((r) => r.ID === rewardId);

  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    custoMoedas: "",
    categoria: "",
  });

  const categorias = [
    "Alimentação",
    "Educação",
    "Esportes",
    "Serviços",
    "Tecnologia",
    "Saúde",
    "Beleza",
    "Entretenimento",
    "Varejo",
    "Outros"
  ];

  useEffect(() => {
    if (reward) {
      setFormData({
        titulo: reward.Title || "",
        descricao: reward.Description || "",
        custoMoedas: reward.Cost?.toString() || "",
        categoria: reward.Category || "",
      });
      if (reward.ImageURL) {
        setImagemPreview(reward.ImageURL);
      }
    }
  }, [reward]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagemNova(file);
      
      // Criar preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagemPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSalvando(true);

    try {
      // Atualizar dados da vantagem
      await updateRewardMutation.mutateAsync({
        rewardId,
        data: {
          titulo: formData.titulo,
          descricao: formData.descricao,
          custoMoedas: parseInt(formData.custoMoedas),
          categoria: formData.categoria,
        },
      });

      // Se houver nova imagem, fazer upload
      if (imagemNova) {
        await uploadImageMutation.mutateAsync({
          rewardId,
          file: imagemNova,
        });
      }

      toast.success("Vantagem atualizada com sucesso!");
      router.push("/empresa/vantagens");
    } catch (error) {
      toast.error("Erro ao atualizar vantagem. Tente novamente.");
    } finally {
      setIsSalvando(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.titulo &&
      formData.descricao &&
      formData.custoMoedas &&
      formData.categoria
    );
  };

  if (rewardsLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <p className="text-muted-foreground">Vantagem não encontrada</p>
          <Link href="/empresa/vantagens">
            <Button variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Editar Vantagem
            </h1>
            <p className="text-muted-foreground">
              Atualize as informações da vantagem
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulário */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="lg:col-span-2 space-y-6"
          >
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Informações da Vantagem
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título da Vantagem</Label>
                  <Input
                    id="titulo"
                    placeholder="Ex: Desconto 30% Livraria Central"
                    value={formData.titulo}
                    onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva detalhadamente a vantagem oferecida..."
                    value={formData.descricao}
                    onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="custoMoedas">Custo em Moedas</Label>
                    <Input
                      id="custoMoedas"
                      type="number"
                      placeholder="Ex: 200"
                      value={formData.custoMoedas}
                      onChange={(e) => setFormData(prev => ({ ...prev, custoMoedas: e.target.value }))}
                      min="1"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria">Categoria</Label>
                    <Select
                      value={formData.categoria}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, categoria: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {categorias.map((categoria) => (
                          <SelectItem key={categoria} value={categoria}>
                            {categoria}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload de Imagem */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Imagem da Vantagem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {imagemPreview ? (
                    <div className="space-y-4">
                      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={imagemPreview}
                          alt="Preview da vantagem"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="imagem-upload"
                        />
                        <label htmlFor="imagem-upload">
                          <Button type="button" variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Alterar Imagem
                          </Button>
                        </label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setImagemPreview(reward.ImageURL || null);
                            setImagemNova(null);
                          }}
                        >
                          Remover Nova
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                      <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Adicionar Imagem</h3>
                      <p className="text-muted-foreground mb-4">
                        Faça upload de uma imagem que represente sua vantagem
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        id="imagem-upload"
                      />
                      <label htmlFor="imagem-upload">
                        <Button type="button" variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Escolher Imagem
                        </Button>
                      </label>
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG até 5MB
                      </p>
                    </div>
                  )}
                </div>
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
            {/* Preview */}
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.titulo ? (
                  <>
                    <div className="aspect-video bg-gradient-to-br from-campus-purple-100 to-campus-blue-100 rounded-lg flex items-center justify-center">
                      {imagemPreview ? (
                        <img
                          src={imagemPreview}
                          alt="Preview"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Gift className="h-12 w-12 text-campus-purple-600" />
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{formData.titulo}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {formData.descricao || "Descrição da vantagem..."}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {formData.categoria || "Categoria"}
                        </Badge>
                        {formData.custoMoedas && (
                          <span className="text-campus-gold-600 font-semibold">
                            {formData.custoMoedas} moedas
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Gift className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Preencha os campos para ver o preview</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Dicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Dicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="p-3 bg-campus-purple-50 border border-campus-purple-200 rounded-lg">
                  <h4 className="font-semibold text-campus-purple-800 mb-1">
                    Título Atrativo
                  </h4>
                  <p className="text-campus-purple-700">
                    Use palavras como &quot;Desconto&quot;, &quot;Grátis&quot; ou &quot;Especial&quot; para chamar atenção.
                  </p>
                </div>
                
                <div className="p-3 bg-campus-gold-50 border border-campus-gold-200 rounded-lg">
                  <h4 className="font-semibold text-campus-gold-800 mb-1">
                    Preço Justo
                  </h4>
                  <p className="text-campus-gold-700">
                    Considere o valor real da vantagem para definir o custo em moedas.
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-1">
                    Imagem de Qualidade
                  </h4>
                  <p className="text-green-700">
                    Use imagens claras e atrativas que representem bem sua vantagem.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Botões */}
            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-campus-purple-500 to-campus-blue-500 hover:from-campus-purple-600 hover:to-campus-blue-600"
                disabled={!isFormValid() || isSalvando}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSalvando ? "Salvando..." : "Salvar Alterações"}
              </Button>
              
              <Link href="/empresa/vantagens">
                <Button variant="outline" className="w-full">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </form>
    </div>
  );
}

