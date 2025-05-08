import { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';
import { Carteirinha } from '@shared/schema';

interface StudentCardProps {
  student: Carteirinha;
  example?: boolean;
  miniVersion?: boolean;
}

export default function StudentCard({ student, example = false, miniVersion = false }: StudentCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const verificationUrl = `${window.location.origin}/verificar/${student.qrId}`;

  return (
    <div 
      className={cn(
        "student-card rounded-xl shadow-card bg-white overflow-hidden cursor-pointer transition-transform duration-600",
        isFlipped ? "flipped" : "",
        miniVersion ? "scale-95" : ""
      )}
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div 
        className="card-face card-front relative"
        style={{ backfaceVisibility: 'hidden' }}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="bg-primary text-white text-xs font-bold py-1 px-2 rounded">ESTUDANTE</div>
              <h4 className="font-card font-bold text-lg mt-2">UNIVERSIDADE EXEMPLO</h4>
            </div>
            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="material-icons text-gray-400 text-2xl">school</span>
            </div>
          </div>
          
          <div className="flex space-x-4 mb-4">
            {/* Student photo */}
            <div className="w-24 h-32 bg-gray-100 border border-gray-300 rounded-lg overflow-hidden">
              <img 
                src={student.foto} 
                alt="Foto do estudante" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Student info */}
            <div className="flex-1">
              <div className="text-xs text-gray-500 mb-1 font-card">NOME</div>
              <div className="text-sm font-semibold font-card mb-2">{student.nome}</div>
              
              <div className="text-xs text-gray-500 mb-1 font-card">MATRÍCULA</div>
              <div className="text-sm font-semibold font-card mb-2">{student.matricula}</div>
              
              <div className="text-xs text-gray-500 mb-1 font-card">CURSO</div>
              <div className="text-sm font-semibold font-card mb-2">{student.curso}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <div>
              <div className="text-xs text-gray-500 mb-1 font-card">DATA DE NASCIMENTO</div>
              <div className="font-semibold font-card">{formatDate(student.dataNascimento)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1 font-card">VALIDADE</div>
              <div className="font-semibold font-card">{formatDate(student.validade)}</div>
            </div>
          </div>
          
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs text-gray-500 mb-1 font-card">CPF</div>
              <div className="font-semibold font-card">{student.cpf}</div>
            </div>
            
            {/* QR Code */}
            <div className="w-20 h-20 bg-white border border-gray-300 rounded p-1">
              {example ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="material-icons text-gray-400">qr_code_2</span>
                </div>
              ) : (
                <QRCodeSVG
                  value={verificationUrl}
                  size={72}
                  level="H"
                  includeMargin={false}
                />
              )}
            </div>
          </div>
          
          <div className="text-xs text-center text-gray-500 mt-4">
            Clique no cartão para ver o verso
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="card-face card-back absolute inset-0"
        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="bg-gray-800 py-4 px-4 text-white text-center mb-6">
            <h4 className="font-card font-bold">INFORMAÇÕES ADICIONAIS</h4>
          </div>
          
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-4">
                Esta carteirinha é de uso pessoal e intransferível. 
                Em caso de perda ou extravio, comunique imediatamente à secretaria.
              </p>
              
              <div className="text-xs text-gray-500 mb-1 font-card">EMITIDO EM</div>
              <div className="font-semibold font-card mb-3">{formatDate(student.createdAt)}</div>
            </div>
            
            <div className="mt-auto">
              <div className="text-center mb-2">
                <div className="mx-auto w-32 h-12 border-b-2 border-gray-400"></div>
                <div className="text-sm font-card mt-1">Assinatura do Portador</div>
              </div>
              
              <div className="text-center mt-4">
                <div className="text-xs text-gray-500">
                  Verifique a autenticidade em:<br/>
                  <span className="text-primary break-all">{verificationUrl}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-xs text-center text-gray-500 mt-4">
            Clique no cartão para ver a frente
          </div>
        </div>
      </motion.div>
    </div>
  );
}
