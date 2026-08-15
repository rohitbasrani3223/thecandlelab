import React from 'react';
import { Badge, SparklesIcon, Button, Card } from '../../design-system';

export interface AboutPageProps {
  onNavigateToShop?: () => void;
  onNavigateToContact?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToShop, onNavigateToContact: _onNavigateToContact }) => {
  return (
    <div className="w-full bg-[#FAF6F8] min-h-screen font-sans">
      {/* 1. Hero Header */}
      <section className="bg-white text-[#1C1217] py-20 sm:py-28 px-6 sm:px-12 text-center relative overflow-hidden border-b border-[#F5E8EE]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F9B8CA]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>OUR HERITAGE & ATELIER</Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#1C1217]">
            Crafted to Glow, Formulated to Inspire
          </h1>
          <p className="text-sm sm:text-base text-[#624855] font-light max-w-2xl mx-auto leading-relaxed">
            The Candle Lab was born out of a passion for olfactory architecture, sustainable hand-pouring, and transforming everyday living spaces into serene sensory sanctuaries.
          </p>
        </div>
      </section>

      {/* 2. Brand Story & Craftsmanship */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E87A96] block">
              THE ARTISANAL PROCESS
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1217] leading-tight">
              100% Pure Botanical Soy & Ethically Harvested Beeswax
            </h2>
            <p className="text-sm text-[#624855] font-light leading-relaxed">
              Every single candle in our atelier is hand-poured in small 50-unit batches. We strictly reject paraffin wax, synthetic phthalates, and toxic lead wicks. Instead, we use 100% renewable botanical soy wax infused with pure IFRA-certified fragrance oils and crackling organic wood wicks.
            </p>
            <p className="text-sm text-[#624855] font-light leading-relaxed">
              From Italian heavy-weight glass jars to hand-stamped rose gold foil labels, our master artisans ensure that each flame delivers a clean, soot-free burn lasting up to 80 hours.
            </p>
            <div className="pt-2">
              <Button
                variant="pink"
                size="lg"
                onClick={onNavigateToShop}
              >
                Explore Artisanal Catalog →
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-card border border-[#F5E8EE] bg-[#FFF6F8] aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1000&auto=format&fit=crop&q=80"
                alt="Atelier Hand-Pouring"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* 3. Core Values Grid */}
        <div className="space-y-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-[#1C1217]">
              Our Guiding Principles
            </h3>
            <p className="text-xs sm:text-sm text-[#886C7B]">
              Uncompromising quality, environmental stewardship, and timeless design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="bordered" padding="lg" className="bg-white border-[#F5E8EE] rounded-3xl space-y-3 shadow-xs">
              <span className="text-3xl">🌿</span>
              <h4 className="font-serif font-bold text-lg text-[#1C1217]">Sustainable & Toxic-Free</h4>
              <p className="text-xs text-[#624855] font-light leading-relaxed">
                Zero paraffin, zero phthalates, zero parabens. Clean air formulations safe for pets and children.
              </p>
            </Card>

            <Card variant="bordered" padding="lg" className="bg-white border-[#F5E8EE] rounded-3xl space-y-3 shadow-xs">
              <span className="text-3xl">🪵</span>
              <h4 className="font-serif font-bold text-lg text-[#1C1217]">FSC Wood Wicks</h4>
              <p className="text-xs text-[#624855] font-light leading-relaxed">
                Sourced from sustainably managed forests, providing a gentle crackling sound reminiscent of a cozy fireplace.
              </p>
            </Card>

            <Card variant="bordered" padding="lg" className="bg-white border-[#F5E8EE] rounded-3xl space-y-3 shadow-xs">
              <span className="text-3xl">✨</span>
              <h4 className="font-serif font-bold text-lg text-[#1C1217]">Hand-Poured in India</h4>
              <p className="text-xs text-[#624855] font-light leading-relaxed">
                Formulated by master perfumers in Mumbai & New Delhi ateliers with international fragrance standards.
              </p>
            </Card>
          </div>
        </div>

        {/* 4. Atelier Statistics Counter */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#F5E8EE] shadow-card grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-serif font-bold text-[#E87A96]">50,000+</div>
            <span className="text-xs text-[#886C7B] uppercase tracking-wider font-semibold">Candles Hand-Poured</span>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-serif font-bold text-[#E87A96]">100%</div>
            <span className="text-xs text-[#886C7B] uppercase tracking-wider font-semibold">Pure Botanical Soy</span>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-serif font-bold text-[#E87A96]">4.95 ★</div>
            <span className="text-xs text-[#886C7B] uppercase tracking-wider font-semibold">Average Rating</span>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-5xl font-serif font-bold text-[#E87A96]">28+</div>
            <span className="text-xs text-[#886C7B] uppercase tracking-wider font-semibold">Artisan Formulations</span>
          </div>
        </div>
      </section>
    </div>
  );
};
