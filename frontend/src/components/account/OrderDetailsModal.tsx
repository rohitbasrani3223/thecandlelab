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
        <div className="p-4 bg-[#F4EFE6] border border-[#D4AF37]/50 rounded-md flex items-center justify-between">
          <div>
            <Badge variant="gold" icon={<SparklesIcon size={12} />}>IN TRANSIT • COURIER</Badge>
            <span className="text-xs font-bold text-[#2A1E17] block mt-1">Est. Arrival: Aug 1 - Aug 3</span>
          </div>
          <span className="font-mono text-xs text-[#8C7A6B]">Placed July 29, 2026</span>
        </div>

        {/* Itemized Products */}
        <div className="space-y-3">
          <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C7A6B] block">
            Purchased Formulations (2 Items)
          </span>

          <div className="p-3 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕯️</span>
              <div>
                <strong className="text-[#2A1E17] block">Velvet Rose & Smoked Amber</strong>
                <span className="text-[10px] text-[#8C7A6B]">Qty: 1 • 12 oz Frosted Glass</span>
              </div>
            </div>
            <span className="font-bold text-[#2A1E17]">$78.00</span>
          </div>

          <div className="p-3 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕯️</span>
              <div>
                <strong className="text-[#2A1E17] block">French Bourbon Vanilla Bean</strong>
                <span className="text-[10px] text-[#8C7A6B]">Qty: 1 • 16 oz 3-Wick Jar</span>
              </div>
            </div>
            <span className="font-bold text-[#2A1E17]">$94.00</span>
          </div>
        </div>

        {/* Order Price Totals Breakdown */}
        <div className="p-4 bg-[#FAF6F0] border border-[#E5D9C5] rounded-md space-y-1.5">
          <div className="flex justify-between text-[#8C7A6B]">
            <span>Subtotal</span>
            <span>$172.00</span>
          </div>
          <div className="flex justify-between text-[#2E6F40] font-semibold">
            <span>Promo Savings (LUXURY10)</span>
            <span>-$17.20</span>
          </div>
          <div className="flex justify-between text-[#8C7A6B]">
            <span>Gold Express Shipping</span>
            <span>FREE</span>
          </div>
          <div className="flex justify-between text-[#8C7A6B]">
            <span>Tax (7%)</span>
            <span>$10.84</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-[#2A1E17] pt-2 border-t border-[#E5D9C5]">
            <span>Total Paid</span>
            <span className="text-[#D4AF37] font-serif">$165.64</span>
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
            variant="gold"
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
