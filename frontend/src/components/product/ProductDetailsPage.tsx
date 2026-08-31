import React, { useState, useMemo } from 'react';
import { PRODUCT_IMAGE_PLACEHOLDER } from '../../config/placeholders';
import { ProductGallery } from './ProductGallery';
import { ProductSummary } from './ProductSummary';
import { ProductSpecsAccordion } from './ProductSpecsAccordion';
import { ProductReviewsSection } from './ProductReviewsSection';
import { RelatedProducts } from './RelatedProducts';
import { useCMS, type CMSProduct, type CMSProductVariant } from '../../context/CMSContext';

export interface ProductDetailsPageProps {
  product?: any | null;
  onNavigateToShop?: () => void;
  onNavigateToCheckout?: () => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({
  product: passedProduct,
  onNavigateToShop,
  onNavigateToCheckout,
}) => {
  const { products } = useCMS();
  const [activeVariantImage, setActiveVariantImage] = useState<string | undefined>(undefined);

  // Always resolve the LIVE product object from CMS store
  const activeProduct = useMemo<CMSProduct>(() => {
    // 1. URL hash query params (e.g. #pdp?id=prod-123 or #pdp?slug=vanilla-candle)
    const hashQuery = window.location.hash.split('?')[1];
    const urlParams = new URLSearchParams(hashQuery || '');
    const urlProductId = urlParams.get('id') || urlParams.get('slug');

    if (urlProductId) {
      const match = products.find(
        (p) =>
          String(p.id).toLowerCase() === String(urlProductId).toLowerCase() ||
          p.slug?.toLowerCase() === String(urlProductId).toLowerCase()
      );
      if (match) return match;
    }

    // 2. Passed product prop
    if (passedProduct?.id) {
      const match = products.find((p) => String(p.id) === String(passedProduct.id));
      if (match) return match;
    }
    if (passedProduct?.name) {
      const matchByName = products.find(
        (p) => p.name.toLowerCase().trim() === passedProduct.name?.toLowerCase().trim()
      );
      if (matchByName) return matchByName;
    }

    return (passedProduct as CMSProduct) || products[0];
  }, [products, passedProduct]);

  if (!activeProduct) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 font-sans space-y-6">
        <div className="text-center text-xs font-bold text-[#8B6F4E] uppercase tracking-widest animate-pulse">
          Loading Formulation Details...
        </div>
      </div>
    );
  }

  const productName = activeProduct.name;

  const handleVariantChange = (_variant: CMSProductVariant | null, variantImage?: string) => {
    if (variantImage) {
      setActiveVariantImage(variantImage);
    }
  };

  const handleBuyNow = () => {
    if (onNavigateToCheckout) {
      onNavigateToCheckout();
    } else {
      window.location.hash = '#checkout';
    }
  };

  return (
    <div className="w-full bg-[#F8F6F0] text-[#232323] min-h-screen font-sans pb-20">
      {/* Breadcrumb Header */}
      <div className="bg-[#FFFFFF] border-b border-[#EADDCB] py-3.5 px-6 sm:px-12 text-xs text-[#7D6F63]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="#home" className="hover:text-[#8B6F4E] transition-colors">
              Home
            </a>
            <span>/</span>
            <button
              onClick={onNavigateToShop}
              className="hover:text-[#8B6F4E] transition-colors cursor-pointer"
            >
              Shop All
            </button>
            <span>/</span>
            <span className="text-[#232323] font-medium truncate max-w-[200px] sm:max-w-md">
              {productName}
            </span>
          </div>

          <button
            onClick={onNavigateToShop}
            className="hidden sm:inline-block text-xs font-mono uppercase tracking-wider text-[#8B6F4E] hover:underline cursor-pointer"
          >
            ← Back to Catalog
          </button>
        </div>
      </div>

      {/* Main Hero Section: Gallery + Purchase Summary */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-start">
          {/* Left Column: Multi-Image Luxury Gallery */}
          <div className="lg:col-span-6 relative lg:sticky lg:top-24 w-full">
            <ProductGallery
              images={activeProduct?.images && activeProduct.images.length > 0 ? activeProduct.images : [activeProduct?.image || activeProduct?.imageUrl || PRODUCT_IMAGE_PLACEHOLDER]}
              productName={activeProduct?.name || ''}
              variantImage={activeVariantImage}
            />
          </div>

          {/* Right Column: Dynamic Purchase Summary */}
          <div className="lg:col-span-6 bg-[#FFFFFF] p-4 sm:p-6 lg:p-8 rounded-3xl border border-[#EADDCB] shadow-card">
            <ProductSummary
              product={activeProduct}
              onVariantChange={handleVariantChange}
              onBuyNow={handleBuyNow}
            />
          </div>
        </div>

        {/* Specs Accordion */}
        <div className="mt-12">
          <ProductSpecsAccordion product={activeProduct} />
        </div>
      </div>

      {/* Customer Reviews & Related Products Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 space-y-12 sm:space-y-16">
        <ProductReviewsSection />
        <RelatedProducts />
      </div>
    </div>
  );
};
