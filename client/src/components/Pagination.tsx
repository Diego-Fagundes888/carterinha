import { Button } from "@/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage
}: PaginationProps) {
  // Calcular range de itens que estão sendo exibidos
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Criar array de páginas para exibição
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Se houver poucas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Mostrar páginas ao redor da atual com ellipsis
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      // Ajustar quando estamos próximos do fim
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      // Primeira página sempre
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push('...');
      }
      
      // Páginas do meio
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Última página sempre
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Próximo
        </Button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{startItem}</span> a <span className="font-medium">{endItem}</span> de{' '}
            <span className="font-medium">{totalItems}</span> resultados
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Botão Anterior */}
            <Button
              variant="outline"
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <span className="material-icons text-xl">chevron_left</span>
            </Button>
            
            {/* Números das páginas */}
            {getPageNumbers().map((page, index) => (
              typeof page === 'number' ? (
                <Button
                  key={index}
                  variant={page === currentPage ? "default" : "outline"}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    page === currentPage 
                      ? 'bg-primary text-white' 
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              ) : (
                <span
                  key={index}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  {page}
                </span>
              )
            ))}
            
            {/* Botão Próximo */}
            <Button
              variant="outline"
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="material-icons text-xl">chevron_right</span>
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
