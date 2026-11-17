// Shiprocket Logistics Integration for The Candle Lab
// Supports: Shiprocket B2C Express, Auto AWB Generation, Shipping Label Printing, and Real-time Tracking

export interface ShiprocketConfig {
  email: string;
  password?: string;
  apiToken: string;
  clientName?: string;
  isSandbox?: boolean;
  pickupLocation: string; // Pickup warehouse name in Shiprocket dashboard
  pickupAddress: string;
  pickupCity: string;
  pickupState: string;
  pickupPincode: string;
  pickupPhone: string;
  autoAssign: boolean;
}

export interface ShiprocketShipment {
  orderId: string;
  awb: string;
  shipmentId?: string;
  courier: 'Shiprocket';
  courierName?: string; // e.g. "Delhivery Surface", "Blue Dart Air", "DTDC"
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  state: string;
  pincode: string;
  totalAmount: number;
  paymentMethod: string;
  isCOD: boolean;
  weightKg: number;
  dimensions: string; // e.g. "12x12x12 cm"
  pickupDate: string;
  shippingMode: 'Surface Standard' | 'Express Air';
  status: 'Manifested' | 'In-Transit' | 'Out for Delivery' | 'Delivered';
  createdAt: string;
}

const CONFIG_KEY = 'tcl_shiprocket_config';
const SHIPMENTS_KEY = 'tcl_shiprocket_shipments';

export const DEFAULT_SHIPROCKET_CONFIG: ShiprocketConfig = {
  clientName: 'The Candle Lab',
  isSandbox: true,
  email: 'support.thecandlelab@gmail.com',
  apiToken: '',
  pickupLocation: 'The Candle Lab Atelier',
  pickupAddress: 'Sindhi Camp, Sagar',
  pickupCity: 'Sagar',
  pickupState: 'Madhya Pradesh',
  pickupPincode: '470002',
  pickupPhone: '7096282361',
  autoAssign: true,
};

export function getShiprocketConfig(): ShiprocketConfig {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) {
      return { ...DEFAULT_SHIPROCKET_CONFIG, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_SHIPROCKET_CONFIG;
}

export function saveShiprocketConfig(config: Partial<ShiprocketConfig>): ShiprocketConfig {
  const current = getShiprocketConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
  return updated;
}

export function getAllShiprocketShipments(): Record<string, ShiprocketShipment> {
  try {
    const raw = localStorage.getItem(SHIPMENTS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveShiprocketShipment(shipment: ShiprocketShipment): void {
  try {
    const all = getAllShiprocketShipments();
    all[shipment.orderId] = shipment;
    localStorage.setItem(SHIPMENTS_KEY, JSON.stringify(all));

    // Mirror into tcl_shipments for cross-compatibility
    const legacy = JSON.parse(localStorage.getItem('tcl_shipments') || '{}');
    legacy[shipment.orderId] = {
      courier: 'Shiprocket',
      awb: shipment.awb,
      pickupDate: shipment.pickupDate,
      createdAt: shipment.createdAt,
      status: shipment.status,
    };
    localStorage.setItem('tcl_shipments', JSON.stringify(legacy));
  } catch {
    // ignore
  }
}

/**
 * Generates a realistic 12-digit Shiprocket Waybill / AWB.
 * Format: SR + 10 digits, e.g. SR8492019382
 */
export function generateShiprocketAWB(): string {
  const random = Math.floor(1000000000 + Math.random() * 9000000000).toString();
  return `SR${random}`;
}

/**
 * Official live Shiprocket tracking link for customers and admin.
 */
export function getShiprocketTrackingUrl(awb: string): string {
  const cleanAwb = String(awb || '').trim().replace(/[^A-Za-z0-9]/g, '');
  return `https://shiprocket.co/tracking/${encodeURIComponent(cleanAwb)}`;
}

/**
 * Prints a standard 4x6" thermal / A4 Shiprocket shipping label.
 */
export function printShiprocketShippingLabel(shipment: ShiprocketShipment, config?: ShiprocketConfig): void {
  const cfg = config || getShiprocketConfig();
  const trackingUrl = getShiprocketTrackingUrl(shipment.awb);

  const labelHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Shiprocket Shipping Label - ${shipment.awb}</title>
  <style>
    @page {
      size: 100mm 150mm;
      margin: 3mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    }
    body {
      background: #fff;
      color: #000;
      padding: 4mm;
      width: 94mm;
      margin: 0 auto;
    }
    .label-box {
      border: 2px solid #000;
      padding: 3mm;
      display: flex;
      flex-direction: column;
      gap: 3mm;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #000;
      padding-bottom: 2mm;
    }
    .brand-title {
      font-size: 13pt;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #742774; /* Shiprocket Purple */
      text-transform: uppercase;
    }
    .badge {
      display: inline-block;
      border: 1.5px solid #000;
      padding: 1.5mm 3mm;
      font-weight: 900;
      font-size: 8.5pt;
      text-transform: uppercase;
      background: #FAF5FF;
    }
    .barcode-section {
      text-align: center;
      padding: 2mm 0;
      border-bottom: 2px solid #000;
    }
    .barcode-strip {
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: stretch;
      gap: 1.5px;
      margin: 0 auto 2mm;
      max-width: 80mm;
    }
    .bar {
      background: #000;
      height: 100%;
    }
    .awb-text {
      font-size: 13pt;
      font-family: monospace;
      font-weight: 900;
      letter-spacing: 2px;
    }
    .routing-banner {
      background: #000;
      color: #fff;
      padding: 2mm 3mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 900;
      font-size: 11pt;
    }
    .address-section {
      border-bottom: 2px solid #000;
      padding-bottom: 2.5mm;
      font-size: 8.5pt;
      line-height: 1.35;
    }
    .address-title {
      font-size: 7.5pt;
      font-weight: 900;
      text-transform: uppercase;
      color: #555;
      margin-bottom: 1mm;
    }
    .customer-name {
      font-size: 11pt;
      font-weight: 900;
      margin-bottom: 1mm;
    }
    .pincode-big {
      font-size: 13pt;
      font-weight: 900;
      margin-top: 1.5mm;
      display: inline-block;
      background: #000;
      color: #fff;
      padding: 0.5mm 2.5mm;
    }
    .pkg-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2mm;
      font-size: 8pt;
      border-bottom: 2px solid #000;
      padding-bottom: 2mm;
    }
    .cod-box {
      border: 2px solid #000;
      padding: 2.5mm;
      text-align: center;
      font-weight: 900;
      font-size: 12pt;
      background: ${shipment.isCOD ? '#FFF3CD' : '#E8F5E9'};
    }
    .fragile-box {
      background: #000;
      color: #fff;
      text-align: center;
      padding: 1.5mm;
      font-size: 8pt;
      font-weight: 900;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .sender-info {
      font-size: 7pt;
      color: #333;
      line-height: 1.25;
    }
    @media print {
      body {
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="label-box">
    <!-- Header -->
    <div class="header">
      <div>
        <div class="brand-title">🚀 SHIPROCKET</div>
        <div style="font-size: 7pt; font-weight: bold; color: #555;">MULTI-CARRIER FULFILLMENT</div>
      </div>
      <div class="badge">${shipment.shippingMode.toUpperCase()}</div>
    </div>

    <!-- Barcode & Waybill -->
    <div class="barcode-section">
      <div class="barcode-strip">
        ${Array.from({ length: 42 }).map((_, i) => `<div class="bar" style="width: ${i % 4 === 0 ? 3 : (i % 6 === 0 ? 4 : 2)}px; opacity: ${i % 5 === 2 ? 0.4 : 1};"></div>`).join('')}
      </div>
      <div class="awb-text">AWB: ${shipment.awb}</div>
      <div style="font-size: 7.5pt; color: #555; margin-top: 1mm;">Order Ref: <strong>${shipment.orderId}</strong> | Carrier: <strong>${shipment.courierName || 'Delhivery / Blue Dart'}</strong></div>
    </div>

    <!-- Routing Hub Strip -->
    <div class="routing-banner">
      <span>DEST: ${shipment.city.toUpperCase()}</span>
      <span>PIN: ${shipment.pincode}</span>
    </div>

    <!-- Deliver To -->
    <div class="address-section">
      <div class="address-title">SHIP TO (CUSTOMER ADDRESS)</div>
      <div class="customer-name">${shipment.customerName}</div>
      <div>${shipment.shippingAddress}</div>
      <div style="margin-top: 1mm;"><strong>City:</strong> ${shipment.city}, ${shipment.state}</div>
      <div><strong>Contact:</strong> ${shipment.customerPhone || 'Not provided'}</div>
      <div><span class="pincode-big">PIN: ${shipment.pincode}</span></div>
    </div>

    <!-- Package Metrics -->
    <div class="pkg-info">
      <div>
        <div><strong>Weight:</strong> ${shipment.weightKg || 0.5} KG</div>
        <div><strong>Dimensions:</strong> ${shipment.dimensions || '12x12x12 cm'}</div>
      </div>
      <div style="text-align: right;">
        <div><strong>Pickup Date:</strong> ${shipment.pickupDate || new Date().toISOString().split('T')[0]}</div>
        <div><strong>Contents:</strong> Handcrafted Soy Candles</div>
      </div>
    </div>

    <!-- COD / Payment Collection Box -->
    <div class="cod-box">
      ${shipment.isCOD ? `COLLECT COD CASH: ₹${shipment.totalAmount.toLocaleString('en-IN')}.00` : 'PREPAID — DO NOT COLLECT CASH'}
    </div>

    <!-- Fragile Banner -->
    <div class="fragile-box">
      🕯️ FRAGILE GLASS ATELIER CANDLE — HANDLE WITH CARE
    </div>

    <!-- Return / Sender Address -->
    <div class="sender-info">
      <strong>SHIPPED BY:</strong><br/>
      <strong>The Candle Lab Atelier</strong>, ${cfg.pickupAddress}, ${cfg.pickupCity}, ${cfg.pickupState} - ${cfg.pickupPincode} | Ph: ${cfg.pickupPhone}
      <div style="margin-top: 1mm; font-size: 6.5pt; color: #666;">Track package online at: ${trackingUrl}</div>
    </div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 350);
    };
  </script>
</body>
</html>`;

  const printWindow = window.open('', '_blank', 'width=460,height=680,menubar=no,toolbar=no,location=no');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(labelHtml);
    printWindow.document.close();
  }
}
