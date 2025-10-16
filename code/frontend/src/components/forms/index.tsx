"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { 
  Input, 
  Label, 
  Textarea, 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/design-system";
import { AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

// Schemas de validação
export const studentSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
  telefone: z.string().min(10, "Telefone inválido"),
  endereco: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
  cidade: z.string().min(2, "Cidade inválida"),
  estado: z.string().min(2, "Estado inválido"),
  cep: z.string().min(8, "CEP inválido"),
  instituicao: z.string().min(1, "Selecione uma instituição"),
  curso: z.string().min(2, "Curso deve ter pelo menos 2 caracteres"),
});

export const professorSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  cpf: z.string().min(11, "CPF deve ter 11 dígitos"),
  telefone: z.string().min(10, "Telefone inválido"),
  departamento: z.string().min(1, "Selecione um departamento"),
  instituicao: z.string().min(1, "Selecione uma instituição"),
  especialidade: z.string().min(2, "Especialidade deve ter pelo menos 2 caracteres"),
  formacao: z.string().min(2, "Formação deve ter pelo menos 2 caracteres"),
});

export const empresaSchema = z.object({
  nome: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  endereco: z.string().min(10, "Endereço deve ter pelo menos 10 caracteres"),
  cidade: z.string().min(2, "Cidade inválida"),
  estado: z.string().min(2, "Estado inválido"),
  cep: z.string().min(8, "CEP inválido"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  descricao: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres"),
});

export const vantagemSchema = z.object({
  titulo: z.string().min(5, "Título deve ter pelo menos 5 caracteres"),
  descricao: z.string().min(20, "Descrição deve ter pelo menos 20 caracteres"),
  custoMoedas: z.number().min(1, "Custo deve ser maior que 0"),
  categoria: z.string().min(1, "Selecione uma categoria"),
  imagem: z.any().refine((file) => file, "Imagem é obrigatória"),
});

export const distribuirMoedasSchema = z.object({
  alunoId: z.string().min(1, "Selecione um aluno"),
  quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
  motivo: z.string().min(20, "Motivo deve ter pelo menos 20 caracteres"),
});

// Componente de campo com validação
interface FormFieldProps {
  name: string;
  label: string;
  type?: "text" | "email" | "password" | "number" | "tel";
  placeholder?: string;
  control: any;
  errors: any;
  required?: boolean;
  disabled?: boolean;
}

export function FormField({
  name,
  label,
  type = "text",
  placeholder,
  control,
  errors,
  required = false,
  disabled = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            id={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={errors[name] ? "border-red-500" : ""}
          />
        )}
      />
      {errors[name] && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 text-sm"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{errors[name].message}</span>
        </motion.div>
      )}
    </div>
  );
}

// Componente de textarea com validação
interface FormTextareaProps {
  name: string;
  label: string;
  placeholder?: string;
  control: any;
  errors: any;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
}

export function FormTextarea({
  name,
  label,
  placeholder,
  control,
  errors,
  required = false,
  disabled = false,
  rows = 4,
}: FormTextareaProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            id={name}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className={errors[name] ? "border-red-500" : ""}
          />
        )}
      />
      {errors[name] && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 text-sm"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{errors[name].message}</span>
        </motion.div>
      )}
    </div>
  );
}

// Componente de select com validação
interface FormSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  control: any;
  errors: any;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
}

export function FormSelect({
  name,
  label,
  placeholder,
  control,
  errors,
  options,
  required = false,
  disabled = false,
}: FormSelectProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Select
            value={field.value}
            onValueChange={field.onChange}
            disabled={disabled}
          >
            <SelectTrigger className={errors[name] ? "border-red-500" : ""}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />
      {errors[name] && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-red-600 text-sm"
        >
          <AlertCircle className="h-4 w-4" />
          <span>{errors[name].message}</span>
        </motion.div>
      )}
    </div>
  );
}

// Hook para formulários com validação
export function useValidatedForm<T extends z.ZodType>(schema: T) {
  const form = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const handleSubmit = async (
    onSubmit: (data: z.infer<T>) => Promise<void> | void
  ) => {
    try {
      const data = await form.handleSubmit(onSubmit)();
      return data;
    } catch (error) {
      console.error("Form validation error:", error);
      toast.error("Por favor, corrija os erros no formulário");
    }
  };

  return {
    ...form,
    handleSubmit,
  };
}

// Componente de status de validação
interface ValidationStatusProps {
  isValid: boolean;
  message: string;
  className?: string;
}

export function ValidationStatus({ isValid, message, className = "" }: ValidationStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex items-center gap-2 text-sm ${className}`}
    >
      {isValid ? (
        <>
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-green-600">{message}</span>
        </>
      ) : (
        <>
          <AlertCircle className="h-4 w-4 text-red-600" />
          <span className="text-red-600">{message}</span>
        </>
      )}
    </motion.div>
  );
}

// Componente de botão de submit com loading
interface SubmitButtonProps {
  isLoading: boolean;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function SubmitButton({ 
  isLoading, 
  children, 
  disabled = false,
  className = ""
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={isLoading || disabled}
      className={className}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Processando...
        </>
      ) : (
        children
      )}
    </Button>
  );
}
