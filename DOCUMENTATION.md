<![CDATA[<div align="center">

# 📚 SPORTZONE DOCUMENTATION

### Comprehensive Feature & Function Documentation

[![Back to README](https://img.shields.io/badge/←-Back_to_README-blue)](./README.md)

</div>

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [E-Commerce Features](#e-commerce-features)
4. [AI Assistant Features](#ai-assistant-features)
5. [Integration Features](#integration-features)
6. [Database Schema](#database-schema)
7. [Security Features](#security-features)
8. [Performance Optimization](#performance-optimization)

---

## Overview

**SportZone** adalah platform e-commerce fashion olahraga yang dibangun dengan arsitektur modern dan scalable. Platform ini menyediakan pengalaman berbelanja premium dengan bantuan AI Assistant untuk rekomendasi produk dan customer service.

### Key Highlights

| Feature | Description | Status |
|---------|-------------|--------|
| E-Commerce Core | Product catalog, cart, checkout, orders | ✅ Production Ready |
| AI Shopping Assistant | LLM-powered chatbot for recommendations | ✅ Production Ready |
| WhatsApp Notifications | Order & shipping notifications | ✅ Production Ready |
| Real-time Shipping | Multi-carrier rate comparison | ✅ Production Ready |
| Payment Integration | Stripe global payment processing | ✅ Production Ready |
| Black & Gold Theme | Professional sporty design | ✅ Production Ready |

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SYSTEM ARCHITECTURE                               │
└─────────────────────────────────────────────────────────────────────────────┘

                              ┌─────────────┐
                              │   CLIENT    │
                              │   (React)   │
                              └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
             ┌────────────┐  ┌────────────┐  ┌────────────┐
             │  REST API  │  │ WebSocket  │  │   Static   │
             │   (HTTPS)  │  │    (WS)    │  │   Files    │
             └─────┬──────┘  └─────┬──────┘  └────────────┘
                   │               │
                   ▼               ▼
            ┌─────────────────────────────┐
            │      API GATEWAY (Express)   │
            │  ┌───────────────────────┐   │
            │  │     Middleware         │   │
            │  │  • Auth (JWT)         │   │
            │  │  • Rate Limiting      │   │
            │  │  • CORS               │   │
            │  │  • Validation         │   │
            │  └───────────────────────┘   │
            └──────────────┬──────────────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
         ▼                 ▼                 ▼
  ┌────────────┐   ┌────────────┐   ┌────────────┐
  │  DATABASE  │   │  AI SERVICE │   │  EXTERNAL  │
  │ (PostgreSQL│   │ (FastAPI +  │   │    APIs    │
  │  + Redis)  │   │  Ollama)    │   │            │
  └────────────┘   └────────────┘   └────────────┘
                           │
                           │         ┌────────────┐
                           └────────▶│  Stripe    │
                                     │  EasyPost  │
                                     │  WhatsApp  │
                                     └────────────┘
```

### Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND ARCHITECTURE (React)                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  App.tsx (Root Component)                                                   │
│  ├── Provider (Redux Store)                                                │
│  ├── BrowserRouter (Routing)                                               │
│  ├── Toaster (Notifications)                                               │
│  └── Routes                                                                │
│      ├── Layout (Navbar + Footer + Outlet)                                 │
│      │   ├── Home                                                          │
│      │   ├── Catalog                                                       │
│      │   ├── ProductDetail                                                 │
│      │   ├── Cart                                                          │
│      │   ├── Checkout                                                      │
│      │   ├── Profile                                                       │
│      │   ├── Orders                                                        │
│      │   └── OrderDetail                                                   │
│      └── AIChat (Floating Widget)                                          │
└─────────────────────────────────────────────────────────────────────────────┘

Redux State Management:
┌─────────────────────────────────────────────────────────────────────────────┐
│  Store                                                                      │
│  ├── authSlice    │ { user, token, loading, error }                        │
│  ├── cartSlice    │ { items, total, loading, error }                       │
│  └── productSlice │ { products, currentProduct, categories, pagination }   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## E-Commerce Features

### 1. Product Catalog

**Functionality:**
- Display products in responsive grid layout
- Filter by category, brand, price range
- Search by name, description, tags
- Sort by price, rating, newest
- Pagination support

**Components:**
```
Catalog.tsx
├── FilterSidebar
│   ├── CategoryFilter
│   ├── PriceRangeFilter
│   └── ActiveFilters
├── ProductGrid
│   └── ProductCard (reusable)
└── Pagination
```

**User Flow:**
```
Homepage ──▶ Click "Shop" ──▶ Catalog Page
                │
                ├──▶ Apply Filters
                ├──▶ Search Products
                ├──▶ Sort Results
                └──▶ Click Product ──▶ Product Detail
```

---

### 2. Product Detail

**Functionality:**
- Image gallery with zoom
- Size/Color variant selection
- Stock availability display
- Add to cart with quantity
- Add to wishlist
- Related products

**Components:**
```
ProductDetail.tsx
├── ImageGallery
├── VariantSelector
│   ├── ColorPicker
│   └── SizeSelector
├── QuantitySelector
├── AddToCartButton
└── ProductInfo
    ├── Price
    ├── Description
    └── Features
```

**Data Displayed:**
```typescript
interface Product {
  name: string;
  price: number;
  comparePrice?: number;    // Original price for discount display
  description: string;
  images: ProductImage[];
  variants: ProductVariant[];
  rating: number;
  reviewCount: number;
  category: Category;
  brand: string;
  stock: number;
  tags: string[];
}
```

---

### 3. Shopping Cart

**Functionality:**
- Add/remove items
- Update quantity
- Real-time total calculation
- Stock validation
- Persistent cart (saved to DB)

**Components:**
```
Cart.tsx
├── CartItem (per item)
│   ├── ProductImage
│   ├── ProductInfo
│   ├── QuantityControls
│   └── RemoveButton
├── OrderSummary
│   ├── Subtotal
│   ├── ShippingEstimate
│   ├── Tax
│   └── Total
└── CheckoutButton
```

**Cart State (Redux):**
```typescript
interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
}

interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number;
}
```

---

### 4. Multi-Step Checkout

**Functionality:**
- 3-step checkout process
- Address management
- Real-time shipping rates
- Stripe payment integration
- Order confirmation

**Checkout Steps:**
```
┌─────────────────────────────────────────────────────────────────┐
│                     CHECKOUT FLOW                               │
└─────────────────────────────────────────────────────────────────┘

STEP 1: SHIPPING ADDRESS
┌─────────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ Street Address: [_____________________________________]  │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ City: [_____________]  State: [_____________]            │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ Postal Code: [_____________]  Phone: [_____________]     │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [Continue to Shipping ──────────────────────────────────────▶] │
└─────────────────────────────────────────────────────────────────┘

STEP 2: SHIPPING METHOD
┌─────────────────────────────────────────────────────────────────┐
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ ○ FedEx Ground (5 days)                    $9.99         │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ ● FedEx Express (2 days)                   $19.99        │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ ○ UPS Ground (5 days)                      $8.99         │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ ○ DHL Express (3 days)                     $24.99        │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [◀ Back]                              [Review Order ────────▶] │
└─────────────────────────────────────────────────────────────────┘

STEP 3: ORDER REVIEW & PAYMENT
┌─────────────────────────────────────────────────────────────────┐
│  ORDER SUMMARY                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ [img] UltraBoost Pro              Qty: 1    $189.99      │  │
│  │ [img] AeroFit Training Tee        Qty: 2    $91.98       │  │
│  ├───────────────────────────────────────────────────────────┤  │
│  │ Subtotal:                            $281.97             │  │
│  │ Shipping (FedEx Express):            $19.99              │  │
│  │ Tax:                                 $28.20              │  │
│  │ ─────────────────────────────────────────────────────    │  │
│  │ TOTAL:                               $330.16             │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  SHIPPING TO:                                                   │
│  123 Main St, Los Angeles, CA 90001                             │
│                                                                 │
│  [◀ Back]                              [Place Order ─────────▶] │
└─────────────────────────────────────────────────────────────────┘
```

---

### 5. Order Management

**Functionality:**
- Order history list
- Order detail view
- Order status tracking
- Cancel order (if eligible)
- Tracking number display

**Order Status Flow:**
```
PENDING ──▶ PAID ──▶ PROCESSING ──▶ SHIPPED ──▶ DELIVERED
    │
    └──▶ CANCELLED
```

**Order Detail Display:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Order #SZ-260606-A1B2C3                          Status: PAID │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PROGRESS TRACKER                                               │
│  ●────●────○────○────○                                           │
│  PENDING PAID PROC SHIP DELIV                                   │
│                                                                 │
│  ITEMS                                                          │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ [img] UltraBoost Pro              1x    $189.99          │  │
│  │ [img] AeroFit Training Tee        2x    $91.98           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  SHIPPING ADDRESS          PAYMENT STATUS                       │
│  123 Main St               ✅ COMPLETED                         │
│  Los Angeles, CA 90001                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## AI Assistant Features

### 1. Chat Widget

**Functionality:**
- Floating chat button (bottom-right)
- Expandable chat window
- Real-time messaging
- Session persistence
- Context-aware responses

**Components:**
```
AIChat.tsx
├── ChatButton (toggle)
├── ChatWindow
│   ├── Header (AI branding)
│   ├── MessageList
│   │   ├── UserMessage
│   │   └── AssistantMessage
│   └── InputArea
│       ├── TextInput
│       └── SendButton
```

**Chat UI:**
```
┌─────────────────────────────────────────────────────┐
│  🤖 SportZone AI Assistant            [× Close]     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │ 🤖 Hi! I'm SportZone AI Assistant. I can    │   │
│  │ help you find products, recommend outfits,   │   │
│  │ answer questions about shipping, sizing,     │   │
│  │ and more. How can I help you today?          │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
│                    ┌──────────────────────────────┐  │
│                    │ Show me running shoes        │  │
│                    └──────────────────────────────┘  │
│                                                     │
│  ┌──────────────────────────────────────────────┐   │
│  │ 🤖 Here are our top running shoes:           │   │
│  │                                              │   │
│  │ 1. UltraBoost Pro - $189.99                 │   │
│  │    ⭐⭐⭐⭐⭐ Best for daily runs              │   │
│  │                                              │   │
│  │ 2. SpeedElite - $129.99                     │   │
│  │    ⭐⭐⭐⭐☆ Racing shoes                      │   │
│  │                                              │   │
│  │ Would you like more details on any of these? │   │
│  └──────────────────────────────────────────────┘   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  [Ask me anything...                    ] [Send ➤] │
│  Powered by AI • Ask about products, sizing         │
└─────────────────────────────────────────────────────┘
```

---

### 2. AI Capabilities

**Product Recommendations:**
```typescript
// User Query: "Find me comfortable running shoes under $150"
// AI Response includes:
{
  products: [
    { name: "UltraBoost Pro", price: 189.99, rating: 4.8 },
    { name: "SpeedElite", price: 129.99, rating: 4.6 }
  ],
  recommendation: "Based on your request, I recommend...",
  reasoning: "These shoes have excellent cushioning..."
}
```

**FAQ Auto-Response:**
```
User: "What's your return policy?"

AI: "Our return policy allows returns within 30 days of purchase.
     Items must be unworn with original tags attached.
     Here's how to return:
     1. Go to your Orders page
     2. Select the order
     3. Click 'Return Item'
     4. Print shipping label
     5. Drop off at carrier location

     Need help with a specific return?"
```

**Styling Advisor:**
```
User: "Suggest an outfit for gym workout"

AI: "Here's a complete gym outfit I recommend:

     🏋️ TOP: AeroFit Training Tee - $45.99
        • Moisture-wicking technology
        • Breathable mesh panels

     👖 BOTTOM: SpeedElite Shorts - $59.99
        • Lightweight design
        • Built-in brief

     👟 FOOTWEAR: UltraBoost Pro - $189.99
        • Responsive cushioning
        • Stable base for lifting

     TOTAL: $295.97

     This combo provides maximum comfort and performance!"
```

---

## Integration Features

### 1. WhatsApp Notifications

**Notification Types:**

| Trigger | Template | Content |
|---------|----------|---------|
| Order Confirmed | order_confirmation | Order #, items, total |
| Order Shipped | shipping_update | Tracking #, carrier |
| Order Delivered | delivery_confirmation | Review request |

**Example Notification:**
```
🎉 Order Confirmed!

Order Number: SZ-260606-A1B2C3

Items:
• UltraBoost Pro x1 - $189.99
• AeroFit Training Tee x2 - $91.98

Total: $330.16

Thank you for shopping with SportZone! 🏃‍♂️

Track your order: https://sportzone.com/orders/SZ-260606-A1B2C3
```

---

### 2. Shipping Integration (EasyPost)

**Supported Carriers:**
- FedEx (Ground, Express, Overnight)
- UPS (Ground, 2nd Day, Next Day)
- DHL (Express, Ground)
- USPS (Priority, First Class)

**Rate Calculation Flow:**
```
┌─────────────────────────────────────────────────────────────────┐
│                    SHIPPING RATE FLOW                           │
└─────────────────────────────────────────────────────────────────┘

1. User enters postal code
         │
         ▼
2. Frontend calls POST /api/shipping/rates
   {
     toZip: "90001",
     toCountry: "US",
     weight: 2.5
   }
         │
         ▼
3. Backend queries EasyPost API
         │
         ▼
4. Response with rates:
   {
     rates: [
       { carrier: "FedEx", service: "Ground", rate: "9.99", days: 5 },
       { carrier: "FedEx", service: "Express", rate: "19.99", days: 2 },
       { carrier: "UPS", service: "Ground", rate: "8.99", days: 5 }
     ]
   }
         │
         ▼
5. User selects preferred carrier
```

---

### 3. Payment Integration (Stripe)

**Payment Flow:**
```
┌─────────────────────────────────────────────────────────────────┐
│                      STRIPE PAYMENT FLOW                        │
└─────────────────────────────────────────────────────────────────┘

1. User clicks "Place Order"
         │
         ▼
2. Backend creates Order (status: PENDING)
         │
         ▼
3. Stripe Payment Intent created
         │
         ▼
4. Frontend confirms payment
         │
         ▼
5. Stripe webhook confirms payment
         │
         ▼
6. Backend updates Order:
   - status: PAID
   - paymentStatus: COMPLETED
   - paymentIntentId: pi_xxx
         │
         ▼
7. Stock decremented
         │
         ▼
8. Order confirmation sent (WhatsApp)
```

---

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATABASE SCHEMA                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│    USER     │       │   ADDRESS   │       │   CART      │
├─────────────┤       ├─────────────┤       ├─────────────┤
│ id (PK)     │──┐    │ id (PK)     │       │ id (PK)     │
│ email       │  │    │ userId (FK) │◀──┐   │ userId (FK) │◀──┐
│ password    │  │    │ label       │   │   │ total       │   │
│ name        │  │    │ street      │   │   └─────────────┘   │
│ phone       │  │    │ city        │   │         │           │
│ role        │  │    │ state       │   │         │1:N        │
│ avatar      │  │    │ postalCode  │   │         ▼           │
│ createdAt   │  │    │ country     │   │   ┌─────────────┐   │
│ updatedAt   │  │    │ isDefault   │   │   │  CART_ITEM  │   │
└─────────────┘  │    └─────────────┘   │   ├─────────────┤
       │         │                      │   │ id (PK)     │
       │         │                      │   │ cartId (FK) │◀──┘
       │1:N      │                      │   │ productId   │
       ▼         │                      │   │ variantId   │
┌─────────────┐  │                      │   │ quantity    │
│   ORDER     │  │                      │   │ price       │
├─────────────┤  │                      │   └─────────────┘
│ id (PK)     │  │                      │
│ orderNumber │  │                      │
│ userId (FK) │◀─┘                      │
│ subtotal    │                         │
│ shippingCost│                         │
│ tax         │                         │
│ total       │                         │
│ status      │                         │
│ paymentStatus                         │
│ trackingNumber                        │
│ shippingService                       │
│ createdAt   │                         │
└─────────────┘                         │
       │                                │
       │1:N                             │
       ▼                                │
┌─────────────┐                         │
│ ORDER_ITEM  │                         │
├─────────────┤                         │
│ id (PK)     │                         │
│ orderId (FK)│◀──┐                     │
│ productId   │   │                     │
│ variantId   │   │                     │
│ name        │   │                     │
│ price       │   │                     │
│ quantity    │   │                     │
│ image       │   │                     │
└─────────────┘   │                     │
                  │                     │
       ┌──────────┘                     │
       │                                │
       ▼                                ▼
┌─────────────┐                  ┌─────────────┐
│  PRODUCT    │                  │  CATEGORY   │
├─────────────┤                  ├─────────────┤
│ id (PK)     │                  │ id (PK)     │
│ name        │                  │ name        │
│ slug        │                  │ slug        │
│ description │                  │ description │
│ price       │                  │ image       │
│ comparePrice│                  │ parentId    │
│ sku         │                  └─────────────┘
│ brand       │                         │
│ categoryId  │◀────────────────────────┘
│ stock       │
│ rating      │
│ reviewCount │
│ tags        │
│ isActive    │
└─────────────┘
       │
       │1:N
       ├──▶ ┌─────────────┐
       │    │PRODUCT_IMAGE│
       │    ├─────────────┤
       │    │ id (PK)     │
       │    │ productId   │
       │    │ url         │
       │    │ alt         │
       │    │ isPrimary   │
       │    │ order       │
       │    └─────────────┘
       │
       ├──▶ ┌─────────────┐
       │    │  VARIANT    │
       │    ├─────────────┤
       │    │ id (PK)     │
       │    │ productId   │
       │    │ name        │
       │    │ sku         │
       │    │ price       │
       │    │ stock       │
       │    │ size        │
       │    │ color       │
       │    │ colorCode   │
       │    └─────────────┘
       │
       ├──▶ ┌─────────────┐
       │    │   REVIEW    │
       │    ├─────────────┤
       │    │ id (PK)     │
       │    │ userId (FK) │
       │    │ productId   │
       │    │ rating      │
       │    │ title       │
       │    │ comment     │
       │    │ images      │
       │    └─────────────┘
       │
       └──▶ ┌─────────────┐
            │  WISHLIST   │
            ├─────────────┤
            │ id (PK)     │
            │ userId (FK) │
            │ productId   │
            └─────────────┘
```

---

## Security Features

### Authentication & Authorization

```
┌─────────────────────────────────────────────────────────────────┐
│                     SECURITY LAYERS                             │
└─────────────────────────────────────────────────────────────────┘

1. JWT Authentication
   ├── Token stored in httpOnly cookie
   ├── Expires in 7 days
   └── Verified on each protected request

2. Password Security
   ├── Hashed with bcrypt (12 rounds)
   ├── Never stored in plain text
   └── Minimum 6 characters

3. Role-Based Access
   ├── USER: Basic operations
   └── ADMIN: Product management, order updates

4. API Security
   ├── Rate limiting (100 req/15min)
   ├── CORS configured
   ├── Helmet.js headers
   └── Input validation (Zod)
```

---

## Performance Optimization

### Frontend Optimizations

| Technique | Implementation |
|-----------|----------------|
| Code Splitting | React.lazy + Suspense |
| Image Optimization | Lazy loading, WebP |
| State Management | Redux Toolkit (minimal re-renders) |
| Caching | LocalStorage for auth |

### Backend Optimizations

| Technique | Implementation |
|-----------|----------------|
| Database Indexes | Prisma @@index |
| Connection Pooling | Prisma connection limits |
| Caching | Redis for sessions |
| Rate Limiting | Express rate-limit |

---

<div align="center">

[![Back to README](https://img.shields.io/badge/←-Back_to_README-blue)](./README.md)

</div>
]]>