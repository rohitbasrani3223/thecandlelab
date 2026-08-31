import React from 'react';
import { printOrderInvoice } from '../../utils/printInvoice';
import type { InvoiceOrderData } from '../../utils/printInvoice';

export interface PrintableInvoiceProps {
  order: InvoiceOrderData;
  mode?: 'invoice' | 'packingslip';
  onClose?: () => void;
}

export const PrintableInvoice: React.FC<PrintableInvoiceProps> = ({
  order,
  mode = 'invoice',
  onClose,
}) => {
  const orderId = order.orderNumber || order.id || '';
  const cleanId = orderId.replace(/^#/, '');
  const invoiceNo = orderId ? `INV-${cleanId.replace(/[^A-Za-z0-9]/g, '')}` : '';

  const formattedDate = order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) : '');

  const customerName = order.customerName || '';
  const customerEmail = order.customerEmail || order.email || '';
  const customerPhone = order.customerPhone || order.phone || '';
  const shippingAddress = order.shippingAddress || order.address || '';

  let totalAmount = 0;
  if (typeof order.totalAmount === 'number') {
    totalAmount = order.totalAmount;
  } else if (typeof order.totalAmount === 'string') {
    totalAmount = Number(order.totalAmount.replace(/[^0-9.]/g, '')) || 0;
  }

  let parsedItems = Array.isArray(order.itemsList) && order.itemsList.length > 0
    ? order.itemsList
    : Array.isArray(order.items) && order.items.length > 0
      ? order.items
      : (typeof order.items === 'string' && order.items.trim())
        ? [{
            name: order.items,
            quantity: 1,
            price: totalAmount,
            fragrance: '',
            size: '',
            wickType: '',
          }]
        : [];

  if (totalAmount === 0 && parsedItems.length > 0) {
    totalAmount = parsedItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
  }
  const discount = order.discount || 0;
  const shippingFee = order.shippingFee !== undefined ? order.shippingFee : (order.shipping || 0);
  const subtotal = order.subtotal !== undefined ? order.subtotal : (totalAmount > 0 ? (totalAmount - shippingFee + discount) : 0);

  const paymentMethod = order.paymentMethod || 'Online (Razorpay / UPI)';
  const isCOD = paymentMethod.toLowerCase().includes('cod') || paymentMethod.toLowerCase().includes('cash');
  const paymentStatus = isCOD ? 'PENDING (Cash on Delivery)' : 'PAID (Online Verified)';
  const paymentRef = order.paymentId || (isCOD ? 'COD_VERIFIED' : (cleanId ? `PAY_${cleanId}` : '—'));
  const trackingAWB = order.trackingNumber || order.awb || '—';

  return (
    <div className="bg-white border border-[#EADDCB] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl max-w-4xl mx-auto font-sans text-xs text-[#232323]">
      {/* Top Action Bar (Screen Only) */}
      <div className="flex items-center justify-between border-b border-[#EADDCB] pb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#8B6F4E] animate-pulse"></span>
          <h3 className="font-serif font-bold text-lg text-[#232323]">
            {mode === 'packingslip' ? 'Atelier Dispatch Packing Slip' : 'Original Tax Invoice Preview'}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => printOrderInvoice(order, 'invoice')}
            className="px-4 py-2 bg-[#232323] text-white hover:bg-[#111111] rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-all"
          >
            <span>🖨️</span>
            <span>Print Tax Invoice (A4)</span>
          </button>

          <button
            onClick={() => printOrderInvoice(order, 'packingslip')}
            className="px-3.5 py-2 bg-[#FAF7F2] border border-[#EADDCB] hover:border-[#8B6F4E] text-[#232323] rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <span>📋</span>
            <span>Print Packing Slip</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#FAF7F2] hover:bg-[#EADDCB] flex items-center justify-center font-bold text-[#7D6F63] cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Invoice Document Body */}
      <div className="border border-[#EADDCB] rounded-xl p-6 bg-white space-y-6">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-b-2 border-[#8B6F4E] pb-4">
          <div>
            <h1 className="font-serif font-black text-2xl tracking-widest uppercase text-[#232323]">
              THE CANDLE LAB
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#8B6F4E] mt-0.5">
              Luxury Soy Wax Candles & Fragrance Atelier
            </p>
            <div className="text-[11px] text-[#5C5149] mt-2 space-y-0.5 leading-relaxed">
              <p>The Candle Lab Atelier Private Limited</p>
              <p>402, Heritage Sanctuary, Bandra West, Mumbai, MH - 400050</p>
              <p><strong>GSTIN:</strong> 27AAACT9821Q1Z4 | <strong>MSME:</strong> UDYAM-MH-19-0048192</p>
              <p><strong>Concierge:</strong> concierge@thecandlelab.in | +91 98200 12345</p>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1">
            <span className="inline-block px-3 py-1 bg-[#FAF7F2] border border-[#EADDCB] rounded-md font-serif font-bold text-sm text-[#8B6F4E]">
              {mode === 'packingslip' ? 'ATELIER PACKING SLIP' : 'ORIGINAL TAX INVOICE'}
            </span>
            <p className="text-[11px] text-[#7D6F63]">Date: {formattedDate}</p>
            <p className="text-[11px] text-[#7D6F63]">Invoice: <strong className="text-[#232323]">{invoiceNo}</strong></p>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-[#FAF7F2] rounded-xl border border-[#EADDCB]">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#7D6F63] font-bold uppercase text-[10px]">Order Number:</span>
              <span className="font-mono font-bold text-[#8B6F4E]">{orderId}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#7D6F63] font-bold uppercase text-[10px]">Order Date:</span>
              <span className="font-medium text-[#232323]">{formattedDate}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#7D6F63] font-bold uppercase text-[10px]">Place of Supply:</span>
              <span className="font-medium text-[#232323]">{order.state || 'Maharashtra (27)'}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#7D6F63] font-bold uppercase text-[10px]">Payment Method:</span>
              <span className="font-medium text-[#232323]">{paymentMethod}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#7D6F63] font-bold uppercase text-[10px]">Payment Status:</span>
              <span className={`font-bold text-xs ${isCOD ? 'text-[#B45309]' : 'text-[#15803D]'}`}>
                {paymentStatus}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#7D6F63] font-bold uppercase text-[10px]">Ref / Payment ID:</span>
              <span className="font-mono text-[10px] text-[#5C5149]">{paymentRef}</span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 border border-[#EADDCB] rounded-xl bg-white space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6F4E] block border-b border-[#F0E6D8] pb-1">
              👤 Billed To (Customer)
            </span>
            <p className="font-bold text-sm text-[#232323]">{customerName}</p>
            <p className="text-[#5C5149]">✉️ {customerEmail}</p>
            <p className="text-[#5C5149]">📞 {customerPhone}</p>
          </div>

          <div className="p-4 border border-[#EADDCB] rounded-xl bg-white space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6F4E] block border-b border-[#F0E6D8] pb-1">
              🏠 Delivery Destination & Courier
            </span>
            <p className="text-[#232323] font-medium leading-relaxed">{shippingAddress}</p>
            <p className="text-[11px] font-mono text-[#7D6F63] pt-1">
              Courier Tracking AWB: <strong className="text-[#8B6F4E]">{trackingAWB}</strong>
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse border border-[#EADDCB]">
            <thead>
              <tr className="bg-[#232323] text-white uppercase text-[10px] font-bold tracking-wider">
                <th className="p-3 text-center w-10 border border-[#232323]">#</th>
                <th className="p-3 border border-[#232323]">Formulation & Specs</th>
                <th className="p-3 text-center border border-[#232323]">SKU</th>
                <th className="p-3 text-center border border-[#232323]">Qty</th>
                <th className="p-3 text-right border border-[#232323]">Unit Price</th>
                <th className="p-3 text-right border border-[#232323]">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADDCB]">
              {parsedItems.map((item: any, idx: number) => {
                const qty = item.quantity || 1;
                const unitPrice = item.price || 0;
                const specs = [item.fragrance, item.size, item.wickType, item.color].filter(Boolean).join(' • ');

                return (
                  <tr key={idx} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="p-3 text-center font-bold text-[#7D6F63] border border-[#EADDCB]">{idx + 1}</td>
                    <td className="p-3 border border-[#EADDCB]">
                      <strong className="text-xs text-[#232323] block">🕯️ {item.name}</strong>
                      {specs && <span className="text-[11px] text-[#5C5149] block">{specs}</span>}
                      {item.giftPackaging && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#FDF2F4] border border-[#F5CAD2] text-[#C94C6D] text-[9px] font-bold rounded">
                          🎁 Luxury Gift Box & Wax Seal
                        </span>
                      )}
                      {item.customMessage && (
                        <div className="mt-1 p-2 bg-[#FFFDF9] border-l-2 border-[#8B6F4E] text-[10px] italic text-[#4A3E36]">
                          " {item.customMessage} "
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center font-mono text-[10px] text-[#7D6F63] border border-[#EADDCB]">
                      {item.sku || `TCL-${101 + idx}`}
                    </td>
                    <td className="p-3 text-center font-bold text-sm text-[#232323] border border-[#EADDCB]">
                      {qty}
                    </td>
                    <td className="p-3 text-right text-xs font-medium border border-[#EADDCB]">
                      ₹{unitPrice.toLocaleString('en-IN')}.00
                    </td>
                    <td className="p-3 text-right font-bold text-xs text-[#232323] border border-[#EADDCB]">
                      ₹{(unitPrice * qty).toLocaleString('en-IN')}.00
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pricing Summary & Candle Guidelines */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-7 p-4 bg-[#FAF7F2] rounded-xl border border-[#EADDCB] text-[11px] text-[#5C5149] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6F4E] block">
              🕯️ Atelier Botanical Care Guidelines
            </span>
            <p>• Handcrafted with 100% natural organic soy wax & therapeutic grade fragrance blends.</p>
            <p>• Allow wax melt pool to reach all jar edges on initial burn to avoid tunneling.</p>
            <p>• Trim wood or cotton wick to 1/4" before lighting for clean, smoke-free diffusion.</p>
          </div>

          <div className="md:col-span-5 border border-[#EADDCB] rounded-xl overflow-hidden">
            <table className="w-full text-xs">
              <tbody className="divide-y divide-[#F0E6D8]">
                <tr>
                  <td className="p-2.5 text-[#7D6F63]">Subtotal:</td>
                  <td className="p-2.5 text-right font-medium">₹{subtotal.toLocaleString('en-IN')}.00</td>
                </tr>
                {discount > 0 && (
                  <tr className="text-[#15803D]">
                    <td className="p-2.5 font-semibold">Promo Discount:</td>
                    <td className="p-2.5 text-right font-bold">-₹{discount.toLocaleString('en-IN')}.00</td>
                  </tr>
                )}
                <tr>
                  <td className="p-2.5 text-[#7D6F63]">Courier Delivery:</td>
                  <td className="p-2.5 text-right font-medium">
                    {shippingFee === 0 ? <span className="text-[#15803D] font-bold">FREE</span> : `₹${shippingFee.toLocaleString('en-IN')}.00`}
                  </td>
                </tr>
                <tr className="bg-[#232323] text-white font-bold">
                  <td className="p-3 text-sm">{isCOD ? 'Due on Delivery:' : 'Grand Total:'}</td>
                  <td className="p-3 text-right text-base text-white">₹{totalAmount.toLocaleString('en-IN')}.00</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer & Signatory */}
        <div className="flex items-end justify-between border-t border-dashed border-[#C8B199] pt-4 text-[10px] text-[#7D6F63]">
          <div>
            <p>Computer-generated luxury Tax Invoice issued by The Candle Lab Atelier.</p>
            <p className="italic">Questions? Contact concierge@thecandlelab.in</p>
          </div>
          <div className="text-right">
            <p className="font-serif font-bold text-sm text-[#8B6F4E] italic">The Candle Lab Atelier</p>
            <span className="uppercase text-[9px] font-bold tracking-wider">Authorized Signatory</span>
          </div>
        </div>
      </div>
    </div>
  );
};
