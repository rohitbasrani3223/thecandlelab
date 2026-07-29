import React, { useState } from 'react';
import { Input, Button, Checkbox, Select, Badge, SparklesIcon } from '../../design-system';

export interface AddressData {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  street: string;
  apartment: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  saveAddress: boolean;
  isGuest: boolean;
}

export interface AddressFormStepProps {
  initialData: AddressData;
  onNext: (data: AddressData) => void;
}

export const AddressFormStep: React.FC<AddressFormStepProps> = ({ initialData, onNext }) => {
  const [formData, setFormData] = useState<AddressData>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-4">
        <div>
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>STEP 1 OF 4</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#2A1E17] mt-1">
            Shipping Address & Contact
          </h2>
        </div>
      </div>

      {/* Guest vs Logged-in Toggle */}
      <div className="p-4 bg-[#F4EFE6] border border-[#E5D9C5] rounded-md flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-[#2A1E17] block">
            {formData.isGuest ? 'Checking out as Guest' : 'Welcome back, Clara!'}
          </span>
          <span className="text-[#8C7A6B]">
            {formData.isGuest ? 'Sign in to use your saved addresses & rewards' : 'Using saved primary shipping address'}
          </span>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setFormData({ ...formData, isGuest: !formData.isGuest })}
        >
          {formData.isGuest ? 'Sign In →' : 'Guest Checkout'}
        </Button>
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <h3 className="text-xs uppercase font-bold tracking-wider text-[#8C7A6B]">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address (for order updates)"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="clara.hemsworth@example.com"
          />
          <Input
            label="Phone Number (for courier updates)"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+1 (555) 234-5678"
          />
        </div>
      </div>

      {/* Shipping Address Inputs */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs uppercase font-bold tracking-wider text-[#8C7A6B]">Shipping Location</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Clara"
          />
          <Input
            label="Last Name"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Hemsworth"
          />
        </div>

        <Input
          label="Street Address"
          required
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          placeholder="742 Evergreen Terrace"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Apt / Suite / Unit (Optional)"
            value={formData.apartment}
            onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
            placeholder="Penthouse 4B"
          />
          <Input
            label="City"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Boston"
          />
          <Input
            label="State / Province"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="MA"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Postal / ZIP Code"
            required
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            placeholder="02108"
          />
          <div>
            <label className="text-xs font-semibold text-[#2A1E17] block mb-1">Country</label>
            <Select
              options={[
                { value: 'US', label: 'United States' },
                { value: 'CA', label: 'Canada' },
                { value: 'UK', label: 'United Kingdom' },
                { value: 'FR', label: 'France' },
                { value: 'IN', label: 'India' },
              ]}
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
        </div>

        <Checkbox
          label={<span className="text-xs text-[#2A1E17]">Save this address to my profile for future orders</span>}
          checked={formData.saveAddress}
          onChange={(e) => setFormData({ ...formData, saveAddress: e.target.checked })}
        />
      </div>

      <div className="pt-4">
        <Button variant="gold" size="lg" fullWidth type="submit">
          Continue to Delivery Method →
        </Button>
      </div>
    </form>
  );
};
