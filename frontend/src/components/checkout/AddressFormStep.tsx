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
  cartItems?: any[];
  subtotal?: number;
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

export const AddressFormStep: React.FC<AddressFormStepProps> = ({ initialData, cartItems = [], subtotal = 0, onNext }) => {
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
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeDetected, setPincodeDetected] = useState<string | null>(null);

  const availableStates = Object.keys(INDIAN_STATES_CITIES);
  const availableCities = INDIAN_STATES_CITIES[formData.state] || ['Mumbai', 'Pune', 'Other City'];

  // Indian Pincode Auto-Fill
  const handlePincodeChange = async (pin: string) => {
    const cleanPin = pin.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => ({ ...prev, zip: cleanPin }));

    if (cleanPin.length === 6) {
      setPincodeLoading(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`, {
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        const data = await res.json();
        if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const detectedCity = po.District || po.Block || po.Circle || po.Name;
          const detectedState = po.State;

          setIsCustomCity(true);
          setIsCustomState(true);
          setFormData((prev) => ({
            ...prev,
            zip: cleanPin,
            city: detectedCity,
            state: detectedState,
            country: 'IN',
          }));
          setPincodeDetected(`${detectedCity}, ${detectedState}`);
        } else {
          setPincodeDetected(null);
        }
      } catch (err) {
        console.warn('Pincode auto-lookup note:', err);
      } finally {
        setPincodeLoading(false);
      }
    } else {
      setPincodeDetected(null);
    }
  };

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
    setPincodeDetected(null);
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
      <div className="flex items-center justify-between border-b border-[#EADDCB] pb-4">
        <div>
          <Badge variant="pink" size="sm" icon={<SparklesIcon size={12} />}>STEP 1 OF 3</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#232323] mt-1">
            Order Summary & Shipping Address
          </h2>
        </div>
      </div>

      {/* 1. Itemized Order Summary Box Inside Step 1 */}
      {cartItems && cartItems.length > 0 && (
        <div className="p-4 bg-[#FAF7F2] border border-[#EADDCB]/60 rounded-3xl space-y-3 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#EADDCB]/40 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C94C6D] flex items-center gap-1.5">
              <span>🛍️</span> Your Order Items ({cartItems.reduce((s, i) => s + (i.quantity || 1), 0)})
            </span>
            <span className="text-xs font-bold text-[#232323]">
              Subtotal: ₹{Math.round(subtotal).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {cartItems.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-3 bg-[#FFFFFF] border border-[#EADDCB] rounded-2xl flex items-center justify-between gap-3 text-xs"
              >
                <div className="w-12 h-12 rounded-xl bg-[#FAF7F2] border border-[#EADDCB] shrink-0 overflow-hidden flex items-center justify-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-lg">🕯️</span>
                  )}
                </div>

                <div className="flex-1 min-w-0 space-y-0.5">
                  <h4 className="font-bold text-[#232323] truncate">{item.name}</h4>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#7D6F63]">
                    {item.fragrance && (
                      <span className="text-[#C94C6D] font-semibold bg-[#FAF7F2] px-1.5 py-0.5 rounded border border-[#EADDCB]/40">
                        🌸 {item.fragrance}
                      </span>
                    )}
                    {item.size && (
                      <span className="bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#EADDCB]">
                        📏 {item.size}
                      </span>
                    )}
                    {item.wickType && (
                      <span className="bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#EADDCB]">
                        🕯️ {item.wickType}
                      </span>
                    )}
                    {item.color && (
                      <span className="bg-[#FFFFFF] px-1.5 py-0.5 rounded border border-[#EADDCB]">
                        🎨 {item.color}
                      </span>
                    )}
                  </div>
                  {item.giftPackaging && (
                    <span className="inline-block text-[9px] text-[#C94C6D] font-bold">
                      🎁 Blush Luxury Gift Box Included
                    </span>
                  )}
                </div>

                <div className="text-right shrink-0">
                  <span className="font-bold text-[#232323] block">
                    ₹{Math.round((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-[#7D6F63]">Qty: {item.quantity || 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Saved Addresses Section (If Available) */}
      {savedAddresses.length > 0 && (
        <div className="space-y-3 p-4 bg-[#FAF7F2] border border-[#EADDCB]/60 rounded-2xl shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C94C6D]">
              📍 Select Saved Address ({savedAddresses.length})
            </span>
            <button
              type="button"
              onClick={handleAddNewAddressClick}
              className="text-xs font-bold text-[#8B6F4E] hover:underline cursor-pointer flex items-center gap-1"
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
                    ? 'border-[#8B6F4E] bg-[#FFFFFF] shadow-card ring-1 ring-[#8B6F4E]'
                    : 'border-[#EADDCB] bg-[#FFFFFF]/70 hover:border-[#EADDCB]'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-[#232323] mb-1">
                  <span>{addr.firstName} {addr.lastName}</span>
                  {selectedAddressIdx === idx && (
                    <span className="text-[10px] bg-[#8B6F4E] text-white px-2 py-0.5 rounded-full font-bold">✓ Selected</span>
                  )}
                </div>
                <p className="text-[#5C5149] truncate font-medium">{addr.street}</p>
                <p className="text-[#7D6F63]">{addr.city}, {addr.state} {addr.zip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Guest vs Logged-in Toggle */}
      <div className="p-4 bg-[#FFFFFF] border border-[#EADDCB] rounded-2xl flex items-center justify-between text-xs shadow-xs">
        <div>
          <span className="font-bold text-[#232323] block">
            {formData.isGuest ? 'Checking out as Guest' : 'Welcome back!'}
          </span>
          <span className="text-[#7D6F63]">
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
        <h3 className="text-xs uppercase font-bold tracking-wider text-[#7D6F63]">Contact Information</h3>
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
        <h3 className="text-xs uppercase font-bold tracking-wider text-[#7D6F63]">Shipping Location</h3>

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

        {/* PIN Code with Auto-Detection */}
        <div className="space-y-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Input
                label="Postal / PIN Code (6 Digits) *"
                required
                maxLength={6}
                value={formData.zip}
                onChange={(e) => handlePincodeChange(e.target.value)}
                placeholder="e.g. 400001"
              />
              {pincodeLoading && (
                <span className="text-[10px] text-[#8B6F4E] font-bold mt-1 block animate-pulse">
                  ⏳ Detecting City & State from Indian Postal Service...
                </span>
              )}
              {pincodeDetected && (
                <span className="text-[10px] text-[#15803D] font-bold mt-1 flex items-center gap-1">
                  <span>📍 Auto-detected:</span>
                  <strong className="underline">{pincodeDetected}</strong>
                </span>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-[#232323] block mb-1">Country *</label>
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

          {/* State Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#232323]">State / Region *</label>
              <button
                type="button"
                onClick={() => setIsCustomState(!isCustomState)}
                className="text-[10px] font-bold text-[#8B6F4E] hover:underline cursor-pointer"
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

          {/* City Input */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-[#232323]">City *</label>
              <button
                type="button"
                onClick={() => setIsCustomCity(!isCustomCity)}
                className="text-[10px] font-bold text-[#8B6F4E] hover:underline cursor-pointer"
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

        <Checkbox
          label={<span className="text-xs text-[#232323]">Save this address to my profile for future orders</span>}
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
