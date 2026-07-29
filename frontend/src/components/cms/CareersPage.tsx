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
    desc: 'Master small-batch soy & beeswax pouring, wood wick trimming, gold foil lid stamping, and quality inspection.',
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
    <div className="w-full bg-[#FAF6F0] min-h-screen font-sans pb-16">
      {/* Hero Header */}
      <section className="bg-[#3D2B1F] text-[#FAF6F0] py-16 sm:py-24 px-6 sm:px-12 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>CAREERS AT THE CANDLE LAB</Badge>
          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#FAF6F0]">
            Join Our Olfactory Atelier
          </h1>
          <p className="text-sm sm:text-base text-[#EFE8DB] font-light max-w-xl mx-auto leading-relaxed">
            We are looking for passionate artisans, perfumers, designers, and e-commerce strategists to build India's premier luxury candle house.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 sm:py-16 space-y-16">
        {/* Open Positions Grid */}
        <div className="space-y-6">
          <div className="border-b border-[#E5D9C5] pb-3">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#2C1E16]">
              Current Open Roles ({OPEN_POSITIONS.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OPEN_POSITIONS.map((pos) => (
              <Card
                key={pos.id}
                variant="bordered"
                padding="lg"
                className="bg-white border-[#EFE8DB] rounded-2xl shadow-subtle space-y-4 hover:border-[#B88B38] transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#B88B38]">
                      {pos.department} • {pos.type}
                    </span>
                    <span className="text-xs text-[#7A6B5D]">{pos.location}</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#2C1E16]">{pos.title}</h3>
                  <p className="text-xs text-[#7A6B5D] font-light leading-relaxed">{pos.desc}</p>
                </div>

                <div className="pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                  <span className="text-xs text-[#2E6F40] font-bold">✓ Accepting Applications</span>
                  <button
                    onClick={() => {
                      setSelectedRole(pos.title);
                      const el = document.getElementById('apply-form');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold text-xs py-1.5 px-3.5 rounded-lg shadow-xs cursor-pointer"
                  >
                    Apply for Role →
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Application Form */}
        <div id="apply-form" className="bg-white border border-[#EFE8DB] rounded-2xl p-8 sm:p-12 shadow-subtle max-w-3xl mx-auto space-y-6">
          <div className="space-y-1 text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#B88B38]">CAREERS APPLICATION</span>
            <h3 className="text-2xl font-serif font-bold text-[#2C1E16]">Apply to The Atelier</h3>
            <p className="text-xs text-[#7A6B5D]">Selected Role: <strong className="text-[#B88B38]">{selectedRole}</strong></p>
          </div>

          <form onSubmit={handleApply} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2C1E16] uppercase">Full Name *</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singh"
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#2C1E16] uppercase">Email Address *</label>
                <Input
                  type="email"
                  required
                  placeholder="e.g. vikram@example.com"
                  value={applicantEmail}
                  onChange={(e) => setApplicantEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C1E16] uppercase">LinkedIn / Portfolio URL</label>
              <Input
                type="url"
                placeholder="https://linkedin.in/in/username"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#2C1E16] uppercase">Why do you want to join The Candle Lab?</label>
              <textarea
                rows={4}
                required
                placeholder="Tell us about your background and passion for luxury candles..."
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                className="w-full bg-[#F8F3EA] border border-[#EFE8DB] text-[#2C1E16] text-xs p-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#B88B38] font-sans"
              />
            </div>

            <Button
              variant="gold"
              size="lg"
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#B88B38] hover:bg-[#A3792E] text-white font-bold"
            >
              {isSubmitting ? 'Submitting Application...' : 'Submit Application →'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
