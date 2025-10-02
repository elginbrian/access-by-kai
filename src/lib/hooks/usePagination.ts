import { useState, useEffect, useMemo } from "react";

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  resetDependencies?: any[];
}

export const usePagination = ({ totalItems, itemsPerPage = 10, resetDependencies = [] }: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  useEffect(() => {
    setCurrentPage(1);
  }, [...resetDependencies, totalItems]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    const resultsSection = document.getElementById("results-section");
    if (resultsSection) {
      resultsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).filter((page) => {
      return page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2);
    });
  }, [totalPages, currentPage]);

  return {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    handlePageChange,
    handlePrevPage,
    handleNextPage,
    pageNumbers,
    canGoPrev: currentPage > 1,
    canGoNext: currentPage < totalPages,
  };
};
