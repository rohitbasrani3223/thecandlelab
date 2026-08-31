import React from 'react';
import { Card, Button, Badge, StarIcon, SparklesIcon, useToast } from '../../design-system';

const relatedItems = [
  {
    id: 'rel-1',
    name: 'French Bourbon Vanilla Bean',
    subtitle: 'Warm Vanilla Series',
    price: '₹1,299',
    rating: 4.95,
    tag: 'Best Seller',
  },
  {
    id: 'rel-2',
    name: 'Mysore Sandalwood & Cedar',
    subtitle: 'Woody Oud Series',
    price: '₹899',
    rating: 4.85,
    tag: 'Limited',
  },
  {
    id: 'rel-3',
    name: 'Bergamot & White Jasmine Bloom',
    subtitle: 'Floral Citrus Series',
    price: '₹1,099',
    rating: 4.88,
    tag: 'Calming',
  },
];

export const RelatedProducts: React.FC = () => {
  const { toast } = useToast();

  return (
    <section className="space-y-8 font-sans border-t border-[#EADDCB] pt-12">
      <div className="flex items-center justify-between border-b border-[#EADDCB] pb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#8B6F4E] block">Complimentary Aromatics</span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#232323]">
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
            className="bg-[#FFFFFF] border-[#EADDCB] rounded-3xl group flex flex-col justify-between overflow-hidden hover:shadow-card hover:border-[#EADDCB] transition-all duration-300"
          >
            <div className="h-48 bg-[#FAF7F2] flex items-center justify-center relative overflow-hidden">
              <div className="text-5xl group-hover:scale-110 transition-transform">🕯️</div>
              <div className="absolute top-3 left-3">
                <Badge variant="pink" size="sm" icon={<SparklesIcon size={10} />}>{prod.tag}</Badge>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#7D6F63] font-medium">{prod.subtitle}</span>
                <div className="flex items-center gap-1 text-[#E8C86D] font-bold">
                  <StarIcon size={12} className="fill-current text-[#E8C86D]" />
                  <span>{prod.rating}</span>
                </div>
              </div>

              <h3 className="text-sm font-serif font-bold text-[#232323] group-hover:text-[#8B6F4E] transition-colors truncate">
                {prod.name}
              </h3>

              <div className="pt-2 border-t border-[#EADDCB] flex items-center justify-between">
                <span className="text-sm font-bold text-[#232323]">{prod.price}</span>
                <Button
                  variant="pink"
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
