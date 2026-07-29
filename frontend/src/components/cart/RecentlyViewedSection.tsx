import React from 'react';
import { Card, Button, StarIcon, useToast } from '../../design-system';

const recentItems = [
  { id: 'rv-1', name: 'Velvet Rose & Smoked Amber', price: '$78.00', rating: 4.95 },
  { id: 'rv-2', name: 'French Bourbon Vanilla Bean', price: '$94.00', rating: 4.94 },
  { id: 'rv-3', name: 'Mysore Sandalwood & Cedar', price: '$42.00', rating: 4.85 },
];

export const RecentlyViewedSection: React.FC = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-4 pt-8 border-t border-[#E5D9C5] font-sans">
      <h3 className="font-serif font-bold text-lg text-[#2A1E17]">
        Recently Viewed Formulations
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recentItems.map((item) => (
          <Card key={item.id} variant="bordered" padding="md" className="bg-[#FAF6F0] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-[#D4AF37] font-bold">
                <StarIcon size={12} className="fill-current text-[#D4AF37]" />
                <span>{item.rating}</span>
              </div>
              <span className="font-bold text-[#2A1E17]">{item.price}</span>
            </div>

            <h5 className="font-serif font-bold text-xs text-[#2A1E17] truncate">{item.name}</h5>

            <Button
              variant="gold"
              size="sm"
              fullWidth
              onClick={() => toast({ type: 'luxury', title: 'Added to Bag', description: item.name })}
            >
              Add to Bag
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
