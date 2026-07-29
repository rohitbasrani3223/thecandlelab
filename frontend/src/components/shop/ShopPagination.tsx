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
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-[#E5D9C5] font-sans">
      {/* Page Size Selector */}
      <div className="flex items-center gap-2 text-xs text-[#8C7A6B]">
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
          className="p-2 rounded-xs border border-[#E5D9C5] bg-[#FAF6F0] text-[#2A1E17] hover:bg-[#F4EFE6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
              className={`w-8 h-8 rounded-xs text-xs font-bold transition-all ${isActive ? 'bg-[#2A1E17] text-[#FAF6F0] shadow-xs' : 'bg-[#FAF6F0] border border-[#E5D9C5] text-[#2A1E17] hover:bg-[#F4EFE6]'}`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="p-2 rounded-xs border border-[#E5D9C5] bg-[#FAF6F0] text-[#2A1E17] hover:bg-[#F4EFE6] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next Page"
        >
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  );
};
