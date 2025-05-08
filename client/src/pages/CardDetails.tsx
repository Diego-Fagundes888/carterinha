import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import StudentCard from '@/components/StudentCard';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function CardDetails() {
  const { id } = useParams();
  const { toast } = useToast();

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

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="h-96 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (error || !carteirinha) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-red-600 mb-4">Erro ao carregar carteirinha</h2>
            <p className="text-gray-600 mb-4">
              Não foi possível carregar os dados da carteirinha solicitada.
            </p>
            <Link href="/">
              <Button>Voltar ao Início</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto"
    >
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center text-primary hover:text-blue-700 p-0">
            <span className="material-icons mr-1">arrow_back</span>
            <span>Voltar</span>
          </Button>
        </Link>
        <h2 className="text-2xl font-heading font-bold text-gray-900 ml-4">Sua Carteirinha Digital</h2>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-xl font-heading font-semibold text-gray-800">Carteirinha Gerada com Sucesso!</h3>
            <Button variant="ghost" onClick={handlePrint} className="text-primary hover:text-blue-700 flex items-center">
              <span className="material-icons mr-1">print</span>
              <span>Imprimir</span>
            </Button>
          </div>

          <p className="text-gray-600 mb-8">
            Sua carteirinha está pronta. Você pode mostrá-la em seu dispositivo ou imprimi-la.
            A verificação pode ser feita através do QR Code.
          </p>

          {/* Card Container */}
          <div className="card-container max-w-md mx-auto">
            <StudentCard student={carteirinha} />
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 mb-2">Link para verificação:</p>
            <p className="text-primary font-medium break-all">
              {`${window.location.origin}/verificar/${carteirinha.qrId}`}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
