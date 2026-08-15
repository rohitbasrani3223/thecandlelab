import { useState } from 'react';
import { Badge, SparklesIcon, ChevronDownIcon } from '../../design-system';

const careTips = [
  {
    id: 'tip-1',
    title: 'The First Burn Wax Memory',
    content: 'Allow the candle to burn for 2-3 hours during its initial lighting until the liquid wax melt pool reaches the outer glass rim. This prevents tunnelling and ensures an even, full burn for the lifespan of your vessel.',
  },
  {
    id: 'tip-2',
    title: 'Trimming Your Wood & Cotton Wick',
    content: 'Always trim the wick to 1/4 inch (6mm) before every relighting. Trimming removes char, prevents excess smoke or soot, and produces a clean, dancing gold flame.',
  },
  {
    id: 'tip-3',
    title: 'Draft Prevention & Airflow',
    content: 'Keep burning candles away from drafty windows, air vents, or ceiling fans. Steady airflow causes uneven burning and reduces the throw strength of botanical essential oils.',
  },
  {
    id: 'tip-4',
    title: 'Proper Storage & Lid Care',
    content: 'Store your candles in a cool, dark place away from direct sunlight to preserve the integrity of natural soy wax and essential oil aromatics. Always extinguish with a snuffer.',
  },
];

export const ScentNotesCareSection: React.FC = () => {
  const [openTip, setOpenTip] = useState<string | null>('tip-1');

  return (
    <section id="scent-quiz-section" className="py-16 sm:py-24 bg-[#FFFFFF] border-b border-[#F5E8EE] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        {/* Olfactory Science Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="pink" icon={<SparklesIcon size={12} />}>OLFACTORY CRAFTSMANSHIP</Badge>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1217] leading-tight">
              The Architecture of a Luxury Scent
            </h2>
            <p className="text-sm text-[#624855] leading-relaxed">
              Every candle formulation is composed of three distinct aromatic layers engineered to unfold gradually as the wax pool warms.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 bg-[#FFF6F8] border-l-4 border-[#E87A96] rounded-r-2xl space-y-1 border-y border-r border-[#F5E8EE]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1C1217] block">1. Top Notes (First 15 Mins)</span>
                <p className="text-xs text-[#886C7B]">Light, refreshing citrus and herbal top accords that greet you immediately upon opening the vessel.</p>
              </div>

              <div className="p-4 bg-[#FFF6F8] border-l-4 border-[#F9B8CA] rounded-r-2xl space-y-1 border-y border-r border-[#F5E8EE]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1C1217] block">2. Heart Notes (Main Body)</span>
                <p className="text-xs text-[#886C7B]">Rich florals, spices, and velvety woods that emerge after 30 minutes of melt pool diffusion.</p>
              </div>

              <div className="p-4 bg-[#FFF6F8] border-l-4 border-[#1C1217] rounded-r-2xl space-y-1 border-y border-r border-[#F5E8EE]">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1C1217] block">3. Base Notes (Lingering Atmosphere)</span>
                <p className="text-xs text-[#886C7B]">Deep amber, smoked oud, and vanilla resins that anchor the scent into your room for hours after extinguishing.</p>
              </div>
            </div>
          </div>

          {/* Candle Care Guide Accordion */}
          <div className="lg:col-span-6 bg-gradient-to-br from-[#1C1217] via-[#2C1D25] to-[#140B10] text-[#FFFFFF] p-8 sm:p-10 rounded-3xl border border-[#F9B8CA]/25 shadow-[0_16px_36px_rgba(20,11,16,0.25)] space-y-6">
            <div className="space-y-2 border-b border-[#422D38] pb-4">
              <span className="text-xs uppercase font-bold tracking-widest text-[#F9B8CA]">Artisan Guidance</span>
              <h3 className="text-2xl font-serif font-bold text-[#FFFFFF]">Candle Care & Maintenance</h3>
            </div>

            <div className="space-y-3 text-xs">
              {careTips.map((tip) => (
                <div key={tip.id} className="border-b border-[#422D38]/70 pb-3">
                  <button
                    onClick={() => setOpenTip(openTip === tip.id ? null : tip.id)}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-[#FCD5E2] hover:text-[#FFFFFF] py-1 transition-colors cursor-pointer"
                  >
                    <span>{tip.title}</span>
                    <ChevronDownIcon size={16} className={`transition-transform ${openTip === tip.id ? 'rotate-180 text-[#F9B8CA]' : 'text-[#AC94A1]'}`} />
                  </button>
                  {openTip === tip.id && (
                    <p className="mt-2 text-xs text-[#EFC8D4] leading-relaxed animate-fade-in">
                      {tip.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
