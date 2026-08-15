import React from 'react';
import { Card, Badge, SparklesIcon, Button } from '../../design-system';

const occasions = [
  {
    id: 'self-care',
    title: 'Self-Care Rituals',
    subtitle: 'Unwind & de-stress with essential aromatherapy',
    scent: 'Lavender & White Sage',
    tag: 'Daily Ritual',
  },
  {
    id: 'dinner',
    title: 'Intimate Dinners',
    subtitle: 'Subtle ambient flicker for dining spaces',
    scent: 'Bourbon Vanilla & Amber',
    tag: 'Ambient',
  },
  {
    id: 'gifting',
    title: 'Luxury Housewarming',
    subtitle: 'Bespoke gift boxes with wood wick trimmers',
    scent: 'Smoked Oud & Damask Rose',
    tag: 'Gift Favorite',
  },
  {
    id: 'festive',
    title: 'Festive Celebrations',
    tag: 'Limited Drop',
    subtitle: 'Numbered 24K gold foil reserve vessels',
    scent: 'Cinnamon Bark & Clove',
  },
];

export interface ShopByOccasionProps {
  onSelectOccasion?: (id: string) => void;
}

export const ShopByOccasion: React.FC<ShopByOccasionProps> = ({ onSelectOccasion }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#F5E8EE] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[#F5E8EE] pb-6">
          <div>
            <Badge variant="pink" icon={<SparklesIcon size={12} />}>MOMENTS & GATHERINGS</Badge>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1217] mt-2">
              Shop by Special Occasion
            </h2>
          </div>
          <p className="text-xs text-[#886C7B] max-w-xs">
            Handcrafted candle formulations matched to life’s cherished moments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {occasions.map((occ) => (
            <Card
              key={occ.id}
              variant="bordered"
              padding="lg"
              className="bg-[#FFFFFF] rounded-3xl group cursor-pointer flex flex-col justify-between h-72 border-[#F5E8EE] hover:border-[#F9B8CA] hover:shadow-card transition-all"
              onClick={() => onSelectOccasion?.(occ.id)}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="pink" size="sm">{occ.tag}</Badge>
                  <span className="text-[10px] text-[#886C7B] uppercase font-mono">Curated Pairings</span>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#1C1217] group-hover:text-[#E87A96] transition-colors">
                  {occ.title}
                </h3>

                <p className="text-xs text-[#624855] leading-relaxed font-light">
                  {occ.subtitle}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F5E8EE] space-y-3">
                <div className="text-[11px] text-[#E87A96] font-semibold">Matched Note: {occ.scent}</div>
                <Button variant="outline" size="sm" fullWidth>
                  Explore Occasion →
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
