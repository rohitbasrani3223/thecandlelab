import React, { useState } from 'react';
import { Card, Badge, SparklesIcon, ChevronRightIcon, CandleIcon } from '../../design-system';

export interface CollectionItem {
  id: string;
  category: 'royal' | 'botanical' | 'gourmand' | 'diffusers' | 'gift-sets';
  title: string;
  subtitle: string;
  description: string;
  price: string;
  burnTime: string;
  vessel: string;
  wax: string;
  tag: string;
  tagVariant?: 'pink' | 'rose' | 'gold' | 'espresso' | 'outline' | 'success';
  scentNotes: string[];
  image: string;
  itemCount: number;
}

const collectionsData: CollectionItem[] = [
  {
    id: 'royal-heritage',
    category: 'royal',
    title: 'The Royal Heritage Edition',
    subtitle: 'Warm Smoked Oud & Royal Amber',
    description: 'Poured in heavy-base amber Italian glass with fluted 24k gilded rim. Dual crackling organic wood wicks.',
    price: '₹1,699',
    burnTime: '65+ Hours',
    vessel: 'Italian Amber Glass',
    wax: '100% Organic Soy',
    tag: 'Signature Pour',
    tagVariant: 'pink',
    scentNotes: ['Smoked Oud', 'Damask Rose', 'Warm Amber', 'Vanilla Resin'],
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1000&q=85',
    itemCount: 8,
  },
  {
    id: 'botanical-haven',
    category: 'botanical',
    title: 'Botanical Haven & Wildflora',
    subtitle: 'French Lavender & White Sage',
    description: 'Calming botanical sanctuary formulated with pure steam-distilled essential oils and solid walnut wooden lids.',
    price: '₹1,299',
    burnTime: '50+ Hours',
    vessel: 'Matte Sage Vessel',
    wax: 'Botanical Soy Blend',
    tag: 'Calm & Serene',
    tagVariant: 'outline',
    scentNotes: ['French Lavender', 'White Sage', 'Bergamot Rind', 'Eucalyptus'],
    image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1000&q=85',
    itemCount: 12,
  },
  {
    id: 'artisanal-espresso',
    category: 'gourmand',
    title: 'Artisanal Espresso & Cacao',
    subtitle: 'Roasted Arabica & Smoked Cinnamon',
    description: 'Cozy cafe sanctuary infused with cold-pressed roasted Arabica beans, dark bitter cacao, and smoked hazelnut.',
    price: '₹1,499',
    burnTime: '55+ Hours',
    vessel: 'Matte Espresso Ceramic',
    wax: '100% Soy Wax',
    tag: 'Gourmand Reserve',
    tagVariant: 'pink',
    scentNotes: ['Roasted Arabica', 'Dark Cacao', 'Smoked Cinnamon', 'Hazelnut'],
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1000&q=85',
    itemCount: 6,
  },
  {
    id: 'madagascar-vanilla',
    category: 'gourmand',
    title: 'Madagascar Vanilla & Bourbon',
    subtitle: 'Warm Amber & Sweet Tonka Bean',
    description: 'Hand-poured in champagne gold ribbed jars. Crushed whole bourbon vanilla pods with warm amber resin undertones.',
    price: '₹1,599',
    burnTime: '60+ Hours',
    vessel: 'Champagne Ribbed Glass',
    wax: 'Natural Soy Wax',
    tag: 'Luxe Classic',
    tagVariant: 'pink',
    scentNotes: ['Vanilla Pod', 'Oak Bourbon', 'Sweet Tonka', 'Golden Honey'],
    image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1000&q=85',
    itemCount: 9,
  },
  {
    id: 'flame-free-diffusers',
    category: 'diffusers',
    title: 'Flame-Free Ambient Diffusers',
    subtitle: 'Japanese Yuzu & White Tea',
    description: 'Flame-free continuous fragrance diffusion. Apothecary flacon with 8 natural porous charcoal rattan reeds.',
    price: '₹1,199',
    burnTime: '90 Days Scent',
    vessel: 'Amber Apothecary Flacon',
    wax: '0% Alcohol Pure Oils',
    tag: 'Flame-Free',
    tagVariant: 'outline',
    scentNotes: ['Japanese Yuzu', 'White Tea', 'Himalayan Cedar', 'Bergamot'],
    image: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=1000&q=85',
    itemCount: 5,
  },
  {
    id: 'bespoke-gift-sets',
    category: 'gift-sets',
    title: 'Bespoke Artisan Gift Sets',
    subtitle: 'Votive Trio & Matte Brass Care Kit',
    description: 'Foil-stamped linen presentation box with 3 artisanal votives, matte brass snuffer, and ergonomic wick trimmer.',
    price: '₹2,499',
    burnTime: '3 x 25h Votives',
    vessel: 'Linen Presentation Box',
    wax: 'Complete Atelier Set',
    tag: 'Luxury Box',
    tagVariant: 'pink',
    scentNotes: ['3 Scent Votives', 'Brass Snuffer', 'Wick Trimmer', 'Gift Bag'],
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1000&q=85',
    itemCount: 7,
  },
];

type CategoryFilter = 'all' | 'royal' | 'botanical' | 'gourmand' | 'diffusers' | 'gift-sets';

const filterTabs: { id: CategoryFilter; label: string; count: number }[] = [
  { id: 'all', label: 'All Collections', count: 6 },
  { id: 'royal', label: 'Royal Heritage', count: 1 },
  { id: 'botanical', label: 'Botanical Sanctuary', count: 1 },
  { id: 'gourmand', label: 'Warm Amber & Gourmand', count: 2 },
  { id: 'diffusers', label: 'Flame-Free Diffusers', count: 1 },
  { id: 'gift-sets', label: 'Artisan Gift Sets', count: 1 },
];

export interface ExploreCollectionsProps {
  onNavigateToShop?: (collectionId?: string) => void;
}

export const ExploreCollections: React.FC<ExploreCollectionsProps> = ({ onNavigateToShop }) => {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filteredCollections = activeFilter === 'all'
    ? collectionsData
    : collectionsData.filter((col) => col.category === activeFilter);

  const handleCollectionClick = (colId: string) => {
    if (onNavigateToShop) {
      onNavigateToShop(colId);
    } else {
      window.location.hash = '#collections';
    }
  };

  return (
    <section id="collections-section" className="py-16 sm:py-24 bg-[#F8F6F0] border-b border-[#EADDCB] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 border-b border-[#EADDCB] pb-6">
          <div className="space-y-2">
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>
              EXCLUSIVE CURATIONS
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#232323] tracking-tight">
              Explore Our Signature Collections
            </h2>
            <p className="text-xs sm:text-sm text-[#5C5149] max-w-2xl leading-relaxed">
              Every collection tells a unique aromatic story. Hand-poured with specialized vessel finishes, bespoke wax blends, and custom double-wick profiles.
            </p>
          </div>

          {/* Quick Action Button */}
          <button
            onClick={() => handleCollectionClick('all')}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#232323] hover:text-[#8B6F4E] transition-colors cursor-pointer group shrink-0"
          >
            <span>View Full Catalog</span>
            <ChevronRightIcon size={14} className="group-hover:translate-x-1 transition-transform text-[#8B6F4E]" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer border flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#232323] text-[#FFFFFF] border-[#232323] shadow-sm scale-105'
                    : 'bg-[#FFFFFF] text-[#5C5149] border-[#EADDCB] hover:bg-[#EADDCB] hover:text-[#232323]'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-[#8B6F4E] text-white' : 'bg-[#FAF7F2] text-[#7D6F63]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Curated Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredCollections.map((col) => (
            <Card
              key={col.id}
              variant="bordered"
              padding="none"
              onClick={() => handleCollectionClick(col.id)}
              className="group cursor-pointer flex flex-col justify-between bg-[#FFFFFF] rounded-3xl overflow-hidden border border-[#EADDCB] hover:border-[#8B6F4E] transition-all duration-400 hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(139,111,78,0.14)] relative"
            >
              {/* Card Image Cover with Subtle Zoom & Gradient Mask */}
              <div className="relative h-64 sm:h-72 overflow-hidden bg-[#232323]">
                <img
                  src={col.image}
                  alt={col.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out brightness-[0.92] group-hover:brightness-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#FFFFFF] via-black/20 to-black/30" />

                {/* Top Floating Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <span className="bg-[#FFFFFF]/90 backdrop-blur-md text-[#232323] text-[11px] font-bold px-3 py-1 rounded-full border border-[#EADDCB] shadow-subtle flex items-center gap-1.5">
                    <CandleIcon size={12} className="text-[#8B6F4E]" />
                    {col.itemCount} Fragrances
                  </span>
                  <Badge variant={col.tagVariant || 'gold'} size="sm">
                    {col.tag}
                  </Badge>
                </div>

                {/* Bottom Overlay Notes Preview */}
                <div className="absolute bottom-3 left-4 right-4 flex flex-wrap gap-1.5 pointer-events-none">
                  {col.scentNotes.slice(0, 3).map((note, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-[#232323]/85 backdrop-blur-sm text-[#FAF7F2] border border-[#EADDCB]/30 px-2 py-0.5 rounded-full"
                    >
                      {note}
                    </span>
                  ))}
                  {col.scentNotes.length > 3 && (
                    <span className="text-[10px] font-semibold bg-[#232323]/85 backdrop-blur-sm text-[#EADDCB] px-2 py-0.5 rounded-full">
                      +{col.scentNotes.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-[#7D6F63]">
                    <span className="font-serif italic text-xs text-[#8B6F4E] font-semibold">
                      {col.subtitle}
                    </span>
                    <span className="font-bold text-[#232323] bg-[#FAF7F2] px-2.5 py-0.5 rounded-full border border-[#EADDCB]">
                      {col.price}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#232323] group-hover:text-[#8B6F4E] transition-colors leading-tight">
                    {col.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[#5C5149] leading-relaxed line-clamp-2">
                    {col.description}
                  </p>
                </div>

                {/* Vessel & Burn Time Specifications */}
                <div className="pt-3 border-t border-[#EADDCB] grid grid-cols-2 gap-2 text-[11px] text-[#5C5149]">
                  <div className="flex items-center gap-1.5 truncate">
                    <CandleIcon size={13} className="text-[#8B6F4E] shrink-0" />
                    <span className="truncate">{col.burnTime}</span>
                  </div>
                  <div className="flex items-center gap-1.5 truncate justify-end">
                    <span className="text-[#7D6F63]">{col.vessel}</span>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-2 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-[#8B6F4E] group-hover:underline flex items-center gap-1">
                    Discover Collection →
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Atelier Quality Assurance Pill Strip */}
        <div className="p-4 sm:p-6 bg-[#FAF7F2] rounded-3xl border border-[#EADDCB] grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-0.5">
            <span className="text-xs sm:text-sm font-serif font-bold text-[#232323] block">100% Organic Soy</span>
            <span className="text-[10px] text-[#7D6F63]">Clean, non-toxic burn</span>
          </div>
          <div className="space-y-0.5 border-l border-[#EADDCB]">
            <span className="text-xs sm:text-sm font-serif font-bold text-[#232323] block">Crackling Wood Wicks</span>
            <span className="text-[10px] text-[#7D6F63]">FSC-certified natural wood</span>
          </div>
          <div className="space-y-0.5 border-l border-[#EADDCB]">
            <span className="text-xs sm:text-sm font-serif font-bold text-[#232323] block">IFRA Certified Oils</span>
            <span className="text-[10px] text-[#7D6F63]">Pure botanical essences</span>
          </div>
          <div className="space-y-0.5 border-l border-[#EADDCB]">
            <span className="text-xs sm:text-sm font-serif font-bold text-[#232323] block">Small-Batch Hand Poured</span>
            <span className="text-[10px] text-[#7D6F63]">Poured with care in Delhi</span>
          </div>
        </div>
      </div>
    </section>
  );
};
