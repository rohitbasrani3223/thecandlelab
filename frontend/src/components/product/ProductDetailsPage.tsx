import React, { useMemo } from 'react';
import { PRODUCT_IMAGE_PLACEHOLDER } from '../../config/placeholders';
import { ProductGallery } from './ProductGallery';
import { ProductSummary } from './ProductSummary';
import { FragrancePyramidSection } from './FragrancePyramidSection';
import { ProductSpecsAccordion } from './ProductSpecsAccordion';
import { ProductReviewsSection } from './ProductReviewsSection';
import { RelatedProducts } from './RelatedProducts';
import { useToast } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

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
  imageUrl?: string;
  images?: string[];
}

export interface ProductDetailsPageProps {
  product?: SelectedProductData | null;
  onNavigateToShop?: () => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product: passedProduct, onNavigateToShop }) => {
  const { toast } = useToast();
  const { products } = useCMS();

  // Always resolve the LIVE product object from CMS store so any updates in Admin immediately reflect on PDP
  const activeProduct = useMemo(() => {
    // 1. Try resolving from URL hash query params (e.g. #pdp?id=prod-123)
    const hashQuery = window.location.hash.split('?')[1];
    const urlParams = new URLSearchParams(hashQuery || '');
    const urlProductId = urlParams.get('id') || urlParams.get('slug');

    if (urlProductId) {
      const matchByUrlId = products.find(
        (p) => String(p.id).toLowerCase() === String(urlProductId).toLowerCase()
      );
      if (matchByUrlId) return matchByUrlId;
    }

    // 2. Try resolving from passedProduct prop
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

    return passedProduct || products[0] || null;
  }, [products, passedProduct]);

  const productName = activeProduct?.name || 'Artisanal Soy Candle';

  const handleAddToCart = (size: string, wick: string, qty: number) => {
    const itemToAdd = {
      id: activeProduct?.id || 'prod-1',
      name: activeProduct?.name || 'Artisanal Soy Candle',
      category: activeProduct?.category || 'Glass Jars',
      price: activeProduct?.price ? Math.round(activeProduct.price) : 1499,
      originalPrice: activeProduct?.originalPrice ? Math.round(activeProduct.originalPrice) : 1799,
      image: activeProduct?.image || activeProduct?.imageUrl || PRODUCT_IMAGE_PLACEHOLDER,
      quantity: qty,
      size,
      wick,
    };

    try {
      const saved = localStorage.getItem('tcl_cart_items');
      const existing = saved ? JSON.parse(saved) : [];
      const index = existing.findIndex((i: any) => i.id === itemToAdd.id && i.size === size);
      if (index > -1) {
        existing[index].quantity += qty;
      } else {
        existing.push(itemToAdd);
      }
      localStorage.setItem('tcl_cart_items', JSON.stringify(existing));
      window.dispatchEvent(new Event('tcl-cart-updated'));
    } catch (e) {
      console.error('Cart update failed', e);
    }

    toast({
      type: 'luxury',
      title: 'Added to Shopping Bag',
      description: `${qty}x ${itemToAdd.name} (${size})`,
    });
  };

  const handleBuyNow = (size: string, wick: string, qty: number) => {
    handleAddToCart(size, wick, qty);
    window.location.hash = '#checkout';
  };

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans pb-16">
      {/* Breadcrumb Header */}
      <div className="bg-[#F4EFE6] border-b border-[#E5D9C5] py-3.5 px-6 sm:px-12 text-xs text-[#8C7A6B]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="#home" className="hover:text-[#D4AF37] transition-colors">
              Home
            </a>
            <span>/</span>
            <button onClick={onNavigateToShop} className="hover:text-[#D4AF37] transition-colors cursor-pointer">
              Shop All
            </button>
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Compact Luxury Gallery */}
          <div className="lg:col-span-6">
            <ProductGallery
              mainImage={activeProduct?.image || activeProduct?.imageUrl}
              images={(activeProduct as any)?.images || []}
              productName={activeProduct?.name}
            />
          </div>

          {/* Right Column: Dynamic Purchase Summary */}
          <div className="lg:col-span-6">
            <ProductSummary product={activeProduct} onAddToCart={handleAddToCart} onBuyNow={handleBuyNow} />
          </div>
        </div>

        {/* Specs Accordion */}
        <div className="mt-12">
          <ProductSpecsAccordion product={activeProduct} />
        </div>
      </div>

      {/* Fragrance Pyramid Architecture */}
      <FragrancePyramidSection product={activeProduct} />

      {/* Customer Reviews & Related Products Container */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16 space-y-16">
        <ProductReviewsSection />
        <RelatedProducts />
      </div>
    </div>
  );
};
