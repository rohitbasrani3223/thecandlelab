import React from 'react';
import { Card, Badge, SparklesIcon } from '../../design-system';

const moods = [
  {
    id: 'serenity',
    title: 'Serenity & Calm',
    tagline: 'Unwind & de-stress your sanctuary',
    color: 'bg-white border-[#EADDCB]',
    scents: 'Lavender • White Sage • Chamomile',
    icon: '🌿',
    tag: 'Restorative',
  },
  {
    id: 'romance',
    title: 'Evening Romance',
    tagline: 'Seductive warmth & intimate glow',
    color: 'bg-[#FAF7F2] border-[#EADDCB]',
    scents: 'Velvet Rose • Smoked Amber • Fig',
    icon: '🌹',
    tag: 'Seductive',
  },
  {
    id: 'focus',
    title: 'Focus & Renewal',
    tagline: 'Invigorate mind & workspace clarity',
    color: 'bg-white border-[#EADDCB]',
    scents: 'Bergamot • Eucalyptus • Mint',
    icon: '🍊',
    tag: 'Energizing',
  },
  {
    id: 'meditation',
    title: 'Deep Meditation',
    tagline: 'Grounding woods & sacred resins',
    color: 'bg-white border-[#EADDCB]',
    scents: 'Cambodian Oud • Sandalwood • Cedar',
    icon: '🪵',
    tag: 'Sacred Oud',
  },
];

export interface ShopByMoodProps {
  onSelectMood?: (moodId: string) => void;
}

export const ShopByMood: React.FC<ShopByMoodProps> = ({ onSelectMood }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#EADDCB] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>ATMOSPHERIC CURATION</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#232323]">
            Shop by Desired Mood
          </h2>
          <p className="text-sm text-[#5C5149]">
            Curated olfactory formulations tailored to cultivate specific mental states and home atmospheres.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {moods.map((m) => (
            <Card
              key={m.id}
              variant="bordered"
              padding="lg"
              onClick={() => onSelectMood?.(m.id)}
              className={`${m.color} rounded-3xl group cursor-pointer flex flex-col justify-between h-72 hover:-translate-y-1 hover:shadow-card hover:border-[#EADDCB] transition-all duration-300 relative overflow-hidden`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    {m.icon}
                  </div>
                  <Badge variant="pink" size="sm">{m.tag}</Badge>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#232323] group-hover:text-[#8B6F4E] transition-colors">
                  {m.title}
                </h3>

                <p className="text-xs text-[#5C5149] leading-relaxed font-light">
                  {m.tagline}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EADDCB] space-y-2 text-xs">
                <div className="font-semibold text-[#8B6F4E] text-[11px] truncate">{m.scents}</div>
                <div className="font-bold text-[#232323] uppercase tracking-wider group-hover:translate-x-1 group-hover:text-[#8B6F4E] transition-transform">
                  Explore Mood Scents →
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
