import {
  Gift,
  UtensilsCrossed,
  GraduationCap,
  Dumbbell,
  Wrench,
  Laptop,
  Heart,
  Sparkles,
  Film,
  ShoppingBag,
  Package,
  LucideIcon,
} from "lucide-react";

// Mapeamento de ícones por categoria
export const categoriaIcones: Record<string, LucideIcon> = {
  "Alimentação": UtensilsCrossed,
  "Educação": GraduationCap,
  "Esportes": Dumbbell,
  "Serviços": Wrench,
  "Tecnologia": Laptop,
  "Saúde": Heart,
  "Beleza": Sparkles,
  "Entretenimento": Film,
  "Varejo": ShoppingBag,
  "Outros": Package,
};

/**
 * Retorna o ícone correspondente à categoria
 * @param categoria - Nome da categoria
 * @returns Componente de ícone do Lucide
 */
export function getCategoryIcon(categoria: string | undefined | null): LucideIcon {
  if (!categoria) return Gift;
  return categoriaIcones[categoria] || Package;
}


