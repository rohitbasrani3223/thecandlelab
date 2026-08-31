import React, { useState } from 'react';
import { Badge, SparklesIcon, Card, Button, useToast } from '../../design-system';
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
    <div className="w-full bg-[#F8F6F0] min-h-screen font-sans">
      {/* 1. Journal Hero Header */}
      <section className="bg-white text-[#232323] py-16 sm:py-24 px-6 sm:px-12 text-center relative overflow-hidden border-b border-[#EADDCB]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EADDCB]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>BOTANICAL & OLFACTORY JOURNAL</Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold tracking-tight text-[#232323]">
            The Candle Lab Gazette
          </h1>
          <p className="text-sm sm:text-base text-[#5C5149] font-light max-w-2xl mx-auto leading-relaxed">
            Editorials on scent architecture, artisanal hand-pouring, candle maintenance, and sensory sanctuary rituals.
          </p>
        </div>
      </section>

      {/* 2. Category Filter Selector Bar */}
      <div className="bg-white border-b border-[#EADDCB] sticky top-0 z-20 shadow-subtle">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 py-4 flex items-center gap-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#8B6F4E] text-white shadow-xs'
                  : 'bg-transparent text-[#5C5149] hover:text-[#232323] hover:bg-[#FAF7F2]'
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
            <span className="text-xs uppercase font-bold tracking-widest text-[#8B6F4E] block">
              ★ Editor's Featured Journal
            </span>
            <Card
              variant="bordered"
              padding="none"
              onClick={() => onSelectArticle(featuredPost)}
              className="bg-white group cursor-pointer overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 border border-[#EADDCB] hover:border-[#EADDCB] rounded-3xl transition-all shadow-card"
            >
              <div className="lg:col-span-7 h-72 lg:h-auto relative overflow-hidden bg-[#FAF7F2]">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-90"
                />
                <div className="absolute top-4 left-4 z-10">
                  <Badge variant="pink" size="sm">{featuredPost.category}</Badge>
                </div>
              </div>

              <div className="lg:col-span-5 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-xs text-[#7D6F63]">
                    <span>{featuredPost.publishedAt}</span>
                    <span>•</span>
                    <span>{featuredPost.readTime}</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#232323] group-hover:text-[#8B6F4E] transition-colors leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-[#5C5149] leading-relaxed font-light line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EADDCB] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={featuredPost.author.avatar}
                      alt={featuredPost.author.name}
                      className="w-8 h-8 rounded-full object-cover border border-[#EADDCB]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-[#232323]">{featuredPost.author.name}</h4>
                      <span className="text-[10px] text-[#7D6F63] block">{featuredPost.author.role}</span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#8B6F4E] group-hover:translate-x-1 transition-transform">
                    Read Journal →
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Articles Grid */}
        <div className="space-y-6">
          <h3 className="text-xl font-serif font-bold text-[#232323] border-b border-[#EADDCB] pb-3">
            Recent Publications ({filteredPosts.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                variant="bordered"
                padding="none"
                onClick={() => onSelectArticle(post)}
                className="bg-white group cursor-pointer overflow-hidden flex flex-col justify-between border border-[#EADDCB] hover:border-[#EADDCB] rounded-3xl hover:shadow-card transition-all"
              >
                <div className="h-48 relative overflow-hidden bg-[#FAF7F2]">
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="pink" size="sm">{post.category}</Badge>
                  </div>
                </div>

                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-[#7D6F63]">
                      <span>{post.publishedAt}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h4 className="text-lg font-serif font-bold text-[#232323] group-hover:text-[#8B6F4E] transition-colors leading-snug">
                      {post.title}
                    </h4>

                    <p className="text-xs text-[#5C5149] leading-relaxed font-light line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EADDCB] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-6 h-6 rounded-full object-cover border border-[#EADDCB]"
                      />
                      <span className="text-xs font-semibold text-[#232323]">{post.author.name}</span>
                    </div>

                    <span className="text-[#8B6F4E] font-bold group-hover:translate-x-1 transition-transform">
                      Read →
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 4. Journal Newsletter Signup Box */}
        <div className="bg-white border border-[#EADDCB] rounded-3xl p-8 sm:p-12 shadow-card text-center max-w-3xl mx-auto space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#EADDCB]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="space-y-2 relative z-10">
            <Badge variant="pink" icon={<SparklesIcon size={12} />}>ATELIER DISPATCHES</Badge>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#232323]">
              Subscribe to the Olfactory Journal
            </h3>
            <p className="text-xs sm:text-sm text-[#5C5149] max-w-md mx-auto leading-relaxed">
              Curated perfumery musings, new harvest notes, and VIP member invitations delivered once weekly.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto relative z-10">
            <input
              type="email"
              placeholder="Enter your email address"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              className="flex-1 bg-[#FAF7F2] border border-[#EADDCB] rounded-full px-4 py-2.5 text-xs text-[#232323] outline-none focus:border-[#8B6F4E]"
            />
            <Button variant="pink" size="md" type="submit">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
