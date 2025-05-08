import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { QRCodeSVG } from 'qrcode.react';
import { cn } from '@/lib/utils';
import { Carteirinha } from '@shared/schema';
import { BadgeCheck, Calendar, GraduationCap, School, User, FileText, CreditCard } from 'lucide-react';

interface StudentCardProps {
  student: Carteirinha;
  example?: boolean;
  miniVersion?: boolean;
}

export default function FixedStudentCard({ student, example = false, miniVersion = false }: StudentCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const formatDate = (date: Date | string) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
  };

  const verificationUrl = `${window.location.origin}/verificar/${student.qrId}`;

  const handleFlip = () => {
    console.log("Flipping card:", !isFlipped ? "Showing back" : "Showing front");
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`card-container ${miniVersion ? 'w-full max-w-[300px] h-[600px]' : 'w-full max-w-[400px] h-[650px]'} mx-auto flex items-center justify-center`}>
      <div 
        className={`card-3d ${isFlipped ? 'is-flipped' : ''} w-full h-full`}
        onClick={handleFlip}
      >
        <div className="card-face card-front shine-effect">
          <div className="p-4 sm:p-8 h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-start mb-3 sm:mb-5">
              <div>
                <div className="bg-primary text-white text-xs font-bold py-1 px-2 sm:py-1.5 sm:px-3 rounded-full inline-flex items-center">
                  <BadgeCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" /> ESTUDANTE
                </div>
                <h4 className="font-card font-bold text-sm sm:text-xl mt-1 sm:mt-2 tracking-wide text-foreground/90 break-words hyphens-auto max-w-[200px] sm:max-w-[240px]">
                  {student.instituicao || "USP"}
                </h4>
              </div>
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                <School className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
            </div>
            
            {/* Content - Student info */}
            <div className="flex space-x-3 sm:space-x-6 mb-4 sm:mb-8">
              {/* Student photo */}
              <div className="w-20 h-28 sm:w-28 sm:h-36 bg-background shadow-md rounded-xl overflow-hidden border border-border">
                <img 
                  src={student.foto} 
                  alt="Foto do estudante" 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              {/* Student details */}
              <div className="flex-1 space-y-2 sm:space-y-3">
                <div>
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5 sm:mb-1 flex items-center font-card">
                    <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> NOME
                  </div>
                  <div className="text-sm sm:text-base font-bold font-card text-foreground">{student.nome}</div>
                </div>
                
                <div>
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5 sm:mb-1 flex items-center font-card">
                    <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> MATRÍCULA
                  </div>
                  <div className="text-sm sm:text-base font-bold font-card text-foreground">{student.matricula}</div>
                </div>
                
                <div>
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5 sm:mb-1 flex items-center font-card">
                    <GraduationCap className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> CURSO
                  </div>
                  <div className="text-sm sm:text-base font-bold font-card text-foreground">{student.curso}</div>
                </div>
              </div>
            </div>
            
            {/* Additional info */}
            <div className="grid grid-cols-2 gap-2 sm:gap-6 mb-4 sm:mb-8">
              <div className="bg-accent/5 rounded-lg p-2 sm:p-3 border border-border/50">
                <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5 sm:mb-1 flex items-center font-card">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> DATA DE NASCIMENTO
                </div>
                <div className="text-xs sm:text-sm font-bold font-card text-foreground">{formatDate(student.dataNascimento)}</div>
              </div>
              <div className="bg-primary/5 rounded-lg p-2 sm:p-3 border border-border/50">
                <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5 sm:mb-1 flex items-center font-card">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> VALIDADE
                </div>
                <div className="text-xs sm:text-sm font-bold font-card text-foreground">{formatDate(student.validade)}</div>
              </div>
            </div>
            
            {/* CPF Section */}
            <div className="mt-auto">
              <div className="text-[10px] sm:text-xs font-medium text-muted-foreground mb-0.5 sm:mb-1 flex items-center font-card">
                <CreditCard className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1" /> CPF
              </div>
              <div className="text-xs sm:text-sm font-bold font-card text-foreground mb-4">{student.cpf}</div>
            </div>
              
            {/* QR Code - Centralizado */}
            <div className="flex justify-center w-full mb-6 mt-4">
              <div className="w-32 h-32 sm:w-40 sm:h-40 bg-white shadow-md rounded-lg p-2 border border-primary/20 flex items-center justify-center mx-auto">
                {example ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <span className="material-icons text-muted-foreground text-4xl sm:text-5xl">qr_code_2</span>
                  </div>
                ) : (
                  <QRCodeSVG
                    value={verificationUrl}
                    size={miniVersion ? 100 : 140}
                    level="H"
                    includeMargin={false}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                )}
              </div>
            </div>
            
            <div className="text-[10px] sm:text-xs text-center text-muted-foreground mt-4 sm:mt-6 absolute bottom-1 sm:bottom-2 left-0 right-0">
              Toque no cartão para ver o verso
            </div>
          </div>
        </div>
        
        <div className="card-face card-back shine-effect" style={{ top: '0', left: '0' }}>
          <div className="p-4 sm:p-8 h-full flex flex-col bg-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-accent py-3 px-3 sm:py-4 sm:px-4 text-white text-center mb-4 sm:mb-6 rounded-lg">
              <h4 className="font-card font-bold tracking-wide text-base sm:text-lg">VERIFICAÇÃO DIGITAL</h4>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center pt-12">
              {/* QR Code Grande - Centralizado em posição fixa */}
              <div className={`${miniVersion ? 'w-[90%] h-auto aspect-square' : 'w-64 h-64'} mx-auto bg-white p-2 rounded-xl border-2 border-primary/20 shadow-lg flex items-center justify-center relative z-10`}>
                {example ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    <span className="material-icons text-muted-foreground text-5xl sm:text-7xl">qr_code_2</span>
                  </div>
                ) : (
                  <QRCodeSVG
                    value={verificationUrl}
                    size={miniVersion ? 200 : 230}
                    level="H"
                    includeMargin={true}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                )}
              </div>
              
              <div className="text-center mt-6">
                <div className="text-xs sm:text-sm font-medium text-gray-900 mb-1">
                  Escaneie este código para verificar a autenticidade
                </div>
                <div className="text-[10px] sm:text-xs text-primary break-all px-2 max-w-xs">{verificationUrl}</div>
              </div>
            </div>
            
            <div className="text-[10px] sm:text-xs text-center text-muted-foreground mt-4 sm:mt-6 absolute bottom-1 sm:bottom-2 left-0 right-0">
              Toque no cartão para ver a frente
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}