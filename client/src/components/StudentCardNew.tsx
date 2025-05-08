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

export default function StudentCardNew({ student, example = false, miniVersion = false }: StudentCardProps) {
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
    <div className={cn(
      "flip-card cursor-pointer",
      miniVersion ? "scale-[0.95]" : ""
    )}>
      <div 
        className={`flip-card-inner ${isFlipped ? "flipped" : ""}`}
        onClick={handleFlip}
      >
        {/* FRENTE DO CARTÃO */}
        <div className="flip-card-front p-8 flex flex-col shine-effect">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="bg-primary text-white text-xs font-bold py-1.5 px-3 rounded-full inline-flex items-center">
                <BadgeCheck className="w-3.5 h-3.5 mr-1" /> ESTUDANTE
              </div>
              <h4 className="font-card font-bold text-xl mt-2 tracking-wide text-foreground/90 break-words hyphens-auto max-w-[240px]">
                {student.instituicao || "UNIVERSIDADE EXEMPLO"}
              </h4>
            </div>
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
              <School className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          {/* Content - Student info */}
          <div className="flex space-x-6 mb-8">
            {/* Student photo */}
            <div className="w-28 h-36 bg-background shadow-md rounded-xl overflow-hidden border border-border">
              <img 
                src={student.foto} 
                alt="Foto do estudante" 
                className="w-full h-full object-cover" 
              />
            </div>
            
            {/* Student details */}
            <div className="flex-1 space-y-3">
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center font-card">
                  <User className="w-3 h-3 mr-1" /> NOME
                </div>
                <div className="text-base font-bold font-card text-foreground">{student.nome}</div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center font-card">
                  <FileText className="w-3 h-3 mr-1" /> MATRÍCULA
                </div>
                <div className="text-base font-bold font-card text-foreground">{student.matricula}</div>
              </div>
              
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center font-card">
                  <GraduationCap className="w-3 h-3 mr-1" /> CURSO
                </div>
                <div className="text-base font-bold font-card text-foreground">{student.curso}</div>
              </div>
            </div>
          </div>
          
          {/* Additional info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-accent/5 rounded-lg p-3 border border-border/50">
              <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center font-card">
                <Calendar className="w-3 h-3 mr-1" /> DATA DE NASCIMENTO
              </div>
              <div className="text-sm font-bold font-card text-foreground">{formatDate(student.dataNascimento)}</div>
            </div>
            <div className="bg-primary/5 rounded-lg p-3 border border-border/50">
              <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center font-card">
                <Calendar className="w-3 h-3 mr-1" /> VALIDADE
              </div>
              <div className="text-sm font-bold font-card text-foreground">{formatDate(student.validade)}</div>
            </div>
          </div>
          
          {/* Footer */}
          <div className="mt-auto flex justify-between items-end">
            <div>
              <div className="text-xs font-medium text-muted-foreground mb-1 flex items-center font-card">
                <CreditCard className="w-3 h-3 mr-1" /> CPF
              </div>
              <div className="text-sm font-bold font-card text-foreground">{student.cpf}</div>
            </div>
            
            {/* QR Code */}
            <div className="w-24 h-24 bg-white shadow-sm rounded-lg p-2 border border-border/50 flex items-center justify-center">
              {example ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <span className="material-icons text-muted-foreground text-4xl">qr_code_2</span>
                </div>
              ) : (
                <QRCodeSVG
                  value={verificationUrl}
                  size={80}
                  level="H"
                  includeMargin={false}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              )}
            </div>
          </div>
          
          <div className="text-xs text-center text-muted-foreground mt-6 absolute bottom-2 left-0 right-0">
            Toque no cartão para ver o verso
          </div>
        </div>

        {/* VERSO DO CARTÃO */}
        <div className="flip-card-back p-8 flex flex-col bg-white shine-effect">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent py-4 px-4 text-white text-center mb-6 rounded-lg">
            <h4 className="font-card font-bold tracking-wide text-lg">VERIFICAÇÃO DIGITAL</h4>
          </div>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* QR Code Grande */}
            <div className="w-64 h-64 bg-white p-4 rounded-xl border-2 border-primary/20 shadow-lg flex items-center justify-center mb-4">
              {example ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <span className="material-icons text-muted-foreground text-7xl">qr_code_2</span>
                </div>
              ) : (
                <QRCodeSVG
                  value={verificationUrl}
                  size={230}
                  level="H"
                  includeMargin={true}
                  bgColor="#FFFFFF"
                  fgColor="#000000"
                />
              )}
            </div>
            
            <div className="text-center mb-4">
              <div className="text-sm font-medium text-gray-900 mb-1">
                Escaneie este código para verificar a autenticidade
              </div>
              <div className="text-xs text-primary">{verificationUrl}</div>
            </div>
          </div>
          
          <div className="text-xs text-center text-muted-foreground mt-6 absolute bottom-2 left-0 right-0">
            Toque no cartão para ver a frente
          </div>
        </div>
      </div>
    </div>
  );
}