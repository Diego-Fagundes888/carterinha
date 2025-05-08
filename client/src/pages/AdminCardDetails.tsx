import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import StudentCard from '@/components/StudentCard';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { useState } from 'react';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function AdminCardDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { data: carteirinha, isLoading, error } = useQuery({
    queryKey: [`/api/carteirinhas/${id}`],
  });

  const handleDelete = async () => {
    try {
      await apiRequest('DELETE', `/api/carteirinhas/${id}`, undefined);
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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6"></div>
          <div className="h-96 bg-gray-200 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (error || !carteirinha) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-bold text-red-600 mb-4">Erro ao carregar carteirinha</h2>
            <p className="text-gray-600 mb-4">
              Não foi possível carregar os dados da carteirinha solicitada.
            </p>
            <Link href="/admin">
              <Button>Voltar para listagem</Button>
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
      className="max-w-4xl mx-auto"
    >
      <div className="flex items-center mb-6">
        <Link href="/admin">
          <Button variant="ghost" className="flex items-center text-primary hover:text-blue-700 p-0">
            <span className="material-icons mr-1">arrow_back</span>
            <span>Voltar para listagem</span>
          </Button>
        </Link>
        <h2 className="text-2xl font-heading font-bold text-gray-900 ml-4">Detalhes da Carteirinha</h2>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-heading font-semibold text-gray-800">Informações do Estudante</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="destructive"
                onClick={() => setOpenDeleteDialog(true)}
                className="flex items-center"
              >
                <span className="material-icons mr-1 text-sm">delete</span>
                Excluir
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Card */}
            <div className="md:col-span-1">
              <div className="card-container">
                <StudentCard student={carteirinha} miniVersion={true} />
              </div>
            </div>

            {/* Student Details */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">ID</div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {carteirinha.id}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">QR Code ID</div>
                  <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                    {carteirinha.qrId}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Nome Completo</div>
                  <div className="text-lg font-medium">{carteirinha.nome}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">CPF</div>
                  <div className="text-lg font-medium">{carteirinha.cpf}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Matrícula</div>
                  <div className="text-lg font-medium">{carteirinha.matricula}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Curso</div>
                  <div className="text-lg font-medium">{carteirinha.curso}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Data de Nascimento</div>
                  <div className="text-lg font-medium">
                    {format(new Date(carteirinha.dataNascimento), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Validade</div>
                  <div className="text-lg font-medium">
                    {format(new Date(carteirinha.validade), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Data de Criação</div>
                  <div className="text-lg font-medium">
                    {format(new Date(carteirinha.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <div className="text-sm text-gray-500 mb-2">Link para verificação:</div>
                <div className="font-mono text-sm bg-gray-100 p-3 rounded break-all">
                  {`${window.location.origin}/verificar/${carteirinha.qrId}`}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
