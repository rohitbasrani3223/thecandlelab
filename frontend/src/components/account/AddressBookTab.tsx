import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, SparklesIcon, Input, Modal, useToast } from '../../design-system';
import { useAuth } from '../../context/AuthContext';

export interface AddressEntry {
  id: string;
  label: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault: boolean;
}

export const AddressBookTab: React.FC = () => {
  const { user } = useAuth();
  const storageKey = `thecandlelab_addresses_${user?.email || 'guest'}`;
  const [addresses, setAddresses] = useState<AddressEntry[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newName, setNewName] = useState(user?.name || '');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newZip, setNewZip] = useState('');
  const { toast } = useToast();

  // Load user addresses from persistent storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setAddresses(JSON.parse(saved));
      } else {
        setAddresses([]);
      }
    } catch (e) {
      console.error('Failed to load user addresses:', e);
    }
  }, [user, storageKey]);

  const saveAddressesToStorage = (updated: AddressEntry[]) => {
    setAddresses(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save user addresses:', e);
    }
  };

  const handleSetDefault = (id: string) => {
    const updated = addresses.map((a) => ({ ...a, isDefault: a.id === id }));
    saveAddressesToStorage(updated);
    toast({ type: 'luxury', title: 'Default Shipping Address Updated' });
  };

  const handleDelete = (id: string) => {
    const updated = addresses.filter((a) => a.id !== id);
    saveAddressesToStorage(updated);
    toast({ type: 'info', title: 'Address Removed' });
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newState || !newZip) {
      toast({ type: 'error', title: 'Missing Address Fields', description: 'Please complete all address fields.' });
      return;
    }

    const created: AddressEntry = {
      id: `addr-${Date.now()}`,
      label: newLabel || 'Home Residence',
      name: newName || user?.name || 'Valued Customer',
      street: newStreet,
      city: newCity,
      state: newState,
      zip: newZip,
      country: 'India',
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, created];
    saveAddressesToStorage(updated);
    setIsAddModalOpen(false);

    // Clear modal fields
    setNewLabel('');
    setNewStreet('');
    setNewCity('');
    setNewState('');
    setNewZip('');
    toast({ type: 'luxury', title: 'New Address Saved to Book' });
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E5D9C5] pb-4">
        <div>
          <Badge variant="gold" icon={<SparklesIcon size={12} />}>ADDRESS BOOK</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#2A1E17] mt-1">
            Saved Shipping Locations
          </h2>
        </div>

        <Button variant="gold" size="sm" onClick={() => setIsAddModalOpen(true)}>
          + Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card variant="bordered" padding="lg" className="bg-[#FAF6F0] text-center py-10 space-y-4">
          <div className="w-14 h-14 bg-[#F4EFE6] border border-[#D4AF37]/30 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-lg font-bold text-[#2A1E17]">No Saved Addresses</h3>
            <p className="text-xs text-[#8C7A6B]">You have no shipping addresses saved in your sanctuary account book yet.</p>
          </div>
          <Button variant="primary" size="md" onClick={() => setIsAddModalOpen(true)}>
            + Add Your First Address
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr) => (
            <Card
              key={addr.id}
              variant={addr.isDefault ? 'gold-border' : 'bordered'}
              padding="lg"
              className="bg-[#FAF6F0] space-y-4 relative flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-[#E5D9C5] pb-2">
                  <span className="font-serif font-bold text-sm text-[#2A1E17]">{addr.label}</span>
                  {addr.isDefault && <Badge variant="gold" size="sm">DEFAULT ADDRESS</Badge>}
                </div>

                <div className="text-xs text-[#5C4A3E] space-y-1">
                  <p className="font-bold text-[#2A1E17]">{addr.name}</p>
                  <p>{addr.street}</p>
                  <p>
                    {addr.city}, {addr.state} — {addr.zip}
                  </p>
                  <p className="text-[#8C7A6B]">{addr.country}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E5D9C5]/60 text-xs">
                {!addr.isDefault && (
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-[#D4AF37] font-semibold hover:underline"
                  >
                    Set as Default
                  </button>
                )}
                {addr.isDefault && <span className="text-[#8C7A6B] italic">Primary Delivery Point</span>}

                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-red-700 font-semibold hover:underline ml-auto"
                >
                  Remove
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add New Address Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Delivery Address"
        subtitle="Save a destination to your sanctuary address book for rapid checkout."
        size="md"
      >
        <form onSubmit={handleCreateAddress} className="space-y-4 font-sans">
          <Input
            label="Location Label"
            placeholder="e.g. Home, Office, Summer Atelier"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />

          <Input
            label="Recipient Full Name"
            placeholder="Recipient Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            required
          />

          <Input
            label="Flat / Building / Street Address"
            placeholder="Flat 4B, Amber Woods, MG Road"
            value={newStreet}
            onChange={(e) => setNewStreet(e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              placeholder="Mumbai"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              required
            />
            <Input
              label="State"
              placeholder="Maharashtra"
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
              required
            />
          </div>

          <Input
            label="PIN / Zip Code"
            placeholder="400001"
            value={newZip}
            onChange={(e) => setNewZip(e.target.value)}
            required
          />

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5D9C5]">
            <Button variant="ghost" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
