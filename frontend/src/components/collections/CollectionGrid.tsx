import React from 'react';
import { StarIcon } from '../../design-system';

const collectionGridItems = [
  {
    id: 'cg-1',
    name: 'Velvet Rose & Smoked Amber',
    collection: 'scented',
    vessel: 'Scented Candles Collection',
    price: 1499,
    originalPrice: 1799,
    rating: 4.95,
    tag: 'Scented Candles',
    notes: 'Bergamot, Damask Rose, Smoked Oud',
  },
  {
    id: 'cg-2',
    name: 'Damask Rose & Velvet Musk',
    collection: 'floral',
    vessel: 'Floral Collection',
    price: 1399,
    originalPrice: 1699,
    rating: 4.91,
    tag: 'Floral Collection',
    notes: 'Pink Peppercorn, Damask Rose, Musk',
  },
  {
    id: 'cg-3',
    name: 'French Bourbon Vanilla Bean',
    collection: 'vanilla',
    vessel: 'Vanilla Collection',
    price: 1499,
    originalPrice: 1899,
    rating: 4.94,
    tag: 'Vanilla Collection',
    notes: 'Crushed Tonka, Bourbon Vanilla Pod',
  },
  {
    id: 'cg-4',
    name: 'Roasted Arabica Espresso Candle',
    collection: 'coffee',
    vessel: 'Coffee Collection',
    price: 1299,
    originalPrice: 1599,
    rating: 4.89,
    tag: 'Coffee Collection',
    notes: 'Roasted Arabica, Dark Cacao, Hazelnut',
  },
  {
    id: 'cg-5',
    name: 'Spiced Cinnamon & Winter Pine',
    collection: 'festive',
    vessel: 'Festive Collection',
    price: 1599,
    originalPrice: 1899,
    rating: 4.93,
    tag: 'Festive Collection',
    notes: 'Ceylon Cinnamon, Glowing Amber, Pine',
  },
  {
    id: 'cg-6',
    name: 'The Atelier Royal Gift Set',
    collection: 'gifts',
    vessel: 'Gift Boxes Collection',
    price: 3499,
    originalPrice: 3999,
    rating: 4.98,
    tag: 'Gift Boxes',
    notes: '3 Signature Candles + Brass Trimmer',
  },
  {
    id: 'cg-7',
    name: 'Italian Frosted Glass Oud Jar',
    collection: 'jars',
    vessel: 'Luxury Glass Jars',
    price: 1699,
    originalPrice: 1999,
    rating: 4.97,
    tag: 'Luxury Jars',
    notes: 'Heavy Frosted Glass, Smoked Leather',
  },
  {
    id: 'cg-8',
    name: 'Lavender & Wild Mint Wax Melts',
    collection: 'melts',
    vessel: 'Wax Melts Collection',
    price: 699,
    originalPrice: 899,
    rating: 4.86,
    tag: 'Wax Melts',
    notes: 'Flame-Free Ambient Lavender & Mint',
  },
];

export interface CollectionGridProps {
  activeTab: string;
}

export const CollectionGrid: React.FC<CollectionGridProps> = ({ activeTab }) => {
  const filteredItems = activeTab === 'all'
    ? collectionGridItems
    : collectionGridItems.filter((item) => item.collection === activeTab);

  const handleProductClick = () => {
    window.location.hash = '#pdp';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
      {filteredItems.map((prod) => {
        const discount = prod.originalPrice - prod.price;

        return (
          <div
            key={prod.id}
            onClick={handleProductClick}
            className="group bg-white border border-[#EFE8DB] rounded-2xl overflow-hidden shadow-subtle hover:shadow-hover hover:border-[#B88B38] transition-all duration-300 flex flex-col justify-between cursor-pointer"
          >
            {/* Top Vessel Media Container */}
            <div className="relative h-56 bg-[#F8F3EA] flex items-center justify-center p-6 overflow-hidden rounded-t-2xl">
              {/* Discount Badge */}
              <div className="absolute top-3 left-3 z-10">
                <span className="bg-[#B93829] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                  SAVE ₹{discount}
                </span>
              </div>

              {/* Tag Badge */}
              <div className="absolute top-3 right-3 z-10">
                <span className="bg-[#B88B38] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                  {prod.tag}
                </span>
              </div>

              {/* Center Emblem Icon */}
              <div className="w-16 h-16 rounded-full bg-white shadow-card flex items-center justify-center border border-[#EFE8DB] group-hover:scale-110 transition-transform duration-500 text-[#B88B38]">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m-9-9h18" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2a4 4 0 014 4c0 2.5-4 6-4 6s-4-3.5-4-6a4 4 0 014-4z" />
                </svg>
              </div>
            </div>

            {/* Lower Content */}
            <div className="p-5 space-y-2.5 flex-1 flex flex-col justify-between bg-white">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B88B38] block">
                  {prod.vessel}
                </span>

                <h3 className="text-base font-serif font-bold text-[#2C1E16] group-hover:text-[#B88B38] transition-colors leading-snug truncate">
                  {prod.name}
                </h3>

                <p className="text-xs text-[#7A6B5D] italic truncate">
                  Notes: {prod.notes}
                </p>

                {/* Rating */}
                <div className="flex items-center gap-1 text-xs text-[#B88B38] font-bold pt-1">
                  <div className="flex text-[#B88B38]">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} size={14} className="fill-current text-[#B88B38]" />
                    ))}
                  </div>
                  <span className="ml-1 text-[#2C1E16]">{prod.rating}</span>
                </div>
              </div>

              {/* Price & Add to Cart Button */}
              <div className="pt-3 border-t border-[#F2ECE1] space-y-3">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xs text-[#8C7A6B] line-through">₹{prod.originalPrice}</span>
                    <span className="text-base font-bold text-[#2C1E16]">₹{prod.price}</span>
                  </div>
                  <span className="text-[10px] text-[#2E6F40] font-bold">✓ In Stock</span>
                </div>

                <button
                  onClick={handleProductClick}
                  className="w-full bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
                >
                  <span>View Product Details →</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
