import React from 'react';
import { Card, Button, Badge, StarIcon, useToast } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

export const NewArrivalsTrending: React.FC = () => {
  const { toast } = useToast();
  const { products, settings } = useCMS();

  // Filter products marked as isNew or isTrending
  const items = (products.filter((p) => p.isNew).length > 0
    ? products.filter((p) => p.isNew)
    : products.filter((p) => p.rating >= 4.85)
  ).slice(0, 3);

  return (
    <section className="py-16 sm:py-24 bg-[#F4EFE6] border-b border-[#E5D9C5] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#E5D9C5] pb-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block mb-1">
              Fresh From Our Studio
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2A1E17]">
              New Arrivals & Trending
            </h2>
          </div>
          <span className="text-xs font-semibold text-[#8C7A6B]">
            Poured in small limited batches weekly.
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, idx) => {
            const formattedPrice = `${settings.currencySymbol}${item.price}`;
            const badgeText = item.isNew ? 'NEW BATCH' : 'TRENDING';

            return (
              <Card
                key={item.id}
                variant="bordered"
                padding="lg"
                className="bg-[#FAF6F0] group flex flex-col justify-between hover:shadow-card transition-all"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="gold" size="sm">{badgeText}</Badge>
                    <span className="text-[11px] font-mono text-[#8C7A6B]">Limited Batch</span>
                  </div>

                  {/* Visual Image Header */}
                  <div className="h-48 bg-[#FAF6F0] rounded-sm flex items-center justify-center relative overflow-hidden">
                    <img
                      src={item.image || item.imageUrl || [
                        'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=800&q=80',
                        'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80'
                      ][idx % 3]}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#1C130E]/80 text-[#D4AF37] px-2 py-1 rounded-xs text-[10px] font-bold z-10 backdrop-blur-xs">
                      <StarIcon size={12} className="fill-current text-[#D4AF37]" />
                      <span>{item.rating || 4.9}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-lg font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-[#8C7A6B]">{item.vesselDescription || item.category}</p>
                    <p className="text-xs text-[#69574A] italic font-accent-luxury">
                      Notes: {item.topNotes || 'Bergamot'}, {item.heartNotes || 'Rose'}, {item.baseNotes || 'Amber'}
                    </p>
                  </div>

                  {/* Scent Intensity Scale */}
                  <div className="pt-2 flex items-center justify-between text-xs text-[#8C7A6B]">
                    <span>Scent Intensity:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <span
                          key={level}
                          className={`w-2.5 h-2.5 rounded-full ${level <= 4 ? 'bg-[#D4AF37]' : 'bg-[#E5D9C5]'}`}
                          title={`Intensity ${level} of 5`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E5D9C5] flex items-center justify-between mt-6">
                  <span className="text-base font-bold text-[#2A1E17]">{formattedPrice}</span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => toast({ type: 'luxury', title: 'Added to Cart', description: item.name })}
                  >
                    Quick Buy
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};
