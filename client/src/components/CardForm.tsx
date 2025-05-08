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
import { useState, useEffect } from "react";
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

// Função para gerar número de matrícula aleatório
function generateRandomMatricula(): string {
  // Obtém o ano atual
  const currentYear = new Date().getFullYear();
  
  // Decide qual formato de matrícula usar (aleatoriamente)
  const formatType = Math.floor(Math.random() * 5); // 0-4 para os 5 tipos de formatos
  
  switch (formatType) {
    case 0: 
      // Formato: Ano de ingresso + número sequencial (ex: 202500123)
      const sequentialNum = Math.floor(Math.random() * 9000) + 1000; // 1000-9999
      return `${currentYear}${String(sequentialNum).padStart(5, '0')}`;
    
    case 1:
      // Formato: Prefixo + data + número sequencial (ex: MAT202505070001)
      const prefixes = ['MAT', 'EST', 'ALU', 'UNI'];
      const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
      const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const seqNum = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
      return `${prefix}${currentYear}${month}${day}${seqNum}`;
    
    case 2:
      // Formato: Código do curso + número sequencial (ex: INF-001234)
      const courseCodes = ['INF', 'ADM', 'DIR', 'MED', 'ENG'];
      const courseCode = courseCodes[Math.floor(Math.random() * courseCodes.length)];
      const seqCourseNum = String(Math.floor(Math.random() * 999999) + 1).padStart(6, '0');
      return `${courseCode}-${seqCourseNum}`;
    
    case 3:
      // Formato: Somente números sequenciais (ex: 00012345)
      return String(Math.floor(Math.random() * 99999999) + 1).padStart(8, '0');
    
    case 4:
      // Formato: Com verificador (ex: 202501234-9)
      const baseNum = `${currentYear}${String(Math.floor(Math.random() * 99999) + 1).padStart(5, '0')}`;
      // Simulação simples de dígito verificador (soma dos dígitos % 10)
      const sum = baseNum.split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
      const checkDigit = sum % 10;
      return `${baseNum}-${checkDigit}`;
    
    default:
      return `${currentYear}${String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0')}`;
  }
}

export default function CardForm({ onSuccessfulSubmit }: CardFormProps) {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { saveFormData } = useCardFormData();
  
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [matricula, setMatricula] = useState<string>(generateRandomMatricula());
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nome: "",
      matricula: matricula,
      curso: "",
      dataNascimento: format(new Date(), "yyyy-MM-dd"),
      validade: format(new Date(new Date().setFullYear(new Date().getFullYear() + 1)), "yyyy-MM-dd"),
      cpf: "",
    },
  });
  
  // Gerar nova matrícula sempre que o componente for montado e atualizar o formulário
  useEffect(() => {
    // Gera um novo número de matrícula ao montar o componente
    const novaMatricula = generateRandomMatricula();
    setMatricula(novaMatricula);
    
    // Atualiza o campo de matrícula no formulário
    form.setValue("matricula", novaMatricula);
  }, [form]);
  
  const mutation = useMutation({
    mutationFn: async (data: FormData | object) => {
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
    
    try {
      // Enviar os dados como objeto JSON para facilitar a manipulação no servidor
      const jsonData = {
        ...values,
        fotoBase64: photoPreview // Sempre usar o preview como base64 que já foi convertido pelo FileReader
      };
      
      // Garantir que a foto base64 está sendo enviada corretamente
      if (!jsonData.fotoBase64 || jsonData.fotoBase64.length < 100) {
        toast({
          title: "Erro com a imagem",
          description: "A imagem não foi processada corretamente. Tente selecionar novamente.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Enviando dados JSON com os campos:", Object.keys(jsonData).join(", "));
      console.log("A foto base64 tem comprimento:", jsonData.fotoBase64.length);
      
      // Usar o mutation com JSON
      mutation.mutate(jsonData);
    } catch (error) {
      console.error("Erro ao preparar dados do formulário:", error);
      toast({
        title: "Erro ao processar formulário",
        description: "Ocorreu um erro ao processar os dados. Tente novamente.",
        variant: "destructive",
      });
    }
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
    <div className="animate-in slide-in-from-bottom-4 duration-700">
      <h3 className="animated-gradient-text text-xl font-bold mb-6">Gerar Nova Carteirinha</h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lado esquerdo do formulário (dados pessoais) */}
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem className="transition-all duration-200 hover:translate-x-1">
                    <FormLabel className="text-sm font-medium">Nome Completo *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite seu nome completo" 
                        className="rounded-lg border-input/60 focus:border-primary/40" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="matricula"
                render={({ field }) => (
                  <FormItem className="transition-all duration-200 hover:translate-x-1">
                    <div className="flex justify-between items-center">
                      <FormLabel className="text-sm font-medium">Matrícula *</FormLabel>
                      <span className="text-xs text-accent italic">Gerada automaticamente</span>
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          placeholder="Número de matrícula" 
                          className="rounded-lg border-input/60 focus:border-primary/40 pr-10" 
                          {...field} 
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        size="icon"
                        variant="ghost"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground hover:text-primary"
                        title="Gerar novo número de matrícula"
                        onClick={() => {
                          const novaMatricula = generateRandomMatricula();
                          setMatricula(novaMatricula);
                          form.setValue("matricula", novaMatricula);
                        }}
                      >
                        <span className="material-icons text-sm">refresh</span>
                      </Button>
                    </div>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="curso"
                render={({ field }) => (
                  <FormItem className="transition-all duration-200 hover:translate-x-1">
                    <FormLabel className="text-sm font-medium">Curso *</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded-lg border-input/60 focus:border-primary/40">
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
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dataNascimento"
                  render={({ field }) => (
                    <FormItem className="transition-all duration-200 hover:translate-x-1">
                      <FormLabel className="text-sm font-medium">Data de Nascimento *</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          className="rounded-lg border-input/60 focus:border-primary/40" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="validade"
                  render={({ field }) => (
                    <FormItem className="transition-all duration-200 hover:translate-x-1">
                      <FormLabel className="text-sm font-medium">Validade *</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          className="rounded-lg border-input/60 focus:border-primary/40" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem className="transition-all duration-200 hover:translate-x-1">
                    <FormLabel className="text-sm font-medium">CPF *</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="000.000.000-00" 
                        className="rounded-lg border-input/60 focus:border-primary/40" 
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(formatCPF(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Lado direito do formulário (upload de foto) */}
            <div className="flex flex-col justify-center space-y-6">
              <div className="bg-accent/5 rounded-xl p-6 border border-border/40">
                <FormLabel className="text-sm font-medium block mb-4">Foto *</FormLabel>
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-36 h-48 bg-background rounded-lg overflow-hidden shadow-sm border-2 border-dashed border-primary/20 hover:border-primary/50 transition-colors duration-300">
                    {photoPreview ? (
                      <img 
                        src={photoPreview} 
                        alt="Prévia da foto" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <span className="material-icons text-muted-foreground text-4xl">add_photo_alternate</span>
                        <div className="text-sm text-muted-foreground mt-2">Adicionar foto</div>
                      </div>
                    )}
                  </div>
                  
                  <div className="w-full">
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
                      className="w-full group transition-all duration-300 hover:bg-primary/10 border-primary/30"
                      onClick={() => document.getElementById('photo')?.click()}
                    >
                      <span className="material-icons mr-2 group-hover:text-primary text-muted-foreground">upload</span>
                      Escolher Foto
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                      Formatos suportados: JPG, PNG. Tamanho máximo: 10MB
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-4 border border-border/40">
                <div className="text-sm text-center text-muted-foreground">
                  <p>A foto deve seguir os padrões de <span className="font-semibold">documento oficial</span> 
                  <br />com fundo branco ou claro e rosto claramente visível.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex justify-center md:justify-end">
            <Button 
              type="submit" 
              className="relative overflow-hidden group px-8 py-6 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-md" 
              size="lg"
              disabled={mutation.isPending}
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-60 transition-opacity duration-500"></span>
              <span className="relative flex items-center">
                {mutation.isPending ? (
                  <>
                    <span className="material-icons animate-spin mr-2">refresh</span>
                    Processando...
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-2">badge</span>
                    Gerar Carteirinha
                  </>
                )}
              </span>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
