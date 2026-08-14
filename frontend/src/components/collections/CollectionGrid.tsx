import React from 'react';
import { useCMS, type CMSProduct } from '../../context/CMSContext';
import { ProductCard } from '../product/ProductCard';

export interface CollectionGridProps {
  activeTab: string;
  onProductClick?: (product: CMSProduct) => void;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({
  activeTab,
  onProductClick,
}) => {
  const { products, collections } = useCMS();

  // Map active tab to collection name/id from real CMS data
  const activeCollection = collections.find(
    (c) =>
      c.id === activeTab ||
      c.slug === activeTab ||
      c.name.toLowerCase() === activeTab.toLowerCase()
  );

  const filteredProducts =
    activeTab === 'all'
      ? products
      : products.filter((p) => {
          if (!activeCollection) return false;
          return (
            p.collectionIds?.includes(activeCollection.id) ||
            p.collection === activeCollection.name ||
            p.collections?.includes(activeCollection.name) ||
            activeCollection.productIds?.includes(p.id)
          );
        });

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-16 text-stone-400 space-y-2">
        <p className="text-2xl">✨</p>
        <p className="font-serif text-sm">No products in this collection yet.</p>
        <p className="text-xs text-stone-500">Assign products via the Admin → Collections manager.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {filteredProducts.map((prod) => (
        <ProductCard
          key={prod.id}
          product={prod}
          onProductClick={onProductClick}
        />
      ))}
    </div>
  );
};
