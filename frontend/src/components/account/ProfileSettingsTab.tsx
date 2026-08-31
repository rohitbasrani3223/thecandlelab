import React, { useState, useEffect } from 'react';
import { Input, Button, Badge, SparklesIcon, useToast } from '../../design-system';
import { useAuth } from '../../context/AuthContext';

export const ProfileSettingsTab: React.FC = () => {
  const { user } = useAuth();

  const nameParts = (user?.name || '').split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [scentPref, setScentPref] = useState<string[]>(['Woody & Spiced', 'Floral Rose']);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ');
      setFirstName(parts[0] || '');
      setLastName(parts.slice(1).join(' ') || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const toggleScent = (scent: string) => {
    if (scentPref.includes(scent)) {
      setScentPref(scentPref.filter((s) => s !== scent));
    } else {
      setScentPref([...scentPref, scent]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      type: 'luxury',
      title: 'Profile Updated Successfully!',
      description: 'Your personal info & scent preferences have been saved.',
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#EADDCB] pb-4">
        <div>
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>PROFILE MANAGEMENT</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#232323] mt-1">
            Personal Details & Scent Profile
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-wider text-[#7D6F63]">Personal Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            label="Last Name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label="Phone Number"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
      </div>

      {/* Preferred Scent Profile Selection */}
      <div className="space-y-3 pt-2">
        <span className="text-xs uppercase font-bold tracking-wider text-[#7D6F63] block">
          Preferred Olfactory Families (for personalized drops):
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {[
            'Woody & Spiced',
            'Floral Rose',
            'Fresh Citrus',
            'Warm Bourbon Vanilla',
            'Aromatherapy Sage',
          ].map((scent) => {
            const isSelected = scentPref.includes(scent);
            return (
              <button
                key={scent}
                type="button"
                onClick={() => toggleScent(scent)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${isSelected ? 'bg-[#8B6F4E] text-white border-[#8B6F4E] shadow-xs' : 'bg-[#FAF7F2] border-[#EADDCB] text-[#5C5149] hover:bg-[#FDE8EF]'}`}
              >
                {isSelected ? `✓ ${scent}` : `+ ${scent}`}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-4">
        <Button variant="pink" size="md" type="submit">
          Save Profile Changes
        </Button>
      </div>
    </form>
  );
};
