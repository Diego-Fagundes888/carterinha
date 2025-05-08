import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Pagination from '@/components/Pagination';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function Admin() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Filtros
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [curso, setCurso] = useState('todos');
  const [validade, setValidade] = useState('todas');
  const [page, setPage] = useState(1);
  const limit = 10;
  
  // Delete dialog
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  // Query para listar carteirinhas
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['/api/carteirinhas', nome, matricula, curso, validade, page, limit],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (nome) queryParams.append('nome', nome);
      if (matricula) queryParams.append('matricula', matricula);
      if (curso && curso !== 'todos') queryParams.append('curso', curso);
      if (validade && validade !== 'todas') queryParams.append('validade', validade);
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      const res = await fetch(`/api/carteirinhas?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Erro ao buscar carteirinhas');
      return await res.json();
    }
  });

  const handleViewDetails = (id: number) => {
    navigate(`/admin/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteId) {
      try {
        await apiRequest('DELETE', `/api/carteirinhas/${deleteId}`, undefined);
        toast({
          title: "Carteirinha excluída",
          description: "A carteirinha foi excluída com sucesso.",
        });
        // Invalidar a query para recarregar os dados
        queryClient.invalidateQueries({ queryKey: ['/api/carteirinhas'] });
        setOpenDeleteDialog(false);
      } catch (error) {
        toast({
          title: "Erro ao excluir",
          description: "Ocorreu um erro ao excluir a carteirinha.",
          variant: "destructive",
        });
      }
    }
  };

  // Resolver o status de validade de uma carteirinha
  const getValidityStatus = (validityDate: string) => {
    const today = new Date();
    const validity = new Date(validityDate);
    const expiringDate = addDays(today, 30);
    
    if (isBefore(validity, today)) {
      return { status: 'expired', label: 'Expirada', className: 'bg-red-100 text-red-800' };
    } else if (isBefore(validity, expiringDate)) {
      return { status: 'expiring', label: 'Expirando', className: 'bg-yellow-100 text-yellow-800' };
    } else {
      return { status: 'valid', label: 'Válida', className: 'bg-green-100 text-green-800' };
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-heading font-bold text-gray-900">Gerenciamento de Carteirinhas</h2>
        <div className="mt-4 sm:mt-0">
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => refetch()}
          >
            <span className="material-icons mr-1 text-sm">refresh</span>
            Atualizar
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label htmlFor="searchName" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
              <Input
                id="searchName"
                placeholder="Buscar por nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="searchEnrollment" className="block text-sm font-medium text-gray-700 mb-1">Matrícula</label>
              <Input
                id="searchEnrollment"
                placeholder="Buscar por matrícula"
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filterCourse" className="block text-sm font-medium text-gray-700 mb-1">Curso</label>
              <Select value={curso} onValueChange={setCurso}>
                <SelectTrigger id="filterCourse">
                  <SelectValue placeholder="Todos os cursos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="todos">Todos os cursos</SelectItem>
                    <SelectItem value="Engenharia de Software">Engenharia de Software</SelectItem>
                    <SelectItem value="Análise e Des. de Sistemas">Análise e Des. de Sistemas</SelectItem>
                    <SelectItem value="Direito">Direito</SelectItem>
                    <SelectItem value="Medicina">Medicina</SelectItem>
                    <SelectItem value="Administração">Administração</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="filterValidity" className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
              <Select value={validade} onValueChange={setValidade}>
                <SelectTrigger id="filterValidity">
                  <SelectValue placeholder="Todas as validades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="todas">Todas as validades</SelectItem>
                    <SelectItem value="valid">Válidas</SelectItem>
                    <SelectItem value="expired">Expiradas</SelectItem>
                    <SelectItem value="expiring">Expirando em 30 dias</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Carteirinhas */}
      <Card className="mb-6 overflow-hidden">
        {isLoading ? (
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validade</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data?.data?.length > 0 ? (
                    data.data.map((carteirinha: any) => {
                      const validityStatus = getValidityStatus(carteirinha.validade);
                      
                      return (
                        <tr key={carteirinha.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                                <img src={carteirinha.foto} alt="Foto do estudante" className="h-full w-full object-cover" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{carteirinha.nome}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{carteirinha.matricula}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{carteirinha.curso}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {format(new Date(carteirinha.validade), 'dd/MM/yyyy', { locale: ptBR })}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${validityStatus.className}`}>
                              {validityStatus.label}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Button
                              variant="ghost"
                              className="text-primary hover:text-blue-900 mr-3"
                              onClick={() => handleViewDetails(carteirinha.id)}
                            >
                              Ver detalhes
                            </Button>
                            <Button
                              variant="ghost"
                              className="text-red-600 hover:text-red-900"
                              onClick={() => handleDeleteClick(carteirinha.id)}
                            >
                              Excluir
                            </Button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                        Nenhuma carteirinha encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Paginação */}
            {data?.total > 0 && (
              <Pagination
                currentPage={page}
                totalPages={data.totalPages}
                onPageChange={setPage}
                totalItems={data.total}
                itemsPerPage={limit}
              />
            )}
          </>
        )}
      </Card>

      {/* Dialog de confirmação de exclusão */}
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </motion.div>
  );
}
