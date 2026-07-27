GLOBAL UI / UX DESIGN SYSTEM
Project: The Candle Lab – Admin Panel

Design Philosophy:
Create a luxury, premium, minimal, elegant admin experience inspired by world-class products while preserving the workflow of the MBA Kapde Wala Admin Panel.

1. Design Principles
Premium First
Minimal Yet Powerful
Consistent Across Every Module
Enterprise Grade UX
Mobile + Tablet + Desktop Responsive
Accessibility (WCAG AA)
Fast & Lightweight
Zero Visual Clutter
Clear Information Hierarchy
High Readability
2. Brand Personality

The admin should feel like managing a luxury candle brand.

Keywords:

Elegant
Calm
Premium
Clean
Sophisticated
Warm
Timeless
High-end
Minimal

Avoid:

Neon colors
Harsh gradients
Gaming-style UI
Loud shadows
Cheap Bootstrap appearance
Overly saturated buttons
3. Color Palette
Primary

Warm Ivory

Secondary

Soft Beige

Accent

Luxury Gold

Neutral

Warm White

Background

Very Light Cream

Surface

Pure White

Text Primary

Charcoal

Text Secondary

Warm Gray

Border

Soft Beige Gray

Success

Soft Emerald

Warning

Muted Amber

Danger

Elegant Terracotta

Info

Dusty Blue

4. Elevation

Cards should float slightly.

Soft shadow
Large border radius
Premium spacing
No heavy borders
5. Border Radius

Buttons

12px

Cards

20px

Inputs

14px

Tables

18px

Dialogs

24px

Badges

999px (pill)

6. Typography

Primary Font

Inter

Alternative

Manrope

Headings

Semi Bold

Body

Regular

Buttons

Medium

Numbers

Semi Bold

Statistics

Bold

7. Icon System

Use one consistent icon family.

Recommended:

Lucide
Heroicons

Icons:

Dashboard

Orders

Products

Categories

Inventory

Customers

Coupons

Reports

Settings

Notifications

Shipping

Analytics

Marketing

Payments

Users

Audit

Support

Logout

8. Buttons
Primary

Filled

Luxury Accent

Rounded

Medium Shadow

Hover Lift

Secondary

White Surface

Border

Subtle Hover

Danger

Soft Red

Ghost

Transparent

Icon Button

Square

Rounded

9. Inputs

Rounded

Soft Border

Large Padding

Floating Labels (optional)

Focus Ring

Inline Validation

Helper Text

Disabled State

Loading State

10. Cards

Every card should have:

Title

Subtitle

Optional Icon

Action Menu

Consistent Padding

Soft Shadow

Rounded Corners

Hover Elevation (only where clickable)

11. KPI Cards

Use premium statistics cards.

Include:

Icon
Value
Subtitle
Trend Indicator
Comparison
Mini Sparkline (optional)
12. Tables

Enterprise style.

Features:

Sticky Header

Rounded Container

Hover Rows

Column Resize (optional)

Column Visibility

Sorting

Filtering

Pagination

Bulk Selection

Row Actions

Search

Export

Import

Responsive Layout

Empty State

Loading Skeleton

13. Charts

Charts should share one visual language.

Use:

Line

Bar

Donut

Pie

Area

Avoid unnecessary 3D effects.

14. Status Badges

Consistent pill badges.

Examples:

Active

Inactive

Draft

Published

Pending

Processing

Completed

Cancelled

Refunded

Out of Stock

Low Stock

Archived

15. Sidebar

Collapsible

Icons + Labels

Active Indicator

Smooth Hover

Scrollable

Persistent

Nested Menus

Search (optional)

16. Header

Sticky

Contains:

Logo

Breadcrumb

Global Search

Notifications

Quick Actions

Profile

Theme Toggle (optional)

17. Modals

Centered

Large Radius

Smooth Animation

ESC Close

Overlay Blur

Primary CTA

Secondary CTA

18. Drawers

Slide Animation

Right Side

Responsive

Sticky Footer Actions

19. Dropdowns

Rounded

Shadow

Keyboard Support

Searchable (where needed)

20. Loading States

Skeleton Cards

Skeleton Tables

Skeleton Charts

Skeleton Forms

Progress Bars

Button Loader

21. Empty States

Illustration

Helpful Message

Primary Action

Secondary Action

22. Error States

Inline Errors

Toast Notifications

Retry Actions

Detailed Validation Messages

23. Success Feedback

Toast

Inline Success

Animated Checkmark

Auto Dismiss

24. Animations

Fast

Smooth

Subtle

No excessive motion

Examples:

Fade

Scale

Slide

Hover Lift

Card Elevation

25. Responsive Breakpoints

Desktop

Laptop

Tablet

Mobile

No horizontal scrolling

26. Accessibility

Keyboard Navigation

Visible Focus

ARIA Labels

Contrast Compliance

Screen Reader Friendly

27. Component Consistency

Every page must reuse the same:

Buttons
Inputs
Cards
Tables
Charts
Modals
Dropdowns
Badges
Pagination
Tabs
Tooltips
Toasts
28. Premium Inspirations

Take inspiration from the design quality (not copy) of:

Apple
Stripe Dashboard
Shopify Admin
Linear
Notion
Aesop
Jo Malone
Framer
Vercel Dashboard
29. Workflow Reference

Important:
UI/UX will be completely redesigned for The Candle Lab with its own premium visual identity. However, the functional workflow, navigation structure, modules, and business logic will follow the reverse-engineered MBA Kapde Wala Admin Panel unless explicitly changed in the PRD.

Ye section main final PRD ke starting chapters me Global Design System ke roop me rakhunga. Iske baad har module (Dashboard, Alerts, Products, Orders, Customers, etc.) isi design system ko follow karega, taaki poora admin panel visually consistent aur luxury feel de.






MODULE 01 — DASHBOARD
Screen Information

Screen Name

Dashboard Overview

Route (Expected)

/admin/dashboard

Purpose

Admin ko business ka complete real-time overview dena.

Layout Structure
---------------------------------------------------------
Top Header
---------------------------------------------------------

Sidebar | Dashboard Content

Sidebar | KPI Cards

Sidebar | Analytics Charts

Sidebar | Reports

Sidebar | Recent Products

Sidebar | Recent Orders

Sidebar | Low Stock

Header
Left

Admin Panel Logo

Subtitle

Control Center
Right
Profile Card

Contains

Avatar
Admin Name
Administrator Role
Logout Button

Icon

Logout Icon

Purpose

Logout current session

Expected API

POST /api/admin/logout

Database

No DB Update

Frontend

Remove Token
Redirect Login
Dashboard Heading
Dashboard Overview

Subtitle

Welcome back!
Here's what's happening with your store today.
KPI SECTION

There are 5 Primary KPI Cards

Card 1

Revenue

Visible Value

₹9,982

Subtitle

Total Sales

Icon

Money

Background

Green

API
GET /dashboard/summary

Response

totalRevenue

DB

orders

payments

Card 2

Shipment Cost

₹1498

Subtitle

Total Shipping Charges

Color

Orange

API

GET /dashboard/shipping

Tables

orders

shipping

Card 3

Orders

33

Subtitle

Today

Color

Blue

API

GET /dashboard/orders

Tables

orders

Card 4

Products

125

Subtitle

Total Items

API

GET /dashboard/products

Tables

products

Card 5

Customers

986

Subtitle

Registered Users

API

GET /dashboard/customers

Tables

customers

users

Analytics Section

Visible analytics count:

18 dashboard widgets (from the screenshots provided).

Widget 1

Revenue (Last 7 Days)

Chart

Line Graph

Purpose

Daily Revenue Trend

API

GET /dashboard/revenue-last7days

Table

orders

payments

Widget 2

Orders (Last 7 Days)

Line Chart

API

GET /dashboard/orders-last7days
Widget 3

Orders By Status

Donut Chart

Visible Status

Pending

Processing

Shipped

Out for Delivery

Delivered

Returned

Cancelled

API

GET /dashboard/order-status
Widget 4

Products By Category

Donut Chart

Purpose

Category Distribution

API

GET /dashboard/product-category

Tables

products

categories

Widget 5

Products By Status

Pie Chart

Values

Active

Inactive

API

GET /dashboard/product-status
Widget 6

Stock Levels

Bar Graph

Visible Categories

Low Stock (<10)

In Stock (>=10)

API

GET /dashboard/stock-levels

Tables

inventory

products

Widget 7

Revenue by Payment Method

Bar Chart

Visible

Razorpay

Cash On Delivery

API

GET /dashboard/payment-methods
Widget 8

Orders by Day Of Week

Bar Graph

Sunday

Monday

Tuesday

Thursday

(API should ideally return all days; screenshot currently shows these labels.)

API

GET /dashboard/orders-weekday
Widget 9

Customer Growth (30 Days)

Line Chart

Purpose

Daily Registration Trend

API

GET /dashboard/customer-growth
Widget 10

Top Selling Products

Bar Chart

Purpose

Most sold products

API

GET /dashboard/top-products
Widget 11

Category Revenue

Bar Graph

Purpose

Revenue By Category

API

GET /dashboard/category-revenue
Widget 12

Main Category Revenue

Donut Chart

Visible

Combo Offer

Top Wear

Bottom Wear

Denim Wear

API

GET /dashboard/main-category-revenue
Widget 13

Hourly Order Distribution

Line Chart

Hours

2 AM

11 AM

1 PM

2 PM

6 PM

7 PM

8 PM

10 PM

11 PM

API

GET /dashboard/hourly-orders
Widget 14

Monthly Revenue

Line Chart

12 Months

API

GET /dashboard/monthly-revenue
Widget 15

Monthly Orders

Bar Graph

12 Months

API

GET /dashboard/monthly-orders
Widget 16

Average Order Value

Line Graph

30 Days

API

GET /dashboard/aov
Widget 17

Coupon Usage

Graph

Purpose

Coupon Performance

API

GET /dashboard/coupon-usage
Widget 18

Product Price Distribution

Chart

Price Buckets

0-500

500-1000

1000-2000

2000-5000

5000+

API

GET /dashboard/product-price
Additional Widgets Visible Lower on Dashboard
Orders by Payment Status (Pie Chart)
Categories by Main Category (Bar Chart)
Products Created (Last 7 Days)
Top Customers by Orders
Shipping Analysis (Summary Cards)
Coupon Discount Analysis (Summary Cards)
Period Comparison (Today vs Week vs Month)
Recent Products (section header visible; detailed rows not visible in the provided screenshots)
Dashboard Buttons

Visible:

Logout

Purpose

Logout

Profile Card

Purpose

Open Profile (interaction not shown, so action is Not Visible in Recording)

View All

Visible near Recent Products section.

Purpose

Navigate to complete list of products (destination inferred from label; exact target not visible).

Database Tables Required
admins

users

customers

products

categories

orders

order_items

inventory

payments

payment_transactions

shipping

coupons

coupon_usage

product_views

dashboard_cache (optional)

Frontend Mapping

Revenue Card
↓
Revenue Summary

Orders Card
↓
Orders Module

Products Card
↓
Products Module

Customers Card
↓
Customer Module

Products by Category
↓
Category Management

Stock Levels
↓
Inventory Module

Payment Methods
↓
Payment Settings / Orders

Coupon Usage
↓
Coupon Module

Top Customers
↓
Customer Module

Shipping Analysis
↓
Delivery Settings / Orders

Dashboard APIs Summary
GET /dashboard/summary
GET /dashboard/revenue-last7days
GET /dashboard/orders-last7days
GET /dashboard/order-status
GET /dashboard/product-category
GET /dashboard/product-status
GET /dashboard/stock-levels
GET /dashboard/payment-methods
GET /dashboard/orders-weekday
GET /dashboard/customer-growth
GET /dashboard/top-products
GET /dashboard/category-revenue
GET /dashboard/main-category-revenue
GET /dashboard/hourly-orders
GET /dashboard/monthly-revenue
GET /dashboard/monthly-orders
GET /dashboard/aov
GET /dashboard/coupon-usage
GET /dashboard/product-price
GET /dashboard/payment-status
GET /dashboard/categories-main
GET /dashboard/products-created
GET /dashboard/top-customers
GET /dashboard/shipping-analysis
GET /dashboard/coupon-discount
GET /dashboard/period-comparison
GET /dashboard/recent-products