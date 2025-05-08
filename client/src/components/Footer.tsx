import { Link } from 'wouter';
import { GraduationCap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Footer() {
  return (
    <footer className="border-t border-border/60 py-12 mt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <Link href="/">
            <div className="flex items-center space-x-2 group hover:opacity-90 transition-opacity cursor-pointer">
              <div className="bg-primary/10 p-2 rounded-full">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-bold text-foreground">
                Carteirinha Digital
              </h3>
            </div>
          </Link>

          <div className="mt-8 border-t border-border/40 pt-8 w-full">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex space-x-4 mb-4 md:mb-0">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 hover:text-primary">
                    Início
                  </Button>
                </Link>
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 hover:text-primary">
                    Administração
                  </Button>
                </Link>
                <Link href="/verificar">
                  <Button variant="ghost" size="sm" className="rounded-full hover:bg-primary/10 hover:text-primary">
                    Verificar
                  </Button>
                </Link>
              </div>
              
              <div className="text-sm text-muted-foreground flex items-center">
                <span>&copy; {new Date().getFullYear()} Universidade Exemplo</span>
                <span className="mx-2">•</span>
                <span className="flex items-center">
                  Feito com <Heart className="h-3 w-3 mx-1 text-red-500 animate-pulse" /> no Brasil
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-xs text-muted-foreground/70">
            <p>Sistema de Carteirinha Digital versão 1.0.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
