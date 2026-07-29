import React from 'react';
import { Badge, SparklesIcon, Card, Button, useToast } from '../../design-system';
import { BLOG_POSTS } from './blogData';
import type { BlogPost } from './blogData';

export interface BlogDetailsPageProps {
  article?: BlogPost | null;
  onNavigateToBlog?: () => void;
  onSelectArticle?: (article: BlogPost) => void;
}

export const BlogDetailsPage: React.FC<BlogDetailsPageProps> = ({
  article,
  onNavigateToBlog,
  onSelectArticle,
}) => {
  const { toast } = useToast();
  const currentArticle = article || BLOG_POSTS[0];

  const relatedArticles = BLOG_POSTS.filter((p) => p.id !== currentArticle.id).slice(0, 3);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast({ type: 'info', title: 'Journal Article Link Copied' });
  };

  return (
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans pb-16">
      {/* Breadcrumb Navigation Bar */}
      <div className="bg-[#F4EFE6] border-b border-[#E5D9C5] py-3.5 px-6 sm:px-12 text-xs text-[#8C7A6B]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="#home" className="hover:text-[#D4AF37] transition-colors">Home</a>
            <span>/</span>
            <button onClick={onNavigateToBlog} className="hover:text-[#D4AF37] transition-colors cursor-pointer">Journal</button>
            <span>/</span>
            <span className="text-[#2A1E17] font-bold truncate max-w-xs">{currentArticle.title}</span>
          </div>

          <button
            onClick={onNavigateToBlog}
            className="text-xs font-bold uppercase tracking-wider text-[#D4AF37] hover:underline cursor-pointer"
          >
            ← Back to Gazette
          </button>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-4xl mx-auto px-6 sm:px-12 py-10 sm:py-16 space-y-10">
        {/* Article Header Metadata */}
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>{currentArticle.category}</Badge>
            <span className="text-xs text-[#8C7A6B]">• {currentArticle.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#2A1E17] leading-tight">
            {currentArticle.title}
          </h1>

          <p className="text-sm sm:text-base font-light text-[#69574A] italic max-w-2xl mx-auto leading-relaxed">
            "{currentArticle.excerpt}"
          </p>

          {/* Author Card */}
          <div className="pt-4 flex items-center justify-center gap-4">
            <img
              src={currentArticle.author.avatar}
              alt={currentArticle.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37]"
            />
            <div className="text-left">
              <h4 className="text-sm font-bold text-[#2A1E17]">{currentArticle.author.name}</h4>
              <span className="text-xs text-[#8C7A6B] block">{currentArticle.author.role}</span>
              <span className="text-[11px] text-[#8C7A6B]">Published on {currentArticle.publishedAt}</span>
            </div>
          </div>
        </div>

        {/* Article Cover Image */}
        <div className="relative h-80 sm:h-[450px] rounded-md overflow-hidden bg-[#2A1E17] border border-[#E5D9C5] shadow-card">
          <img
            src={currentArticle.coverImage}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose max-w-none space-y-6 text-[#2A1E17] leading-relaxed font-sans text-base">
          {currentArticle.content.map((paragraph, index) => (
            <p key={index} className="text-[#3D2C22] font-light text-base sm:text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags & Social Share Bar */}
        <div className="pt-6 border-t border-b border-[#E5D9C5] py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8C7A6B]">Tags:</span>
            {currentArticle.tags.map((tag) => (
              <Badge key={tag} variant="espresso" size="sm">#{tag}</Badge>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={handleShare}>
            Share Editorial 🔗
          </Button>
        </div>

        {/* Author Bio Card */}
        <div className="bg-[#F4EFE6] border border-[#E5D9C5] rounded-md p-6 sm:p-8 flex items-center gap-6 shadow-card">
          <img
            src={currentArticle.author.avatar}
            alt={currentArticle.author.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#D4AF37] shrink-0"
          />
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4AF37]">Written By</span>
            <h4 className="font-serif font-bold text-lg text-[#2A1E17]">{currentArticle.author.name}</h4>
            <p className="text-xs text-[#69574A] font-light leading-relaxed">
              {currentArticle.author.role} at The Candle Lab Atelier. Dedicated to botanical fragrance formulation, sustainable beeswax harvesting, and scent architectural design.
            </p>
          </div>
        </div>

        {/* Related Articles Carousel / Grid */}
        <div className="space-y-6 pt-8">
          <div className="border-b border-[#E5D9C5] pb-3">
            <h3 className="text-2xl font-serif font-bold text-[#2A1E17]">
              Related Olfactory Articles
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <Card
                key={rel.id}
                variant="bordered"
                padding="md"
                onClick={() => onSelectArticle && onSelectArticle(rel)}
                className="bg-[#FAF6F0] group cursor-pointer space-y-3 hover:border-[#D4AF37] transition-all"
              >
                <div className="h-40 bg-[#2A1E17] rounded-xs overflow-hidden relative">
                  <img
                    src={rel.coverImage}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2 z-10">
                    <Badge variant="gold" size="sm">{rel.category}</Badge>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-[#8C7A6B]">{rel.publishedAt}</span>
                  <h4 className="font-serif font-bold text-sm text-[#2A1E17] group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
};
