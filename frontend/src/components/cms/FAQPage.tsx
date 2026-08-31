import React, { useState } from 'react';
import { Badge, SparklesIcon, Input } from '../../design-system';

export interface FAQItem {
  id: string;
  category: 'shipping' | 'care' | 'orders' | 'returns' | 'gifting';
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'shipping',
    question: 'What are your delivery timelines across India?',
    answer: 'We dispatch all orders within 24 hours. Standard Metro shipping takes 2-4 business days. Regional and tier-2/3 cities deliver in 4-6 business days. Express shipping options are available at checkout.',
  },
  {
    id: 'faq-2',
    category: 'shipping',
    question: 'Is shipping free on luxury orders?',
    answer: 'Yes! We offer 100% Free Shipping on all orders over ₹1,499 across India. For orders below ₹1,499, a flat standard delivery fee of ₹99 applies.',
  },
  {
    id: 'faq-3',
    category: 'care',
    question: 'How do I trim organic wood wicks correctly?',
    answer: 'Before each lighting, pinch or trim your wood wick to 1/4 inch (about 5mm) to remove any charred ash. This prevents tall flickering flames, soot buildup, and ensures an even crackling burn.',
  },
  {
    id: 'faq-4',
    category: 'care',
    question: 'What is a "Memory Burn" and why is it important?',
    answer: 'On your candle\'s very first burn, allow the wax pool to melt continuously to the outer glass rim (approx. 2-3 hours). Soy wax has a memory effect—if extinguished too early, it can form a deep tunnel that shortens candle life.',
  },
  {
    id: 'faq-5',
    category: 'orders',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major Indian credit/debit cards (Visa, MasterCard, RuPay, Amex), UPI (Google Pay, PhonePe, Paytm), Net Banking, and Cash on Delivery (COD).',
  },
  {
    id: 'faq-6',
    category: 'returns',
    question: 'What is your return & exchange policy?',
    answer: 'We offer a 15-day no-questions-asked return and exchange policy for unused, unopened candles in original packaging. If a jar arrives damaged during transit, we send a replacement free of charge within 24 hours.',
  },
  {
    id: 'faq-7',
    category: 'gifting',
    question: 'Do you offer custom corporate gifting and wedding favors?',
    answer: 'Yes! We craft bespoke custom-branded candles, engraved metal lids, and personalized luxury gift boxes for corporate clients, weddings, and VIP events. Contact support@thecandlelab.in for bulk inquiries.',
  },
];

export const FAQPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('faq-1');

  const filteredFaqs = FAQ_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[#F8F6F0] min-h-screen font-sans pb-16">
      {/* Hero Header */}
      <section className="bg-white text-[#232323] py-16 sm:py-24 px-6 sm:px-12 text-center relative overflow-hidden border-b border-[#EADDCB]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EADDCB]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>HELP CENTER & KNOWLEDGE BASE</Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#232323]">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[#5C5149] font-light max-w-xl mx-auto leading-relaxed">
            Find immediate answers regarding candle maintenance, shipping timelines, payment options, and return procedures.
          </p>

          <div className="max-w-md mx-auto pt-4">
            <Input
              type="text"
              placeholder="Search FAQ questions (e.g. shipping, wick, return)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white text-[#232323] border-[#EADDCB]"
            />
          </div>
        </div>
      </section>

      {/* Main FAQ Container */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 py-12 space-y-8">
        {/* Category Pills Filter */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {[
            { id: 'all', label: 'All Topics' },
            { id: 'shipping', label: '🚚 Shipping & Delivery' },
            { id: 'care', label: '🕯️ Candle Care' },
            { id: 'orders', label: '💳 Orders & Payments' },
            { id: 'returns', label: '🔄 Returns & Exchanges' },
            { id: 'gifting', label: '🎁 Bespoke Gifting' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#8B6F4E] text-white shadow-xs'
                  : 'bg-white text-[#5C5149] border border-[#EADDCB] hover:border-[#EADDCB]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion Questions List */}
        <div className="space-y-4">
          {filteredFaqs.map((faq) => {
            const isOpen = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                className={`bg-white border rounded-3xl overflow-hidden transition-all shadow-xs ${
                  isOpen ? 'border-[#8B6F4E] ring-2 ring-[#EADDCB]/20' : 'border-[#EADDCB]'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#FAF7F2] transition-colors"
                >
                  <h3 className="font-serif font-bold text-base text-[#232323]">
                    {faq.question}
                  </h3>
                  <span className={`text-sm font-bold text-[#8B6F4E] transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 text-xs sm:text-sm text-[#5C5149] leading-relaxed border-t border-[#EADDCB] font-light">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
