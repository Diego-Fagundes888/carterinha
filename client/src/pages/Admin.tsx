import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Pagination from '@/components/Pagination';
import DeleteConfirmationDialog from '@/components/DeleteConfirmationDialog';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RefreshCw, 
  Search, 
  Filter, 
  ChevronRight, 
  MoreHorizontal, 
  Trash2, 
  Eye, 
  Calendar, 
  UserCheck, 
  Award, 
  User, 
  PlusCircle,
  GraduationCap,
  FileSearch
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from '@/lib/utils';

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
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('todos');
  
  // Delete dialog
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  
  // Hover para ações em cada linha
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    ativas: 0,
    expirando: 0,
    expiradas: 0,
  });

  // Query para listar carteirinhas
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['/api/carteirinhas', nome, matricula, curso, validade, page, limit],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (nome) queryParams.append('nome', nome);
      if (matricula) queryParams.append('matricula', matricula);
      if (curso && curso !== 'todos') queryParams.append('curso', curso);
      if (validade && validade !== 'todas') queryParams.append('validade', validade);
      if (activeTab !== 'todos') queryParams.append('validade', activeTab);
      queryParams.append('page', page.toString());
      queryParams.append('limit', limit.toString());
      
      const res = await fetch(`/api/carteirinhas?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Erro ao buscar carteirinhas');
      return await res.json();
    }
  });

  // Atualizar estatísticas
  useEffect(() => {
    if (data?.data) {
      const today = new Date();
      const expiringDate = addDays(today, 30);
      
      const ativas = data.data.filter((c: any) => {
        const validity = new Date(c.validade);
        return isAfter(validity, today);
      }).length;
      
      const expirando = data.data.filter((c: any) => {
        const validity = new Date(c.validade);
        return isAfter(validity, today) && isBefore(validity, expiringDate);
      }).length;
      
      const expiradas = data.data.filter((c: any) => {
        const validity = new Date(c.validade);
        return isBefore(validity, today);
      }).length;
      
      setStats({
        total: data.total,
        ativas,
        expirando,
        expiradas
      });
    }
  }, [data]);

  const handleChangeTab = (value: string) => {
    setActiveTab(value);
    setPage(1);
    if (value === 'todos') {
      setValidade('todas');
    } else {
      setValidade(value);
    }
  };

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
      return { 
        status: 'expired', 
        label: 'Expirada', 
        className: 'bg-red-100 text-red-800 border border-red-200' ,
        icon: <Calendar className="w-3 h-3 mr-1" />
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

  // Variantes para animações
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Função para limpar os filtros
  const clearFilters = () => {
    setNome('');
    setMatricula('');
    setCurso('todos');
    setValidade('todas');
    setActiveTab('todos');
    setPage(1);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto"
    >
      <div className="relative rounded-xl overflow-hidden mb-6 bg-gradient-to-r from-primary/90 to-accent/90 p-8 text-white shadow-lg">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#ffffff10,#ffffff80)] bg-fixed"></div>
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Gerenciamento de Carteirinhas
              </h1>
              <p className="text-white/80 max-w-xl mt-2">
                Gerencie todas as carteirinhas estudantis, visualize detalhes e monitore status de validade.
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                onClick={() => navigate('/') }
                variant="secondary" 
                size="sm" 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
              >
                <User className="w-4 h-4 mr-1" />
                Área do Aluno
              </Button>
              <Button 
                onClick={() => refetch()}
                variant="secondary" 
                size="sm" 
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Atualizar
              </Button>
              <Button 
                onClick={() => navigate('/')}
                variant="secondary" 
                size="sm" 
                className="bg-primary text-white hover:bg-primary/80 border-0"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Nova Carteirinha
              </Button>
            </div>
          </motion.div>
          
          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Total de Carteirinhas</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.total}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FileSearch className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={item} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Carteirinhas Ativas</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.ativas}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-green-500/30 flex items-center justify-center">
                  <UserCheck className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={item} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Expirando em 30 dias</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.expirando}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-yellow-500/30 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
            
            <motion.div variants={item} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 hover:bg-white/20 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Carteirinhas Expiradas</p>
                  <h3 className="text-2xl font-bold mt-1">{stats.expiradas}</h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-500/30 flex items-center justify-center">
                  <Calendar className="h-5 w-5" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Filtros e Tabs */}
      <div className="bg-white rounded-lg shadow-sm border mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Tabs 
              value={activeTab} 
              onValueChange={handleChangeTab}
              className="w-full"
            >
              <div className="flex flex-wrap items-center justify-between">
                <TabsList className="mb-2 sm:mb-0">
                  <TabsTrigger value="todos" className="px-4">Todos</TabsTrigger>
                  <TabsTrigger value="valid" className="px-4">Válidas</TabsTrigger>
                  <TabsTrigger value="expiring" className="px-4">Expirando</TabsTrigger>
                  <TabsTrigger value="expired" className="px-4">Expiradas</TabsTrigger>
                </TabsList>
                
                <div className="flex space-x-2">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome..."
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="pl-8 w-full"
                    />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                    className={cn(isFiltersVisible && "border-primary text-primary")}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                  
                  {(nome || matricula || curso !== 'todos' || validade !== 'todas') && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs"
                    >
                      Limpar filtros
                    </Button>
                  )}
                </div>
              </div>
            </Tabs>
          </div>
          
          <AnimatePresence>
            {isFiltersVisible && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mt-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Lista de Carteirinhas */}
        <div>
          {isLoading ? (
            <div className="p-8">
              <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-100">
                  <thead>
                    <tr className="bg-gray-50/50">
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Matrícula</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Validade</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {data?.data?.length > 0 ? (
                      data.data.map((carteirinha: any, index: number) => {
                        const validityStatus = getValidityStatus(carteirinha.validade);
                        const isHovered = hoveredRow === carteirinha.id;
                        
                        return (
                          <motion.tr 
                            key={carteirinha.id} 
                            className={`hover:bg-gray-50 transition-colors ${isHovered ? 'bg-gray-50/80' : ''}`}
                            onMouseEnter={() => setHoveredRow(carteirinha.id)}
                            onMouseLeave={() => setHoveredRow(null)}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05, duration: 0.3 }}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                                  <img src={carteirinha.foto} alt="Foto do estudante" className="h-full w-full object-cover" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{carteirinha.nome}</div>
                                  <div className="text-xs text-gray-500">ID: {carteirinha.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-medium">{carteirinha.matricula}</div>
                              <div className="text-xs text-gray-500">{format(new Date(carteirinha.createdAt), "'Criada em' dd/MM/yyyy", { locale: ptBR })}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <GraduationCap className="w-4 h-4 text-primary mr-1.5" />
                                <div className="text-sm text-gray-900">{carteirinha.curso}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 font-medium">
                                {format(new Date(carteirinha.validade), 'dd/MM/yyyy', { locale: ptBR })}
                              </div>
                              <div className="text-xs text-gray-500">CPF: {carteirinha.cpf}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full items-center ${validityStatus.className}`}>
                                {validityStatus.icon}
                                {validityStatus.label}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <div className="flex justify-end space-x-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-primary hover:text-blue-800 hover:bg-blue-50"
                                  onClick={() => handleViewDetails(carteirinha.id)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Detalhes
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-600 hover:text-red-800 hover:bg-red-50"
                                  onClick={() => handleDeleteClick(carteirinha.id)}
                                >
                                  <Trash2 className="w-4 h-4 mr-1" />
                                  Excluir
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center">
                          <div className="max-w-xs mx-auto">
                            <FileSearch className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma carteirinha encontrada</h3>
                            <p className="text-gray-500 text-sm mb-3">
                              Não foi possível encontrar registros com os filtros aplicados.
                            </p>
                            <Button variant="outline" size="sm" onClick={clearFilters}>
                              Limpar filtros
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginação */}
              {data?.total > 0 && (
                <div className="border-t">
                  <Pagination
                    currentPage={page}
                    totalPages={data.totalPages}
                    onPageChange={setPage}
                    totalItems={data.total}
                    itemsPerPage={limit}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dialog de confirmação de exclusão */}
      <DeleteConfirmationDialog
        open={openDeleteDialog}
        onOpenChange={setOpenDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </motion.div>
  );
}
