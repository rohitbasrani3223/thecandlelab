import { Card, Button, Badge, StarIcon, useToast } from '../../design-system';


const newArrivals = [
  {
    id: 'na-1',
    name: 'Midnight Fig & Honeyed Amber',
    vessel: 'Matte Obsidian Jar (12 oz)',
    price: '$74.00',
    intensity: 4,
    rating: 5.0,
    reviews: 24,
    badge: 'NEW BATCH',
    batchNo: 'Batch #18',
    notes: 'Wild Fig, Honey, Dark Cedar',
  },
  {
    id: 'na-2',
    name: 'Santorini Cypress & Salted Sage',
    vessel: 'Frosted Seafoam Vessel (14 oz)',
    price: '$82.00',
    intensity: 3,
    rating: 4.92,
    reviews: 18,
    badge: 'NEW FORMULA',
    batchNo: 'Batch #19',
    notes: 'Coastal Cypress, Sage, Salt Air',
  },
  {
    id: 'na-3',
    name: 'Spiced Cardamom & Smoked Clove',
    vessel: 'Botanical Travel Brass Tin',
    price: '$46.00',
    intensity: 5,
    rating: 4.88,
    reviews: 32,
    badge: 'TRENDING',
    batchNo: 'Batch #16',
    notes: 'Cardamom, Clove, Cinnamon Bark',
  },
];

export const NewArrivalsTrending: React.FC = () => {
  const { toast } = useToast();

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
          {newArrivals.map((item) => (
            <Card
              key={item.id}
              variant="bordered"
              padding="lg"
              className="bg-[#FAF6F0] group flex flex-col justify-between hover:shadow-card transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="gold" size="sm">{item.badge}</Badge>
                  <span className="text-[11px] font-mono text-[#8C7A6B]">{item.batchNo}</span>
                </div>

                {/* Visual Icon Header */}
                <div className="h-40 bg-[#2A1E17] rounded-sm flex items-center justify-center relative overflow-hidden">
                  <div className="text-5xl group-hover:scale-110 transition-transform">🕯️</div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-[#1C130E]/80 text-[#D4AF37] px-2 py-1 rounded-xs text-[10px] font-bold">
                    <StarIcon size={12} className="fill-current text-[#D4AF37]" />
                    <span>{item.rating}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#8C7A6B]">{item.vessel}</p>
                  <p className="text-xs text-[#69574A] italic font-accent-luxury">
                    Notes: {item.notes}
                  </p>
                </div>

                {/* Scent Intensity Scale */}
                <div className="pt-2 flex items-center justify-between text-xs text-[#8C7A6B]">
                  <span>Scent Intensity:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <span
                        key={level}
                        className={`w-2.5 h-2.5 rounded-full ${level <= item.intensity ? 'bg-[#D4AF37]' : 'bg-[#E5D9C5]'}`}
                        title={`Intensity ${level} of 5`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5D9C5] flex items-center justify-between mt-6">
                <span className="text-base font-bold text-[#2A1E17]">{item.price}</span>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => toast({ type: 'luxury', title: 'Added to Cart', description: item.name })}
                >
                  Quick Buy
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
