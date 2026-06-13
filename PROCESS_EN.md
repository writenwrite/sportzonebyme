# SportZone Process Guide

A comprehensive step-by-step guide to the SportZone e-commerce transaction process, from initial browsing to final delivery.

[← Back to README](./README.md)

---

## Table of Contents

- [Overview](#overview)
- [Step 1: Browsing Products](#step-1-browsing-products)
- [Step 2: Viewing Product Details](#step-2-viewing-product-details)
- [Step 3: Adding Items to Cart](#step-3-adding-items-to-cart)
- [Step 4: Authentication](#step-4-authentication)
- [Step 5: Checkout Process](#step-5-checkout-process)
- [Step 6: Payment](#step-6-payment)
- [Step 7: Order Confirmation](#step-7-order-confirmation)
- [Step 8: Shipping and Tracking](#step-8-shipping-and-tracking)
- [Step 9: Delivery](#step-9-delivery)
- [AI Assistant](#ai-assistant)
- [System Architecture](#system-architecture)

---

## Overview

The following diagram illustrates the complete transaction flow in SportZone:

```
+===========================================================================+
|                    COMPLETE E-COMMERCE TRANSACTION FLOW                    |
+===========================================================================+

 CUSTOMER                      WEBSITE                       SYSTEM
 ---------                     --------                      ------
     |                             |                             |
     |  1. Open Website            |                             |
     |---------------------------->|                             |
     |                             |  Load Homepage              |
     |<----------------------------|---------------------------->|
     |                             |                             |
     |  2. Browse Products         |                             |
     |---------------------------->|  Query Products             |
     |                             |---------------------------->|
     |<----------------------------|  Return Products            |
     |                             |                             |
     |  3. Click Product           |                             |
     |---------------------------->|  Load Details               |
     |                             |---------------------------->|
     |<----------------------------|  Return Details             |
     |                             |                             |
     |  4. Add to Cart             |                             |
     |---------------------------->|  Add Item                   |
     |                             |---------------------------->|
     |<----------------------------|  Cart Updated               |
     |                             |                             |
     |  5. Login/Register          |                             |
     |---------------------------->|  Authenticate               |
     |                             |---------------------------->|
     |<----------------------------|  Auth Success               |
     |                             |                             |
     |  6. Checkout                |                             |
     |---------------------------->|  Process Order              |
     |                             |---------------------------->|
     |                             |  Payment (Stripe)           |
     |                             |---------------------------->|
     |                             |  Create Order               |
     |                             |---------------------------->|
     |<----------------------------|  Order Confirmed            |
     |                             |                             |
     |  7. Receive Notification    |  WhatsApp Notification      |
     |<----------------------------|---------------------------->|
     |                             |                             |
     |  8. Track Order             |                             |
     |---------------------------->|  Get Tracking               |
     |                             |---------------------------->|
     |<----------------------------|  Return Status              |
     |                             |                             |
     |  9. Receive Delivery        |  Update Status              |
     |---------------------------->|---------------------------->|
     |                             |                             |
     v                             v                             v
```

---

## Step 1: Browsing Products

### What Happens

```
+---------------------------------------------------------------------------+
|                        STEP 1: BROWSING PRODUCTS                           |
+---------------------------------------------------------------------------+

 USER ACTION                     SYSTEM RESPONSE
 ------------                    ---------------

 1. Open browser
    Type: localhost:5173
         |
         v
 2. Homepage loads
    +---------------------------------------------+
    |  SPORTZONE                                  |
    |  +-----------------------------------------+|
    |  |     UNLEASH YOUR POTENTIAL              ||
    |  |     Premium sports fashion              ||
    |  |                                         ||
    |  |     [Shop Now]  [Explore]               ||
    |  +-----------------------------------------+|
    |                                             |
    |  Featured Products:                         |
    |  +----+ +----+ +----+ +----+               |
    |  |    | |    | |    | |    |               |
    |  |$189| |$45 | |$129| |$79 |               |
    |  +----+ +----+ +----+ +----+               |
    +---------------------------------------------+
         |
         v
 3. Click "Shop Now" or category link
         |
         v
 4. Catalog page displays products
```

### Code Execution Flow

```
Frontend (React):
  Home.tsx -> useEffect() -> dispatch(fetchProducts())
       |
       v
  Redux Store -> fetchProducts() -> API Call
       |
       v
  GET /api/products -> Backend Query -> Return JSON
       |
       v
  ProductCard.tsx -> Render each product
```

### User Interface Elements

| Element | Description |
|---------|-------------|
| Hero Banner | Full-width promotional image with call-to-action |
| Featured Products | Grid of 4-8 highlighted products |
| Category Links | Navigation to product categories |
| Navbar | Navigation menu with search and cart icon |

---

## Step 2: Viewing Product Details

### What Happens

```
+---------------------------------------------------------------------------+
|                    STEP 2: PRODUCT DETAILS                                 |
+---------------------------------------------------------------------------+

 USER ACTION                     SYSTEM RESPONSE
 ------------                    ---------------

 1. Click on "UltraBoost Pro" product
         |
         v
 2. Product Detail page loads
    +-----------------------------------------------------------+
    |                                                           |
    |  +------------------+  +------------------------------+   |
    |  |                  |  | Brand: SportZone             |   |
    |  |   PRODUCT IMAGE  |  | UltraBoost Pro               |   |
    |  |   (Gallery)      |  | Rating: 4.8 (125 reviews)   |   |
    |  |                  |  |                              |   |
    |  |   [Main Image]   |  | Price:                       |   |
    |  |                  |  | $189.99  Was: $219.99        |   |
    |  +------------------+  | Save 14%                     |   |
    |  +--+--+--+--+        |                              |   |
    |  |1 |2 |3 |4 |        | Color:                       |   |
    |  +--+--+--+--+        | [Black] [White]              |   |
    |                        |                              |   |
    |                        | Size:                        |   |
    |                        | [10] [11] [12] [13]          |   |
    |                        |                              |   |
    |                        | Quantity: [-] 1 [+]          |   |
    |                        |                              |   |
    |                        | [Add to Cart] [Wishlist]     |   |
    |                        +------------------------------+   |
    |                                                           |
    +-----------------------------------------------------------+
         |
         v
 3. User can:
    - View additional images (click thumbnails)
    - Select color (click color button)
    - Select size (click size button)
    - Adjust quantity (click +/-)
```

### Displayed Data

```json
{
  "name": "UltraBoost Pro",
  "price": 189.99,
  "comparePrice": 219.99,
  "rating": 4.8,
  "reviewCount": 125,
  "images": [
    {"url": "image1.jpg", "isPrimary": true},
    {"url": "image2.jpg"},
    {"url": "image3.jpg"}
  ],
  "variants": [
    {"size": "10", "color": "Black", "stock": 30},
    {"size": "11", "color": "Black", "stock": 25},
    {"size": "10", "color": "White", "stock": 20}
  ]
}
```

---

## Step 3: Adding Items to Cart

### What Happens

```
+---------------------------------------------------------------------------+
|                    STEP 3: ADD TO CART                                     |
+---------------------------------------------------------------------------+

 USER ACTION                     SYSTEM RESPONSE
 ------------                    ---------------

 1. Select size "10"
    Select color "Black"
    Quantity: 1
         |
         v
 2. Click "Add to Cart"
         |
         v
 3. Success notification appears
    +---------------------------+
    |  + Added to cart          |
    +---------------------------+
         |
         v
 4. Cart icon in navbar updates
    +--------------------------------------+
    |  SPORTZONE    Cart(1)  User         |
    +--------------------------------------+
         |
         v
 5. Cart page (if clicked)
    +-----------------------------------------------------------+
    | Shopping Cart                                              |
    | +-------------------------------------------------------+ |
    | | [Img] UltraBoost Pro     [-] 1 [+]           $189.99 | |
    | |      Size: 10, Color: Black                   [X]    | |
    | +-------------------------------------------------------+ |
    |                                                           |
    | ORDER SUMMARY                                             |
    | Subtotal:                            $189.99             |
    | Shipping:                            $0.00 (Free!)       |
    | Tax:                                 $19.00              |
    | -----------------------------------------------           |
    | TOTAL:                               $208.99             |
    |                                                           |
    | [Proceed to Checkout]                                     |
    +-----------------------------------------------------------+
```

### Backend Process

```
1. Frontend sends request:
   POST /api/cart
   {
     productId: "product-uuid",
     variantId: "variant-uuid",
     quantity: 1
   }

2. Backend processes:
   +-----------------------------------------+
   | 1. Check if user cart exists            |
   |    +-- Yes -> Use existing cart         |
   |    +-- No  -> Create new cart           |
   |                                         |
   | 2. Check if item exists in cart         |
   |    +-- Yes -> Increment quantity        |
   |    +-- No  -> Add new item              |
   |                                         |
   | 3. Calculate cart total                 |
   |                                         |
   | 4. Save to database                     |
   +-----------------------------------------+

3. Response to frontend:
   {
     cart: {
       items: [...],
       total: 208.99
     }
   }
```

---

## Step 4: Authentication

### What Happens

```
+---------------------------------------------------------------------------+
|                    STEP 4: LOGIN / REGISTER                                |
+---------------------------------------------------------------------------+

 USER ACTION                     SYSTEM RESPONSE
 ------------                    ---------------

 1. Click "Proceed to Checkout"
    (If not logged in)
         |
         v
 2. Redirect to Login page
    +-----------------------------------------+
    |           WELCOME BACK                  |
    |                                         |
    |  Email:    [________________]           |
    |  Password: [________________]           |
    |                                         |
    |        [ Sign In ]                      |
    |                                         |
    |  Don't have an account? Sign up         |
    +-----------------------------------------+
         |
         v
 3a. If user has an account:
    - Enter email and password
    - Click "Sign In"
         |
         v
    4. Backend verifies:
       +-----------------------------------------+
       | 1. Check email in database             |
       | 2. Compare password (bcrypt)           |
       | 3. Generate JWT token                  |
       | 4. Return token + user data            |
       +-----------------------------------------+
         |
         v
    5. Token stored in localStorage
       User redirected to checkout
         |
         v
    6. Navbar updates:
       +--------------------------------------+
       |  SPORTZONE    Cart(1)  User Menu    |
       +--------------------------------------+

 3b. If user is new:
    Click "Sign up"
         |
         v
    Register page:
    +-----------------------------------------+
    |         CREATE ACCOUNT                  |
    |                                         |
    |  Name:     [________________]           |
    |  Email:    [________________]           |
    |  Password: [________________]           |
    |  Confirm:  [________________]           |
    |                                         |
    |        [ Create Account ]               |
    |                                         |
    |  Already have an account? Sign in       |
    +-----------------------------------------+
```

### Password Security

```
Original Password     ->  "password123"
                           |
                           v
Hashing (bcrypt 12 rounds)
                           |
                           v
Stored Password        ->  "$2a$12$LJ3m4y..." (unreadable)

NOTE: Passwords are NEVER stored in plain text!
```

---

## Step 5: Checkout Process

### What Happens

```
+---------------------------------------------------------------------------+
|                    STEP 5: CHECKOUT (3 STEPS)                              |
+---------------------------------------------------------------------------+


=============================================================================
 STEP 1: SHIPPING ADDRESS
=============================================================================

 +-----------------------------------------------------------------------+
 |  (*)---( )---( )                                                      |
 |  1     2     3   <- Progress indicator                                |
 |                                                                       |
 |  +-----------------------------------------------------------------+  |
 |  |                    SHIPPING ADDRESS                             |  |
 |  +-----------------------------------------------------------------+  |
 |  |                                                                 |  |
 |  |  Street Address:                                                |  |
 |  |  +-----------------------------------------------------------+  |  |
 |  |  | 123 Main Street, Apt 4B                                   |  |  |
 |  |  +-----------------------------------------------------------+  |  |
 |  |                                                                 |  |
 |  |  City:              State:                                      |  |
 |  |  +--------------+  +--------------+                             |  |
 |  |  | Los Angeles  |  | California   |                             |  |
 |  |  +--------------+  +--------------+                             |  |
 |  |                                                                 |  |
 |  |  Postal Code:       Phone:                                      |  |
 |  |  +--------------+  +--------------+                             |  |
 |  |  | 90001        |  | +1234567890  |                             |  |
 |  |  +--------------+  +--------------+                             |  |
 |  |                                                                 |  |
 |  +-----------------------------------------------------------------+  |
 |                                                                       |
 |                    [Continue to Shipping >]                           |
 |                                                                       |
 +-----------------------------------------------------------------------+


=============================================================================
 STEP 2: SHIPPING METHOD
=============================================================================

 +-----------------------------------------------------------------------+
 |  (*)---(*)---( )                                                      |
 |  1     2     3                                                        |
 |                                                                       |
 |  +-----------------------------------------------------------------+  |
 |  |                    SELECT SHIPPING                              |  |
 |  +-----------------------------------------------------------------+  |
 |  |                                                                 |  |
 |  |  +-----------------------------------------------------------+  |  |
 |  |  |  FedEx Ground                          5 days      $9.99 |  |  |
 |  |  +-----------------------------------------------------------+  |  |
 |  |  +-----------------------------------------------------------+  |  |
 |  |  |  FedEx Express                         2 days     $19.99 |  |  |
 |  |  +-----------------------------------------------------------+  |  |
 |  |  +-----------------------------------------------------------+  |  |
 |  |  |  UPS Ground                            5 days      $8.99 |  |  |
 |  |  +-----------------------------------------------------------+  |  |
 |  |  +-----------------------------------------------------------+  |  |
 |  |  |  DHL Express                            3 days     $24.99 |  |  |
 |  |  +-----------------------------------------------------------+  |  |
 |  |                                                                 |  |
 |  +-----------------------------------------------------------------+  |
 |                                                                       |
 |  [< Back]                       [Review Order >]                      |
 |                                                                       |
 +-----------------------------------------------------------------------+

 NOTE: System fetches real-time shipping rates from EasyPost API


=============================================================================
 STEP 3: ORDER REVIEW AND PAYMENT
=============================================================================

 +-----------------------------------------------------------------------+
 |  (*)---(*)---(*)                                                      |
 |  1     2     3                                                        |
 |                                                                       |
 |  +-----------------------------------------------------------------+  |
 |  |                    ORDER REVIEW                                 |  |
 |  +-----------------------------------------------------------------+  |
 |  |                                                                 |  |
 |  |  ITEMS:                                                         |  |
 |  |  +-----------------------------------------------------------+  |  |
 |  |  | [Img] UltraBoost Pro      Size: 10   x1         $189.99 |  |  |
 |  |  +-----------------------------------------------------------+  |  |
 |  |  | [Img] AeroFit Training Tee  Size: M    x2          $91.98 |  |  |
 |  |  +-----------------------------------------------------------+  |  |
 |  |                                                                 |  |
 |  |  SUMMARY:                                                       |  |
 |  |  -----------------------------------------------               |  |
 |  |  Subtotal:                              $281.97                 |  |
 |  |  Shipping (FedEx Express):              $19.99                  |  |
 |  |  Tax (10%):                             $28.20                  |  |
 |  |  ========================================                      |  |
 |  |  TOTAL:                                 $330.16                 |  |
 |  |                                                                 |  |
 |  |  SHIP TO:                                                       |  |
 |  |  123 Main Street, Los Angeles, CA 90001                        |  |
 |  |                                                                 |  |
 |  +-----------------------------------------------------------------+  |
 |                                                                       |
 |  [< Back]                       [Place Order >]                        |
 |                                                                       |
 +-----------------------------------------------------------------------+
```

---

## Step 6: Payment

### What Happens

```
+---------------------------------------------------------------------------+
|                    STEP 6: PAYMENT (STRIPE)                                |
+---------------------------------------------------------------------------+

 USER ACTION                     SYSTEM RESPONSE
 ------------                    ---------------

 1. Click "Place Order"
         |
         v
 2. Loading spinner appears
    +---------------------------+
    |  Processing...            |
    +---------------------------+
         |
         v
 3. Backend processing:
    +-----------------------------------------------------------+
    |                                                           |
    |  +----------+     +----------+     +----------+          |
    |  |  Create  |     |  Stripe  |     |  Return  |          |
    |  |  Order   |---->|  Payment |---->|  Payment |          |
    |  | (PENDING)|     |  Intent  |     | Client   |          |
    |  +----------+     +----------+     +----------+          |
    |                                                           |
    +-----------------------------------------------------------+
         |
         v
 4. Stripe checkout form appears (or redirect)
    +-----------------------------------------+
    |         STRIPE CHECKOUT                 |
    |                                         |
    |  Card Number: [4242 4242 4242 4242]     |
    |  Expiry:      [12/25]                   |
    |  CVC:         [123]                     |
    |                                         |
    |  Total: $330.16                         |
    |                                         |
    |        [ Pay Now ]                      |
    +-----------------------------------------+
         |
         v
 5. User enters card details and clicks "Pay"
         |
         v
 6. Stripe processes payment
    +-----------------------------------------+
    |  Stripe API                             |
    |  +-- Validate card                      |
    |  +-- Check balance                      |
    |  +-- Process transaction                |
    |  +-- Return status: SUCCESS             |
    +-----------------------------------------+
         |
         v
 7. Stripe webhook to backend:
    POST /api/webhooks/stripe
    {
      type: "payment_intent.succeeded",
      data: { orderId: "xxx", paymentIntentId: "pi_xxx" }
    }
         |
         v
 8. Backend updates order:
    Status: PENDING -> PAID
    Payment Status: COMPLETED
```

---

## Step 7: Order Confirmation

### What Happens

```
+---------------------------------------------------------------------------+
|                    STEP 7: ORDER CONFIRMATION                              |
+---------------------------------------------------------------------------+

 USER ACTION                     SYSTEM RESPONSE
 ------------                    ---------------

 1. Payment successful
         |
         v
 2. Redirect to Order Confirmation page
    +-----------------------------------------------------------+
    |                                                           |
    |                     ORDER CONFIRMED!                      |
    |                                                           |
    |              Order Number: SZ-260606-A1B2C3               |
    |                                                           |
    |  +-------------------------------------------------------+|
    |  |  Status: PAID          Est. Delivery: 2-5 days       ||
    |  +-------------------------------------------------------+|
    |                                                           |
    |  +-------------------------------------------------------+|
    |  |  ITEMS:                                               ||
    |  |  * UltraBoost Pro (Size: 10) x1        $189.99       ||
    |  |  * AeroFit Training Tee (Size: M) x2    $91.98       ||
    |  |                                                       ||
    |  |  TOTAL PAID:                            $330.16      ||
    |  +-------------------------------------------------------+|
    |                                                           |
    |  [View Order Details]    [Continue Shopping]              |
    |                                                           |
    +-----------------------------------------------------------+
         |
         v
 3. WhatsApp notification sent
    +-----------------------------------------+
    |  WhatsApp Message                       |
    |                                         |
    |  Order Confirmed!                       |
    |                                         |
    |  Order: SZ-260606-A1B2C3                |
    |  Total: $330.16                         |
    |                                         |
    |  Track: sportzone.com/orders/SZ-xxx     |
    +-----------------------------------------+
```

---

## Step 8: Shipping and Tracking

### What Happens

```
+---------------------------------------------------------------------------+
|                    STEP 8: SHIPPING AND TRACKING                           |
+---------------------------------------------------------------------------+

 SHIPPING PROCESS:
 ================

 Day 1: Order Processing
 +-----------------------------------------------------------+
 |  Status: PROCESSING                                        |
 |  +-------------------------------------------------------+|
 |  | Admin receives order                                   ||
 |  | +--------+    +----------+                             ||
 |  | | ORDER  |--->| PACKING  |                             ||
 |  | |        |    | [Boxes]  |                             ||
 |  | +--------+    +----------+                             ||
 |  +-------------------------------------------------------+|
 +-----------------------------------------------------------+
         |
         v
 Day 2: Package Shipped
 +-----------------------------------------------------------+
 |  Status: SHIPPED                                           |
 |  +-------------------------------------------------------+|
 |  | Carrier: FedEx Express                                 ||
 |  | Tracking: FX123456789                                  ||
 |  | +----------+    +----------+    +----------+            ||
 |  | | WAREHOUSE|--->| IN       |--->| ON THE  |            ||
 |  | |          |    | TRANSIT  |    | WAY     |            ||
 |  | +----------+    +----------+    +----------+            ||
 |  +-------------------------------------------------------+|
 +-----------------------------------------------------------+
         |
         v
 Day 3-5: In Transit
 +-----------------------------------------------------------+
 |  Status: SHIPPED                                           |
 |  +-------------------------------------------------------+|
 |  | Location: Los Angeles Distribution Center              ||
 |  | +----------+    +----------+    +----------+    +------+||
 |  | | Warehouse|--->| Chicago  |--->| LA       |--->| Your ||
 |  | | NY       |    | Hub      |    | Hub      |    | City ||
 |  | +----------+    +----------+    +----------+    +------+||
 |  +-------------------------------------------------------+|
 +-----------------------------------------------------------+
```

### WhatsApp Shipping Notification

```
+-----------------------------------------+
|  WhatsApp Message                       |
|                                         |
|  Shipping Update                        |
|                                         |
|  Order: SZ-260606-A1B2C3                |
|  Status: Shipped                        |
|                                         |
|  Tracking Number: FX123456789           |
|  Carrier: FedEx Express                 |
|                                         |
|  Track here:                            |
|  https://track.fedex.com/FX123456789   |
+-----------------------------------------+
```

---

## Step 9: Delivery

### What Happens

```
+---------------------------------------------------------------------------+
|                    STEP 9: DELIVERY                                        |
+---------------------------------------------------------------------------+

 USER ACTION                     SYSTEM RESPONSE
 ------------                    ---------------

 1. Package received at doorstep
    +-----------------------------+
    |  PACKED BY SPORTZONE       |
    |  +-----------------------+  |
    |  |                       |  |
    |  |   UltraBoost Pro      |  |
    |  |   AeroFit Tee x2      |  |
    |  |                       |  |
    |  +-----------------------+  |
    +-----------------------------+
         |
         v
 2. Status automatically updated
    (Or admin updates manually)
         |
         v
 3. Order Detail now shows:
    +-----------------------------------------------------------+
    |  ORDER DETAIL                                             |
    |  +-------------------------------------------------------+|
    |  |  Progress:                                             ||
    |  |  (*)---(*)---(*)---(*)---(*)                          ||
    |  |  PENDING PAID PROCESSING SHIPPED DELIVERED             ||
    |  +-------------------------------------------------------+|
    |                                                           |
    |  +-------------------------------------------------------+|
    |  |  Status: DELIVERED                                     ||
    |  |  Delivered on: June 8, 2026 at 2:30 PM                ||
    |  +-------------------------------------------------------+|
    +-----------------------------------------------------------+
         |
         v
 4. WhatsApp delivery confirmation
    +-----------------------------------------+
    |  WhatsApp Message                       |
    |                                         |
    |  Delivered!                             |
    |                                         |
    |  Your order SZ-260606-A1B2C3            |
    |  has been delivered!                     |
    |                                         |
    |  We hope you enjoy your new gear!       |
    |                                         |
    |  Rate your experience:                  |
    |  sportzone.com/review/SZ-xxx            |
    +-----------------------------------------+
         |
         v
 5. User can:
    - Leave a product review
    - Place another order
    - Contact customer service
```

---

## AI Assistant

### How to Use the AI Chat

```
+---------------------------------------------------------------------------+
|                    AI ASSISTANT - USAGE GUIDE                              |
+---------------------------------------------------------------------------+

 1. Click the chat button in the bottom-right corner
    +------------------------+
    |                        |
    |                        |
    |                        |
    |                    +---+---+
    |                    |  Chat | <- Click this button
    |                    +-------+
    +----------------------------------------------+
         |
         v
 2. Chat window opens
    +-----------------------------------------+
    |  SportZone AI                  [Close]  |
    +-----------------------------------------+
    |                                         |
    |  Hello! I am SportZone AI Assistant.    |
    |  How can I help you today?              |
    |                                         |
    +-----------------------------------------+
         |
         v
 3. Type your message
    Examples:
    - "Find me running shoes under $150"
    - "What is your return policy?"
    - "Suggest an outfit for gym"
         |
         v
 4. AI responds with:
    - Product recommendations
    - FAQ answers
    - Outfit suggestions
```

### Sample AI Conversation

```
+-----------------------------------------+
|  SAMPLE CONVERSATION                    |
+-----------------------------------------+
|                                         |
|  User: "Show me comfortable running     |
|         shoes"                          |
|                                         |
|  AI: "Here are our most comfortable     |
|       running shoes:                    |
|                                         |
|       1. UltraBoost Pro - $189.99       |
|          Best for: Daily runs           |
|          Features: Responsive cushion   |
|                                         |
|       2. AeroRun Lite - $149.99         |
|          Best for: Speed training       |
|          Features: Lightweight          |
|                                         |
|       Would you like more details?"     |
|                                         |
|  User: "What is your return policy?"    |
|                                         |
|  AI: "Our return policy:                |
|                                         |
|       - 30-day return window            |
|       - Items must be unworn            |
|       - Free returns for defects        |
|       - Refund in 5-7 business days     |
|                                         |
|       Need help with a return?"         |
|                                         |
+-----------------------------------------+
```

---

## System Architecture

### Architecture Diagram

```
+===========================================================================+
|                         SYSTEM ARCHITECTURE                                |
+===========================================================================+

                         +-----------------+
                         |      USER       |
                         |    (Browser)    |
                         +--------+--------+
                                  |
                                  v
                    +-------------------------------+
                    |       CDN (Vercel)            |
                    |    Static Files + SSL         |
                    +---------------+---------------+
                                    |
            +-----------------------+-----------------------+
            |                       |                       |
            v                       v                       v
   +-----------------+   +-----------------+   +-----------------+
   |   React App     |   |   REST API      |   |   AI Service    |
   |   (Frontend)    |   |   (Express)     |   |   (FastAPI)     |
   |                 |   |                 |   |                 |
   | - Pages         |   | - Auth          |   | - Chat          |
   | - Components    |   | - Products      |   | - Recommendations|
   | - Redux Store   |   | - Cart          |   | - FAQ           |
   | - AI Chat UI    |   | - Orders        |   | - Styling       |
   +-----------------+   +--------+--------+   +--------+--------+
                                  |                       |
            +---------------------+---------------------+
            |                     |                     |
            v                     v                     v
   +-----------------+   +-----------------+   +-----------------+
   |  PostgreSQL     |   |  Redis          |   |  Ollama         |
   |  Database       |   |  Cache          |   |  LLM Engine     |
   |                 |   |                 |   |                 |
   | - Users         |   | - Sessions      |   | - Llama 3.2     |
   | - Products      |   | - Cart Cache    |   | - Mistral 7B    |
   | - Orders        |   | - Rate Limit    |   |                 |
   | - Cart          |   |                 |   |                 |
   +-----------------+   +-----------------+   +-----------------+
            |                     |                     |
            v                     v                     v
   +-----------------+   +-----------------+   +-----------------+
   |  Stripe         |   |  EasyPost       |   |  WhatsApp       |
   |  Payment        |   |  Shipping       |   |  Business API   |
   |                 |   |                 |   |                 |
   | - Pay intent    |   | - Rate calc     |   | - Order confirm |
   | - Webhooks      |   | - Tracking      |   | - Ship updates  |
   +-----------------+   +-----------------+   +-----------------+
```

---

## Complete Flow Summary

```
+===========================================================================+
|                     COMPLETE FLOW SUMMARY                                 |
+===========================================================================+

 1. USER OPENS WEBSITE
    +-- Homepage loads with featured products

 2. BROWSING PRODUCTS
    +-- Click "Shop" -> Catalog -> Filter/Search

 3. VIEW PRODUCT DETAILS
    +-- Click product -> Detail page (images, size, price)

 4. ADD TO CART
    +-- Select size/color -> Click "Add to Cart"

 5. LOGIN / REGISTER
    +-- Click checkout -> Login or Register new account

 6. CHECKOUT
    +-- Step 1: Enter shipping address
    +-- Step 2: Select shipping method (rates)
    +-- Step 3: Review order

 7. PAYMENT
    +-- Click "Place Order" -> Stripe payment -> Success

 8. ORDER CONFIRMATION
    +-- Order confirmed -> WhatsApp notification -> Email

 9. SHIPPING
    +-- Admin processes -> Carrier pickup -> In transit -> Delivered

 10. DELIVERY
     +-- User receives -> Status updated -> Can leave review
```

---

## Writing Standards

This documentation follows these international writing standards:

- **AP Style** for general writing conventions
- **Technical Writing** best practices for documentation
- **Consistent terminology** throughout all documents
- **Active voice** preferred over passive voice
- **Present tense** for describing current functionality
- **Clear and concise** language for global audience

---

[← Back to README](./README.md)
