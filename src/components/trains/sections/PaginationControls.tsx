import React from "react";
import { colors } from "@/app/design-system";

interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  canGoPrev: boolean;
  canGoNext: boolean;
  pageNumbers: number[];
}

const PaginationControls: React.FC<PaginationControlsProps> = ({ currentPage, totalPages, onPageChange, onPrevPage, onNextPage, canGoPrev, canGoNext, pageNumbers }) => {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const elements: React.ReactNode[] = [];
    let lastPage = 0;

    pageNumbers.forEach((page, index) => {
      // Add ellipsis if there's a gap
      if (lastPage && page > lastPage + 1) {
        elements.push(
          <span key={`ellipsis-${lastPage}`} className="px-3 py-2 text-gray-500">
            ...
          </span>
        );
      }

      elements.push(
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? "text-white" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
          style={
            currentPage === page
              ? {
                  background: `linear-gradient(135deg, ${colors.violet.normal} 0%, ${colors.blue.normal} 100%)`,
                }
              : {}
          }
        >
          {page}
        </button>
      );

      lastPage = page;
    });

    return elements;
  };

  return (
    <div className="flex justify-center items-center space-x-2 mt-8 mb-4">
      {/* Previous Button */}
      <button
        onClick={onPrevPage}
        disabled={!canGoPrev}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!canGoPrev ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
      >
        ← Sebelumnya
      </button>

      {/* Page Numbers */}
      <div className="flex space-x-1">{renderPageNumbers()}</div>

      {/* Next Button */}
      <button
        onClick={onNextPage}
        disabled={!canGoNext}
        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!canGoNext ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"}`}
      >
        Selanjutnya →
      </button>
    </div>
  );
};

export default PaginationControls;
