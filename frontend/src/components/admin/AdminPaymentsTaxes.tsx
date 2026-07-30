import React, { useState } from 'react';
import { Card, Button, Badge, useToast } from '../../design-system';
import { useCMS } from '../../context/CMSContext';

type PaymentsSubTab = 'methods' | 'taxes' | 'shipping';

export const AdminPaymentsTaxes: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<PaymentsSubTab>('methods');
  const { settings, updateSettings } = useCMS();
  const { toast } = useToast();

  const [formState, setFormState] = useState({
    currencySymbol: settings.currencySymbol || '₹',
    freeShippingThreshold: settings.freeShippingThreshold || 1499,
    standardShippingFee: settings.standardShippingFee || 99,
    razorpayKey: 'rzp_live_9488371891',
    razorpaySecret: '••••••••••••••••••••',
    razorpayEnabled: true,
    codEnabled: true,
    stripeEnabled: false,
    stripePublishableKey: 'pk_live_51M...',
    gstRatePercent: 18,
    includeTaxInPrice: true,
  });

  const [savedMsg, setSavedMsg] = useState('');

  const SUB_TABS: { id: PaymentsSubTab; label: string; icon: string }[] = [
    { id: 'methods', label: 'Payment Methods', icon: '💳' },
    { id: 'taxes', label: 'Taxes', icon: '🧾' },
    { id: 'shipping', label: 'Shipping Rules', icon: '🚚' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setFormState((prev) => ({ ...prev, [target.name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      currencySymbol: formState.currencySymbol,
      freeShippingThreshold: Number(formState.freeShippingThreshold),
      standardShippingFee: Number(formState.standardShippingFee),
    });
    setSavedMsg('Payment gateways & tax configuration saved!');
    toast({ type: 'luxury', title: 'Payment & Tax Settings Saved', description: 'Changes reflect live on checkout.' });
    setTimeout(() => setSavedMsg(''), 4000);
  };

  return (
    <div className="space-y-6 font-sans max-w-5xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EFE8DB] pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#B88B38]">FINANCIAL & CHECKOUT</span>
          <h1 className="text-3xl font-serif font-bold text-[#2C1E16]">Payments, Taxes & Shipping Rules</h1>
        </div>

        {savedMsg && (
          <span className="bg-[#2E6F40] text-white text-xs font-bold px-4 py-2 rounded-full shadow-subtle animate-bounce">
            ✓ {savedMsg}
          </span>
        )}
      </div>

      {/* Sub Navigation Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#EFE8DB] scrollbar-none">
        {SUB_TABS.map((tab) => {
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#B88B38] text-white shadow-card'
                  : 'bg-white text-[#7A6B5D] border border-[#EFE8DB] hover:bg-[#F8F3EA] hover:text-[#2C1E16]'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeSubTab === 'methods' && (
          <Card variant="bordered" padding="lg" className="bg-[#FAF6F0] space-y-6">
            <div className="flex items-center justify-between border-b border-[#EFE8DB] pb-3">
              <div>
                <h3 className="text-lg font-serif font-bold text-[#2C1E16]">Payment Methods & Gateways</h3>
                <p className="text-xs text-[#7A6B5D]">Manage active checkout payment providers.</p>
              </div>
              <Badge variant="gold" size="sm">ENTERPRISE SECURE</Badge>
            </div>

            <div className="space-y-4">
              {/* Razorpay Integration */}
              <div className="p-4 bg-[#F4EFE6] rounded-sm border border-[#E5D9C5] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💳</span>
                    <div>
                      <h4 className="text-sm font-bold text-[#2C1E16]">Razorpay (UPI, Credit Cards, Net Banking)</h4>
                      <p className="text-[11px] text-[#7A6B5D]">Primary payment gateway for India</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="razorpayEnabled"
                      checked={formState.razorpayEnabled}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-[#D8CEBE] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B88B38]" />
                  </label>
                </div>

                {formState.razorpayEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="block text-xs font-bold text-[#57493E] mb-1">Razorpay Key ID</label>
                      <input
                        type="text"
                        name="razorpayKey"
                        value={formState.razorpayKey}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-[#E5D9C5] rounded-xs text-xs font-mono text-[#2C1E16]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#57493E] mb-1">Razorpay Key Secret</label>
                      <input
                        type="password"
                        name="razorpaySecret"
                        value={formState.razorpaySecret}
                        onChange={handleChange}
                        className="w-full px-3 py-2 bg-white border border-[#E5D9C5] rounded-xs text-xs font-mono text-[#2C1E16]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Cash on Delivery */}
              <div className="p-4 bg-[#F4EFE6] rounded-sm border border-[#E5D9C5] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💵</span>
                  <div>
                    <h4 className="text-sm font-bold text-[#2C1E16]">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-[#7A6B5D]">Allow customers to pay upon delivery</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="codEnabled"
                    checked={formState.codEnabled}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#D8CEBE] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B88B38]" />
                </label>
              </div>
            </div>
          </Card>
        )}

        {activeSubTab === 'taxes' && (
          <Card variant="bordered" padding="lg" className="bg-[#FAF6F0] space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#2C1E16] border-b border-[#EFE8DB] pb-3">
              Taxes & Store Currency
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#57493E] mb-1">Currency Symbol</label>
                <input
                  type="text"
                  name="currencySymbol"
                  value={formState.currencySymbol}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-[#E5D9C5] rounded-xs text-xs font-bold text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#57493E] mb-1">GST / Sales Tax (%)</label>
                <input
                  type="number"
                  name="gstRatePercent"
                  value={formState.gstRatePercent}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-[#E5D9C5] rounded-xs text-xs font-bold text-[#2C1E16]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#57493E] mb-1">Tax Calculation</label>
                <select
                  name="includeTaxInPrice"
                  value={String(formState.includeTaxInPrice)}
                  onChange={(e) => setFormState((prev) => ({ ...prev, includeTaxInPrice: e.target.value === 'true' }))}
                  className="w-full px-3 py-2 bg-white border border-[#E5D9C5] rounded-xs text-xs font-bold text-[#2C1E16]"
                >
                  <option value="true">Prices Include Tax</option>
                  <option value="false">Add Tax at Checkout</option>
                </select>
              </div>
            </div>
          </Card>
        )}

        {activeSubTab === 'shipping' && (
          <Card variant="bordered" padding="lg" className="bg-[#FAF6F0] space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#2C1E16] border-b border-[#EFE8DB] pb-3">
              Delivery & Shipping Thresholds
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#57493E] mb-1">Free Shipping Threshold ({formState.currencySymbol})</label>
                <input
                  type="number"
                  name="freeShippingThreshold"
                  value={formState.freeShippingThreshold}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-[#E5D9C5] rounded-xs text-xs font-bold text-[#2C1E16]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#57493E] mb-1">Standard Shipping Fee ({formState.currencySymbol})</label>
                <input
                  type="number"
                  name="standardShippingFee"
                  value={formState.standardShippingFee}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-white border border-[#E5D9C5] rounded-xs text-xs font-bold text-[#2C1E16]"
                />
              </div>
            </div>
          </Card>
        )}

        <div className="flex justify-end pt-4">
          <Button variant="gold" size="lg">
            Save Payment & Tax Rules →
          </Button>
        </div>
      </form>
    </div>
  );
};
