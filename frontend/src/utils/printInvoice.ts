/**
 * The Candle Lab - Luxury Tax Invoice & Packing Slip Print Utility
 * Generates an elegant, high-contrast, professional A4 printable invoice/bill.
 */

export interface InvoiceItem {
  name: string;
  fragrance?: string;
  size?: string;
  color?: string;
  wickType?: string;
  sku?: string;
  quantity: number;
  price: number;
  giftPackaging?: boolean;
  customMessage?: string;
  image?: string;
}

export interface InvoiceOrderData {
  id?: string;
  orderNumber?: string;
  date?: string;
  createdAt?: string;
  customerName?: string;
  customerEmail?: string;
  email?: string;
  customerPhone?: string;
  phone?: string;
  shippingAddress?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  paymentMethod?: string;
  paymentId?: string;
  status?: string;
  trackingNumber?: string;
  awb?: string;
  courier?: string;
  items?: InvoiceItem[] | string;
  itemsList?: InvoiceItem[];
  itemsSummary?: string;
  subtotal?: number;
  discount?: number;
  shipping?: number;
  shippingFee?: number;
  tax?: number;
  totalAmount?: number | string;
}

function numberToWordsINR(num: number): string {
  const a = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const n = Math.floor(Math.abs(num));
  if (n === 0) return 'Zero Rupees Only';

  function convert(n: number): string {
    if (n < 20) return a[n];
    if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? ' ' + a[n % 10] : '');
    if (n < 1000) return a[Math.floor(n / 100)] + ' Hundred' + (n % 100 !== 0 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 !== 0 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 !== 0 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 !== 0 ? ' ' + convert(n % 10000000) : '');
  }

  return 'Rupees ' + convert(n) + ' Only';
}

export function generateInvoiceHTML(order: InvoiceOrderData, mode: 'invoice' | 'packingslip' = 'invoice'): string {
  const orderId = order.orderNumber || order.id || '';
  const cleanId = orderId.replace(/^#/, '');
  const invoiceNo = orderId ? `INV-${cleanId.replace(/[^A-Za-z0-9]/g, '')}` : '';
  
  const formattedDate = order.date || (order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }) : '');
  const formattedTime = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const customerName = order.customerName || '';
  const customerEmail = order.customerEmail || order.email || '';
  const customerPhone = order.customerPhone || order.phone || '';
  const shippingAddress = order.shippingAddress || order.address || '';

  // Parse total amount
  let totalAmount = 0;
  if (typeof order.totalAmount === 'number') {
    totalAmount = order.totalAmount;
  } else if (typeof order.totalAmount === 'string') {
    totalAmount = Number(order.totalAmount.replace(/[^0-9.]/g, '')) || 0;
  }

  // Normalize items
  let parsedItems: InvoiceItem[] = [];
  if (Array.isArray(order.itemsList) && order.itemsList.length > 0) {
    parsedItems = order.itemsList;
  } else if (Array.isArray(order.items) && order.items.length > 0) {
    parsedItems = order.items;
  } else if (typeof order.items === 'string' && order.items.trim()) {
    parsedItems = [{
      name: order.items,
      quantity: 1,
      price: totalAmount,
      fragrance: '',
      size: '',
      wickType: '',
    }];
  }

  const discount = order.discount || 0;
  const shippingFee = order.shippingFee !== undefined ? order.shippingFee : (order.shipping || 0);
  const subtotal = order.subtotal !== undefined ? order.subtotal : (totalAmount > 0 ? (totalAmount - shippingFee + discount) : 0);

  const paymentMethod = order.paymentMethod || 'Online (Razorpay / UPI)';
  const isCOD = paymentMethod.toLowerCase().includes('cod') || paymentMethod.toLowerCase().includes('cash');
  const paymentStatus = isCOD ? 'PENDING (Cash on Delivery)' : 'PAID (Online Verified)';
  const paymentRef = order.paymentId || (isCOD ? 'COD_VERIFIED' : (cleanId ? `PAY_${cleanId}` : '—'));
  const trackingAWB = order.trackingNumber || order.awb || '—';
  const courier = order.courier || 'Express Air Courier';

  const totalQuantity = parsedItems.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);
  const amountWords = numberToWordsINR(totalAmount);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${mode === 'packingslip' ? 'Packing Slip' : 'Tax Invoice'} - ${orderId} - The Candle Lab</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 12mm 15mm 15mm 15mm;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #1a1a1a;
      background: #ffffff;
      font-size: 11px;
      line-height: 1.45;
      -webkit-font-smoothing: antialiased;
      padding: 10px;
    }
    .invoice-wrapper {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #d4c5b2;
      padding: 24px 28px;
      border-radius: 6px;
    }
    .header-table {
      width: 100%;
      border-bottom: 2px solid #8B6F4E;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    .brand-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #232323;
      margin-bottom: 2px;
    }
    .brand-subtitle {
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #8B6F4E;
      font-weight: 700;
      margin-bottom: 4px;
    }
    .company-details {
      font-size: 10px;
      color: #555555;
      line-height: 1.35;
    }
    .doc-badge {
      text-align: right;
    }
    .doc-type-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 16px;
      font-weight: 800;
      color: #8B6F4E;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .doc-copy-tag {
      display: inline-block;
      background: #FAF7F2;
      border: 1px solid #EADDCB;
      padding: 3px 8px;
      font-size: 9px;
      font-weight: 700;
      color: #232323;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .meta-grid {
      display: table;
      width: 100%;
      margin-bottom: 16px;
      border: 1px solid #EADDCB;
      background: #FAF7F2;
      border-radius: 4px;
      padding: 10px 12px;
    }
    .meta-col {
      display: table-cell;
      width: 50%;
      vertical-align: top;
      padding: 2px 6px;
    }
    .meta-item {
      margin-bottom: 4px;
      font-size: 10.5px;
    }
    .meta-label {
      font-weight: 700;
      color: #7D6F63;
      text-transform: uppercase;
      font-size: 9px;
      letter-spacing: 0.5px;
      display: inline-block;
      width: 110px;
    }
    .meta-value {
      font-weight: 600;
      color: #1a1a1a;
    }
    .address-grid {
      display: table;
      width: 100%;
      margin-bottom: 16px;
    }
    .address-box {
      display: table-cell;
      width: 50%;
      padding: 10px 12px;
      border: 1px solid #EADDCB;
      background: #FFFFFF;
      vertical-align: top;
    }
    .address-box:first-child {
      border-right: none;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .address-box:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
    .box-heading {
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #8B6F4E;
      border-bottom: 1px solid #F0E6D8;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
    }
    .items-table th {
      background: #232323;
      color: #ffffff;
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      padding: 8px 10px;
      text-align: left;
      border: 1px solid #232323;
    }
    .items-table th.text-right, .items-table td.text-right {
      text-align: right;
    }
    .items-table th.text-center, .items-table td.text-center {
      text-align: center;
    }
    .items-table td {
      padding: 8px 10px;
      border: 1px solid #EADDCB;
      font-size: 10.5px;
      vertical-align: top;
    }
    .items-table tbody tr:nth-child(even) {
      background-color: #FAF7F2;
    }
    .item-title {
      font-weight: 700;
      color: #232323;
      font-size: 11px;
    }
    .item-spec {
      font-size: 9.5px;
      color: #5C5149;
      margin-top: 2px;
    }
    .gift-badge {
      display: inline-block;
      margin-top: 4px;
      padding: 2px 6px;
      background: #FDF2F4;
      border: 1px solid #F5CAD2;
      color: #C94C6D;
      font-size: 8.5px;
      font-weight: 700;
      border-radius: 3px;
    }
    .gift-message-box {
      margin-top: 4px;
      padding: 4px 6px;
      background: #FFFDF9;
      border-left: 2px solid #8B6F4E;
      font-style: italic;
      font-size: 9px;
      color: #4A3E36;
    }
    .totals-wrapper {
      display: table;
      width: 100%;
      margin-bottom: 16px;
    }
    .terms-col {
      display: table-cell;
      width: 58%;
      vertical-align: top;
      padding-right: 14px;
    }
    .totals-col {
      display: table-cell;
      width: 42%;
      vertical-align: top;
    }
    .totals-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #EADDCB;
    }
    .totals-table td {
      padding: 5px 8px;
      font-size: 10.5px;
      border-bottom: 1px solid #F0E6D8;
    }
    .totals-table tr.grand-total {
      background: #232323;
      color: #ffffff;
    }
    .totals-table tr.grand-total td {
      font-size: 13px;
      font-weight: 800;
      padding: 8px 10px;
      color: #ffffff;
      border-bottom: none;
    }
    .amount-words-box {
      margin-top: 8px;
      padding: 6px 8px;
      background: #FAF7F2;
      border: 1px solid #EADDCB;
      border-radius: 4px;
      font-size: 9.5px;
      color: #232323;
    }
    .candle-care-box {
      border: 1px solid #EADDCB;
      border-radius: 4px;
      padding: 8px 10px;
      background: #FAF7F2;
      font-size: 9px;
      color: #5C5149;
      line-height: 1.35;
    }
    .candle-care-title {
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #8B6F4E;
      margin-bottom: 3px;
      font-size: 9.5px;
    }
    .footer-sign-table {
      width: 100%;
      margin-top: 14px;
      border-top: 1px dashed #C8B199;
      padding-top: 10px;
    }
    .signatory-box {
      text-align: right;
    }
    .signatory-seal {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 13px;
      font-style: italic;
      color: #8B6F4E;
      font-weight: 700;
      margin-bottom: 2px;
    }
    .signatory-label {
      font-size: 9px;
      color: #7D6F63;
      text-transform: uppercase;
      font-weight: 700;
    }
    .footer-note {
      text-align: center;
      margin-top: 14px;
      font-size: 9px;
      color: #8C7A6B;
      font-style: italic;
    }

    @media print {
      body {
        padding: 0;
        background: #ffffff;
      }
      .invoice-wrapper {
        border: none;
        padding: 0;
        max-width: 100%;
      }
      .no-print {
        display: none !important;
      }
    }
  </style>
</head>
<body>

  <div class="invoice-wrapper" id="invoice-content">
    <!-- Header Table -->
    <table class="header-table" width="100%">
      <tr>
        <td width="60%" valign="top">
          <div class="brand-title">THE CANDLE LAB</div>
          <div class="brand-subtitle">LUXURY SOY WAX CANDLES & FRAGRANCE ATELIER</div>
          <div class="company-details">
            <strong>The Candle Lab Atelier Private Limited</strong><br>
            Regd Office: 402, Heritage Sanctuary, Bandra West, Mumbai, MH - 400050<br>
            <strong>GSTIN:</strong> 27AAACT9821Q1Z4 | <strong>MSME Reg:</strong> UDYAM-MH-19-0048192<br>
            <strong>Support:</strong> concierge@thecandlelab.in | <strong>WhatsApp:</strong> +91 98200 12345
          </div>
        </td>
        <td width="40%" valign="top" class="doc-badge">
          <div class="doc-type-title">${mode === 'packingslip' ? 'ATELIER PACKING SLIP' : 'ORIGINAL TAX INVOICE'}</div>
          <div class="doc-copy-tag">${mode === 'packingslip' ? 'Order Dispatch & Packing Checklist' : 'Original for Recipient'}</div>
          <div style="margin-top: 8px; font-size: 10px; color: #555;">
            <strong>Date:</strong> ${formattedDate} • ${formattedTime}
          </div>
        </td>
      </tr>
    </table>

    <!-- Metadata Grid -->
    <div class="meta-grid">
      <div class="meta-col">
        <div class="meta-item"><span class="meta-label">Invoice Number:</span> <span class="meta-value">${invoiceNo}</span></div>
        <div class="meta-item"><span class="meta-label">Order Number:</span> <span class="meta-value" style="font-family: monospace; font-weight: 700; color: #8B6F4E;">${orderId}</span></div>
        <div class="meta-item"><span class="meta-label">Order Date:</span> <span class="meta-value">${formattedDate}</span></div>
        <div class="meta-item"><span class="meta-label">Place of Supply:</span> <span class="meta-value">${order.state || 'Maharashtra (27)'}</span></div>
      </div>
      <div class="meta-col">
        <div class="meta-item"><span class="meta-label">Payment Mode:</span> <span class="meta-value">${paymentMethod}</span></div>
        <div class="meta-item"><span class="meta-label">Payment Status:</span> <span class="meta-value" style="color: ${isCOD ? '#B45309' : '#15803D'}; font-weight: 700;">${paymentStatus}</span></div>
        <div class="meta-item"><span class="meta-label">Transaction Ref:</span> <span class="meta-value" style="font-family: monospace; font-size: 9.5px;">${paymentRef}</span></div>
        <div class="meta-item"><span class="meta-label">Courier & AWB:</span> <span class="meta-value" style="font-family: monospace; font-weight: 700;">${courier} (${trackingAWB})</span></div>
      </div>
    </div>

    <!-- Address Grid -->
    <div class="address-grid">
      <div class="address-box">
        <div class="box-heading">👤 Billed To (Customer Details)</div>
        <div style="font-weight: 700; font-size: 12px; color: #232323; margin-bottom: 2px;">${customerName}</div>
        <div style="color: #555555; margin-bottom: 2px;">✉️ ${customerEmail}</div>
        <div style="color: #555555; margin-bottom: 2px;">📞 ${customerPhone}</div>
      </div>
      <div class="address-box">
        <div class="box-heading">🏠 Shipped & Delivered To</div>
        <div style="font-weight: 600; color: #232323; line-height: 1.35;">
          ${shippingAddress}
        </div>
      </div>
    </div>

    <!-- Items Table -->
    <table class="items-table">
      <thead>
        <tr>
          <th class="text-center" width="5%">#</th>
          <th width="48%">Handcrafted Formulation Details</th>
          <th class="text-center" width="12%">SKU</th>
          <th class="text-center" width="8%">Qty</th>
          <th class="text-right" width="13%">Unit Price</th>
          <th class="text-right" width="14%">Total Amount</th>
        </tr>
      </thead>
      <tbody>
        ${parsedItems.map((item, index) => {
          const qty = item.quantity || 1;
          const unitPrice = item.price || 0;
          const rowTotal = unitPrice * qty;
          const specs = [item.fragrance, item.size, item.wickType, item.color].filter(Boolean).join(' • ');

          return `
          <tr>
            <td class="text-center" style="font-weight: 700; color: #7D6F63;">${index + 1}</td>
            <td>
              <div class="item-title">🕯️ ${item.name}</div>
              ${specs ? `<div class="item-spec">${specs}</div>` : ''}
              ${item.giftPackaging ? `<span class="gift-badge">🎁 Luxury Gift Packaging & Wax Seal Included</span>` : ''}
              ${item.customMessage ? `<div class="gift-message-box"><strong>💌 Handwritten Note:</strong> "${item.customMessage}"</div>` : ''}
            </td>
            <td class="text-center" style="font-family: monospace; font-size: 9.5px; color: #5C5149;">
              ${item.sku || `TCL-${(100 + index)}`}
            </td>
            <td class="text-center" style="font-weight: 800; font-size: 12px; color: #232323;">${qty}</td>
            <td class="text-right font-medium">₹${unitPrice.toLocaleString('en-IN')}.00</td>
            <td class="text-right" style="font-weight: 700; color: #232323;">₹${rowTotal.toLocaleString('en-IN')}.00</td>
          </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <!-- Totals & Terms Section -->
    <div class="totals-wrapper">
      <div class="terms-col">
        <div class="candle-care-box">
          <div class="candle-care-title">🕯️ Atelier Candle Care & Guidelines</div>
          • Hand-poured with 100% natural organic soy wax & therapeutic botanicals.<br>
          • <strong>First Burn:</strong> Allow wax melt pool to reach jar edges (2-3 hours) to prevent tunneling.<br>
          • <strong>Wick Care:</strong> Trim wood/cotton wick to 1/4" (5mm) before every lighting.<br>
          • <strong>Safety:</strong> Never leave burning candles unattended. Keep away from drafts and children.
        </div>
        <div class="amount-words-box">
          <strong>Amount in Words:</strong><br>
          <span style="font-style: italic; font-weight: 600; color: #8B6F4E;">${amountWords}</span>
        </div>
      </div>

      <div class="totals-col">
        <table class="totals-table">
          <tr>
            <td style="color: #7D6F63;">Total Quantity:</td>
            <td class="text-right" style="font-weight: 700;">${totalQuantity} Units</td>
          </tr>
          <tr>
            <td style="color: #7D6F63;">Subtotal:</td>
            <td class="text-right font-medium">₹${subtotal.toLocaleString('en-IN')}.00</td>
          </tr>
          ${discount > 0 ? `
          <tr>
            <td style="color: #15803D; font-weight: 600;">Promo Discount:</td>
            <td class="text-right" style="color: #15803D; font-weight: 700;">-₹${discount.toLocaleString('en-IN')}.00</td>
          </tr>
          ` : ''}
          <tr>
            <td style="color: #7D6F63;">Courier Delivery:</td>
            <td class="text-right font-medium">${shippingFee === 0 ? '<span style="color: #15803D; font-weight: 700;">FREE</span>' : `₹${shippingFee.toLocaleString('en-IN')}.00`}</td>
          </tr>
          <tr class="grand-total">
            <td>${isCOD ? 'AMOUNT DUE ON DELIVERY' : 'GRAND TOTAL (INR)'}:</td>
            <td class="text-right">₹${totalAmount.toLocaleString('en-IN')}.00</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Signatory Block -->
    <table class="footer-sign-table" width="100%">
      <tr>
        <td width="50%" valign="bottom" style="font-size: 9px; color: #7D6F63;">
          This is an electronically generated Tax Invoice & Dispatch Slip verified by The Candle Lab.<br>
          Subject to Mumbai Jurisdiction. Thank you for illuminating your sanctuary.
        </td>
        <td width="50%" valign="bottom" class="signatory-box">
          <div class="signatory-seal">The Candle Lab Atelier</div>
          <div class="signatory-label">Authorized Signatory & Seal</div>
        </td>
      </tr>
    </table>

    <div class="footer-note">
      ✨ Handcrafted in India • 100% Vegan & Cruelty-Free • www.thecandlelab.in
    </div>
  </div>

</body>
</html>
  `;
}

/**
 * Print order invoice cleanly via an invisible iframe to prevent UI background artifacts.
 */
export function printOrderInvoice(order: InvoiceOrderData, mode: 'invoice' | 'packingslip' = 'invoice'): void {
  const html = generateInvoiceHTML(order, mode);

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  iframe.style.zIndex = '-1';
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow?.document || iframe.contentDocument;
  if (!doc) {
    // Fallback: Open popup window
    const printWin = window.open('', '_blank');
    if (printWin) {
      printWin.document.open();
      printWin.document.write(html);
      printWin.document.close();
      printWin.focus();
      setTimeout(() => {
        printWin.print();
      }, 350);
    }
    return;
  }

  doc.open();
  doc.write(html);
  doc.close();

  setTimeout(() => {
    try {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
    } catch (e) {
      console.warn('Iframe print fallback trigger:', e);
    } finally {
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {}
      }, 2000);
    }
  }, 350);
}
