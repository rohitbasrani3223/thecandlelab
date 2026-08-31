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
    <div className="w-full bg-[#F8F6F0] min-h-screen font-sans pb-16">
      {/* Breadcrumb Navigation Bar */}
      <div className="bg-white border-b border-[#EADDCB] py-3.5 px-6 sm:px-12 text-xs text-[#7D6F63]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="#home" className="hover:text-[#8B6F4E] transition-colors">Home</a>
            <span>/</span>
            <button onClick={onNavigateToBlog} className="hover:text-[#8B6F4E] transition-colors cursor-pointer">Journal</button>
            <span>/</span>
            <span className="text-[#232323] font-bold truncate max-w-xs">{currentArticle.title}</span>
          </div>

          <button
            onClick={onNavigateToBlog}
            className="text-xs font-bold uppercase tracking-wider text-[#8B6F4E] hover:underline cursor-pointer"
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
            <Badge variant="pink" icon={<SparklesIcon size={12} />}>{currentArticle.category}</Badge>
            <span className="text-xs text-[#7D6F63]">• {currentArticle.readTime}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#232323] leading-tight">
            {currentArticle.title}
          </h1>

          <p className="text-sm sm:text-base font-light text-[#5C5149] italic max-w-2xl mx-auto leading-relaxed">
            "{currentArticle.excerpt}"
          </p>

          {/* Author Card */}
          <div className="pt-4 flex items-center justify-center gap-4">
            <img
              src={currentArticle.author.avatar}
              alt={currentArticle.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#EADDCB]"
            />
            <div className="text-left">
              <h4 className="text-sm font-bold text-[#232323]">{currentArticle.author.name}</h4>
              <span className="text-xs text-[#7D6F63] block">{currentArticle.author.role}</span>
              <span className="text-[11px] text-[#7D6F63]">Published on {currentArticle.publishedAt}</span>
            </div>
          </div>
        </div>

        {/* Article Cover Image */}
        <div className="relative h-80 sm:h-[450px] rounded-3xl overflow-hidden bg-[#FAF7F2] border border-[#EADDCB] shadow-card">
          <img
            src={currentArticle.coverImage}
            alt={currentArticle.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body Content */}
        <div className="prose max-w-none space-y-6 text-[#232323] leading-relaxed font-sans text-base">
          {currentArticle.content.map((paragraph, index) => (
            <p key={index} className="text-[#5C5149] font-light text-base sm:text-lg leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags & Social Share Bar */}
        <div className="pt-6 border-t border-b border-[#EADDCB] py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#7D6F63]">Tags:</span>
            {currentArticle.tags.map((tag) => (
              <span key={tag} className="text-xs px-3 py-1 bg-[#FAF7F2] border border-[#EADDCB] rounded-full text-[#5C5149]">
                #{tag}
              </span>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={handleShare}>
            🔗 Share Article
          </Button>
        </div>

        {/* Related Articles Carousel/Grid */}
        <div className="pt-10 space-y-6">
          <h3 className="text-2xl font-serif font-bold text-[#232323]">
            Complementary Readings
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <Card
                key={rel.id}
                variant="bordered"
                padding="none"
                onClick={() => {
                  if (onSelectArticle) onSelectArticle(rel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-white border-[#EADDCB] rounded-3xl group cursor-pointer overflow-hidden flex flex-col justify-between hover:shadow-card hover:border-[#EADDCB] transition-all"
              >
                <div className="h-40 overflow-hidden relative bg-[#FAF7F2]">
                  <img
                    src={rel.coverImage}
                    alt={rel.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge variant="pink" size="sm">{rel.category}</Badge>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] text-[#7D6F63]">{rel.readTime}</span>
                  <h4 className="text-sm font-serif font-bold text-[#232323] group-hover:text-[#8B6F4E] transition-colors line-clamp-2">
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
