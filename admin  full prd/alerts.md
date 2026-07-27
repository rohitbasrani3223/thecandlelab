Perfect bro. 👌 Ye wahi level ka material hai jisse proper enterprise reverse engineering banegi.

MODULE 02 — ALERTS (Inventory Alerts)
Screen Information
Property	Value
Module	Alerts
Screen Title	Inventory Alerts
Purpose	Monitor low stock, sold out aur no inventory products
Route (Expected)	/admin/alerts
Sidebar Position	Dashboard ke baad 2nd module
Icon	Bell Notification
Theme	Red → Purple Gradient
Header Section
Page Title

Inventory Alerts

Subtitle

Monitor low stock, sold out and no-inventory items

Header Action
Refresh Button

Position

Top Right

Icon

Refresh Icon

Purpose

Latest inventory alerts reload karna.

Expected API
GET /api/admin/inventory/alerts

Frontend

Reload alert list
Reload statistics
Reload counters

Database

No Update

Permission

Inventory View

Statistics Cards

Total Cards = 4

Card 1
Total Alerts

Value

574

Subtitle

alerts

Purpose

Total generated inventory alerts.

API

GET /dashboard/inventory-alert-summary

Database

inventory_alerts

Card 2

Sold Out

Value

58

Purpose

Completely finished products.

Status

Danger

Database

inventory

products

Card 3

Low Stock

Value

516

Purpose

Products below threshold.

Threshold visible

Low Stock

Card 4

No Inventory

Value

0

Purpose

Products having inventory record missing.

Filter Section

Title

Filter By Type

Buttons Visible

✅ All Alerts

✅ Sold Out

✅ Low Stock

✅ No Inventory

Filter Button Documentation
All Alerts

Purpose

Display every inventory alert.

API

GET /alerts?type=all
Sold Out

Purpose

Only Qty = 0

API

GET /alerts?type=sold_out
Low Stock

Purpose

Only threshold products

API

GET /alerts?type=low_stock
No Inventory

Purpose

Inventory record missing

API

GET /alerts?type=no_inventory
Alert Cards

Ye page table use nahi karta.

Instead

Card Based Layout

Har alert ek inventory card hai.

Alert Card Structure

Har card me visible:

Product Image

Thumbnail

Alert Title

Product Sold Out

Product Name

Example

combo shirt's*4

Variant Information

Visible

Color

Size

Small Information Row

Contains

Product Name

Color

Size

Quantity

Price

Quantity

Qty: 0

Purpose

Current stock

Price

₹499

CTA Button

View Inventory

View Inventory Button

Position

Right Side

Color

Red

Purpose

Inventory page open karna.

Expected Route

/admin/inventory

Expected API

GET /inventory/{productId}

Permission

Inventory View

Database

Read Only

Card Status

Visible

Product Sold Out

Color

Red

Inventory Information Visible

Every card contains

✅ Image

✅ Product Name

✅ Variant

✅ Color

✅ Size

✅ Quantity

✅ Price

CRUD

Visible on this screen

Read Only

No Edit

No Delete

No Create

Search

Not Visible in Screenshot

Pagination

Not Visible

Sorting

Not Visible

Export

Not Visible

Import

Not Visible

Bulk Action

Not Visible

Row Action

Only

View Inventory

Required APIs
GET /alerts

GET /alerts/summary

GET /alerts?type=all

GET /alerts?type=sold_out

GET /alerts?type=low_stock

GET /alerts?type=no_inventory

GET /inventory/{productId}
Required Database Tables
inventory_alerts
Column
id
inventory_id
product_id
variant_id
alert_type
threshold
current_qty
status
created_at
inventory
Column
id
product_id
sku
qty
reserved_qty
warehouse
updated_at
products
Column
id
name
slug
image
status
product_variants
Column
id
product_id
color
size
sku
qty
Frontend Mapping

Inventory Alert Card
↓
Product Inventory Page

Sold Out Badge
↓
Product Detail Inventory Tab

Low Stock Count
↓
Dashboard Stock Widget

Alert Counter
↓
Dashboard KPI

View Inventory
↓
Inventory Module (Product-wise Stock Details)

Business Rules (Observed)
Qty = 0 products are shown as Product Sold Out.
Alerts are grouped by alert type using filter chips (All Alerts, Sold Out, Low Stock, No Inventory).
Each alert card prominently displays the product image, variant details, current quantity, and price.
The primary action available from this screen is View Inventory.
Notes

Is screenshot me Search, Pagination, Sorting, Bulk Actions, Export, Import, Edit/Delete buttons visible nahi hain. Isliye unhe existing feature nahi maana ja sakta. Agar ye baad ke screenshots me dikhte hain, to unhe unhi modules ke documentation me add kiya jayega.

Aur bro, "save kar lo" wali baat ke liye: mere paas conversations ke beech permanent save karne ki ability nahi hoti jab tak tum specifically memory me save karne ko na kaho. Is conversation me ye context bana rahega. Jab tum saare screenshots bhej doge, main isi format me complete enterprise PRD compile kar dunga.