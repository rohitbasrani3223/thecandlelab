import React, { useState } from 'react';
import { Badge, SparklesIcon, ChevronDownIcon } from '../../design-system';

const faqs = [
  {
    question: 'What type of wax is used in The Candle Lab candles?',
    answer: 'We formulate exclusively with 100% natural, renewable organic soy wax sourced from North American farmers. Our wax is 100% biodegradable, non-toxic, and free from paraffin, phthalates, and petroleum synthetic additives.',
  },
  {
    question: 'How long do your signature glass candles burn?',
    answer: 'Our standard 12 oz luxury glass candles provide 60 to 70 hours of clean, fragrant burn time when trimmed correctly. Our 3-wick 16 oz vessels burn for up to 85+ hours.',
  },
  {
    question: 'Why do you use crackling wood wicks?',
    answer: 'Our FSC-certified organic wood wicks create a soothing, gentle fireplace crackle as they burn while distributing fragrance heat more evenly than traditional cotton wicks, enhancing scent throw.',
  },
  {
    question: 'What is your shipping & return policy?',
    answer: 'We offer Free Express Shipping nationwide on all orders over ₹1,499. Every order is backed by our 30-Day Serenity Guarantee: if you are not delighted with your scent, return it unused for a full refund or exchange.',
  },
  {
    question: 'Do you offer custom corporate or wedding gift boxes?',
    answer: 'Yes! We create bespoke custom-formulated candles with gold foil monogramming for weddings, executive gifting, and corporate events. Contact our concierge team for custom quotes.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-24 bg-[#FAF7F2] border-b border-[#EADDCB] font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>CLEAR ANSWERS</Badge>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-[#232323]">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#5C5149]">
            Everything you need to know about our organic soy wax, wood wicks, and atelier deliveries.
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-[#FFFFFF] rounded-2xl border border-[#EADDCB] overflow-hidden shadow-subtle hover:border-[#EADDCB] transition-all"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-5 sm:p-6 font-serif font-bold text-base sm:text-lg text-[#232323] hover:text-[#8B6F4E] flex items-center justify-between gap-4 transition-colors cursor-pointer"
              >
                <span>{faq.question}</span>
                <ChevronDownIcon size={18} className={`shrink-0 transition-transform ${openIndex === index ? 'rotate-180 text-[#8B6F4E]' : 'text-[#7D6F63]'}`} />
              </button>

              {openIndex === index && (
                <div className="px-5 sm:px-6 pb-6 text-xs sm:text-sm text-[#5C5149] leading-relaxed border-t border-[#EADDCB] pt-4 animate-fade-in font-sans">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { FaqSection as FAQSection };
