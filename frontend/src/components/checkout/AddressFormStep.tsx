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

const INDIAN_STATES_CITIES: Record<string, string[]> = {
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Navi Mumbai', 'Aurangabad', 'Solapur'],
  'Delhi / NCR': ['New Delhi', 'Gurgaon (Gurugram)', 'Noida', 'Ghaziabad', 'Faridabad'],
  'Karnataka': ['Bengaluru (Bangalore)', 'Mysuru (Mysore)', 'Mangaluru', 'Hubballi', 'Belagavi'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Gandhinagar'],
  'West Bengal': ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Asansol'],
  'Rajasthan': ['Jaipur', 'Udaipur', 'Jodhpur', 'Kota', 'Ajmer', 'Bikaner'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Prayagraj', 'Noida', 'Ghaziabad'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Chandigarh'],
  'Haryana': ['Gurugram', 'Faridabad', 'Panipat', 'Ambala', 'Karnal'],
  'Kerala': ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur'],
  'Madhya Pradesh': ['Indore', 'Bhopal', 'Gwalior', 'Jabalpur', 'Ujjain'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Puri'],
  'Assam': ['Guwahati', 'Silchar', 'Dibrugarh'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh'],
  'Jammu & Kashmir': ['Srinagar', 'Jammu'],
  'Other / International': ['Custom City'],
};

export const AddressFormStep: React.FC<AddressFormStepProps> = ({ initialData, onNext }) => {
  const getStorageKey = (email: string) => `tcl_saved_addresses_${(email || 'guest').toLowerCase().trim()}`;

  // Saved Addresses for Customer
  const [savedAddresses] = useState<AddressData[]>(() => {
    try {
      const key = getStorageKey(initialData.email);
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      // Check last saved address fallback
      const last = localStorage.getItem('tcl_last_shipping_address');
      return last ? [JSON.parse(last)] : [];
    } catch {
      return [];
    }
  });

  const [selectedAddressIdx, setSelectedAddressIdx] = useState<number | 'new'>(
    savedAddresses.length > 0 ? 0 : 'new'
  );

  const [formData, setFormData] = useState<AddressData>(() => {
    if (savedAddresses.length > 0 && savedAddresses[0]) {
      return { ...initialData, ...savedAddresses[0] };
    }
    return {
      ...initialData,
      state: initialData.state || 'Maharashtra',
      city: initialData.city || 'Mumbai',
      country: initialData.country || 'IN',
    };
  });

  const [isCustomState, setIsCustomState] = useState(false);
  const [isCustomCity, setIsCustomCity] = useState(false);

  const availableStates = Object.keys(INDIAN_STATES_CITIES);
  const availableCities = INDIAN_STATES_CITIES[formData.state] || ['Mumbai', 'Pune', 'Other City'];

  const handleSelectSavedAddress = (addr: AddressData, idx: number) => {
    setSelectedAddressIdx(idx);
    setFormData({
      ...formData,
      ...addr,
    });
  };

  const handleAddNewAddressClick = () => {
    setSelectedAddressIdx('new');
    setFormData({
      ...formData,
      firstName: '',
      lastName: '',
      street: '',
      apartment: '',
      city: 'Mumbai',
      state: 'Maharashtra',
      zip: '',
      saveAddress: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.saveAddress && formData.street && formData.city) {
      try {
        const key = getStorageKey(formData.email);
        const currentSaved: AddressData[] = JSON.parse(localStorage.getItem(key) || '[]');
        const exists = currentSaved.some(a => a.street === formData.street && a.zip === formData.zip);
        if (!exists) {
          const updated = [formData, ...currentSaved];
          localStorage.setItem(key, JSON.stringify(updated));
        }
        localStorage.setItem('tcl_last_shipping_address', JSON.stringify(formData));
      } catch (err) {}
    }

    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-sans">
      {/* Step Header */}
      <div className="flex items-center justify-between border-b border-[#F5E8EE] pb-4">
        <div>
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>STEP 1 OF 4</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#1C1217] mt-1">
            Shipping Address & Contact
          </h2>
        </div>
      </div>

      {/* Saved Addresses Section (If Available) */}
      {savedAddresses.length > 0 && (
        <div className="space-y-3 p-4 bg-[#FFF6F8] border border-[#F9B8CA]/60 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C94C6D]">
              📍 Select Saved Address ({savedAddresses.length})
            </span>
            <button
              type="button"
              onClick={handleAddNewAddressClick}
              className="text-xs font-bold text-[#E87A96] hover:underline cursor-pointer flex items-center gap-1"
            >
              ➕ Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedAddresses.map((addr, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSavedAddress(addr, idx)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  selectedAddressIdx === idx
                    ? 'border-[#E87A96] bg-[#FFFFFF] shadow-card ring-1 ring-[#E87A96]'
                    : 'border-[#F5E8EE] bg-[#FFFFFF]/70 hover:border-[#F9B8CA]'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[#1C1217] mb-1">
                  <span>{addr.firstName} {addr.lastName}</span>
                  {selectedAddressIdx === idx && (
                    <span className="text-[10px] bg-[#E87A96] text-white px-2 py-0.5 rounded-full font-bold">✓ Selected</span>
                  )}
                </div>
                <p className="text-[#624855] truncate font-medium">{addr.street}</p>
                <p className="text-[#886C7B]">{addr.city}, {addr.state} {addr.zip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guest vs Logged-in Toggle */}
      <div className="p-4 bg-[#FFFFFF] border border-[#F5E8EE] rounded-2xl flex items-center justify-between text-xs shadow-xs">
        <div>
          <span className="font-bold text-[#1C1217] block">
            {formData.isGuest ? 'Checking out as Guest' : 'Welcome back!'}
          </span>
          <span className="text-[#886C7B]">
            {formData.isGuest ? 'Sign in to use your saved addresses & rewards' : 'Using saved shipping address'}
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
        <h3 className="text-xs uppercase font-bold tracking-wider text-[#886C7B]">Contact Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Email Address (for order updates)"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="yourname@example.com"
          />
          <Input
            label="Phone Number (for courier updates)"
            type="tel"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      {/* Shipping Address Inputs */}
      <div className="space-y-4 pt-2">
        <h3 className="text-xs uppercase font-bold tracking-wider text-[#886C7B]">Shipping Location</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="First Name"
            required
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            placeholder="Enter first name"
          />
          <Input
            label="Last Name"
            required
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            placeholder="Enter last name"
          />
        </div>

        <Input
          label="Street Address"
          required
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          placeholder="Flat / House No. / Building / Street"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Apt / Suite (Optional)"
            value={formData.apartment}
            onChange={(e) => setFormData({ ...formData, apartment: e.target.value })}
            placeholder="Apt, Suite, Unit"
          />

          {/* State Select Dropdown / Custom Input Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#1C1217]">State / Region *</label>
              <button
                type="button"
                onClick={() => setIsCustomState(!isCustomState)}
                className="text-[10px] font-bold text-[#E87A96] hover:underline cursor-pointer"
              >
                {isCustomState ? '📋 List' : '✏️ Custom'}
              </button>
            </div>

            {isCustomState ? (
              <Input
                placeholder="Type State name"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
            ) : (
              <Select
                options={[
                  ...availableStates.map((st) => ({ value: st, label: st })),
                  { value: 'OTHER_CUSTOM_STATE', label: '✏️ Type Custom State...' },
                ]}
                value={formData.state}
                onChange={(e) => {
                  if (e.target.value === 'OTHER_CUSTOM_STATE') {
                    setIsCustomState(true);
                    setFormData({ ...formData, state: '' });
                  } else {
                    const newState = e.target.value;
                    const newCities = INDIAN_STATES_CITIES[newState] || ['Custom City'];
                    setFormData({
                      ...formData,
                      state: newState,
                      city: newCities[0] || '',
                    });
                  }
                }}
              />
            )}
          </div>

          {/* City Select Dropdown / Custom Input Toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#1C1217]">City *</label>
              <button
                type="button"
                onClick={() => setIsCustomCity(!isCustomCity)}
                className="text-[10px] font-bold text-[#E87A96] hover:underline cursor-pointer"
              >
                {isCustomCity ? '📋 List' : '✏️ Custom'}
              </button>
            </div>

            {isCustomCity ? (
              <Input
                placeholder="Type City name"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            ) : (
              <Select
                options={[
                  ...availableCities.map((ct) => ({ value: ct, label: ct })),
                  { value: 'OTHER_CUSTOM', label: '✏️ Type Custom City...' },
                ]}
                value={formData.city}
                onChange={(e) => {
                  if (e.target.value === 'OTHER_CUSTOM') {
                    setIsCustomCity(true);
                    setFormData({ ...formData, city: '' });
                  } else {
                    setFormData({ ...formData, city: e.target.value });
                  }
                }}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Postal / ZIP Code"
            required
            value={formData.zip}
            onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
            placeholder="e.g. 400001"
          />
          <div>
            <label className="text-xs font-semibold text-[#1C1217] block mb-1">Country *</label>
            <Select
              options={[
                { value: 'IN', label: '🇮🇳 India' },
                { value: 'US', label: '🇺🇸 United States' },
                { value: 'CA', label: '🇨🇦 Canada' },
                { value: 'UK', label: '🇬🇧 United Kingdom' },
                { value: 'AE', label: '🇦🇪 United Arab Emirates' },
                { value: 'AU', label: '🇦🇺 Australia' },
              ]}
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
          </div>
        </div>

        <Checkbox
          label={<span className="text-xs text-[#1C1217]">Save this address to my profile for future orders</span>}
          checked={formData.saveAddress}
          onChange={(e) => setFormData({ ...formData, saveAddress: e.target.checked })}
        />
      </div>

      <div className="pt-4">
        <Button variant="pink" size="lg" fullWidth type="submit">
          Continue to Delivery Method →
        </Button>
      </div>
    </form>
  );
};
