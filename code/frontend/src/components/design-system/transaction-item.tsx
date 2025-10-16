"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { slideUp } from "@/lib/animations";

interface TransactionItemProps {
  id: string;
  tipo: "recebimento" | "resgate";
  valor: number;
  descricao: string;
  data: Date;
  avatar?: string;
  nome?: string;
  saldoApos: number;
  className?: string;
}

export function TransactionItem({
  tipo,
  valor,
  descricao,
  data,
  avatar,
  nome,
  saldoApos,
  className,
}: TransactionItemProps) {
  const isRecebimento = tipo === "recebimento";
  const valorFormatted = new Intl.NumberFormat("pt-BR").format(valor);
  
  const getTipoStyles = () => {
    if (isRecebimento) {
      return {
        badge: "bg-green-50 text-green-700 border-green-200",
        valor: "text-green-600",
        icon: "text-green-500",
      };
    }
    return {
      badge: "bg-red-50 text-red-700 border-red-200",
      valor: "text-red-600",
      icon: "text-red-500",
    };
  };

  const styles = getTipoStyles();

  return (
    <motion.div
      variants={slideUp}
      initial="initial"
      animate="animate"
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors",
        className
      )}
    >
      <Avatar className="h-10 w-10">
        <AvatarImage src={avatar} alt={nome} />
        <AvatarFallback className="bg-campus-purple-100 text-campus-purple-700">
          {nome?.charAt(0).toUpperCase() || "?"}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="outline" className={styles.badge}>
            {isRecebimento ? "Recebido" : "Resgatado"}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {format(data, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
          </span>
        </div>
        
        <p className="text-sm font-medium text-foreground truncate">
          {descricao}
        </p>
        
        {nome && (
          <p className="text-xs text-muted-foreground">
            {isRecebimento ? "De:" : "Para:"} {nome}
          </p>
        )}
      </div>

      <div className="text-right">
        <div className={cn("text-lg font-semibold", styles.valor)}>
          {isRecebimento ? "+" : "-"}{valorFormatted}
        </div>
        <div className="text-xs text-muted-foreground">
          Saldo: {new Intl.NumberFormat("pt-BR").format(saldoApos)}
        </div>
      </div>
    </motion.div>
  );
}
