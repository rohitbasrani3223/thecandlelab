import React from 'react';
import { ProductGallery } from './ProductGallery';
import { ProductSummary } from './ProductSummary';
import { FragrancePyramidSection } from './FragrancePyramidSection';
import { ProductSpecsAccordion } from './ProductSpecsAccordion';
import { FrequentlyBoughtTogether } from './FrequentlyBoughtTogether';
import { ProductReviewsSection } from './ProductReviewsSection';
import { RelatedProducts } from './RelatedProducts';
import { StickyBuyBar } from './StickyBuyBar';
import { useToast } from '../../design-system';

export interface SelectedProductData {
  id?: string;
  name?: string;
  category?: string;
  collection?: string;
  scentProfile?: string;
  price?: number;
  originalPrice?: number;
  rating?: number;
  reviewsCount?: number;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  burnTime?: string;
  vesselDescription?: string;
  image?: string;
}

export interface ProductDetailsPageProps {
  product?: SelectedProductData | null;
  onNavigateToShop?: () => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product, onNavigateToShop }) => {
  const { toast } = useToast();
  const productName = product?.name || 'Velvet Rose & Smoked Amber';

  const handleAddToCart = (size: string, wick: string, qty: number) => {
    toast({
      type: 'luxury',
      title: 'Added to Shopping Bag',
      description: `${qty}x ${productName} (${size}, ${wick})`,
    });
  };

  const handleBuyNow = (size: string, wick: string, qty: number) => {
    toast({
      type: 'luxury',
      title: 'Proceeding to Instant Checkout',
      description: `Configured: ${qty}x ${productName} (${size} with ${wick})`,
    });
  };

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans pb-16">
      {/* Breadcrumb Header */}
      <div className="bg-[#F4EFE6] border-b border-[#E5D9C5] py-3.5 px-6 sm:px-12 text-xs text-[#8C7A6B]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="#home" className="hover:text-[#D4AF37] transition-colors">Home</a>
            <span>/</span>
            <button onClick={onNavigateToShop} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Shop All</button>
            <span>/</span>
            <span className="text-[#2A1E17] font-bold">{productName}</span>
          </div>

          <button
            onClick={onNavigateToShop}
            className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:underline cursor-pointer"
          >
            ← Back to Shop Catalog
          </button>
        </div>
      </div>

      {/* Main Hero Section: Gallery + Purchase Summary */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery mainImage={product?.image} />
          </div>

          {/* Right Column: Purchase Summary */}
          <div className="lg:col-span-5">
            <ProductSummary
              product={product}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* Frequently Bought Together Bundle */}
        <div className="mt-16">
          <FrequentlyBoughtTogether />
        </div>

        {/* Specs Accordion */}
        <div className="mt-12">
          <ProductSpecsAccordion />
        </div>
      </div>

      {/* Fragrance Pyramid Architecture */}
      <FragrancePyramidSection />

      {/* Customer Reviews & Related Products Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-16">
        <ProductReviewsSection />
        <RelatedProducts />
      </div>

      {/* Sticky Bottom Buy Bar */}
      <StickyBuyBar onAddToCart={() => handleAddToCart('12 oz Glass', 'Organic Wood Wick', 1)} />
    </div>
  );
};
