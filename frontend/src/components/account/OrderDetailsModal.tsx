import React from 'react';
import { Modal, Button, Badge, SparklesIcon, useToast } from '../../design-system';

export interface OrderDetailsModalProps {
  orderId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  orderId,
  isOpen,
  onClose,
}) => {
  const { toast } = useToast();

  if (!isOpen || !orderId) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Breakdown ${orderId}`}
    >
      <div className="space-y-6 font-sans text-xs">
        {/* Status Header */}
        <div className="p-4 bg-[#FFF6F8] border border-[#F9B8CA] rounded-2xl flex items-center justify-between">
          <div>
            <Badge variant="pink" icon={<SparklesIcon size={12} />}>IN TRANSIT • COURIER</Badge>
            <span className="text-xs font-bold text-[#1C1217] block mt-1">Est. Arrival: Aug 1 - Aug 3</span>
          </div>
          <span className="font-mono text-xs text-[#886C7B]">Placed July 29, 2026</span>
        </div>

        {/* Itemized Products */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#886C7B] block">
            Purchased Formulations (2 Items)
          </span>

          <div className="p-3 bg-white border border-[#F5E8EE] rounded-2xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕯️</span>
              <div>
                <strong className="text-[#1C1217] block">Velvet Rose & Smoked Amber</strong>
                <span className="text-[10px] text-[#886C7B]">Qty: 1 • 12 oz Frosted Glass</span>
              </div>
            </div>
            <span className="font-bold text-[#1C1217]">₹1,499</span>
          </div>

          <div className="p-3 bg-white border border-[#F5E8EE] rounded-2xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕯️</span>
              <div>
                <strong className="text-[#1C1217] block">French Bourbon Vanilla Bean</strong>
                <span className="text-[10px] text-[#886C7B]">Qty: 1 • 16 oz 3-Wick Jar</span>
              </div>
            </div>
            <span className="font-bold text-[#1C1217]">₹1,799</span>
          </div>
        </div>

        {/* Order Price Totals Breakdown */}
        <div className="p-4 bg-[#FFF6F8] border border-[#F5E8EE] rounded-2xl space-y-1.5">
          <div className="flex justify-between text-[#886C7B]">
            <span>Subtotal</span>
            <span>₹3,298</span>
          </div>
          <div className="flex justify-between text-[#15803D] font-semibold">
            <span>Promo Savings (LUXURY10)</span>
            <span>-₹329</span>
          </div>
          <div className="flex justify-between text-[#886C7B]">
            <span>Express Courier Shipping</span>
            <span>FREE</span>
          </div>
          <div className="flex justify-between text-[#886C7B]">
            <span>Tax (18% GST)</span>
            <span>₹534</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-[#1C1217] pt-2 border-t border-[#F5E8EE]">
            <span>Total Paid</span>
            <span className="text-[#E87A96] font-serif font-bold">₹3,503</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="pt-2 flex justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              window.print();
              toast({ type: 'info', title: 'Preparing Invoice PDF...' });
            }}
          >
            🖨️ Invoice PDF
          </Button>

          <Button
            variant="pink"
            size="sm"
            onClick={() => {
              toast({ type: 'luxury', title: 'Order Reordered!', description: 'Items added back to your bag.' });
              onClose();
            }}
          >
            Reorder All Formulations
          </Button>
        </div>
      </div>
    </Modal>
  );
};
