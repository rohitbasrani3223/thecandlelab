import React from 'react';
import { Card, Button, Badge, StarIcon, SparklesIcon, useToast } from '../../design-system';

const relatedItems = [
  {
    id: 'rel-1',
    name: 'French Bourbon Vanilla Bean',
    subtitle: 'Warm Vanilla Series',
    price: '$94.00',
    rating: 4.95,
    tag: 'Best Seller',
  },
  {
    id: 'rel-2',
    name: 'Mysore Sandalwood & Cedar',
    subtitle: 'Woody Oud Series',
    price: '$42.00',
    rating: 4.85,
    tag: 'Limited',
  },
  {
    id: 'rel-3',
    name: 'Bergamot & White Jasmine Bloom',
    subtitle: 'Floral Citrus Series',
    price: '$68.00',
    rating: 4.88,
    tag: 'Calming',
  },
];

export const RelatedProducts: React.FC = () => {
  const { toast } = useToast();

  return (
    <section className="space-y-8 font-sans border-t border-[#E5D9C5] pt-12">
      <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block">Complimentary Aromatics</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A1E17]">
            You May Also Savor
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {relatedItems.map((prod) => (
          <Card
            key={prod.id}
            variant="bordered"
            padding="none"
            className="bg-[#FAF6F0] group flex flex-col justify-between overflow-hidden hover:shadow-hover transition-all duration-300"
          >
            <div className="h-48 bg-[#2A1E17] flex items-center justify-center relative overflow-hidden">
              <div className="text-5xl group-hover:scale-110 transition-transform">🕯️</div>
              <div className="absolute top-2 left-2">
                <Badge variant="gold" size="sm" icon={<SparklesIcon size={10} />}>{prod.tag}</Badge>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8C7A6B] font-medium">{prod.subtitle}</span>
                <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
                  <StarIcon size={12} className="fill-current text-[#D4AF37]" />
                  <span>{prod.rating}</span>
                </div>
              </div>

              <h3 className="text-sm font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors truncate">
                {prod.name}
              </h3>

              <div className="pt-2 border-t border-[#E5D9C5] flex items-center justify-between">
                <span className="text-sm font-bold text-[#2A1E17]">{prod.price}</span>
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => toast({ type: 'luxury', title: 'Added to Bag', description: prod.name })}
                >
                  Add to Bag
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};
