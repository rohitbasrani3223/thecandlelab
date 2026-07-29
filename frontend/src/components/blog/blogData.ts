export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  category: 'Scent Pairing' | 'Candle Care' | 'Artisanal Craft' | 'Wellness & Lifestyle';
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  coverImage: string;
  tags: string[];
  featured?: boolean;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Art of Scent Pairing: Elevating Your Evening Rituals',
    slug: 'art-of-scent-pairing',
    excerpt: 'Discover how layering Damask Rose with Smoked Oud creates an immersive sensory sanctuary in your living room.',
    content: [
      'Fragrance is an invisible architecture that shapes our emotions and memory. In high perfumery and artisanal candle formulation, scent layering—or scent pairing—is the delicate practice of burning complementary candles to create a multidimensional aromatic atmosphere.',
      'When pairing scents, begin with a rich grounding base note such as Mysore Sandalwood or Smoked Tobacco Leather in your central living space. Layer this with a delicate top note like Wild Bergamot or White Jasmine in adjacent rooms.',
      'Our master perfumers recommend burning Velvet Rose & Smoked Amber alongside French Bourbon Vanilla to balance floral romance with comforting warmth during evening rituals.'
    ],
    category: 'Scent Pairing',
    author: {
      name: 'Elena Rostova',
      role: 'Master Perfumer & Olfactory Director',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    publishedAt: 'July 24, 2026',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1200&auto=format&fit=crop&q=80',
    tags: ['Scent Layering', 'Atmosphere', 'Luxury Living'],
    featured: true,
  },
  {
    id: 'post-2',
    title: 'The Master Candle Care Guide: Trimming Wicks & Memory Burns',
    slug: 'master-candle-care-guide',
    excerpt: 'Essential maintenance practices to ensure a clean, soot-free burn and maximize candle lifespan up to 80 hours.',
    content: [
      'To enjoy the full 80-hour burn potential of your signature soy candle, proper wick maintenance is essential. Always trim your wood or cotton wick to 1/4 inch before each lighting.',
      'The first burn—known as the memory burn—is crucial. Allow your candle to burn continuously for at least 2 to 3 hours until the wax pool reaches the outer edges of the glass jar. This prevents tunneling.',
      'Never blow out a luxury candle directly. Use a matte brass snuffer to gently extinguish the flame without producing residual smoke.'
    ],
    category: 'Candle Care',
    author: {
      name: 'Marcus Vance',
      role: 'Head Atelier Craftsman',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    publishedAt: 'July 18, 2026',
    readTime: '4 min read',
    coverImage: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1200&auto=format&fit=crop&q=80',
    tags: ['Candle Maintenance', 'Wick Care', 'Long Burn'],
  },
  {
    id: 'post-3',
    title: 'Inside Our Atelier: Why We Pour 100% Pure Botanical Soy',
    slug: 'inside-our-atelier-pure-soy',
    excerpt: 'Explore our commitment to toxic-free, eco-conscious soy & beeswax formulations hand-poured in small batches.',
    content: [
      'Unlike mass-manufactured paraffin candles derived from petroleum, our formulations utilize 100% natural botanical soy and pure beeswax harvested from sustainable ethical farms.',
      'Soy wax burns cooler and slower, releasing pure essential fragrance oils without releasing toxic benzene or toluene into your home.',
      'Every jar is hand-poured in small 50-unit batches in our studio, ensuring precise wick alignment and gold foil detailing.'
    ],
    category: 'Artisanal Craft',
    author: {
      name: 'Elena Rostova',
      role: 'Master Perfumer & Olfactory Director',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
    publishedAt: 'July 10, 2026',
    readTime: '6 min read',
    coverImage: 'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1200&auto=format&fit=crop&q=80',
    tags: ['Botanical Soy', 'Hand Poured', 'Sustainability'],
  },
  {
    id: 'post-4',
    title: 'Mindfulness & Aromatherapy: Crafting a Sanctuary Space',
    slug: 'mindfulness-and-aromatherapy',
    excerpt: 'How wild lavender, eucalyptus, and Palo Santo essential oils stimulate deep relaxation and stress relief.',
    content: [
      'In a hyper-connected world, creating a sacred quiet sanctuary at home is vital for mental restoration.',
      'Olfactory stimulation directly targets the limbic system of the brain, regulating stress and cortisol levels. Inhaling pure lavender and eucalyptus oil during evening meditation slows pulse rate and prepares the body for restful sleep.',
      'Light an aromatherapy beeswax pillar 30 minutes before your evening bath or bedtime reading to transform your room into a tranquil spa.'
    ],
    category: 'Wellness & Lifestyle',
    author: {
      name: 'Dr. Sophia Chen',
      role: 'Holistic Wellness Advisor',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    },
    publishedAt: 'June 28, 2026',
    readTime: '5 min read',
    coverImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=1200&auto=format&fit=crop&q=80',
    tags: ['Mindfulness', 'Stress Relief', 'Sanctuary'],
  },
];
