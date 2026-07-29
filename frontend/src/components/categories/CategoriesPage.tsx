import React, { useState } from 'react';
import { Badge, SparklesIcon, Card, Button } from '../../design-system';

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: string;
  icon: string;
  tag: string;
  bannerImage: string;
  products: Array<{
    id: string;
    title: string;
    fragrance: string;
    price: number;
    image: string;
    badge?: string;
  }>;
}

const CATEGORIES_DATA: CategoryItem[] = [
  {
    id: 'glass-jars',
    name: 'Luxury Glass Jars',
    slug: 'glass-jars',
    description: 'Heavy-base Italian frosted glass with hand-carved wooden lids. Designed for long, clean burns.',
    count: '12 Formulations',
    icon: '🕯️',
    tag: 'Popular',
    bannerImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1200&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'prod-1',
        title: 'Velvet Rose & Smoked Amber',
        fragrance: 'Damask Rose, Oud Wood, Smoked Amber',
        price: 1499,
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=80',
        badge: 'Best Seller',
      },
      {
        id: 'prod-2',
        title: 'French Bourbon Vanilla',
        fragrance: 'Madagascar Vanilla Bean, Bourbon, Caramel',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80',
        badge: 'Signature',
      },
      {
        id: 'prod-3',
        title: 'Midnight Jasmine & Bergamot',
        fragrance: 'Night-blooming Jasmine, Calabrian Bergamot',
        price: 1399,
        image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'travel-tins',
    name: 'Botanical Travel Tins',
    slug: 'travel-tins',
    description: 'Seamless brass and matte black travel tins. Take your signature sanctuary scent anywhere.',
    count: '8 Formulations',
    icon: '✨',
    tag: 'Compact',
    bannerImage: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1200&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'prod-4',
        title: 'Eucalyptus & Wild Mint Tin',
        fragrance: 'Blue Gum Eucalyptus, Spearmint, Peppermint',
        price: 799,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80',
        badge: 'Travel Ready',
      },
      {
        id: 'prod-5',
        title: 'Lavender & White Sage Tin',
        fragrance: 'French Lavender, White Sage, Cedarwood',
        price: 799,
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'pillars',
    name: 'Aromatherapy Pillars',
    slug: 'pillars',
    description: 'Unscented & essential oil pure beeswax pillars. Hand-poured without synthetic additives.',
    count: '15 Formulations',
    icon: '🌿',
    tag: 'Pure Oils',
    bannerImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'prod-6',
        title: 'Pure Beeswax Honey Pillar',
        fragrance: 'Natural Honey, Sweet Wax',
        price: 1199,
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=80',
        badge: '100% Pure',
      },
      {
        id: 'prod-7',
        title: 'Sandalwood & Palo Santo Pillar',
        fragrance: 'Mysore Sandalwood, Palo Santo Smoke',
        price: 1599,
        image: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=500&auto=format&fit=crop&q=80',
      },
    ],
  },
  {
    id: 'diffusers',
    name: 'Reed Diffusers & Ambient Oils',
    slug: 'diffusers',
    description: 'Flame-free continuous fragrance diffusion lasting up to 4 months in heavy amber glass bottles.',
    count: '6 Formulations',
    icon: '💧',
    tag: 'Flame-Free',
    bannerImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1200&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'prod-8',
        title: 'Smoked Leather & Tobacco Reed Diffuser',
        fragrance: 'Tuscan Leather, Smoked Tobacco, Vetiver',
        price: 1899,
        image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=80',
        badge: 'Long Lasting',
      },
    ],
  },
  {
    id: 'gift-boxes',
    name: 'Bespoke Gift Sets',
    slug: 'gift-boxes',
    description: 'Curated gift boxes featuring custom candles, matte brass wick trimmers, and snuffer tools.',
    count: '10 Sets',
    icon: '🎁',
    tag: 'Luxury Box',
    bannerImage: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1200&auto=format&fit=crop&q=80',
    products: [
      {
        id: 'prod-9',
        title: 'The Royal Atelier Gift Box',
        fragrance: '3 Signature Candles + Brass Accessories',
        price: 3499,
        image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=80',
        badge: 'Gift Set',
      },
    ],
  },
];

export interface CategoriesPageProps {
  onNavigateToShop?: () => void;
  onSelectProduct?: (product: any) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigateToShop, onSelectProduct }) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');

  const selectedCategory = CATEGORIES_DATA.find((c) => c.id === selectedCategoryId);

  const handleProductClick = (prod: any, cat: CategoryItem) => {
    const productData = {
      id: prod.id,
      name: prod.title,
      price: prod.price,
      topNotes: prod.fragrance,
      vesselDescription: cat.description,
      category: cat.name,
      image: prod.image,
    };
    if (onSelectProduct) {
      onSelectProduct(productData);
    } else {
      window.location.hash = '#pdp';
    }
  };

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans">
      {/* 1. Header Hero Banner */}
      <section className="bg-gradient-to-b from-[#2A1E17] to-[#1C130E] text-[#FAF6F0] py-16 sm:py-24 px-6 sm:px-12 text-center relative overflow-hidden border-b border-[#3D2C22]">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>CURATED CATEGORIES</Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-[#FAF6F0]">
            Artisanal Candle Categories
          </h1>
          <p className="text-sm sm:text-base text-[#E5D9C5] font-light max-w-2xl mx-auto leading-relaxed">
            Discover our hand-poured soy glass jars, brass travel tins, pure beeswax pillars, ambient reed diffusers, and bespoke gift box sets.
          </p>
        </div>
      </section>

      {/* 2. Category Selector Filter Bar */}
      <div className="bg-[#F4EFE6] border-b border-[#E5D9C5] sticky top-0 z-20 shadow-subtle">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setSelectedCategoryId('all')}
            className={`px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
              selectedCategoryId === 'all'
                ? 'bg-[#2A1E17] text-[#D4AF37] shadow-card'
                : 'bg-transparent text-[#69574A] hover:text-[#2A1E17] hover:bg-[#FAF6F0]'
            }`}
          >
            All Categories ({CATEGORIES_DATA.length})
          </button>
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoryId(cat.id)}
              className={`px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                selectedCategoryId === cat.id
                  ? 'bg-[#2A1E17] text-[#D4AF37] shadow-card'
                  : 'bg-transparent text-[#69574A] hover:text-[#2A1E17] hover:bg-[#FAF6F0]'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Category Showcase Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 space-y-16">
        {(selectedCategoryId === 'all' ? CATEGORIES_DATA : [selectedCategory!]).map((cat) => (
          <div key={cat.id} id={cat.id} className="space-y-8 border-b border-[#E5D9C5] pb-12 last:border-b-0">
            {/* Category Header Card */}
            <div className="bg-[#F4EFE6] border border-[#E5D9C5] rounded-md p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-card">
              <div className="space-y-2 max-w-2xl">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{cat.icon}</span>
                  <Badge variant="gold">{cat.tag}</Badge>
                  <span className="text-xs text-[#8C7A6B] font-semibold">{cat.count}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A1E17]">
                  {cat.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#69574A] font-light leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {onNavigateToShop && (
                <Button
                  variant="gold"
                  size="md"
                  onClick={onNavigateToShop}
                  className="shrink-0"
                >
                  Explore All {cat.name} →
                </Button>
              )}
            </div>

            {/* Category Products Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.products.map((prod) => (
                <Card
                  key={prod.id}
                  variant="bordered"
                  padding="md"
                  onClick={() => handleProductClick(prod, cat)}
                  className="group bg-[#FAF6F0] space-y-4 hover:border-[#D4AF37] transition-all cursor-pointer"
                >
                  <div className="relative aspect-square overflow-hidden rounded-xs bg-[#F4EFE6]">
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {prod.badge && (
                      <div className="absolute top-2 left-2 z-10">
                        <Badge variant="gold" size="sm">{prod.badge}</Badge>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-base text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-[#8C7A6B] italic">{prod.fragrance}</p>
                    <p className="text-base font-bold text-[#2A1E17] pt-1">
                      ₹{prod.price.toLocaleString('en-IN')}.00
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    fullWidth
                    onClick={() => handleProductClick(prod, cat)}
                  >
                    View Product Details →
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
