export const ProductSkeleton = () => {
  return (
    <div className="bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle animate-pulse space-y-4">
      {/* Top Image Stage */}
      <div className="h-60 bg-[#F4EFE6]" />

      {/* Content lines */}
      <div className="p-5 space-y-3">
        <div className="h-3 bg-[#EFE8DB] rounded w-1/3" />
        <div className="h-5 bg-[#EFE8DB] rounded w-3/4" />
        <div className="h-3 bg-[#EFE8DB] rounded w-1/2" />
        <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
          <div className="h-5 bg-[#EFE8DB] rounded w-1/4" />
          <div className="h-8 bg-[#EFE8DB] rounded-lg w-1/3" />
        </div>
      </div>
    </div>
  );
};

export const ProductGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
};
