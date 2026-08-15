import React from 'react';
import { Card, Button, StarIcon, useToast } from '../../design-system';

const recentItems = [
  { id: 'rv-1', name: 'Velvet Rose & Smoked Amber', price: '₹1,499', rating: 4.95 },
  { id: 'rv-2', name: 'French Bourbon Vanilla Bean', price: '₹1,299', rating: 4.94 },
  { id: 'rv-3', name: 'Mysore Sandalwood & Cedar', price: '₹899', rating: 4.85 },
];

export const RecentlyViewedSection: React.FC = () => {
  const { toast } = useToast();

  return (
    <div className="space-y-4 pt-8 border-t border-[#F5E8EE] font-sans">
      <h3 className="font-serif font-bold text-lg text-[#1C1217]">
        Recently Viewed Formulations
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recentItems.map((item) => (
          <Card key={item.id} variant="bordered" padding="md" className="bg-[#FFFFFF] border-[#F5E8EE] rounded-2xl space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-[#E8C86D] font-bold">
                <StarIcon size={12} className="fill-current text-[#E8C86D]" />
                <span>{item.rating}</span>
              </div>
              <span className="font-bold text-[#1C1217]">{item.price}</span>
            </div>

            <h5 className="font-serif font-bold text-xs text-[#1C1217] truncate">{item.name}</h5>

            <Button
              variant="pink"
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
