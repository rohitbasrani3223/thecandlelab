import React, { useState } from 'react';
import { Badge, SparklesIcon, Card, Button, Input, useToast } from '../../design-system';
import { BLOG_POSTS } from './blogData';
import type { BlogPost } from './blogData';

export interface BlogListingPageProps {
  onSelectArticle: (article: BlogPost) => void;
}

export const BlogListingPage: React.FC<BlogListingPageProps> = ({ onSelectArticle }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { toast } = useToast();

  const categories = ['all', 'Scent Pairing', 'Candle Care', 'Artisanal Craft', 'Wellness & Lifestyle'];

  const filteredPosts = selectedCategory === 'all'
    ? BLOG_POSTS
    : BLOG_POSTS.filter((p) => p.category === selectedCategory);

  const featuredPost = BLOG_POSTS.find((p) => p.featured) || BLOG_POSTS[0];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast({
      type: 'luxury',
      title: 'Subscribed to Sanctuary Journal',
      description: `Weekly olfactory editorials will be sent to ${newsletterEmail}`,
    });
    setNewsletterEmail('');
  };

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans">
      {/* 1. Journal Hero Header */}
      <section className="bg-gradient-to-b from-[#2A1E17] to-[#1C130E] text-[#FAF6F0] py-16 sm:py-24 px-6 sm:px-12 text-center relative overflow-hidden border-b border-[#3D2C22]">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>BOTANICAL & OLFACTORY JOURNAL</Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-[#FAF6F0]">
            The Candle Lab Gazette
          </h1>
          <p className="text-sm sm:text-base text-[#E5D9C5] font-light max-w-2xl mx-auto leading-relaxed">
            Editorials on scent architecture, artisanal hand-pouring, candle maintenance, and sensory sanctuary rituals.
          </p>
        </div>
      </section>

      {/* 2. Category Filter Selector Bar */}
      <div className="bg-[#F4EFE6] border-b border-[#E5D9C5] sticky top-0 z-20 shadow-subtle">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#2A1E17] text-[#D4AF37] shadow-card'
                  : 'bg-transparent text-[#69574A] hover:text-[#2A1E17] hover:bg-[#FAF6F0]'
              }`}
            >
              {cat === 'all' ? `All Editorials (${BLOG_POSTS.length})` : cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Articles Viewport */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 space-y-16">
        {/* Featured Article Spotlight */}
        {selectedCategory === 'all' && (
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold tracking-widest text-[#D4AF37] block">
              ★ Editor's Featured Journal
            </span>
            <Card
              variant="gold-border"
              padding="none"
              onClick={() => onSelectArticle(featuredPost)}
              className="bg-[#FAF6F0] group cursor-pointer overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[#E5D9C5] hover:border-[#D4AF37] transition-all shadow-card"
            >
              <div className="lg:col-span-7 h-72 lg:h-auto relative overflow-hidden bg-[#2A1E17]">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="gold" size="sm">{featuredPost.category}</Badge>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-[#8C7A6B]">
                    <span>{featuredPost.publishedAt}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#69574A] font-light leading-relaxed">
                    {featuredPost.excerpt}
                  </p>
                </div>

                {/* Author Info */}
                <div className="pt-6 border-t border-[#E5D9C5] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#2A1E17]">{featuredPost.author.name}</h4>
                      <span className="text-[10px] text-[#8C7A6B]">{featuredPost.author.role}</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#D4AF37] group-hover:translate-x-1 transition-transform">
                    Read Article →
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Articles Grid */}
        <div className="space-y-6">
          <div className="border-b border-[#E5D9C5] pb-3 flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-[#2A1E17]">
              {selectedCategory === 'all' ? 'Recent Journal Articles' : `${selectedCategory} Articles`}
            </h3>
            <span className="text-xs text-[#8C7A6B]">{filteredPosts.length} Articles</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                variant="bordered"
                padding="none"
                onClick={() => onSelectArticle(post)}
                className="bg-[#FAF6F0] group cursor-pointer overflow-hidden flex flex-col justify-between hover:border-[#D4AF37] hover:shadow-card transition-all duration-300"
              >
                <div className="relative h-56 bg-[#2A1E17] overflow-hidden">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute top-3 left-3 z-10">
                    <Badge variant="gold" size="sm">{post.category}</Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-[#8C7A6B]">
                      <span>{post.publishedAt}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="text-lg font-serif font-bold text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors leading-snug">
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#69574A] font-light line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Author Card Footer */}
                  <div className="pt-4 border-t border-[#E5D9C5] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]/50"
                      />
                      <span className="font-semibold text-[#2A1E17] text-[11px]">{post.author.name}</span>
                    </div>
                    <span className="text-[#D4AF37] font-bold group-hover:translate-x-1 transition-transform">
                      Read →
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 4. VIP Journal Newsletter Section */}
        <div className="bg-gradient-to-br from-[#2A1E17] to-[#1C130E] text-[#FAF6F0] rounded-md p-8 sm:p-12 text-center space-y-6 shadow-card border border-[#3D2C22]">
          <div className="max-w-xl mx-auto space-y-2">
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>ATELIER JOURNAL SUBSCRIBERS</Badge>
            <h3 className="text-2xl sm:text-4xl font-serif font-bold text-[#FAF6F0]">
              Subscribe to Olfactory Musings
            </h3>
            <p className="text-xs sm:text-sm text-[#E5D9C5] font-light leading-relaxed">
              Receive weekly fragrance profiles, candle care secrets, private batch release invitations, and VIP discounts.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
            <Input
              type="email"
              placeholder="Enter your email address..."
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              required
              className="bg-[#FAF6F0] text-[#2A1E17]"
            />
            <Button variant="gold" size="md" type="submit" className="shrink-0 font-bold">
              Join Journal →
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
