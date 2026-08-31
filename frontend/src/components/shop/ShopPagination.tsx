import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon, Select } from '../../design-system';

export interface ShopPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

export const ShopPagination: React.FC<ShopPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#EADDCB] font-sans">
      {/* Page Size Selector */}
      <div className="flex items-center gap-2 text-xs text-[#7D6F63]">
        <span>Show per page:</span>
        <div className="w-24">
          <Select
            options={[
              { value: '12', label: '12 Items' },
              { value: '24', label: '24 Items' },
              { value: '36', label: '36 Items' },
            ]}
            value={pageSize.toString()}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="py-1 text-xs"
          />
        </div>
      </div>

      {/* Pagination Page Numbers */}
      <div className="flex items-center gap-1.5">
        <button
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="p-2 rounded-full border border-[#EADDCB] bg-[#FFFFFF] text-[#232323] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous Page"
        >
          <ChevronLeftIcon size={16} />
        </button>

        {[...Array(totalPages)].map((_, index) => {
          const pageNum = index + 1;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${isActive ? 'bg-[#8B6F4E] text-white shadow-xs' : 'bg-[#FFFFFF] border border-[#EADDCB] text-[#232323] hover:bg-[#FAF7F2]'}`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-full border border-[#EADDCB] bg-[#FFFFFF] text-[#232323] hover:bg-[#FAF7F2] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next Page"
        >
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  );
};
