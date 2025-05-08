import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion } from 'framer-motion';

export default function VerifyCard() {
  const { qrId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: [`/api/verificar/${qrId}`],
  });

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

  const isValid = data?.valid;
  const carteirinha = data?.carteirinha;

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
        <h2 className="text-2xl font-heading font-bold text-gray-900 ml-4">Verificação de Carteirinha</h2>
      </div>

      {isValid && carteirinha ? (
        <Card className="border-l-4 border-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <span className="material-icons text-green-500 mr-2 text-4xl">check_circle</span>
              <h3 className="text-xl font-heading font-semibold text-gray-800">Carteirinha Verificada</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">NOME COMPLETO</div>
                  <div className="text-lg font-medium">{carteirinha.nome}</div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">MATRÍCULA</div>
                  <div className="text-lg font-medium">{carteirinha.matricula}</div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">CURSO</div>
                  <div className="text-lg font-medium">{carteirinha.curso}</div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">CPF</div>
                  <div className="text-lg font-medium">{carteirinha.cpf}</div>
                </div>
              </div>

              <div>
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">DATA DE NASCIMENTO</div>
                  <div className="text-lg font-medium">
                    {format(new Date(carteirinha.dataNascimento), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">VALIDADE</div>
                  <div className="text-lg font-medium">
                    {format(new Date(carteirinha.validade), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">DATA DE EMISSÃO</div>
                  <div className="text-lg font-medium">
                    {format(new Date(carteirinha.createdAt), 'dd/MM/yyyy', { locale: ptBR })}
                  </div>
                </div>

                {/* Foto */}
                <div className="mb-4">
                  <div className="text-xs text-gray-500 mb-1">FOTO</div>
                  <div className="w-32 h-40 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={carteirinha.foto}
                      alt="Foto do estudante"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-l-4 border-red-500">
          <CardContent className="pt-6">
            <div className="flex items-center mb-6">
              <span className="material-icons text-red-500 mr-2 text-4xl">error</span>
              <h3 className="text-xl font-heading font-semibold text-gray-800">Carteirinha Inválida ou Expirada</h3>
            </div>

            <p className="text-gray-600 mb-4">
              A carteirinha consultada não foi encontrada em nosso sistema ou está expirada.
              Possíveis motivos:
            </p>

            <ul className="list-disc pl-5 mb-6 text-gray-600">
              <li>O código QR ou link de verificação está incorreto</li>
              <li>A carteirinha foi revogada</li>
              <li>A data de validade da carteirinha expirou</li>
            </ul>

            <div className="text-sm text-gray-500">
              Para mais informações, entre em contato com a secretaria acadêmica.
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
}
