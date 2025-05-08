import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { carteirinhaValidationSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";
import useCardFormData from "@/hooks/useCardFormData";

// Estenda o schema para validar o formulário
const formSchema = z.object({
  nome: z.string().min(5, "O nome completo deve ter no mínimo 5 caracteres"),
  matricula: z.string().min(4, "A matrícula deve ter no mínimo 4 caracteres"),
  curso: z.string().min(3, "O curso deve ter no mínimo 3 caracteres"),
  dataNascimento: z.string().refine((val) => {
    return !isNaN(Date.parse(val));
  }, "Data de nascimento inválida"),
  validade: z.string().refine((val) => {
    return !isNaN(Date.parse(val));
  }, "Data de validade inválida"),
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato 000.000.000-00"),
});

type FormValues = z.infer<typeof formSchema>;

interface CardFormProps {
  onSuccessfulSubmit?: () => void;
}

export default function CardForm({ onSuccessfulSubmit }: CardFormProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { saveFormData } = useCardFormData();
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      matricula: "",
      curso: "",
      dataNascimento: format(new Date(), "yyyy-MM-dd"),
      validade: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), "yyyy-MM-dd"),
      cpf: "",
    },
  });
  
  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest('POST', '/api/carteirinhas', data);
      return await response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Carteirinha gerada com sucesso!",
        description: "Sua carteirinha digital já pode ser utilizada.",
      });
      
      // Salvar os dados do formulário no storage para uso posterior
      saveFormData({
        ...form.getValues(),
        id: data.id,
        foto: photoPreview || "",
        qrId: data.qrId,
      });
      
      // Fechar o modal se callback fornecido
      if (onSuccessfulSubmit) {
        onSuccessfulSubmit();
      }
      
      // Redirecionar para a página de detalhes
      navigate(`/carteirinha/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Erro ao gerar carteirinha",
        description: (error as Error).message || "Ocorreu um erro ao processar sua solicitação.",
        variant: "destructive",
      });
    },
  });
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoPreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const onSubmit = (values: FormValues) => {
    if (!photoFile && !photoPreview) {
      toast({
        title: "Erro de validação",
        description: "Por favor, faça o upload de uma foto.",
        variant: "destructive",
      });
      return;
    }
    
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      formData.append(key, value);
    });
    
    if (photoFile) {
      formData.append("foto", photoFile);
    } else if (photoPreview) {
      formData.append("fotoBase64", photoPreview);
    }
    
    mutation.mutate(formData);
  };
  
  // Formatar CPF enquanto digita
  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, "");
    let formatted = "";
    
    if (digits.length > 0) formatted += digits.substring(0, 3);
    if (digits.length > 3) formatted += "." + digits.substring(3, 6);
    if (digits.length > 6) formatted += "." + digits.substring(6, 9);
    if (digits.length > 9) formatted += "-" + digits.substring(9, 11);
    
    return formatted;
  };
  
  return (
    <div>
      <h3 className="text-xl font-heading font-bold text-gray-900 mb-6">Gerar Nova Carteirinha</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome Completo *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu nome completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="matricula"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matrícula *</FormLabel>
                <FormControl>
                  <Input placeholder="Digite seu número de matrícula" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="curso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Curso *</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu curso" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Engenharia de Software">Engenharia de Software</SelectItem>
                    <SelectItem value="Análise e Des. de Sistemas">Análise e Des. de Sistemas</SelectItem>
                    <SelectItem value="Direito">Direito</SelectItem>
                    <SelectItem value="Medicina">Medicina</SelectItem>
                    <SelectItem value="Administração">Administração</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dataNascimento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data de Nascimento *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="validade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validade *</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem>
                <FormLabel>CPF *</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="000.000.000-00" 
                    value={field.value}
                    onChange={(e) => {
                      field.onChange(formatCPF(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div>
            <FormLabel>Foto *</FormLabel>
            <div className="flex items-center space-x-4 mt-1">
              <div className="w-24 h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                {photoPreview ? (
                  <img 
                    src={photoPreview} 
                    alt="Prévia da foto" 
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center p-1">
                    <span className="material-icons text-gray-400 text-2xl">add_photo_alternate</span>
                    <div className="text-xs text-gray-500 mt-1">Nenhuma foto</div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input 
                  type="file" 
                  id="photo" 
                  name="photo" 
                  accept="image/jpeg,image/jpg,image/png" 
                  className="hidden" 
                  onChange={handlePhotoChange}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full mb-2"
                  onClick={() => document.getElementById('photo')?.click()}
                >
                  Escolher Foto
                </Button>
                <p className="text-xs text-gray-500">Formatos suportados: JPG, PNG. Tamanho máximo: 5MB</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end">
            <Button type="submit" className="flex items-center" disabled={mutation.isPending}>
              {mutation.isPending ? (
                <>
                  <span className="material-icons animate-spin mr-1" style={{ fontSize: '1.25rem' }}>
                    refresh
                  </span>
                  Processando...
                </>
              ) : (
                <>
                  <span className="material-icons mr-1" style={{ fontSize: '1.25rem' }}>check</span>
                  Gerar Carteirinha
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
