import React from 'react';
import { Card, Badge, SparklesIcon } from '../../design-system';

const moods = [
  {
    id: 'serenity',
    title: 'Serenity & Calm',
    tagline: 'Unwind & de-stress your sanctuary',
    color: 'bg-white border-[#F5E8EE]',
    scents: 'Lavender • White Sage • Chamomile',
    icon: '🌿',
    tag: 'Restorative',
  },
  {
    id: 'romance',
    title: 'Evening Romance',
    tagline: 'Seductive warmth & intimate glow',
    color: 'bg-[#FFF6F8] border-[#F9B8CA]',
    scents: 'Velvet Rose • Smoked Amber • Fig',
    icon: '🌹',
    tag: 'Seductive',
  },
  {
    id: 'focus',
    title: 'Focus & Renewal',
    tagline: 'Invigorate mind & workspace clarity',
    color: 'bg-white border-[#F5E8EE]',
    scents: 'Bergamot • Eucalyptus • Mint',
    icon: '🍊',
    tag: 'Energizing',
  },
  {
    id: 'meditation',
    title: 'Deep Meditation',
    tagline: 'Grounding woods & sacred resins',
    color: 'bg-white border-[#F5E8EE]',
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
    <section className="py-16 sm:py-24 bg-[#FFF6F8] border-b border-[#F5E8EE] font-sans">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>ATMOSPHERIC CURATION</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#1C1217]">
            Shop by Desired Mood
          </h2>
          <p className="text-sm text-[#624855]">
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
              className={`${m.color} rounded-3xl group cursor-pointer flex flex-col justify-between h-72 hover:-translate-y-1 hover:shadow-card hover:border-[#F9B8CA] transition-all duration-300 relative overflow-hidden`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    {m.icon}
                  </div>
                  <Badge variant="pink" size="sm">{m.tag}</Badge>
                </div>

                <h3 className="text-xl font-serif font-bold text-[#1C1217] group-hover:text-[#E87A96] transition-colors">
                  {m.title}
                </h3>

                <p className="text-xs text-[#624855] leading-relaxed font-light">
                  {m.tagline}
                </p>
              </div>

              <div className="pt-4 border-t border-[#F5E8EE] space-y-2 text-xs">
                <div className="font-semibold text-[#E87A96] text-[11px] truncate">{m.scents}</div>
                <div className="font-bold text-[#1C1217] uppercase tracking-wider group-hover:translate-x-1 group-hover:text-[#E87A96] transition-transform">
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
