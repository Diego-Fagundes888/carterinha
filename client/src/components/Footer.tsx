import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <span className="material-icons text-primary mr-2">school</span>
            <Link href="/">
              <span className="text-gray-800 font-heading font-semibold cursor-pointer">
                Carteirinha Digital de Estudante
              </span>
            </Link>
          </div>
          <div className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Universidade Exemplo. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
}
