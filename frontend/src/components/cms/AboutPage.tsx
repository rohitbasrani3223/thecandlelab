import React from 'react';
import { Badge, SparklesIcon, Button, Card } from '../../design-system';

export interface AboutPageProps {
  onNavigateToShop?: () => void;
  onNavigateToContact?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateToShop, onNavigateToContact }) => {
  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans">
      {/* 1. Hero Header */}
      <section className="bg-[#3D2B1F] text-[#FAF6F0] py-20 sm:py-28 px-6 sm:px-12 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>OUR HERITAGE & ATELIER</Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#FAF6F0]">
            Crafted to Glow, Formulated to Inspire
          </h1>
          <p className="text-sm sm:text-base text-[#EFE8DB] font-light max-w-2xl mx-auto leading-relaxed">
            The Candle Lab was born out of a passion for olfactory architecture, sustainable hand-pouring, and transforming everyday living spaces into serene sensory sanctuaries.
          </p>
        </div>
      </section>

      {/* 2. Brand Story & Craftsmanship */}
      <section className="max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-widest text-[#B88B38] block">
              THE ARTISANAL PROCESS
            </span>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#2C1E16] leading-tight">
              100% Pure Botanical Soy & Ethically Harvested Beeswax
            </h2>
            <p className="text-sm text-[#7A6B5D] font-light leading-relaxed">
              Every single candle in our atelier is hand-poured in small 50-unit batches. We strictly reject paraffin wax, synthetic phthalates, and toxic lead wicks. Instead, we use 100% renewable botanical soy wax infused with pure IFRA-certified fragrance oils and crackling organic wood wicks.
            </p>
            <p className="text-sm text-[#7A6B5D] font-light leading-relaxed">
              From Italian heavy-weight glass jars to hand-stamped gold foil labels, our master artisans ensure that each flame delivers a clean, soot-free burn lasting up to 80 hours.
            </p>
            <div className="pt-2">
              <Button
                variant="gold"
                size="lg"
                className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold"
                onClick={onNavigateToShop}
              >
                Explore Artisanal Catalog →
              </Button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-card border border-[#EFE8DB] bg-[#F8F3EA] aspect-4/3">
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
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-[#2C1E16]">
              Our Guiding Principles
            </h3>
            <p className="text-xs sm:text-sm text-[#7A6B5D]">
              Uncompromising quality, environmental stewardship, and timeless design.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card variant="bordered" padding="lg" className="bg-white border-[#EFE8DB] rounded-2xl space-y-3">
              <span className="text-3xl">🌿</span>
              <h4 className="font-serif font-bold text-lg text-[#2C1E16]">Sustainable & Toxic-Free</h4>
              <p className="text-xs text-[#7A6B5D] font-light leading-relaxed">
                Zero paraffin, zero phthalates, zero parabens. Clean air formulations safe for pets and children.
              </p>
            </Card>

            <Card variant="bordered" padding="lg" className="bg-white border-[#EFE8DB] rounded-2xl space-y-3">
              <span className="text-3xl">🪵</span>
              <h4 className="font-serif font-bold text-lg text-[#2C1E16]">FSC Wood Wicks</h4>
              <p className="text-xs text-[#7A6B5D] font-light leading-relaxed">
                Sourced from sustainably managed forests, providing an gentle crackling sound reminiscent of a cozy fireplace.
              </p>
            </Card>

            <Card variant="bordered" padding="lg" className="bg-white border-[#EFE8DB] rounded-2xl space-y-3">
              <span className="text-3xl">✨</span>
              <h4 className="font-serif font-bold text-lg text-[#2C1E16]">Hand-Poured in India</h4>
              <p className="text-xs text-[#7A6B5D] font-light leading-relaxed">
                Formulated by master perfumers in Mumbai & New Delhi ateliers with international fragrance standards.
              </p>
            </Card>
          </div>
        </div>

        {/* 4. Founder Note */}
        <div className="bg-[#3D2B1F] text-[#FAF6F0] rounded-2xl p-8 sm:p-12 shadow-card border border-[#523A2B] text-center max-w-4xl mx-auto space-y-6">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">A LETTER FROM OUR FOUNDER</span>
          <h3 className="text-2xl sm:text-4xl font-serif font-bold italic text-[#EFE8DB]">
            "A candle is more than wax and wick; it is a ritual of returning home to yourself."
          </h3>
          <div className="pt-2">
            <h5 className="font-bold text-base text-[#FAF6F0]">Aarav & Elena Rostova</h5>
            <span className="text-xs text-[#B88B38]">Co-Founders & Olfactory Directors</span>
          </div>
          <div className="pt-4">
            <Button variant="outline" size="sm" onClick={onNavigateToContact} className="border-[#B88B38] text-[#B88B38] hover:bg-[#B88B38] hover:text-white">
              Get in Touch with Our Studio →
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
