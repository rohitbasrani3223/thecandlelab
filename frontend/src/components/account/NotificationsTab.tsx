import React, { useState } from 'react';
import { Switch, Button, Badge, SparklesIcon, useToast } from '../../design-system';

export const NotificationsTab: React.FC = () => {
  const [smsShipping, setSmsShipping] = useState(true);
  const [vipRestocks, setVipRestocks] = useState(true);
  const [seasonalInvites, setSeasonalInvites] = useState(true);
  const [monthlyDigest, setMonthlyDigest] = useState(false);
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      type: 'luxury',
      title: 'Notification Preferences Saved!',
      description: 'Your communication settings have been updated.',
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 font-sans">
      <div className="flex items-center justify-between border-b border-[#EADDCB] pb-4">
        <div>
          <Badge variant="pink" icon={<SparklesIcon size={12} />}>COMMUNICATION PREFERENCES</Badge>
          <h2 className="text-2xl font-serif font-bold text-[#232323] mt-1">
            Notification Settings
          </h2>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-[#FAF7F2] border border-[#EADDCB] rounded-2xl flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="font-serif font-bold text-sm text-[#232323]">SMS Order & Shipping Alerts</h4>
            <p className="text-xs text-[#7D6F63]">Receive real-time SMS tracking updates on courier delivery status.</p>
          </div>
          <Switch checked={smsShipping} onChange={setSmsShipping} />
        </div>

        <div className="p-4 bg-[#FAF7F2] border border-[#EADDCB] rounded-2xl flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="font-serif font-bold text-sm text-[#232323]">VIP Limited Batch Restock Drops</h4>
            <p className="text-xs text-[#7D6F63]">Early 24-hour access alerts before numbered rose drops go public.</p>
          </div>
          <Switch checked={vipRestocks} onChange={setVipRestocks} />
        </div>

        <div className="p-4 bg-[#FAF7F2] border border-[#EADDCB] rounded-2xl flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="font-serif font-bold text-sm text-[#232323]">Seasonal Scent Release Invites</h4>
            <p className="text-xs text-[#7D6F63]">Exclusive invitations to seasonal scent formulation releases.</p>
          </div>
          <Switch checked={seasonalInvites} onChange={setSeasonalInvites} />
        </div>

        <div className="p-4 bg-[#FAF7F2] border border-[#EADDCB] rounded-2xl flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <h4 className="font-serif font-bold text-sm text-[#232323]">Monthly Sanctuary Digest</h4>
            <p className="text-xs text-[#7D6F63]">Monthly email newsletter with candle care guides and Grasse perfumery stories.</p>
          </div>
          <Switch checked={monthlyDigest} onChange={setMonthlyDigest} />
        </div>
      </div>

      <div className="pt-4">
        <Button variant="pink" size="md" type="submit">
          Save Notification Preferences
        </Button>
      </div>
    </form>
  );
};
