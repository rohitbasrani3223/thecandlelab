Haan bro, maine identify kar liya. Orders table ke action column me ye buttons hain:

👁 View Order → Order details modal
✏️ Edit Order Items → Edit items modal
🟣 View Invoice
🟢 Download Invoice (PDF)
🟠 Create Shipment (same functionality jo upar bulk "Create Shipments" button ka hai, lekin sirf us ek order ke liye)
Complete Order Actions
View
Edit
View Invoice
Download Invoice
Create Shipment
View Order

Shows:

Order ID
Order Date
Status
Customer Information
Shipping Address
Order Items
Price Summary
Payment Information
Edit Order

Allows:

Change Size
Change Color
Change Quantity

Only in-stock variants are available.

View Invoice

Opens invoice preview.

Contains:

Invoice Number
Order Number
Customer Details
Shipping Address
Billing Address
Product List
Quantity
GST (if applicable)
Shipping Charges
Total
Payment Status
Company Details
Download Invoice

Downloads PDF invoice.

API example:

GET /api/orders/{id}/invoice/download

Returns:

invoice.pdf
Create Shipment

Creates shipment for only that order.

Opens shipment modal where admin selects:

Courier
Package Weight
Package Dimensions
Pickup Address
Shipping Service
COD / Prepaid

After confirmation:

Shipment Created
AWB Generated
Tracking Number Generated
Status updated to Processing / Shipped

API example:

POST /api/orders/{id}/shipment
Difference

Top Button

Create Shipments

➡️ Bulk shipment for multiple selected orders.

Row Button

Create Shipment

➡️ Shipment for one specific order only.

Ab tak maine ye modules capture kar liye hain:

✅ Dashboard
✅ Alerts
✅ Send Notification
✅ Main Categories
✅ Sub Categories
✅ Products
✅ Inventory
✅ Orders (including View, Edit, View Invoice, Download Invoice, Create Shipment, Bulk Shipment flow)   