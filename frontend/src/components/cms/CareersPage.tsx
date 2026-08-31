import React, { useState } from 'react';
import { Badge, SparklesIcon, Button, Input, Card, useToast } from '../../design-system';

const OPEN_POSITIONS = [
  {
    id: 'car-1',
    title: 'Senior Olfactory Perfumer & Fragrance Chemist',
    department: 'Atelier R&D',
    location: 'Mumbai Studio (On-Site)',
    type: 'Full-Time',
    desc: 'Lead candle formulation, essential oil scent pairing, and IFRA safety compliance for upcoming luxury seasonal collections.',
  },
  {
    id: 'car-2',
    title: 'Hand-Pouring Studio Artisan',
    department: 'Production',
    location: 'New Delhi Studio (On-Site)',
    type: 'Full-Time',
    desc: 'Master small-batch soy & beeswax pouring, wood wick trimming, rose gold foil lid stamping, and quality inspection.',
  },
  {
    id: 'car-3',
    title: 'Brand Marketing & Social Content Lead',
    department: 'Marketing',
    location: 'Remote / Hybrid',
    type: 'Full-Time',
    desc: 'Craft luxury editorial storytelling, manage VIP influencer gifting, and oversee digital campaigns across Instagram & Pinterest.',
  },
  {
    id: 'car-4',
    title: 'E-Commerce Logistics & Fulfillment Specialist',
    department: 'Operations',
    location: 'Mumbai Warehouse',
    type: 'Full-Time',
    desc: 'Manage inventory, courier API integrations, express order dispatches, and premium gift box assembly.',
  },
];

export const CareersPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState(OPEN_POSITIONS[0].title);
  const [applicantName, setApplicantName] = useState('');
  const [applicantEmail, setApplicantEmail] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [coverNote, setCoverNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        type: 'luxury',
        title: 'Application Submitted Successfully',
        description: `Thank you ${applicantName}. Our atelier talent team will review your portfolio for ${selectedRole}.`,
      });
      setApplicantName('');
      setApplicantEmail('');
      setLinkedinUrl('');
      setCoverNote('');
    }, 1000);
  };

  return (
    <div className="w-full bg-[#F8F6F0] min-h-screen font-sans pb-16">
      {/* Hero Header */}
      <section className="bg-white text-[#232323] py-16 sm:py-24 px-6 sm:px-12 text-center relative overflow-hidden border-b border-[#EADDCB]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#EADDCB]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>CAREERS AT THE CANDLE LAB</Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#232323]">
            Join Our Olfactory Atelier
          </h1>
          <p className="text-sm sm:text-base text-[#5C5149] font-light max-w-xl mx-auto leading-relaxed">
            We are looking for passionate artisans, perfumers, designers, and e-commerce strategists to build India's premier luxury candle house.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-16 space-y-16">
        {/* Open Positions Grid */}
        <div className="space-y-6">
          <div className="border-b border-[#EADDCB] pb-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#232323]">
              Current Open Roles ({OPEN_POSITIONS.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OPEN_POSITIONS.map((pos) => (
              <Card
                key={pos.id}
                variant="bordered"
                padding="lg"
                className="bg-white border-[#EADDCB] rounded-3xl shadow-card space-y-4 hover:border-[#EADDCB] transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#8B6F4E]">
                      {pos.department} • {pos.location}
                    </span>
                    <Badge variant="pink" size="sm">{pos.type}</Badge>
                  </div>
                  <h3 className="font-serif font-bold text-xl text-[#232323]">
                    {pos.title}
                  </h3>
                  <p className="text-xs text-[#5C5149] font-light leading-relaxed">
                    {pos.desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EADDCB]">
                  <Button
                    variant="outline"
                    size="sm"
                    fullWidth
                    onClick={() => {
                      setSelectedRole(pos.title);
                      const el = document.getElementById('apply-form');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    Apply for Position →
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div id="apply-form" className="bg-white border border-[#EADDCB] rounded-3xl p-8 sm:p-12 shadow-card max-w-2xl mx-auto space-y-6">
          <div className="space-y-1 text-center">
            <Badge variant="pink" icon={<SparklesIcon size={12} />}>TALENT APPLICATION</Badge>
            <h3 className="text-2xl font-serif font-bold text-[#232323]">
              Submit Your Candidacy
            </h3>
            <p className="text-xs text-[#7D6F63]">
              Selected Role: <strong className="text-[#8B6F4E]">{selectedRole}</strong>
            </p>
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            <Input
              label="Full Name *"
              required
              placeholder="e.g. Maya Iyer"
              value={applicantName}
              onChange={(e) => setApplicantName(e.target.value)}
            />
            <Input
              label="Email Address *"
              type="email"
              required
              placeholder="e.g. maya@example.com"
              value={applicantEmail}
              onChange={(e) => setApplicantEmail(e.target.value)}
            />
            <Input
              label="LinkedIn Profile or Portfolio URL"
              placeholder="https://linkedin.com/in/..."
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#232323] uppercase">Short Introduction / Motivation *</label>
              <textarea
                required
                rows={4}
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Tell us about your background, craftsmanship, or why you'd like to join The Candle Lab..."
                className="w-full bg-[#FAF7F2] border border-[#EADDCB] rounded-2xl p-4 text-xs text-[#232323] outline-none focus:border-[#8B6F4E]"
              />
            </div>

            <Button
              variant="pink"
              size="lg"
              fullWidth
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting Application...' : 'Send Application to Talent Team →'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
