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
    <section id="scent-quiz-section" className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#E5DAC7] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-16">
        {/* Olfactory Science Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>OLFACTORY CRAFTSMANSHIP</Badge>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#241812] leading-tight">
              The Architecture of a Luxury Scent
            </h2>
            <p className="text-sm text-[#5E4E42] leading-relaxed">
              Every candle formulation is composed of three distinct aromatic layers engineered to unfold gradually as the wax pool warms.
            </p>

            <div className="space-y-4 pt-2">
              <div className="p-4 bg-[#F5EEE4] border-l-4 border-[#C5983A] rounded-r-xl space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#241812] block">1. Top Notes (First 15 Mins)</span>
                <p className="text-xs text-[#847262]">Light, refreshing citrus and herbal top accords that greet you immediately upon opening the vessel.</p>
              </div>

              <div className="p-4 bg-[#F5EEE4] border-l-4 border-[#847262] rounded-r-xl space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#241812] block">2. Heart Notes (Main Body)</span>
                <p className="text-xs text-[#847262]">Rich florals, spices, and velvety woods that emerge after 30 minutes of melt pool diffusion.</p>
              </div>

              <div className="p-4 bg-[#F5EEE4] border-l-4 border-[#241812] rounded-r-xl space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-[#241812] block">3. Base Notes (Lingering Atmosphere)</span>
                <p className="text-xs text-[#847262]">Deep amber, smoked oud, and vanilla resins that anchor the scent into your room for hours after extinguishing.</p>
              </div>
            </div>
          </div>

          {/* Candle Care Guide Accordion */}
          <div className="lg:col-span-6 bg-[#241812] text-[#FAF7F2] p-8 sm:p-10 rounded-3xl border border-[#3E3027] shadow-[0_16px_36px_rgba(36,24,18,0.14)] space-y-6">
            <div className="space-y-2 border-b border-[#3E3027] pb-4">
              <span className="text-xs uppercase font-bold tracking-widest text-[#C5983A]">Artisan Guidance</span>
              <h3 className="text-2xl font-serif font-bold text-[#FAF7F2]">Candle Care & Maintenance</h3>
            </div>

            <div className="space-y-3 text-xs">
              {careTips.map((tip) => (
                <div key={tip.id} className="border-b border-[#3E3027]/70 pb-3">
                  <button
                    onClick={() => setOpenTip(openTip === tip.id ? null : tip.id)}
                    className="w-full flex items-center justify-between text-left font-bold text-sm text-[#E5DAC7] hover:text-[#C5983A] py-1 transition-colors cursor-pointer"
                  >
                    <span>{tip.title}</span>
                    <ChevronDownIcon size={16} className={`transition-transform ${openTip === tip.id ? 'rotate-180 text-[#C5983A]' : ''}`} />
                  </button>
                  {openTip === tip.id && (
                    <p className="mt-2 text-xs text-[#D6C7AF] leading-relaxed animate-fade-in">
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
