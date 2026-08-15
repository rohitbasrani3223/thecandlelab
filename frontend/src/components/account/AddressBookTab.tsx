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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#F5E8EE] pb-4">
        <div>
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>DISPATCH DESTINATIONS</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#1C1217] mt-1">
            Saved Shipping Addresses
          </h2>
        </div>

        <Button variant="pink" size="sm" onClick={() => setIsAddModalOpen(true)}>
          + Add New Address
        </Button>
      </div>

      {addresses.length === 0 ? (
        <Card variant="bordered" padding="lg" className="bg-[#FFFFFF] border-[#F5E8EE] rounded-3xl text-center py-12 space-y-4 shadow-xs">
          <div className="w-16 h-16 bg-[#FFF6F8] border border-[#F9B8CA] rounded-full flex items-center justify-center mx-auto text-[#E87A96]">
            📍
          </div>
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-[#1C1217]">No Saved Addresses</h3>
            <p className="text-xs text-[#886C7B] max-w-sm mx-auto">
              Save your residence or office address to expedite checkout on future artisanal orders.
            </p>
          </div>
          <Button variant="pink" size="md" onClick={() => setIsAddModalOpen(true)}>
            + Add First Address
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <Card
              key={addr.id}
              variant="bordered"
              padding="md"
              className={`bg-white rounded-3xl space-y-3 shadow-xs transition-all ${addr.isDefault ? 'border-[#E87A96] ring-2 ring-[#F9B8CA]/30' : 'border-[#F5E8EE]'}`}
            >
              <div className="flex items-center justify-between border-b border-[#F5E8EE] pb-2 text-xs">
                <div className="flex items-center gap-2">
                  <strong className="font-serif text-[#1C1217] font-bold">{addr.label}</strong>
                  {addr.isDefault && <Badge variant="pink" size="sm">DEFAULT</Badge>}
                </div>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-[#886C7B] hover:text-[#BE123C] font-semibold text-xs cursor-pointer"
                >
                  Delete
                </button>
              </div>

              <div className="text-xs text-[#624855] space-y-1 leading-relaxed">
                <strong className="text-[#1C1217] block font-semibold">{addr.name}</strong>
                <p>{addr.street}</p>
                <p>{addr.city}, {addr.state} {addr.zip}</p>
                <p>{addr.country}</p>
              </div>

              {!addr.isDefault && (
                <div className="pt-2 border-t border-[#F5E8EE]">
                  <button
                    onClick={() => handleSetDefault(addr.id)}
                    className="text-xs font-bold text-[#E87A96] hover:underline cursor-pointer"
                  >
                    Set as Default Address
                  </button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Shipping Destination"
      >
        <form onSubmit={handleCreateAddress} className="space-y-4 font-sans text-xs">
          <Input
            label="Address Tag / Label (e.g. Home, Studio, Office)"
            placeholder="Home Residence"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
          />
          <Input
            label="Full Recipient Name"
            placeholder="Aria Montgomery"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            label="Street Address"
            placeholder="42 Beacon Hill Lane, Apt 4B"
            required
            value={newStreet}
            onChange={(e) => setNewStreet(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              placeholder="Boston"
              required
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            />
            <Input
              label="State / Province"
              placeholder="MA"
              required
              value={newState}
              onChange={(e) => setNewState(e.target.value)}
            />
          </div>
          <Input
            label="Postal / PIN Code"
            placeholder="02108"
            required
            value={newZip}
            onChange={(e) => setNewZip(e.target.value)}
          />

          <div className="pt-3 flex justify-end gap-3">
            <Button variant="outline" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="pink" size="sm" type="submit">
              Save Address
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
