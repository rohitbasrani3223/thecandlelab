import React from 'react';
import { ProductGallery } from './ProductGallery';
import { ProductSummary } from './ProductSummary';
import { FragrancePyramidSection } from './FragrancePyramidSection';
import { ProductSpecsAccordion } from './ProductSpecsAccordion';
import { ProductReviewsSection } from './ProductReviewsSection';
import { RelatedProducts } from './RelatedProducts';
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
  imageUrl?: string;
}

export interface ProductDetailsPageProps {
  product?: SelectedProductData | null;
  onNavigateToShop?: () => void;
}

export const ProductDetailsPage: React.FC<ProductDetailsPageProps> = ({ product, onNavigateToShop }) => {
  const { toast } = useToast();
  const productName = product?.name || 'Velvet Rose & Smoked Amber';

  const handleAddToCart = (size: string, wick: string, qty: number) => {
    const itemToAdd = {
      id: product?.id || 'prod-1',
      name: product?.name || 'Velvet Rose & Smoked Amber',
      category: product?.category || 'Glass Jars',
      price: product?.price ? Math.round(product.price) : 1499,
      originalPrice: product?.originalPrice ? Math.round(product.originalPrice) : 1799,
      image: product?.image || product?.imageUrl || 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
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
            <ProductGallery
              mainImage={product?.image || product?.imageUrl}
              images={(product as any)?.images || []}
              productName={product?.name}
            />
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
    </div>
  );
};
