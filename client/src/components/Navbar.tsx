import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { GraduationCap, Menu, X, Home, Settings } from 'lucide-react';

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-background/70 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="bg-primary/10 p-2 rounded-full transition-colors group-hover:bg-primary/20">
                <GraduationCap className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-xl font-bold text-foreground tracking-tight cursor-pointer transition-colors group-hover:text-primary">
                Carteirinha Digital
              </h1>
            </div>
          </Link>

          <nav className="hidden md:flex space-x-1">
            <Link href="/">
              <Button 
                variant={isActive('/') ? "default" : "ghost"} 
                className={`rounded-full text-sm px-4 ${isActive('/') ? '' : 'hover:bg-primary/10 hover:text-primary'}`}
                size="sm"
              >
                <Home className="h-4 w-4 mr-2" />
                Início
              </Button>
            </Link>
            <Link href="/admin">
              <Button 
                variant={isActive('/admin') ? "default" : "ghost"}
                className={`rounded-full text-sm px-4 ${isActive('/admin') ? '' : 'hover:bg-primary/10 hover:text-primary'}`}
                size="sm"
              >
                <Settings className="h-4 w-4 mr-2" />
                Administração
              </Button>
            </Link>
          </nav>
          
          <Button 
            variant="ghost"
            size="icon"
            className="md:hidden" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-background/95 backdrop-blur-sm border-b border-border"
        >
          <div className="px-4 py-3 space-y-2">
            <Link href="/">
              <Button 
                variant={isActive('/') ? "default" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="h-4 w-4 mr-2" />
                Início
              </Button>
            </Link>
            <Link href="/admin">
              <Button 
                variant={isActive('/admin') ? "default" : "ghost"}
                className="w-full justify-start text-left"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Administração
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
