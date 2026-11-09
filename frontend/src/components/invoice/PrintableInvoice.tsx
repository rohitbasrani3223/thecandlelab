import React from 'react';
import { printOrderInvoice, deduplicateOrderItems } from '../../utils/printInvoice';
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

  let parsedItems = deduplicateOrderItems(
    Array.isArray(order.itemsList) && order.itemsList.length > 0
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
          : []
  );

  if (totalAmount === 0 && parsedItems.length > 0) {
    totalAmount = parsedItems.reduce((sum, item) => sum + (Number(item.price || 0) * Number(item.quantity || 1)), 0);
  }
  const discount = order.discount || 0;
  const shippingFee = order.shippingFee !== undefined ? order.shippingFee : (order.shipping || 0);
  const subtotal = order.subtotal !== undefined ? order.subtotal : (totalAmount > 0 ? (totalAmount - shippingFee + discount) : 0);

  const isCOD = Boolean(
    order.isCOD ||
    String(order.paymentMethod || '').toLowerCase().includes('cod') ||
    String(order.paymentMethod || '').toLowerCase().includes('cash') ||
    String(order.status || '').toLowerCase().includes('cod')
  );
  const paymentMethod = isCOD ? 'Cash on Delivery (COD)' : (order.paymentMethod || 'Online (Razorpay / UPI)');
  const paymentStatus = isCOD ? 'PENDING (Cash on Delivery)' : 'PAID (Online Verified)';
  const paymentRef = order.paymentId || (isCOD ? 'COD_VERIFIED' : (cleanId ? `PAY_${cleanId}` : '—'));

  return (
    <div className="bg-white border border-[#EADDCB] rounded-2xl sm:rounded-3xl shadow-2xl max-w-4xl w-full mx-auto font-sans text-xs text-[#232323] overflow-hidden">
      {/* 1. STICKY TOP ACTION BAR (Never scrolls out of sight!) */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#EADDCB] px-3.5 sm:px-6 py-3 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-[#8B6F4E] shrink-0 animate-pulse" />
          <h3 className="font-serif font-bold text-sm sm:text-base text-[#232323] truncate">
            {mode === 'packingslip' ? 'Atelier Packing Slip' : 'Original Tax Invoice'}
          </h3>
          <span className="hidden md:inline-block text-[11px] font-mono text-[#8B6F4E] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-[#EADDCB]">
            {invoiceNo}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => printOrderInvoice(order, 'invoice')}
            className="px-3 sm:px-4 py-2 bg-[#232323] hover:bg-[#111111] text-white rounded-xl font-bold text-[11px] sm:text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all hover:scale-102 active:scale-98"
            title="Download or Print official A4 PDF"
          >
            <span>🖨️</span>
            <span className="hidden sm:inline">Print / Download (A4)</span>
            <span className="sm:hidden">Print A4</span>
          </button>

          <button
            onClick={() => printOrderInvoice(order, 'packingslip')}
            className="hidden sm:flex px-3 py-2 bg-[#FAF7F2] border border-[#EADDCB] hover:border-[#8B6F4E] text-[#232323] rounded-xl font-bold text-xs items-center gap-1.5 cursor-pointer transition-all"
            title="Print Atelier Dispatch Slip"
          >
            <span>📋</span>
            <span>Slip</span>
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FAF7F2] hover:bg-[#232323] text-[#7D6F63] hover:text-white flex items-center justify-center font-bold text-sm transition-all cursor-pointer border border-[#EADDCB]"
              aria-label="Close invoice preview"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. INVOICE DOCUMENT BODY */}
      <div className="p-3.5 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 bg-white">
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 border-b-2 border-[#8B6F4E] pb-4">
          <div>
            <h1 className="font-serif font-black text-xl sm:text-2xl tracking-widest uppercase text-[#232323]">
              THE CANDLE LAB
            </h1>
            <p className="text-[10px] uppercase font-bold tracking-widest text-[#8B6F4E] mt-0.5">
              Luxury Soy Wax Candles & Fragrance Atelier
            </p>
            <div className="text-[11px] text-[#5C5149] mt-2 space-y-0.5 leading-relaxed">
              <p className="font-medium text-[#232323]">The Candle Lab Atelier</p>
              <p>Katni, Madhya Pradesh - 483501</p>
              <p>
                <strong>Concierge:</strong> support.thecandlelab@gmail.com | +91 6264885453
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between gap-2 sm:gap-1 bg-[#FAF7F2] sm:bg-transparent p-2.5 sm:p-0 rounded-xl sm:rounded-none border sm:border-0 border-[#EADDCB]">
            <span className="inline-block px-2.5 py-1 bg-white sm:bg-[#FAF7F2] border border-[#EADDCB] rounded-md font-serif font-bold text-xs sm:text-sm text-[#8B6F4E]">
              {mode === 'packingslip' ? 'ATELIER PACKING SLIP' : 'ORIGINAL TAX INVOICE'}
            </span>
            <div className="text-right text-[11px] text-[#7D6F63] space-y-0.5">
              <p>Date: <strong className="text-[#232323]">{formattedDate}</strong></p>
              <p>Invoice: <strong className="text-[#232323]">{invoiceNo}</strong></p>
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 p-3 sm:p-4 bg-[#FAF7F2] rounded-xl sm:rounded-2xl border border-[#EADDCB]">
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
              <span className="font-medium text-[#232323]">{order.state || 'Madhya Pradesh (23)'}</span>
            </div>
          </div>

          <div className="space-y-1.5 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#EADDCB]">
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
              <span className="font-mono text-[10px] text-[#5C5149] truncate max-w-[160px] sm:max-w-none">{paymentRef}</span>
            </div>
          </div>
        </div>

        {/* Customer & Shipping Addresses */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="p-3.5 sm:p-4 border border-[#EADDCB] rounded-xl sm:rounded-2xl bg-[#FCFAF6] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6F4E] block border-b border-[#F0E6D8] pb-1">
              👤 Billed To (Customer)
            </span>
            <p className="font-bold text-sm text-[#232323]">{customerName || 'Honored Patron'}</p>
            {customerEmail && <p className="text-[#5C5149] text-[11px] truncate">✉️ {customerEmail}</p>}
            {customerPhone && <p className="text-[#5C5149] text-[11px]">📞 {customerPhone}</p>}
          </div>

          <div className="p-3.5 sm:p-4 border border-[#EADDCB] rounded-xl sm:rounded-2xl bg-[#FCFAF6] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6F4E] block border-b border-[#F0E6D8] pb-1">
              🏠 Delivery Destination
            </span>
            <p className="text-[#232323] font-medium leading-relaxed text-xs">
              {shippingAddress || 'Address on file'}
            </p>
          </div>
        </div>

        {/* 3. ITEM PRESENTATION */}
        {/* A. MOBILE CARD VIEW (<640px) - Guaranteed zero horizontal cutoffs! */}
        <div className="block sm:hidden space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#7D6F63] px-1 flex items-center justify-between">
            <span>Ordered Formulations ({parsedItems.length})</span>
            <span>Price & Total</span>
          </div>

          {parsedItems.map((item: any, idx: number) => {
            const qty = item.quantity || 1;
            const unitPrice = item.price || 0;
            const specs = [item.fragrance, item.size, item.wickType, item.color].filter(Boolean).join(' • ');

            return (
              <div
                key={idx}
                className="p-3 rounded-xl border border-[#EADDCB] bg-[#FAF7F2] space-y-2 shadow-2xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <strong className="text-xs text-[#232323] block leading-snug">
                      🕯️ {item.name}
                    </strong>
                    {specs && (
                      <p className="text-[11px] text-[#6E6053] mt-0.5 leading-normal">
                        {specs}
                      </p>
                    )}
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-bold text-sm text-[#232323] block">
                      ₹{(unitPrice * qty).toLocaleString('en-IN')}.00
                    </span>
                    <span className="text-[10px] text-[#7D6F63] block">
                      {qty} × ₹{unitPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* SKU Badge & Gift Wrap Pill */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#EADDCB]/60">
                  <span className="font-mono text-[9px] bg-white border border-[#EADDCB] px-1.5 py-0.5 rounded text-[#7D6F63]">
                    SKU: {item.sku || `TCL-${101 + idx}`}
                  </span>
                  {item.giftPackaging && (
                    <span className="px-1.5 py-0.5 bg-[#FDF2F4] border border-[#F5CAD2] text-[#C94C6D] text-[9px] font-bold rounded">
                      🎁 Gift Box & Wax Seal
                    </span>
                  )}
                </div>

                {/* Custom Gift Note */}
                {item.customMessage && (
                  <div className="mt-1 p-2 bg-white border-l-2 border-[#8B6F4E] rounded-r-md">
                    <span className="text-[9px] uppercase font-bold text-[#8B6F4E] block tracking-wider mb-0.5">
                      💌 Personal Gift Note:
                    </span>
                    <p className={`text-sm text-[#232323] leading-relaxed ${
                      item.customMessageFont === 'handscript'
                        ? 'font-handscript'
                        : item.customMessageFont === 'aristocratic'
                        ? 'font-aristocratic'
                        : item.customMessageFont === 'garamond'
                        ? 'font-garamond italic'
                        : item.customMessageFont === 'cinzel'
                        ? 'font-cinzel text-xs font-bold'
                        : item.customMessageFont === 'sans'
                        ? 'font-sans text-xs'
                        : 'font-calligraphy'
                    }`}>
                      "{item.customMessage}"
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* B. DESKTOP TABULAR VIEW (>=640px) */}
        <div className="hidden sm:block border border-[#EADDCB] rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#232323] text-white uppercase text-[10px] font-bold tracking-wider">
                <th className="p-3 text-center w-12 border-r border-white/10">#</th>
                <th className="p-3 border-r border-white/10">Formulation & Specs</th>
                <th className="p-3 text-center w-24 border-r border-white/10">SKU</th>
                <th className="p-3 text-center w-14 border-r border-white/10">Qty</th>
                <th className="p-3 text-right w-24 border-r border-white/10">Unit Price</th>
                <th className="p-3 text-right w-28">Total (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EADDCB] bg-white">
              {parsedItems.map((item: any, idx: number) => {
                const qty = item.quantity || 1;
                const unitPrice = item.price || 0;
                const specs = [item.fragrance, item.size, item.wickType, item.color].filter(Boolean).join(' • ');

                return (
                  <tr key={idx} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="p-3 text-center font-bold text-[#7D6F63] border-r border-[#EADDCB]">
                      {idx + 1}
                    </td>
                    <td className="p-3 border-r border-[#EADDCB]">
                      <strong className="text-xs text-[#232323] block">🕯️ {item.name}</strong>
                      {specs && <span className="text-[11px] text-[#5C5149] block mt-0.5">{specs}</span>}
                      {item.giftPackaging && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-[#FDF2F4] border border-[#F5CAD2] text-[#C94C6D] text-[9px] font-bold rounded">
                          🎁 Luxury Gift Box & Wax Seal
                        </span>
                      )}
                      {item.customMessage && (
                        <div className="mt-1.5 p-2 bg-[#FAF7F2] border-l-2 border-[#8B6F4E] rounded-r-md">
                          <span className="text-[9px] uppercase font-bold text-[#8B6F4E] block tracking-wider mb-0.5">
                            💌 Personal Gift Note:
                          </span>
                          <p className={`text-base text-[#232323] leading-relaxed ${
                            item.customMessageFont === 'handscript'
                              ? 'font-handscript'
                              : item.customMessageFont === 'aristocratic'
                              ? 'font-aristocratic'
                              : item.customMessageFont === 'garamond'
                              ? 'font-garamond italic'
                              : item.customMessageFont === 'cinzel'
                              ? 'font-cinzel text-xs font-bold'
                              : item.customMessageFont === 'sans'
                              ? 'font-sans text-xs'
                              : 'font-calligraphy'
                          }`}>
                            "{item.customMessage}"
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="p-3 text-center font-mono text-[10px] text-[#7D6F63] border-r border-[#EADDCB]">
                      {item.sku || `TCL-${101 + idx}`}
                    </td>
                    <td className="p-3 text-center font-bold text-sm text-[#232323] border-r border-[#EADDCB]">
                      {qty}
                    </td>
                    <td className="p-3 text-right text-xs font-medium border-r border-[#EADDCB]">
                      ₹{unitPrice.toLocaleString('en-IN')}.00
                    </td>
                    <td className="p-3 text-right font-bold text-xs text-[#232323]">
                      ₹{(unitPrice * qty).toLocaleString('en-IN')}.00
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 4. PRICING SUMMARY & BOTANICAL CARE GUIDELINES */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          <div className="md:col-span-7 p-3.5 sm:p-4 bg-[#FAF7F2] rounded-xl sm:rounded-2xl border border-[#EADDCB] text-[11px] text-[#5C5149] space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B6F4E] block">
              🕯️ Atelier Botanical Care Guidelines
            </span>
            <p>• Handcrafted with 100% natural organic soy wax & therapeutic grade fragrance blends.</p>
            <p>• Allow wax melt pool to reach all jar edges on initial burn to avoid tunneling.</p>
            <p>• Trim wood or cotton wick to 1/4" before lighting for clean, smoke-free diffusion.</p>
          </div>

          <div className="md:col-span-5 border border-[#EADDCB] rounded-xl sm:rounded-2xl overflow-hidden bg-white">
            <table className="w-full text-xs">
              <tbody className="divide-y divide-[#F0E6D8]">
                <tr>
                  <td className="p-2.5 sm:p-3 text-[#7D6F63]">Subtotal:</td>
                  <td className="p-2.5 sm:p-3 text-right font-medium">₹{subtotal.toLocaleString('en-IN')}.00</td>
                </tr>
                {discount > 0 && (
                  <tr className="text-[#15803D]">
                    <td className="p-2.5 sm:p-3 font-semibold">Promo Discount:</td>
                    <td className="p-2.5 sm:p-3 text-right font-bold">-₹{discount.toLocaleString('en-IN')}.00</td>
                  </tr>
                )}
                <tr>
                  <td className="p-2.5 sm:p-3 text-[#7D6F63]">Courier Delivery:</td>
                  <td className="p-2.5 sm:p-3 text-right font-medium">
                    {shippingFee === 0 ? (
                      <span className="text-[#15803D] font-bold">FREE</span>
                    ) : (
                      `₹${shippingFee.toLocaleString('en-IN')}.00`
                    )}
                  </td>
                </tr>
                <tr className="bg-[#232323] text-white font-bold">
                  <td className="p-3 text-xs sm:text-sm">{isCOD ? 'Due on Delivery:' : 'Grand Total:'}</td>
                  <td className="p-3 text-right text-sm sm:text-base text-white">
                    ₹{totalAmount.toLocaleString('en-IN')}.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* 5. FOOTER & AUTHORIZED SIGNATORY */}
        <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 border-t border-dashed border-[#C8B199] pt-4 text-[10px] text-[#7D6F63]">
          <div className="text-center sm:text-left space-y-0.5">
            <p>Computer-generated luxury Tax Invoice issued by The Candle Lab Atelier.</p>
            <p className="italic">Questions? Contact support.thecandlelab@gmail.com</p>
          </div>
          <div className="text-center sm:text-right">
            <p className="font-serif font-bold text-sm text-[#8B6F4E] italic">The Candle Lab Atelier</p>
            <span className="uppercase text-[9px] font-bold tracking-wider">Authorized Signatory</span>
          </div>
        </div>
      </div>
    </div>
  );
};
