
import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
  data: T[];
  itemsPerPage: number;
  initialPage?: number;
}

interface UsePaginationReturn<T> {
  currentPage: number;
  totalPages: number;
  currentData: T[];
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  startIndex: number;
  endIndex: number;
  totalItems: number;
}

export const usePagination = <T>({
  data,
  itemsPerPage,
  initialPage = 1
}: UsePaginationProps<T>): UsePaginationReturn<T> => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calcular datos de paginación
  const paginationData = useMemo(() => {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // Asegurar que la página actual es válida
    const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1);
    
    if (validCurrentPage !== currentPage) {
      setCurrentPage(validCurrentPage);
    }

    const startIndex = (validCurrentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
    const currentData = data.slice(startIndex, endIndex);

    return {
      totalPages,
      currentData,
      startIndex: startIndex + 1, // +1 para mostrar índice basado en 1
      endIndex,
      totalItems,
      validCurrentPage
    };
  }, [data, itemsPerPage, currentPage]);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= paginationData.totalPages) {
      setCurrentPage(page);
      // Scroll suave hacia arriba
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const prevPage = () => {
    goToPage(currentPage - 1);
  };

  const canGoNext = currentPage < paginationData.totalPages;
  const canGoPrev = currentPage > 1;

  return {
    currentPage: paginationData.validCurrentPage,
    totalPages: paginationData.totalPages,
    currentData: paginationData.currentData,
    goToPage,
    nextPage,
    prevPage,
    canGoNext,
    canGoPrev,
    startIndex: paginationData.startIndex,
    endIndex: paginationData.endIndex,
    totalItems: paginationData.totalItems
  };
};