import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StudentCard from '@/components/StudentCard';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Share2, Download, ArrowLeft, Printer, CheckCircle2, QrCode } from 'lucide-react';
import { useState } from 'react';

export default function CardDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [showShareOptions, setShowShareOptions] = useState(false);

  const { data: carteirinha, isLoading, error } = useQuery({
    queryKey: [`/api/carteirinhas/${id}`],
  });

  const handlePrint = () => {
    toast({
      title: "Preparando impressão...",
      description: "Sua carteirinha será aberta em uma nova janela para impressão.",
    });
    // Em uma implementação real, aqui abriríamos uma janela para impressão
    window.print();
  };

  const handleDownload = () => {
    toast({
      title: "Preparando download...",
      description: "Sua carteirinha digital será baixada como PDF.",
    });
    // Implementação real não disponível nesta versão
  };

  const handleShare = () => {
    setShowShareOptions(!showShareOptions);
  };

  const copyLinkToClipboard = () => {
    if (carteirinha) {
      const verificationUrl = `${window.location.origin}/verificar/${carteirinha.qrId}`;
      navigator.clipboard.writeText(verificationUrl).then(() => {
        toast({
          title: "Link copiado!",
          description: "O link para verificação da carteirinha foi copiado para a área de transferência.",
        });
        setShowShareOptions(false);
      });
    }
  };

  // Skeleton loading state
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse card-details-container p-8 rounded-2xl">
          <div className="flex items-center mb-8">
            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
            <div className="h-8 w-48 bg-gray-200 rounded-lg ml-4"></div>
          </div>
          <div className="bg-gray-100 rounded-2xl p-8">
            <div className="h-12 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-10"></div>
            <div className="h-96 bg-gray-200 rounded-xl mx-auto max-w-md mb-8"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !carteirinha) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-red-200 shadow-lg overflow-hidden">
            <div className="bg-red-50 p-4 border-b border-red-100">
              <h2 className="text-xl font-bold text-red-600 flex items-center">
                <span className="material-icons mr-2">error_outline</span>
                Erro ao carregar carteirinha
              </h2>
            </div>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-6">
                Não foi possível carregar os dados da carteirinha solicitada. 
                Por favor, tente novamente mais tarde ou entre em contato com o suporte.
              </p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary/90">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar ao Início
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration: 0.6,
        type: "spring",
        stiffness: 100 
      }}
      className="max-w-4xl mx-auto card-details-container"
    >
      {/* Header e navegação */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" className="flex items-center p-0 text-gray-700 hover:text-primary">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span>Voltar</span>
            </Button>
          </Link>
          <h2 className="text-3xl font-bold ml-6 text-gradient">Sua Carteirinha Digital</h2>
        </div>
        
        <div className="flex space-x-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            className="border-primary/30 hover:bg-primary/5 text-primary"
          >
            <Printer className="w-4 h-4 mr-2" />
            Imprimir
          </Button>
          
          <Button
            onClick={handleDownload}
            variant="outline"
            className="border-primary/30 hover:bg-primary/5 text-primary"
          >
            <Download className="w-4 h-4 mr-2" />
            Baixar PDF
          </Button>
          
          <div className="relative">
            <Button
              onClick={handleShare}
              variant="outline"
              className="border-primary/30 hover:bg-primary/5 text-primary"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
            
            <AnimatePresence>
              {showShareOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-12 bg-white shadow-lg rounded-lg p-3 w-64 z-10 border border-border"
                >
                  <div 
                    className="flex items-center p-2 hover:bg-gray-50 rounded-md cursor-pointer transition-colors"
                    onClick={copyLinkToClipboard}
                  >
                    <QrCode className="w-4 h-4 mr-2 text-primary" />
                    <span className="text-sm">Copiar link de verificação</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <Card className="mb-8 overflow-hidden border-0 shadow-xl card-glow-effect bg-gradient-to-b from-background to-background/80">
        <CardContent className="p-0">
          {/* Header com gradiente e badge de sucesso */}
          <div className="bg-white p-6 relative overflow-hidden border-b">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-col">
                <span className="success-badge text-white text-sm font-bold py-2 px-4 rounded-full inline-flex items-center w-fit mb-3 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 mr-1.5" /> CARTEIRINHA EMITIDA
                </span>
                <h3 className="text-2xl font-bold text-gray-900">Carteirinha Gerada com Sucesso!</h3>
                <p className="text-gray-800 mt-2 max-w-xl text-base">
                  Sua carteirinha digital está pronta para uso. Você pode apresentá-la em seu dispositivo móvel ou imprimi-la quando necessário.
                </p>
              </div>
            </div>
          </div>
          
          {/* Card Container */}
          <div className="flex flex-col items-center justify-center py-10 px-4">
            <motion.div 
              className="card-container max-w-md mx-auto card-float-effect"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <StudentCard student={carteirinha} />
            </motion.div>
            
            <motion.div 
              className="mt-10 text-center max-w-md mx-auto bg-white shadow-md p-6 rounded-xl border border-primary/20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="flex items-center justify-center mb-3 text-accent">
                <QrCode className="w-6 h-6 mr-2" />
                <h4 className="font-bold text-lg text-gray-900">Link para verificação</h4>
              </div>
              <Link href={`/verificar/${carteirinha.qrId}`} className="block">
                <div className="text-primary font-medium break-all bg-accent/5 p-4 rounded-lg border border-accent/20 hover:bg-accent/10 transition-colors cursor-pointer flex items-center justify-center">
                  <span className="text-gray-900">{`${window.location.origin}/verificar/${carteirinha.qrId}`}</span>
                  <span className="material-icons ml-2 text-accent">open_in_new</span>
                </div>
              </Link>
              <p className="text-gray-700 mt-4 text-sm">
                Este link pode ser usado para verificar a autenticidade da sua carteirinha digital.
              </p>
            </motion.div>
          </div>
          
          {/* Informações adicionais */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <motion.div 
                className="bg-white p-5 rounded-xl border border-primary/20 text-center shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <span className="material-icons text-primary text-3xl mb-3">phone_android</span>
                <h4 className="font-bold text-base mb-2 text-gray-900">Disponível em qualquer dispositivo</h4>
                <p className="text-sm text-gray-700">Acesse sua carteirinha de qualquer lugar a qualquer momento</p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-5 rounded-xl border border-accent/20 text-center shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <span className="material-icons text-accent text-3xl mb-3">verified</span>
                <h4 className="font-bold text-base mb-2 text-gray-900">Verificação segura</h4>
                <p className="text-sm text-gray-700">QR Code com validação em tempo real para maior segurança</p>
              </motion.div>
              
              <motion.div 
                className="bg-white p-5 rounded-xl border border-primary/20 text-center shadow-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <span className="material-icons text-primary text-3xl mb-3">print</span>
                <h4 className="font-bold text-base mb-2 text-gray-900">Imprima quando precisar</h4>
                <p className="text-sm text-gray-700">Versão física sempre disponível para impressão</p>
              </motion.div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
