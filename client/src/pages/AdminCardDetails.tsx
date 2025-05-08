import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import FixedStudentCard from '@/components/FixedStudentCard';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useState } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { format, formatDistanceToNow, isAfter, isBefore, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Calendar, 
  ClipboardCopy, 
  FileText, 
  GraduationCap, 
  UserCheck, 
  Info, 
  User, 
  CreditCard, 
  QrCode, 
  Trash2, 
  Upload, 
  Printer, 
  AlertTriangle
} from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { QRCodeSVG } from 'qrcode.react';

export default function AdminCardDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { data: carteirinha, isLoading, error } = useQuery({
    queryKey: [`/api/carteirinhas/${id}`],
  });

  const handleDelete = async () => {
    try {
      await apiRequest(`/api/carteirinhas/${id}`, { method: 'DELETE' });
      toast({
        title: "Carteirinha excluída",
        description: "A carteirinha foi excluída com sucesso.",
      });
      // Redirecionar para a lista após exclusão
      window.location.href = '/admin';
    } catch (error) {
      toast({
        title: "Erro ao excluir",
        description: "Ocorreu um erro ao excluir a carteirinha.",
        variant: "destructive",
      });
    }
  };

  const copyLinkToClipboard = () => {
    if (carteirinha) {
      const verificationUrl = `${window.location.origin}/verificar/${carteirinha.qrId}`;
      navigator.clipboard.writeText(verificationUrl).then(() => {
        toast({
          title: "Link copiado!",
          description: "O link para verificação da carteirinha foi copiado para a área de transferência.",
        });
      });
    }
  };

  // Resolver o status de validade de uma carteirinha
  const getValidityStatus = (validityDate: string) => {
    const today = new Date();
    const validity = new Date(validityDate);
    const expiringDate = addDays(today, 30);
    
    if (isBefore(validity, today)) {
      return { 
        status: 'expired', 
        label: 'Expirada', 
        className: 'bg-red-100 text-red-800 border border-red-200' ,
        icon: <AlertTriangle className="w-3 h-3 mr-1" />
      };
    } else if (isBefore(validity, expiringDate)) {
      return { 
        status: 'expiring', 
        label: 'Expirando', 
        className: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
        icon: <Calendar className="w-3 h-3 mr-1" />
      };
    } else {
      return { 
        status: 'valid', 
        label: 'Válida', 
        className: 'bg-green-100 text-green-800 border border-green-200',
        icon: <UserCheck className="w-3 h-3 mr-1" />
      };
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="h-8 w-64 bg-gray-200 rounded-md ml-4 animate-pulse"></div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-100 rounded-xl h-[600px] animate-pulse"></div>
          
          <div className="space-y-8 animate-pulse">
            <div className="bg-gray-100 rounded-xl h-24"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 rounded-xl h-16"></div>
              <div className="bg-gray-100 rounded-xl h-16"></div>
              <div className="bg-gray-100 rounded-xl h-16"></div>
              <div className="bg-gray-100 rounded-xl h-16"></div>
            </div>
            <div className="bg-gray-100 rounded-xl h-32"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !carteirinha) {
    return (
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-red-200 shadow-lg overflow-hidden">
            <div className="bg-red-50 p-6">
              <div className="flex items-center">
                <div className="bg-red-100 rounded-full p-3">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-red-600 ml-4">
                  Erro ao carregar carteirinha
                </h2>
              </div>
            </div>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-6">
                Não foi possível carregar os dados da carteirinha solicitada. 
                Verifique se o ID é válido ou tente novamente mais tarde.
              </p>
              <Link href="/admin">
                <Button className="bg-primary hover:bg-primary/90">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar para listagem
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const validityStatus = getValidityStatus(carteirinha.validade);
  const verificationUrl = `${window.location.origin}/verificar/${carteirinha.qrId}`;
  const createdAtDistance = formatDistanceToNow(new Date(carteirinha.createdAt), { locale: ptBR, addSuffix: true });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto"
    >
      {/* Header com navegação e título */}
      <div className="flex flex-wrap items-center justify-between mb-8 gap-4">
        <div className="flex items-center">
          <Link href="/admin">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center text-gray-700 border-gray-300 hover:bg-gray-100 p-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Voltar</span>
            </Button>
          </Link>
          <div className="ml-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              Detalhes da Carteirinha 
              <span className="inline-flex items-center ml-3">
                <Badge 
                  variant="outline" 
                  className={`${validityStatus.className} ml-2 py-1 px-2 text-xs`}
                >
                  {validityStatus.icon}
                  {validityStatus.label}
                </Badge>
              </span>
            </h1>
            <p className="text-gray-500 text-sm">
              ID: {carteirinha.id} · Criada {createdAtDistance}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary/5"
            onClick={() => {
              window.print();
              toast({
                title: "Preparando impressão",
                description: "Abrindo janela de impressão...",
              });
            }}
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setOpenDeleteDialog(true)}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda - Carteirinha */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-0 shadow-lg overflow-hidden p-0">
            <CardHeader className="bg-gradient-to-r from-primary/90 to-accent/90 text-white py-4 px-6">
              <CardTitle className="text-lg flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Visualização da Carteirinha
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 flex justify-center">
              <div className="card-float-effect">
                <FixedStudentCard student={carteirinha} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gray-50 py-4 px-6 border-b">
              <CardTitle className="text-base flex items-center">
                <QrCode className="w-5 h-5 mr-2 text-primary" />
                Verificação Digital
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <div className="bg-white p-3 rounded-lg border shadow-sm mb-3">
                  <QRCodeSVG
                    value={verificationUrl}
                    size={180}
                    level="H"
                    includeMargin={true}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                </div>
                
                <div className="w-full mt-4">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-md text-sm mb-2">
                    <div className="flex items-center text-gray-700">
                      <Info className="w-4 h-4 mr-2 text-primary" />
                      Link de Verificação:
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={copyLinkToClipboard}
                      className="h-8 text-primary hover:text-primary/80"
                    >
                      <ClipboardCopy className="w-4 h-4 mr-1" />
                      Copiar
                    </Button>
                  </div>
                  
                  <div className="text-xs text-gray-600 break-all font-mono bg-gray-50 p-3 rounded-md border">
                    {verificationUrl}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Coluna Direita - Informações detalhadas */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 border-b">
              <CardTitle className="text-lg flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Dados Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-1.5 text-gray-500 text-sm">
                    <User className="w-4 h-4 mr-2 text-primary/70" />
                    Nome Completo
                  </div>
                  <div className="text-lg font-medium">{carteirinha.nome}</div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1.5 text-gray-500 text-sm">
                    <CreditCard className="w-4 h-4 mr-2 text-primary/70" />
                    CPF
                  </div>
                  <div className="text-lg font-medium">{carteirinha.cpf}</div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1.5 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                    Data de Nascimento
                  </div>
                  <div className="text-lg font-medium">
                    {format(new Date(carteirinha.dataNascimento), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                </div>
              </div>
              
              <Separator className="my-5" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-1.5 text-gray-500 text-sm">
                    <FileText className="w-4 h-4 mr-2 text-primary/70" />
                    Matrícula
                  </div>
                  <div className="text-lg font-medium font-mono">{carteirinha.matricula}</div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1.5 text-gray-500 text-sm">
                    <GraduationCap className="w-4 h-4 mr-2 text-primary/70" />
                    Curso
                  </div>
                  <div className="text-lg font-medium">{carteirinha.curso}</div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1.5 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-primary/70" />
                    Validade
                  </div>
                  <div className="flex items-center">
                    <span className="text-lg font-medium mr-2">
                      {format(new Date(carteirinha.validade), 'dd/MM/yyyy', { locale: ptBR })}
                    </span>
                    <Badge 
                      variant="outline" 
                      className={`${validityStatus.className} py-0.5 px-1.5 text-xs`}
                    >
                      {validityStatus.icon}
                      {validityStatus.label}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1.5 text-gray-500 text-sm">
                    <Upload className="w-4 h-4 mr-2 text-primary/70" />
                    Data de Criação
                  </div>
                  <div className="text-lg font-medium">
                    {format(new Date(carteirinha.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 py-4 px-6 border-b">
              <CardTitle className="text-lg flex items-center">
                <Info className="w-5 h-5 mr-2 text-primary" />
                Informações Técnicas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center mb-1.5 text-gray-500 text-sm">
                    ID da Carteirinha
                  </div>
                  <div className="font-mono text-sm p-2 rounded bg-gray-50 border">
                    {carteirinha.id}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center mb-1.5 text-gray-500 text-sm">
                    QR Code ID
                  </div>
                  <div className="font-mono text-sm p-2 rounded bg-gray-50 border">
                    {carteirinha.qrId}
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center mb-1.5 text-gray-500 text-sm">
                  Observações
                </div>
                <div className="text-gray-700 p-3 rounded bg-gray-50 border">
                  Carteirinha estudantil válida para uso em conformidade com a legislação vigente. 
                  O portador desta carteirinha está regularmente matriculado na instituição.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
