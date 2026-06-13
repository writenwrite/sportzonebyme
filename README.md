<![CDATA[<div align="center">

# 🏃‍♂️ SPORTZONE

### **Premium E-Commerce with AI Shopping Assistant**

![License](https://img.shields.io/badge/license-MIT-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-20-339933)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1)

[![Documentation](https://img.shields.io/badge/Docs-DOCUMENTATION.md-yellow)](./DOCUMENTATION.md)
[![API Reference](https://img.shields.io/badge/API-REST-blue)](./API.md)
[![Deployment](https://img.shields.io/badge/Deploy-DEPLOYMENT.md-orange)](./DEPLOYMENT.md)

---

**SportZone** adalah platform e-commerce fashion olahraga premium dengan **AI Assistant** yang membantu pelanggan menemukan produk, mendapatkan rekomendasi outfit, dan menjawab pertanyaan tentang shipping/sizing secara otomatis.

</div>

---

## 🎯 Fitur Utama

<table>
<tr>
<td width="50%">

### 🛒 E-Commerce
- ✅ Product Catalog dengan filter
- ✅ Shopping Cart
- ✅ Multi-step Checkout
- ✅ User Authentication (JWT)
- ✅ Order Management
- ✅ User Profile & Addresses

</td>
<td width="50%">

### 🤖 AI & Integrasi
- ✅ AI Chat Assistant (Llama/Mistral)
- ✅ Product Recommendations
- ✅ Styling Advisor
- ✅ FAQ Auto-response
- ✅ WhatsApp Notifications
- ✅ Real-time Shipping Rates

</td>
</tr>
</table>

---

## 🔄 Transaction Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SPORTZONE TRANSACTION FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
  │          │─────▶│          │─────▶│          │─────▶│          │
  │ HOMEPAGE │      │ CATALOG  │      │ PRODUCT  │      │   CART   │
  │          │      │          │      │  DETAIL  │      │          │
  └──────────┘      └──────────┘      └──────────┘      └──────────┘
       │                                                   │
       │                                                   │
       ▼                                                   ▼
  ┌──────────┐                                      ┌──────────┐
  │    AI    │                                      │ CHECKOUT │
  │ ASSISTANT│                                      │  3 STEP  │
  └──────────┘                                      └──────────┘
                                                          │
                        ┌─────────────────────────────────┘
                        │
                        ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                         CHECKOUT PROCESS                                │
  ├─────────────────────────────────────────────────────────────────────────┤
  │                                                                         │
  │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                │
  │   │ STEP 1:     │    │ STEP 2:     │    │ STEP 3:     │                │
  │   │ ADDRESS     │───▶│ SHIPPING    │───▶│ PAYMENT     │                │
  │   │             │    │ RATES       │    │ (Stripe)    │                │
  │   └─────────────┘    └─────────────┘    └─────────────┘                │
  │                                                                         │
  └─────────────────────────────────────────────────────────────────────────┘
                        │
                        ▼
  ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
  │  ORDER   │─────▶│ PAYMENT  │─────▶│ SHIPPING │─────▶│ DELIVERY │
  │  CREATED │      │ SUCCESS  │      │ & TRACK  │      │    ✓     │
  └──────────┘      └──────────┘      └──────────┘      └──────────┘
```

---

## 📊 Order Status Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ORDER STATUS LIFECYCLE                            │
└─────────────────────────────────────────────────────────────────────────���───┘

    ┌─────────────┐
    │   PENDING   │ ◀─── Order baru dibuat, menunggu pembayaran
    └──────┬──────┘
           │
           │ 💳 Payment Success (Stripe Webhook)
           ▼
    ┌─────────────┐
    │    PAID     │ ◀─── Pembayaran berhasil dikonfirmasi
    └──────┬──────┘
           │
           │ 👨‍💼 Admin Process Order
           ▼
    ┌─────────────┐
    │ PROCESSING  │ ◀─── Admin sedang memproses & packing
    └──────┬──────┘
           │
           │ 📦 Carrier Pickup
           ▼
    ┌─────────────┐         ┌─────────────┐
    │   SHIPPED   │────────▶│  DELIVERED  │ ◀─── Barang diterima customer
    └──────┬──────┘         └─────────────┘
           │
           │ ❌ User/Admin Cancel
           ▼
    ┌─────────────┐
    │  CANCELLED  │ ◀─── Order dibatalkan, stock dikembalikan
    └─────────────┘
```

---

## 🤖 AI Assistant Capabilities

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        AI ASSISTANT FEATURES                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────┐  ┌─────────────────────────┐  ┌─────────────────────────┐
│   🔍 PRODUCT SEARCH     │  │   💬 FAQ AUTO-RESPONSE  │  │   👔 STYLING ADVISOR    │
├─────────────────────────┤  ├─────────────────────────┤  ├─────────────────────────┤
│                         │  │                         │  │                         │
│ "Find me running shoes" │  │ "What's your return     │  │ "Suggest an outfit for  │
│                         │  │  policy?"               │  │  gym workout"           │
│ "Show me black jackets" │  │                         │  │                         │
│                         │  │ "How long is shipping?" │  │ "What matches these     │
│ "Any shoes under $100?" │  │                         │  │  shoes?"                │
│                         │  │ "What payment methods?" │  │                         │
└─────────────────────────┘  └─────────────────────────┘  └─────────────────────────┘
           │                           │                           │
           └───────────────────────────┼───────────────────────────┘
                                       │
                                       ▼
                         ┌─────────────────────────┐
                         │   OLLAMA LLM ENGINE     │
                         │   ┌─────────────────┐   │
                         │   │  Llama 3.2 /    │   │
                         │   │  Mistral 7B     │   │
                         │   └─────────────────┘   │
                         │   Context-Aware:        │
                         │   • Product Database    │
                         │   • User History        │
                         │   • FAQ Knowledge Base  │
                         └─────────────────────────┘
```

---

## 🏗️ Tech Stack

<table>
<tr>
<td><strong>Frontend</strong></td>
<td>React 18, TypeScript, Tailwind CSS, Redux Toolkit, React Router v6</td>
</tr>
<tr>
<td><strong>Backend</strong></td>
<td>Node.js 20, Express, TypeScript, Prisma ORM</td>
</tr>
<tr>
<td><strong>Database</strong></td>
<td>PostgreSQL 16, Redis (caching)</td>
</tr>
<tr>
<td><strong>AI Service</strong></td>
<td>Python FastAPI, Ollama (Llama 3.2 / Mistral 7B)</td>
</tr>
<tr>
<td><strong>Payment</strong></td>
<td>Stripe (global payments)</td>
</tr>
<tr>
<td><strong>Shipping</strong></td>
<td>EasyPost (FedEx, UPS, DHL multi-carrier)</td>
</tr>
<tr>
<td><strong>Notifications</strong></td>
<td>WhatsApp Business API (via Twilio/Waha)</td>
</tr>
<tr>
<td><strong>Deployment</strong></td>
<td>Vercel (FE), Railway (BE), Docker Compose</td>
</tr>
</table>

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required
Node.js 18+
PostgreSQL 14+
Docker (optional)

# For AI Features
Ollama (https://ollama.ai)
```

### Installation

```bash
# 1. Clone repository
git clone https://github.com/yourusername/sportzone.git
cd sportzone

# 2. Install dependencies
npm install
cd server && npm install && cd ..
cd client && npm install && cd ..

# 3. Configure environment
cp .env.example .env
# Edit .env with your configuration

# 4. Start database (Docker)
docker-compose up -d postgres redis

# 5. Setup database
cd server
npx prisma generate
npx prisma db push
npm run seed
cd ..

# 6. Start development servers
npm run dev
```

### Access Points

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React App |
| Backend API | http://localhost:3001/api | Express API |
| AI Service | http://localhost:8000 | FastAPI + Ollama |

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@sportzone.com | admin123 |
| User | Register new account | - |

---

## 📁 Project Structure

```
sportzone/
│
├── 📁 client/                      # React Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/          # Reusable UI (Navbar, Footer, ProductCard)
│   │   ├── 📁 pages/               # Route pages (Home, Catalog, Cart, etc.)
│   │   ├── 📁 features/            # Redux slices (auth, cart, products)
│   │   ├── 📁 services/            # API calls (axios instance)
│   │   ├── 📁 hooks/               # Custom React hooks
│   │   ├── 📁 ai/                   # AI Chat Widget component
│   │   └── 📁 styles/              # Global CSS, Tailwind config
│   ├── 📄 package.json
│   ├── 📄 tailwind.config.js
│   └── 📄 vite.config.ts
│
├── 📁 server/                      # Express Backend
│   ├── 📁 src/
│   │   ├── 📁 routes/              # API route definitions
│   │   ├── 📁 controllers/         # Business logic
│   │   ├── 📁 middleware/           # Auth, validation, error handling
│   │   ├── 📁 services/            # External APIs (WhatsApp, etc.)
│   │   └── 📁 utils/               # Helpers (logger, slugify)
│   ├── 📁 prisma/
│   │   ├── 📄 schema.prisma        # Database schema
│   │   └── 📄 seed.ts              # Seed data
│   └── 📄 package.json
│
├── 📁 ai-service/                  # Python AI Service
│   ├── 📄 main.py                  # FastAPI endpoints
│   └── 📄 requirements.txt
│
├── 📄 docker-compose.yml           # Local dev services
├── 📄 .env.example                 # Environment template
├── 📄 package.json                 # Root monorepo config
│
└── 📁 docs/                        # Documentation
    ├── 📄 DOCUMENTATION.md         # Full feature docs
    ├── 📄 FLOW.md                  # User journey diagrams
    ├── 📄 API.md                   # REST API reference
    └── 📄 DEPLOYMENT.md            # Deployment guide
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [DOCUMENTATION.md](./DOCUMENTATION.md) | Comprehensive feature documentation |
| [FLOW.md](./FLOW.md) | User journey & transaction flow diagrams |
| [API.md](./API.md) | REST API reference with examples |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment guide |

---

## 🌐 API Overview

### Authentication
```
POST /api/auth/register    - Register new user
POST /api/auth/login       - Login user
POST /api/auth/logout      - Logout user
GET  /api/auth/me          - Get current user
```

### Products
```
GET  /api/products          - List products (with filters)
GET  /api/products/:slug    - Get product detail
POST /api/products          - Create product (Admin)
PUT  /api/products/:id      - Update product (Admin)
DELETE /api/products/:id    - Delete product (Admin)
```

### Cart & Orders
```
GET  /api/cart              - Get user cart
POST /api/cart              - Add to cart
POST /api/orders            - Create order
GET  /api/orders            - List user orders
```

### AI & Shipping
```
POST /api/ai/chat           - Create AI chat session
POST /api/ai/chat/message   - Send message to AI
POST /api/shipping/rates    - Get shipping rates
```

Full API docs: [API.md](./API.md)

---

## 🎨 UI Screenshots

<table>
<tr>
<td><strong>Homepage</strong></td>
<td><strong>Product Catalog</strong></td>
<td><strong>AI Chat</strong></td>
</tr>
<tr>
<td>Hero section + Featured products</td>
<td>Grid layout + Filters</td>
<td>Floating chat widget</td>
</tr>
<tr>
<td>![Homepage](./screenshots/home.png)</td>
<td>![Catalog](./screenshots/catalog.png)</td>
<td>![AI Chat](./screenshots/ai-chat.png)</td>
</tr>
</table>

<table>
<tr>
<td><strong>Product Detail</strong></td>
<td><strong>Checkout</strong></td>
<td><strong>Order Tracking</strong></td>
</tr>
<tr>
<td>Image gallery + Variants</td>
<td>3-step checkout process</td>
<td>Real-time status tracker</td>
</tr>
<tr>
<td>![Product](./screenshots/product.png)</td>
<td>![Checkout](./screenshots/checkout.png)</td>
<td>![Orders](./screenshots/orders.png)</td>
</tr>
</table>

---

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Build command
cd client && npm run build

# Output directory
client/dist
```

### Backend (Railway/Render)
```bash
# Root directory
server

# Start command
npm start
```

Full deployment guide: [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🛠️ Development

```bash
# Run all services
npm run dev

# Run only server
npm run dev:server

# Run only client
npm run dev:client

# Run only AI service
npm run dev:ai

# Database commands
npm run db:generate    # Generate Prisma client
npm run db:push        # Push schema to DB
npm run db:seed        # Seed sample data
npm run db:migrate     # Run migrations
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by SportZone Team**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername/sportzone)
[![Twitter](https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/sportzone)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/sportzone)

</div>
]]>