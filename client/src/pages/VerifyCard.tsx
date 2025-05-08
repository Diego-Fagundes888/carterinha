import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { format, isAfter } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Calendar, 
  GraduationCap, 
  User, 
  FileText, 
  CreditCard, 
  Clock,
  BadgeCheck,
  ShieldCheck,
  Shield,
  LucideProps,
  ShieldX
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import FixedStudentCard from '@/components/FixedStudentCard';

// Ícone confeccionado especialmente para verificação
const VerificationIcon = (props: LucideProps) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path
      d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
      className="fill-green-50 stroke-green-600"
    />
    <path
      d="M9 12l2 2 4-4"
      stroke="currentColor"
      strokeWidth="2"
      className="stroke-green-600"
    />
    <path
      d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"
      className="stroke-green-600"
    />
  </svg>
);

export default function VerifyCard() {
  const { qrId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: [`/api/verificar/${qrId}`],
  });

  // Esqueleto de carregamento elegante
  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto pt-6">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="h-6 bg-gray-200 rounded w-48"></div>
          </div>
          
          <div className="h-4 bg-gray-200 rounded w-64 mb-4"></div>
          <div className="h-3 bg-gray-200 rounded w-full max-w-md mb-8"></div>
          
          <div className="bg-gray-100 rounded-xl p-8 mb-8">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div>
                <div className="h-5 bg-gray-200 rounded w-48 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-32"></div>
              </div>
            </div>
            <div className="h-[420px] bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const isValid = data?.valid;
  const carteirinha = data?.carteirinha;
  
  // Verificamos se a carteirinha é valida E se a data de validade ainda não expirou
  const isValidAndActive = isValid && carteirinha && isAfter(new Date(carteirinha.validade), new Date());

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-4xl mx-auto pb-10"
    >
      {/* Cabeçalho com estilo moderno */}
      <div className="relative overflow-hidden mb-8 rounded-b-xl">
        <div className={`relative py-12 px-8 ${isValidAndActive ? 'bg-gradient-to-r from-green-600 to-emerald-600' : 'bg-gradient-to-r from-red-600 to-rose-600'} text-white`}>
          <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#ffffff10,#ffffff70)] bg-fixed"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="relative"
          >
            <div className="flex flex-wrap items-center justify-between">
              <div className="w-full lg:max-w-xl mb-6 lg:mb-0">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight mb-2">
                  {isValidAndActive ? (
                    <>Sistema de Verificação de Carteirinha</>
                  ) : (
                    <>Verificação de Carteirinha</>
                  )}
                </h1>
                <p className="text-white/80 text-sm sm:text-base max-w-xl">
                  {isValidAndActive ? (
                    <>Este sistema verifica a autenticidade de carteirinhas estudantis. Esta carteirinha foi verificada e é autêntica.</>
                  ) : (
                    <>Este sistema verifica a autenticidade de carteirinhas estudantis. A carteirinha verificada apresenta um problema de validação.</>
                  )}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 sm:space-x-4 mt-2 lg:mt-0">
                <Link href="/">
                  <Button 
                    size="sm"
                    variant="secondary" 
                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-0 text-xs sm:text-sm"
                  >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    Página Inicial
                  </Button>
                </Link>
                
                <div 
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center ${
                    isValidAndActive 
                      ? 'bg-green-500/30' 
                      : 'bg-red-500/30'
                  }`}
                >
                  {isValidAndActive ? (
                    <ShieldCheck className="h-6 w-6 sm:h-8 sm:w-8" />
                  ) : (
                    <ShieldX className="h-6 w-6 sm:h-8 sm:w-8" />
                  )}
                </div>
              </div>
            </div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6"
            >
              <Badge 
                className={`text-sm py-1 px-3 ${
                  isValidAndActive 
                    ? 'bg-green-500/90 hover:bg-green-500/90 text-white' 
                    : 'bg-red-500/90 hover:bg-red-500/90 text-white'
                } border-none`}
              >
                {isValidAndActive ? (
                  <span className="flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                    Carteirinha Válida
                  </span>
                ) : (
                  <span className="flex items-center">
                    <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                    Carteirinha Inválida
                  </span>
                )}
              </Badge>
              
              <div className="mt-2 text-white/70 text-sm">
                Código de verificação: {qrId}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="px-4">
        <AnimatePresence>
          {isValidAndActive && carteirinha ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-8"
            >
              {/* Carteirinha com largura completa em celulares e coluna na esquerda em desktop */}
              <div className="col-span-1 lg:col-span-3 xl:col-span-1 mb-6 lg:mb-0">
                <Card className="shadow-lg border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 border-b">
                    <div className="flex items-center">
                      <div className="p-2 bg-green-100 rounded-full mr-3">
                        <BadgeCheck className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-900">Carteirinha Estudantil</CardTitle>
                        <CardDescription>
                          Esta carteirinha é válida e autêntica
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 flex justify-center">
                    <div className="card-float-effect w-full max-w-sm mx-auto">
                      <FixedStudentCard student={carteirinha} miniVersion={false} />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Coluna Direita - Informações do estudante */}
              <div className="col-span-1 xl:col-span-2">
                <Card className="shadow-lg border-0 overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-green-50/30 border-b">
                    <div className="flex items-center">
                      <VerificationIcon className="h-6 w-6 mr-3 text-green-600" />
                      <CardTitle className="text-lg font-bold text-gray-900">
                        Dados Verificados
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Todos os dados estão íntegros e conferem com o registro original
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="p-6">
                    {/* Informações pessoais */}
                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        <User className="h-5 w-5 text-primary mr-2" />
                        <h3 className="font-bold text-gray-900">Informações Pessoais</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-2">
                        <div>
                          <div className="text-sm text-gray-500 mb-1 flex items-center">
                            <User className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            NOME COMPLETO
                          </div>
                          <div className="text-lg font-medium text-gray-900">{carteirinha.nome}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-500 mb-1 flex items-center">
                            <CreditCard className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            CPF
                          </div>
                          <div className="text-lg font-medium text-gray-900">{carteirinha.cpf}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-500 mb-1 flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            DATA DE NASCIMENTO
                          </div>
                          <div className="text-lg font-medium text-gray-900">
                            {format(new Date(carteirinha.dataNascimento), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    {/* Informações acadêmicas */}
                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        <GraduationCap className="h-5 w-5 text-primary mr-2" />
                        <h3 className="font-bold text-gray-900">Informações Acadêmicas</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-2">
                        <div>
                          <div className="text-sm text-gray-500 mb-1 flex items-center">
                            <FileText className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            MATRÍCULA
                          </div>
                          <div className="text-lg font-medium text-gray-900 font-mono">{carteirinha.matricula}</div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-500 mb-1 flex items-center">
                            <GraduationCap className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            CURSO
                          </div>
                          <div className="text-lg font-medium text-gray-900">{carteirinha.curso}</div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    {/* Informações sobre a carteirinha */}
                    <div>
                      <div className="flex items-center mb-4">
                        <Shield className="h-5 w-5 text-primary mr-2" />
                        <h3 className="font-bold text-gray-900">Informações da Carteirinha</h3>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-2">
                        <div>
                          <div className="text-sm text-gray-500 mb-1 flex items-center">
                            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            VALIDADE
                          </div>
                          <div className="text-lg font-medium text-gray-900">
                            {format(new Date(carteirinha.validade), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        </div>
                        
                        <div>
                          <div className="text-sm text-gray-500 mb-1 flex items-center">
                            <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
                            DATA DE EMISSÃO
                          </div>
                          <div className="text-lg font-medium text-gray-900">
                            {format(new Date(carteirinha.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Mensagem de validação */}
                    <div className="mt-8 p-4 rounded-lg bg-green-50 border border-green-200 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <ShieldCheck className="h-6 w-6 text-green-600 mr-2" />
                        <h4 className="font-bold text-green-700">Verificação de Segurança</h4>
                      </div>
                      <p className="text-green-800 text-sm">
                        Esta carteirinha foi verificada e está autenticada. Os dados exibidos são oficiais e foram confirmados em nosso sistema de registro.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-red-50 to-rose-50 border-b">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-full mr-3">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-red-900">Carteirinha Inválida</CardTitle>
                      <CardDescription className="text-red-700/70">
                        Não foi possível verificar a autenticidade desta carteirinha
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-8">
                  <div className="max-w-md mx-auto">
                    <div className="bg-red-50 p-5 rounded-lg border border-red-200 mb-8">
                      <div className="flex items-center mb-4">
                        <div className="p-2 bg-red-100 rounded-full mr-3">
                          <ShieldX className="h-5 w-5 text-red-600" />
                        </div>
                        <h3 className="font-bold text-red-800">Verificação Falhou</h3>
                      </div>
                      
                      <p className="text-red-700 mb-4">
                        A carteirinha consultada não foi encontrada em nosso sistema ou está expirada.
                      </p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                          <p className="text-red-700 text-sm">O código QR ou link de verificação pode estar incorreto</p>
                        </div>
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                          <p className="text-red-700 text-sm">A carteirinha pode ter sido revogada</p>
                        </div>
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
                          <p className="text-red-700 text-sm">A data de validade da carteirinha pode ter expirado</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 text-center">
                      <h4 className="font-bold text-gray-700 mb-2">Precisa de ajuda?</h4>
                      <p className="text-gray-600 text-sm mb-4">
                        Para mais informações sobre esta verificação, entre em contato com a secretaria acadêmica.
                      </p>
                      <div className="flex justify-center">
                        <Link href="/">
                          <Button>
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Voltar para página inicial
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
