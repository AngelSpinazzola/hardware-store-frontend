interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPages?: number; // Cantidad de páginas a mostrar (default: 5)
  size?: 'small' | 'normal'; // Tamaño del paginador
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  showPages = 5,
  size = 'normal'
}: PaginationProps) => {
  // Si no hay páginas, no mostrar el paginador
  if (totalPages <= 1) return null;

  // Configuración según el tamaño
  const sizeConfig = {
    small: {
      height: 'h-8',
      padding: 'px-3',
      textSize: 'text-sm',
      iconSize: 'w-2.5 h-2.5'
    },
    normal: {
      height: 'h-10',
      padding: 'px-4',
      textSize: 'text-base',
      iconSize: 'w-3 h-3'
    }
  };

  const config = sizeConfig[size];

  // Calcular qué páginas mostrar
  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= showPages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para páginas con puntos suspensivos
      const halfShow = Math.floor(showPages / 2);
      let start = Math.max(1, currentPage - halfShow);
      let end = Math.min(totalPages, currentPage + halfShow);

      // Ajustar si estamos cerca del inicio o final
      if (currentPage <= halfShow) {
        end = showPages;
      } else if (currentPage >= totalPages - halfShow) {
        start = totalPages - showPages + 1;
      }

      // Agregar primera página y puntos suspensivos si es necesario
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      // Agregar páginas del rango
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Agregar puntos suspensivos y última página si es necesario
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const regularButtonClass = `
  flex items-center justify-center ${config.padding} ${config.height} leading-tight 
  pagination-button-inactive ${config.textSize}
  `;

  const activeButtonClass = `
    flex items-center justify-center ${config.padding} ${config.height} leading-tight 
    z-10 pagination-button-active ${config.textSize}
  `;

  const disabledButtonClass = `
    flex items-center justify-center ${config.padding} ${config.height} leading-tight 
    pagination-button-disabled ${config.textSize}
  `;

  return (
    <nav aria-label="Navegación de páginas">
      <ul className={`flex items-center -space-x-px ${config.height} ${config.textSize}`}>
        {/* Botón Previous */}
        <li>
          <button
            onClick={() => handlePageClick(currentPage - 1)}
            className={`
              ${currentPage === 1 ? disabledButtonClass : regularButtonClass}
              ms-0 border-e-0 rounded-s-lg
            `}
            aria-label="Página anterior"
          >
            <span className="sr-only">Anterior</span>
            <svg
              className={`${config.iconSize} rtl:rotate-180`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 1 1 5l4 4"
              />
            </svg>
          </button>
        </li>

        {/* Páginas */}
        {visiblePages.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className={`${regularButtonClass} cursor-default hover:bg-white hover:text-gray-500`}>
                ...
              </span>
            ) : (
              <button
                onClick={() => handlePageClick(page as number)}
                className={page === currentPage ? activeButtonClass : regularButtonClass}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`Ir a página ${page}`}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Botón Next */}
        <li>
          <button
            onClick={() => handlePageClick(currentPage + 1)}
            className={`
              ${currentPage === totalPages ? disabledButtonClass : regularButtonClass}
              rounded-e-lg
            `}
            aria-label="Página siguiente"
          >
            <span className="sr-only">Siguiente</span>
            <svg
              className={`${config.iconSize} rtl:rotate-180`}
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 6 10"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 9 4-4-4-4"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;