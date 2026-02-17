# Specification

## Summary
**Goal:** Build a public online storefront for "Jubaan Hit Masala" (English UI) with a browsable masala/food catalog, cart + checkout, manual payment options, order tracking, and a minimal admin area for managing catalog and orders.

**Planned changes:**
- Create a public homepage highlighting the "Jubaan Hit Masala" brand with key actions: Browse Products, View Cart, Track Order.
- Implement catalog browsing: category list, product list (filterable by category), and product detail pages (name, price in INR display, description, optional image).
- Add cart and checkout: add/remove items, adjust quantities, view totals, and place orders with customer details (name, phone, delivery address, city, state, PIN code).
- Add payment method selection: Cash on Delivery and Manual UPI (collect payment reference/UTR); store paymentMethod and paymentStatus on orders.
- Implement customer order tracking via order id + phone number to view order status, payment status, items, and totals.
- Provide an admin-only interface protected by Internet Identity login to manage categories/products and view/update orders (order status + payment status, including mark Paid/Confirmed).
- Apply a consistent "Jubaan Hit Masala" visual theme across the UI (no blue/purple primary palette).
- Seed the backend with initial demo categories and products for an India-wide masala/food store.

**User-visible outcome:** Visitors can browse masala/food categories and products, add items to a cart, check out and place an order with COD or manual UPI (UTR), and track orders using order id + phone number; admins can log in to manage the catalog and update order/payment statuses.
