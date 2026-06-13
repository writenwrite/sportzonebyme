<![CDATA[<div align="center">

# 📖 SPORTZONE PROCESS GUIDE

### Panduan Lengkap Proses E-Commerce dari Awal sampai Selesai

[![Back to README](https://img.shields.io/badge/←-Back_to_README-blue)](./README.md)

</div>

---

## 📑 Daftar Isi

1. [Overview Proses](#overview-proses)
2. [Tahap 1: browsing Produk](#tahap-1-browsing-produk)
3. [Tahap 2: Melihat Detail Produk](#tahap-2-melihat-detail-produk)
4. [Tahap 3: Menambah ke Keranjang](#tahap-3-menambah-ke-keranjang)
5. [Tahap 4: Login / Register](#tahap-4-login--register)
6. [Tahap 5: Checkout](#tahap-5-checkout)
7. [Tahap 6: Pembayaran](#tahap-6-pembayaran)
8. [Tahap 7: Konfirmasi Order](#tahap-7-konfirmasi-order)
9. [Tahap 8: Pengiriman & Tracking](#tahap-8-pengiriman--tracking)
10. [Tahap 9: Barang Diterima](#tahap-9-barang-diterima)
11. [Fitur AI Assistant](#fitur-ai-assistant)
12. [Arsitektur Sistem](#arsitektur-sistem)

---

## Overview Proses

Berikut adalah gambaran lengkap proses transaksi di SportZone:

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                    PROSES E-COMMERCE LENGKAP SPORTZONE                        ║
╚═══════════════════════════════════════════════════════════════════════════════╝

 👤 CUSTOMER                    🖥️ WEBSITE                    📦 SISTEM
 ────────────                   ──────────                    ──────────
      │                              │                             │
      │  1. Buka Website             │                             │
      │─────────────────────────────▶│                             │
      │                              │  Load Homepage              │
      │  ◀───────────────────────────│────────────────────────────▶│
      │                              │                             │
      │  2. Browse Produk            │                             │
      │─────────────────────────────▶│  Query Products             │
      │                              │────────────────────────────▶│
      │  ◀───────────────────────────│  Return Products            │
      │                              │                             │
      │  3. Klik Produk              │                             │
      │─────────────────────────────▶│  Load Detail                │
      │                              │────────────────────────────▶│
      │  ◀───────────────────────────│  Return Detail              │
      │                              │                             │
      │  4. Add to Cart              │                             │
      │─────────────────────────────▶│  Add Item                   │
      │                              │────────────────────────────▶│
      │  ◀───────────────────────────│  Cart Updated               │
      │                              │                             │
      │  5. Login/Register           │                             │
      │─────────────────────────────▶│  Authenticate               │
      │                              │────────────────────────────▶│
      │  ◀───────────────────────────│  Auth Success               │
      │                              │                             │
      │  6. Checkout                 │                             │
      │─────────────────────────────▶│  Process Order              │
      │                              │────────────────────────────▶│
      │                              │  Payment (Stripe)           │
      │                              │────────────────────────────▶│
      │                              │  Create Order               │
      │                              │────────────────────────────▶│
      │  ◀───────────────────────────│  Order Confirmed            │
      │                              │                             │
      │  7. Terima Notifikasi        │  WhatsApp Notification      │
      │  ◀───────────────────────────│────────────────────────────▶│
      │                              │                             │
      │  8. Track Order              │                             │
      │─────────────────────────────▶│  Get Tracking               │
      │                              │────────────────────────────▶│
      │  ◀───────────────────────────│  Return Status              │
      │                              │                             │
      │  9. Barang Diterima          │  Update Status              │
      │─────────────────────────────▶│────────────────────────────▶│
      │                              │                             │
      ▼                              ▼                             ▼
```

---

## Tahap 1: Browsing Produk

### Apa yang Terjadi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TAHAP 1: BROWSING PRODUK                             │
└─────────────────────────────────────────────────────────────────────────────┘

 USER ACTION                    SYSTEM RESPONSE
 ───────────                    ───────────────

 1. Buka browser
    Ketik: localhost:5173
         │
         ▼
 2. Homepage muncul
    ┌─────────────────────────────────────────────┐
    │  SPORTZONE                                  │
    │  ┌─────────────────────────────────────────┐│
    │  │     UNLEASH YOUR POTENTIAL              ││
    │  │     Premium sports fashion              ││
    │  │                                         ││
    │  │     [Shop Now]  [Explore]               ││
    │  └─────────────────────────────────────────┘│
    │                                             │
    │  Featured Products:                         │
    │  ┌────┐ ┌────┐ ┌────┐ ┌────┐               │
    │  │ 🖼 │ │ 🖼 │ │ 🖼 │ │ 🖼 │               │
    │  │$189│ │$45 │ │$129│ │$79 │               │
    │  └────┘ └────┘ └────┘ └────┘               │
    └─────────────────────────────────────────────┘
         │
         ▼
 3. Klik "Shop Now" atau link kategori
         │
         ▼
 4. Catalog page muncul dengan produk
```

### Kode yang Berjalan

```
Frontend (React):
  Home.tsx → useEffect() → dispatch(fetchProducts())
       │
       ▼
  Redux Store → fetchProducts() → API Call
       │
       ▼
  GET /api/products → Backend Query → Return JSON
       │
       ▼
  ProductCard.tsx → Render setiap produk
```

### Yang Dilihat User

| Elemen | Deskripsi |
|--------|-----------|
| Hero Banner | Gambar besar + teks promosi |
| Featured Products | 4-8 produk unggulan |
| Category Links | Navigasi ke kategori |
| Navbar | Menu navigasi + search + cart icon |

---

## Tahap 2: Melihat Detail Produk

### Apa yang Terjadi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TAHAP 2: DETAIL PRODUK                                   │
└─────────────────────────────────────────────────────────────────────────────┘

 USER ACTION                    SYSTEM RESPONSE
 ───────────                    ───────────────

 1. Klik produk "UltraBoost Pro"
         │
         ▼
 2. Product Detail page muncul
    ┌─────────────────────────────────────────────────────────┐
    │                                                         │
    │  ┌──────────────────┐  ┌──────────────────────────────┐ │
    │  │                  │  │ Brand: SportZone             │ │
    │  │   GAMBAR PRODUK  │  │ UltraBoost Pro               │ │
    │  │   (Gallery)      │  │ ⭐⭐⭐⭐⭐ (125 reviews)       │ │
    │  │                  │  │                              │ │
    │  │   [Gambar 1]     │  │ $189.99  Was: $219.99       │ │
    │  │                  │  │ Save 14%                     │ │
    │  └──────────────────┘  │                              │ │
    │  ┌──┐┌──┐┌──┐┌──┐     │ Color:                       │ │
    │  │1 ││2 ││3 ││4 │     │ [Black] [White]              │ │
    │  └──┘└──┘└──┘└──┘     │                              │ │
    │                        │ Size:                        │ │
    │                        │ [10] [11] [12] [13]          │ │
    │                        │                              │ │
    │                        │ Qty: [-] 1 [+]               │ │
    │                        │                              │ │
    │                        │ [🛒 Add to Cart] [♡ Wishlist]│ │
    │                        └──────────────────────────────┘ │
    │                                                         │
    └─────────────────────────────────────────────────────────┘
         │
         ▼
 3. User bisa:
    - Lihat gambar lain (klik thumbnail)
    - Pilih warna (klik tombol warna)
    - Pilih ukuran (klik tombol ukuran)
    - Ubah quantity (klik +/-)
```

### Data yang Ditampilkan

```json
{
  "name": "UltraBoost Pro",
  "price": 189.99,
  "comparePrice": 219.99,
  "rating": 4.8,
  "reviewCount": 125,
  "images": [
    {"url": "gambar1.jpg", "isPrimary": true},
    {"url": "gambar2.jpg"},
    {"url": "gambar3.jpg"}
  ],
  "variants": [
    {"size": "10", "color": "Black", "stock": 30},
    {"size": "11", "color": "Black", "stock": 25},
    {"size": "10", "color": "White", "stock": 20}
  ]
}
```

---

## Tahap 3: Menambah ke Keranjang

### Apa yang Terjadi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TAHAP 3: ADD TO CART                                      │
└─────────────────────────────────────────────────────────────────────────────┘

 USER ACTION                    SYSTEM RESPONSE
 ───────────                    ───────────────

 1. Pilih ukuran "10"
    Pilih warna "Black"
    Qty: 1
         │
         ▼
 2. Klik "Add to Cart"
         │
         ▼
 3. Notifikasi muncul
    ┌─────────────────────────┐
    │  ✓ Added to cart        │
    └─────────────────────────┘
         │
         ▼
 4. Cart icon di navbar berubah
    ┌──────────────────────────────┐
    │  SPORTZONE    🛒(1)  👤     │
    └──────────────────────────────┘
         │
         ▼
 5. Cart page (jika diklik)
    ┌─────────────────────────────────────────────────────────┐
    │ Shopping Cart                                            │
    │ ┌─────────────────────────────────────────────────────┐ │
    │ │ 🖼 UltraBoost Pro          [-] 1 [+]      $189.99  │ │
    │ │    Size: 10, Color: Black                  [🗑]     │ │
    │ └─────────────────────────────────────────────────────┘ │
    │                                                         │
    │ ORDER SUMMARY                                           │
    │ Subtotal:                           $189.99            │
    │ Shipping:                           $0.00 (Free!)      │
    │ Tax:                                $19.00             │
    │ ─────────────────────────────────────────────          │
    │ TOTAL:                              $208.99            │
    │                                                         │
    │ [Proceed to Checkout]                                   │
    └─────────────────────────────────────────────────────────┘
```

### Proses di Backend

```
1. Frontend kirim request:
   POST /api/cart
   {
     productId: "uuid-product",
     variantId: "uuid-variant",
     quantity: 1
   }

2. Backend proses:
   ┌─────────────────────────────────────────┐
   │ 1. Cek apakah cart user ada?           │
   │    ├─ Ada → Gunakan cart yang ada      │
   │    └─ Tidak → Buat cart baru           │
   │                                         │
   │ 2. Cek apakah item sudah ada di cart?  │
   │    ├─ Ada → Tambah quantity            │
   │    └─ Tidak → Tambah item baru         │
   │                                         │
   │ 3. Hitung total cart                    │
   │                                         │
   │ 4. Simpan ke database                   │
   └─────────────────────────────────────────┘

3. Response ke frontend:
   {
     cart: {
       items: [...],
       total: 208.99
     }
   }
```

---

## Tahap 4: Login / Register

### Apa yang Terjadi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TAHAP 4: LOGIN / REGISTER                                │
└─────────────────────────────────────────────────────────────────────────────┘

 USER ACTION                    SYSTEM RESPONSE
 ───────────                    ───────────────

 1. Klik "Proceed to Checkout"
    (Jika belum login)
         │
         ▼
 2. Redirect ke Login page
    ┌─────────────────────────────────────────┐
    │           WELCOME BACK                  │
    │                                         │
    │  Email:    [________________]           │
    │  Password: [________________]           │
    │                                         │
    │        [ Sign In ]                      │
    │                                         │
    │  Don't have an account? Sign up         │
    └─────────────────────────────────────────┘
         │
         ▼
 3a. Jika sudah punya akun:
    - Isi email & password
    - Klik "Sign In"
         │
         ▼
    4. Backend verifikasi:
       ┌─────────────────────────────────────────┐
       │ 1. Cek email di database               │
       │ 2. Bandingkan password (bcrypt)        │
       │ 3. Buat JWT token                      │
       │ 4. Return token + user data            │
       └─────────────────────────────────────────┘
         │
         ▼
    5. Token disimpan di localStorage
       User di-redirect ke checkout
         │
         ▼
    6. Navbar berubah:
       ┌──────────────────────────────┐
       │  SPORTZONE    🛒(1)  👤     │
       │                     [Menu]   │
       └──────────────────────────────┘

 3b. Jika belum punya akun:
    Klik "Sign up"
         │
         ▼
    Register page:
    ┌─────────────────────────────────────────┐
    │         CREATE ACCOUNT                  │
    │                                         │
    │  Name:     [________________]           │
    │  Email:    [________________]           │
    │  Password: [________________]           │
    │  Confirm:  [________________]           │
    │                                         │
    │        [ Create Account ]               │
    │                                         │
    │  Already have an account? Sign in       │
    └─────────────────────────────────────────┘
```

### Keamanan Password

```
Password Asli        →  "password123"
                        ↓
Hashing (bcrypt 12 rounds)
                        ↓
Password Tersimpan   →  "$2a$12$LJ3m4y..." (tidak bisa dibaca)

⚠️ Password TIDAK PERNAH disimpan dalam teks biasa!
```

---

## Tahap 5: Checkout

### Apa yang Terjadi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TAHAP 5: CHECKOUT (3 LANGKAH)                            │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
 LANGKAH 1: ALAMAT PENGIRIMAN
═══════════════════════════════════════════════════════════════════════════════

 ┌─────────────────────────────────────────────────────────────────────────┐
 │  ●────○────○                                                             │
 │  1    2    3   ← Progress indicator                                     │
 │                                                                         │
 │  ┌───────────────────────────────────────────────────────────────────┐  │
 │  │                    SHIPPING ADDRESS                               │  │
 │  ├───────────────────────────────────────────────────────────────────┤  │
 │  │                                                                   │  │
 │  │  Street Address:                                                  │  │
 │  │  ┌─────────────────────────────────────────────────────────────┐  │  │
 │  │  │ 123 Main Street, Apt 4B                                     │  │  │
 │  │  └─────────────────────────────────────────────────────────────┘  │  │
 │  │                                                                   │  │
 │  │  City:              State:                                        │  │
 │  │  ┌──────────────┐  ┌──────────────┐                              │  │
 │  │  │ Los Angeles  │  │ California   │                              │  │
 │  │  └──────────────┘  └──────────────┘                              │  │
 │  │                                                                   │  │
 │  │  Postal Code:       Phone:                                        │  │
 │  │  ┌──────────────┐  ┌──────────────┐                              │  │
 │  │  │ 90001        │  │ +1234567890  │                              │  │
 │  │  └──────────────┘  └──────────────┘                              │  │
 │  │                                                                   │  │
 │  └───────────────────────────────────────────────────────────────────┘  │
 │                                                                         │
 │                    [Continue to Shipping ▶]                             │
 │                                                                         │
 └─────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
 LANGKAH 2: METODE PENGIRIMAN
═══════════════════════════════════════════════════════════════════════════════

 ┌─────────────────────────────────────────────────────────────────────────┐
 │  ●────●────○                                                             │
 │  1    2    3                                                             │
 │                                                                         │
 │  ┌───────────────────────────────────────────────────────────────────┐  │
 │  │                    SELECT SHIPPING                                │  │
 │  ├───────────────────────────────────────────────────────────────────┤  │
 │  │                                                                   │  │
 │  │  ┌─────────────────────────────────────────────────────────────┐  │  │
 │  │  │  🚚 FedEx Ground                              5 days  $9.99 │  │  │
 │  │  └─────────────────────────────────────────────────────────────┘  │  │
 │  │  ┌─────────────────────────────────────────────────────────────┐  │  │
 │  │  │  ✈️ FedEx Express                             2 days $19.99 │  │  │
 │  │  └─────────────────────────────────────────────────────────────┘  │  │
 │  │  ┌─────────────────────────────────────────────────────────────┐  │  │
 │  │  │  📦 UPS Ground                               5 days  $8.99 │  │  │
 │  │  └─────────────────────────────────────────────────────────────┘  │  │
 │  │  ┌─────────────────────────────────────────────────────────────┐  │  │
 │  │  │  🌍 DHL Express                              3 days $24.99 │  │  │
 │  │  └─────────────────────────────────────────────────────────────┘  │  │
 │  │                                                                   │  │
 │  └───────────────────────────────────────────────────────────────────┘  │
 │                                                                         │
 │  [◀ Back]                         [Review Order ▶]                      │
 │                                                                         │
 └─────────────────────────────────────────────────────────────────────────┘

 ⚡ Sistem mengambil ongkir real-time dari EasyPost API


═══════════════════════════════════════════════════════════════════════════════
 LANGKAH 3: REVIEW & PEMBAYARAN
═══════════════════════════════════════════════════════════════════════════════

 ┌─────────────────────────────────────────────────────────────────────────┐
 │  ●────●────●                                                             │
 │  1    2    3                                                             │
 │                                                                         │
 │  ┌───────────────────────────────────────────────────────────────────┐  │
 │  │                    ORDER REVIEW                                   │  │
 │  ├───────────────────────────────────────────────────────────────────┤  │
 │  │                                                                   │  │
 │  │  ITEMS:                                                           │  │
 │  │  ┌─────────────────────────────────────────────────────────────┐  │  │
 │  │  │ 🖼 UltraBoost Pro        Size: 10   x1           $189.99  │  │  │
 │  │  ├─────────────────────────────────────────────────────────────┤  │  │
 │  │  │ 🖼 AeroFit Training Tee  Size: M    x2            $91.98  │  │  │
 │  │  └─────────────────────────────────────────────────────────────┘  │  │
 │  │                                                                   │  │
 │  │  SUMMARY:                                                         │  │
 │  │  ────────────────────────────────────────────────                │  │
 │  │  Subtotal:                                $281.97                 │  │
 │  │  Shipping (FedEx Express):                $19.99                  │  │
 │  │  Tax (10%):                               $28.20                  │  │
 │  │  ════════════════════════════════════════════════                │  │
 │  │  TOTAL:                                   $330.16                 │  │
 │  │                                                                   │  │
 │  │  SHIP TO:                                                         │  │
 │  │  123 Main Street, Los Angeles, CA 90001                          │  │
 │  │                                                                   │  │
 │  └───────────────────────────────────────────────────────────────────┘  │
 │                                                                         │
 │  [◀ Back]                         [Place Order ▶]                        │
 │                                                                         │
 └─────────────────────────────────────────────────────────────────────────┘
```

---

## Tahap 6: Pembayaran

### Apa yang Terjadi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TAHAP 6: PEMBAYARAN (STRIPE)                             │
└─────────────────────────────────────────────────────────────────────────────┘

 USER ACTION                    SYSTEM RESPONSE
 ───────────                    ───────────────

 1. Klik "Place Order"
         │
         ▼
 2. Loading spinner muncul
    ┌─────────────────────────┐
    │  Processing... ⏳       │
    └─────────────────────────┘
         │
         ▼
 3. Proses di backend:
    ┌─────────────────────────────────────────────────────────────────┐
    │                                                                 │
    │  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐   │
    │  │  Create      │     │  Stripe      │     │  Return      │   │
    │  │  Order       │────▶│  Payment     │────▶│  Payment     │   │
    │  │  (PENDING)   │     │  Intent     │     │  Client Sec  │   │
    │  └──────────────┘     └──────────────┘     └──────────────┘   │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
         │
         ▼
 4. Stripe popup muncul (atau redirect)
    ┌─────────────────────────────────────────┐
    │         💳 STRIPE CHECKOUT              │
    │                                         │
    │  Card Number: [4242 4242 4242 4242]     │
    │  Expiry:      [12/25]                   │
    │  CVC:         [123]                     │
    │                                         │
    │  Total: $330.16                         │
    │                                         │
    │        [ Pay Now ]                      │
    └─────────────────────────────────────────┘
         │
         ▼
 5. User masukkan data kartu & klik "Pay"
         │
         ▼
 6. Stripe memproses pembayaran
    ┌─────────────────────────────────────────┐
    │  Stripe API                             │
    │  ├─ Validasi kartu                      │
    │  ├─ Cek saldo                           │
    │  ├─ Proses transaksi                    │
    │  └─ Return status: SUCCESS              │
    └─────────────────────────────────────────┘
         │
         ▼
 7. Webhook Stripe ke backend:
    POST /api/webhooks/stripe
    {
      type: "payment_intent.succeeded",
      data: { orderId: "xxx", paymentIntentId: "pi_xxx" }
    }
         │
         ▼
 8. Backend update order:
    Status: PENDING → PAID
    Payment Status: COMPLETED
```

---

## Tahap 7: Konfirmasi Order

### Apa yang Terjadi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TAHAP 7: KONFIRMASI ORDER                                │
└─────────────────────────────────────────────────────────────────────────────┘

 USER ACTION                    SYSTEM RESPONSE
 ───────────                    ───────────────

 1. Pembayaran berhasil
         │
         ▼
 2. Redirect ke Order Confirmation
    ┌─────────────────────────────────────────────────────────────────┐
    │                                                                 │
    │                     ✅ ORDER CONFIRMED!                         │
    │                                                                 │
    │              Order Number: SZ-260606-A1B2C3                     │
    │                                                                 │
    │  ┌───────────────────────────────────────────────────────────┐  │
    │  │  Status: PAID          Est. Delivery: 2-5 days           │  │
    │  └───────────────────────────────────────────────────────────┘  │
    │                                                                 │
    │  ┌───────────────────────────────────────────────────────────┐  │
    │  │  ITEMS:                                                   │  │
    │  │  • UltraBoost Pro (Size: 10) x1        $189.99           │  │
    │  │  • AeroFit Training Tee (Size: M) x2    $91.98           │  │
    │  │                                                           │  │
    │  │  TOTAL PAID:                            $330.16          │  │
    │  └───────────────────────────────────────────────────────────┘  │
    │                                                                 │
    │  [View Order Details]    [Continue Shopping]                    │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
         │
         ▼
 3. WhatsApp notification terkirim
    ┌─────────────────────────────────────────┐
    │  📱 WhatsApp Message                    │
    │                                         │
    │  🎉 Order Confirmed!                    │
    │                                         │
    │  Order: SZ-260606-A1B2C3                │
    │  Total: $330.16                         │
    │                                         │
    │  Track: sportzone.com/orders/SZ-xxx     │
    └─────────────────────────────────────────┘
```

### Email Confirmation (Opsional)

```
┌─────────────────────────────────────────────────────────────────┐
│  📧 EMAIL CONFIRMATION                                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Subject: Order Confirmed - SZ-260606-A1B2C3                    │
│                                                                 │
│  Hi Novan,                                                     │
│                                                                 │
│  Thank you for your order!                                      │
│                                                                 │
│  Order Number: SZ-260606-A1B2C3                                 │
│  Order Date: June 6, 2026                                       │
│  Total: $330.16                                                 │
│                                                                 │
│  Items:                                                         │
│  - UltraBoost Pro (Size: 10) x1          $189.99               │
│  - AeroFit Training Tee (Size: M) x2      $91.98               │
│                                                                 │
│  Shipping to:                                                   │
│  123 Main Street                                                │
│  Los Angeles, CA 90001                                          │
│                                                                 │
│  [View Order Details]                                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tahap 8: Pengiriman & Tracking

### Apa yang Terjadi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TAHAP 8: PENGIRIMAN & TRACKING                            │
└─────────────────────────────────────────────────────────────────────────────┘

 PROSES PENGIRIMAN:
 ═══════════════════

 Day 1: Order Diproses
 ┌─────────────────────────────────────────────────────────────────┐
 │  Status: PROCESSING                                             │
 │  ─────────────────────────────────────────────────────────────  │
 │  Admin menerima order                                           │
 │  ┌──────┐    ┌──────────┐                                       │
 │  │ ORDER│───▶│ PACKING  │                                       │
 │  │      │    │ 📦📦📦    │                                       │
 │  └──────┘    └──────────┘                                       │
 └─────────────────────────────────────────────────────────────────┘
         │
         ▼
 Day 2: Barang Dikirim
 ┌─────────────────────────────────────────────────────────────────┐
 │  Status: SHIPPED                                                │
 │  ─────────────────────────────────────────────────────────────  │
 │  Carrier: FedEx Express                                         │
 │  Tracking: FX123456789                                          │
 │  ┌──────────┐    ┌──────────┐    ┌──────────┐                   │
 │  │ WAREHOUSE│───▶│ IN       │───▶│ ON THE   │                   │
 │  │          │    │ TRANSIT  │    │ WAY 🚚   │                   │
 │  └──────────┘    └──────────┘    └──────────┘                   │
 └─────────────────────────────────────────────────────────────────┘
         │
         ▼
 User bisa tracking:
 ┌─────────────────────────────────────────────────────────────────┐
 │  ORDER DETAIL                                                   │
 │  ─────────────────────────────────────────────────────────────  │
 │                                                                 │
 │  Progress:                                                      │
 │  ●───────●───────●───────○───────○                              │
 │  PENDING  PAID  PROCESSING SHIPPED DELIVERED                    │
 │                                                                 │
 │  Tracking Information:                                          │
 │  ┌───────────────────────────────────────────────────────────┐  │
 │  │ 📦 Jun 6, 10:00 AM  - Order placed                       │  │
 │  │ ✅ Jun 6, 02:30 PM  - Payment confirmed                  │  │
 │  │ 📋 Jun 7, 09:00 AM  - Being packed                       │  │
 │  │ 🚚 Jun 7, 03:00 PM  - Shipped via FedEx Express          │  │
 │  │ 📍 Jun 8, 08:00 AM  - In transit (Chicago, IL)           │  │
 │  └───────────────────────────────────────────────────────────┘  │
 │                                                                 │
 │  Carrier: FedEx Express                                         │
 │  Tracking Number: FX123456789                                   │
 │  [Track on FedEx Website]                                       │
 │                                                                 │
 └─────────────────────────────────────────────────────────────────┘


 Day 3-5: Dalam Perjalanan
 ┌─────────────────────────────────────────────────────────────────┐
 │  Status: SHIPPED                                                │
 │  ─────────────────────────────────────────────────────────────  │
 │  📍 Location: Los Angeles Distribution Center                   │
 │  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐  │
 │  │ Warehouse│───▶│ Chicago  │───▶│ LA       │───▶│ Your     │  │
 │  │ NY       │    │ Hub      │    │ Hub      │    │ City     │  │
 │  └──────────┘    └──────────┘    └──────────┘    └──────────┘  │
 └─────────────────────────────────────────────────────────────────┘
```

### WhatsApp Shipping Update

```
┌─────────────────────────────────────────────────────────────────┐
│  📱 WHATSAPP NOTIFICATION                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📦 Shipping Update                                             │
│                                                                 │
│  Order: SZ-260606-A1B2C3                                        │
│  Status: Shipped                                                │
│                                                                 │
│  Tracking Number: FX123456789                                   │
│  Carrier: FedEx Express                                         │
│                                                                 │
│  Track here:                                                    │
│  https://track.fedex.com/FX123456789                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tahap 9: Barang Diterima

### Apa yang Terjadi

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TAHAP 9: BARANG DITERIMA                                 │
└─────────────────────────────────────────────────────────────────────────────┘

 USER ACTION                    SYSTEM RESPONSE
 ───────────                    ───────────────

 1. Paket diterima di rumah
    ┌─────────────────────────────┐
    │  📦 PACKED BY SPORTZONE    │
    │  ┌───────────────────────┐  │
    │  │                       │  │
    │  │   UltraBoost Pro      │  │
    │  │   AeroFit Tee x2      │  │
    │  │                       │  │
    │  └───────────────────────┘  │
    └─────────────────────────────┘
         │
         ▼
 2. Status otomatis terupdate
    (Atau admin update manual)
         │
         ▼
 3. Order Detail sekarang:
    ┌─────────────────────────────────────────────────────────────────┐
    │  ORDER DETAIL                                                   │
    │  ─────────────────────────────────────────────────────────────  │
    │                                                                 │
    │  Progress:                                                      │
    │  ●───────●───────●───────●───────●                              │
    │  PENDING  PAID  PROCESSING SHIPPED DELIVERED ✅                 │
    │                                                                 │
    │  ┌───────────────────────────────────────────────────────────┐  │
    │  │  Status: DELIVERED ✓                                      │  │
    │  │  Delivered on: June 8, 2026 at 2:30 PM                   │  │
    │  └───────────────────────────────────────────────────────────┘  │
    │                                                                 │
    └─────────────────────────────────────────────────────────────────┘
         │
         ▼
 4. WhatsApp delivery confirmation
    ┌─────────────────────────────────────────┐
    │  📱 WhatsApp Message                    │
    │                                         │
    │  ✅ Delivered!                           │
    │                                         │
    │  Your order SZ-260606-A1B2C3            │
    │  has been delivered!                     │
    │                                         │
    │  We hope you enjoy your new gear! 🏆    │
    │                                         │
    │  Rate your experience:                  │
    │  sportzone.com/review/SZ-xxx            │
    └─────────────────────────────────────────┘
         │
         ▼
 5. User bisa:
    - Beri rating & review produk
    - Buat order lagi
    - Hubungi customer service
```

---

## Fitur AI Assistant

### Cara Menggunakan AI Chat

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    AI ASSISTANT - CARA MENGGUNAKAN                          │
└─────────────────────────────────────────────────────────────────────────────┘

 1. Klik tombol chat di pojok kanan bawah
    ┌──────────────────┐
    │                  │
    │                  │
    │                  │
    │              ┌───┴───┐
    │              │  💬   │ ← Klik tombol ini
    │              └───────┘
    └──────────────────────────────────────────────────────────┘
         │
         ▼
 2. Chat window terbuka
    ┌─────────────────────────────────────────┐
    │  🤖 SportZone AI            [× Close]   │
    ├─────────────────────────────────────────┤
    │                                         │
    │  🤖 Hi! I'm SportZone AI Assistant.    │
    │  How can I help you today?              │
    │                                         │
    └─────────────────────────────────────────┘
         │
         ▼
 3. Ketik pesan Anda
    Contoh:
    - "Find me running shoes under $150"
    - "What's your return policy?"
    - "Suggest an outfit for gym"
         │
         ▼
 4. AI akan merespon dengan:
    - Rekomendasi produk
    - Jawaban FAQ
    - Saran outfit
```

### Contoh Percakapan AI

```
┌─────────────────────────────────────────────────────────────────┐
│  CONTOH PERCAKAPAN                                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  👤 User: "Show me comfortable running shoes"                   │
│                                                                 │
│  🤖 AI: "Here are our most comfortable running shoes:           │
│                                                                 │
│         1. UltraBoost Pro - $189.99 ⭐⭐⭐⭐⭐                     │
│            Best for: Daily runs, long distance                  │
│            Features: Responsive cushioning, Primeknit upper     │
│                                                                 │
│         2. AeroRun Lite - $149.99 ⭐⭐⭐⭐☆                        │
│            Best for: Speed training, racing                     │
│            Features: Lightweight, breathable mesh               │
│                                                                 │
│         3. SpeedElite - $129.99 ⭐⭐⭐⭐☆                          │
│            Best: Budget-friendly option                         │
│            Features: Good cushioning, durable sole              │
│                                                                 │
│         Would you like to see details on any of these?"         │
│                                                                 │
│  👤 User: "What's your return policy?"                          │
│                                                                 │
│  🤖 AI: "Our return policy:                                     │
│                                                                 │
│         ✅ 30-day return window                                 │
│         ✅ Items must be unworn with tags                        │
│         ✅ Free returns for defective items                      │
│         ✅ Refund in 5-7 business days                          │
│                                                                 │
│         Need help with a return?"                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Arsitektur Sistem

### Diagram Arsitektur

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                         ARSITEKTUR SISTEM SPORTZONE                           ║
╚═══════════════════════════════════════════════════════════════════════════════╝

                           ┌─────────────────┐
                           │     USER        │
                           │   (Browser)     │
                           └────────┬────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │        CDN (Vercel)           │
                    │   Static Files + SSL          │
                    └───────────────┬───────────────┘
                                    │
            ┌───────────────────────┼───────────────────────┐
            │                       │                       │
            ▼                       ▼                       ▼
   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
   │   React App     │   │  REST API       │   │  AI Service     │
   │   (Frontend)    │   │  (Express)      │   │  (FastAPI)      │
   │                 │   │                 │   │                 │
   │ • Pages         │   │ • Auth          │   │ • Chat          │
   │ • Components    │   │ • Products      │   │ • Recommendations│
   │ • Redux Store   │   │ • Cart          │   │ • FAQ           │
   │ • AI Chat UI    │   │ • Orders        │   │ • Styling       │
   └─────────────────┘   └────────┬────────┘   └────────┬────────┘
                                  │                       │
            ┌─────────────────────┼─────────────────────┐
            │                     │                     │
            ▼                     ▼                     ▼
   ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
   │  PostgreSQL     │   │  Redis          │   │  Ollama         │
   │  Database       │   │  Cache          │   │  LLM Engine     │
   │                 │   │                 │   │                 │
   │ • Users         │   │ • Sessions      │   │ • Llama 3.2     │
   │ • Products      │   │ • Cart Cache    │   │ • Mistral 7B    │
   │ • Orders        │   │ • Rate Limit    │   │                 │
   │ • Cart          │   │                 │   │                 │
   └─────────────────┘   └─────────────────┘   └─────────────────┘
            │
            │                     │
            ▼                     ▼
   ┌─────────────────┐   ┌─────────────────┐
   │  Stripe         │   │  EasyPost       │
   │  Payment        │   │  Shipping       │
   │                 │   │                 │
   │ • Pay intent    │   │ • Rate calc     │
   │ • Webhooks      │   │ • Tracking      │
   └─────────────────┘   └─────────────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │  WhatsApp       │
                         │  Business API   │
                         │                 │
                         │ • Order confirm │
                         │ • Ship updates  │
                         └─────────────────┘
```

---

## Ringkasan Flow Lengkap

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                     RINGKASAN: DARI AWAL SAMPAI SELESAI                       ║
╚═══════════════════════════════════════════════════════════════════════════════╝

 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                                                                             │
 │  1️⃣  USER BUKA WEBSITE                                                      │
 │      └─▶ Homepage muncul dengan produk featured                             │
 │                                                                             │
 │  2️⃣  BROWSING PRODUK                                                        │
 │      └─▶ Klik "Shop" → Catalog → Filter/Search                             │
 │                                                                             │
 │  3️⃣  LIHAT DETAIL PRODUK                                                    │
 │      └─▶ Klik produk → Detail page (gambar, ukuran, harga)                  │
 │                                                                             │
 │  4️⃣  ADD TO CART                                                            │
 │      └─▶ Pilih ukuran/warna → Klik "Add to Cart"                           │
 │                                                                             │
 │  5️⃣  LOGIN / REGISTER                                                       │
 │      └─▶ Klik checkout → Login atau Register akun baru                      │
 │                                                                             │
 │  6️⃣  CHECKOUT                                                               │
 │      ├─▶ Step 1: Masukkan alamat pengiriman                                 │
 │      ├─▶ Step 2: Pilih metode pengiriman (ongkir)                           │
 │      └─▶ Step 3: Review order                                               │
 │                                                                             │
 │  7️⃣  PEMBAYARAN                                                             │
 │      └─▶ Klik "Place Order" → Stripe payment → Berhasil                     │
 │                                                                             │
 │  8️⃣  KONFIRMASI ORDER                                                       │
 │      └─▶ Order confirmed → WhatsApp notification → Email                    │
 │                                                                             │
 │  9️⃣  PENGIRIMAN                                                             │
 │      └─▶ Admin proses → Carrier pickup → In transit → Delivered             │
 │                                                                             │
 │  🔟  BARANG DITERIMA                                                        │
 │      └─▶ User terima → Status updated → Bisa review                         │
 │                                                                             │
 └─────────────────────────────────────────────────────────────────────────────┘
```

---

<div align="center">

**Selamat belajar! 🏃‍♂️**

[![Back to README](https://img.shields.io/badge/←-Back_to_README-blue)](./README.md)

</div>
]]>