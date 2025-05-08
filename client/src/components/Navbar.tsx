import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-primary">school</span>
            <Link href="/">
              <h1 className="text-xl font-heading font-bold text-gray-800 cursor-pointer">
                Carteirinha Digital de Estudante
              </h1>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8 text-sm">
            <Link href="/">
              <a className={`px-3 py-2 transition-colors duration-150 font-medium ${isActive('/') ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
                Início
              </a>
            </Link>
            <Link href="/admin">
              <a className={`px-3 py-2 transition-colors duration-150 font-medium ${isActive('/admin') ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}>
                Administração
              </a>
            </Link>
          </nav>
          <button 
            className="md:hidden text-gray-600 focus:outline-none" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="material-icons">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-white border-b border-gray-200"
        >
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link href="/">
              <a 
                className={`block px-3 py-2 rounded-md font-medium ${isActive('/') ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </a>
            </Link>
            <Link href="/admin">
              <a 
                className={`block px-3 py-2 rounded-md font-medium ${isActive('/admin') ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Administração
              </a>
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
