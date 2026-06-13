<![CDATA[<div align="center">

# 🔌 SPORTZONE API REFERENCE

### Complete REST API Documentation

[![Back to README](https://img.shields.io/badge/←-Back_to_README-blue)](./README.md)

</div>

---

## 📑 Table of Contents

1. [Base URL & Authentication](#base-url--authentication)
2. [Auth API](#auth-api)
3. [Products API](#products-api)
4. [Cart API](#cart-api)
5. [Orders API](#orders-api)
6. [User API](#user-api)
7. [AI API](#ai-api)
8. [Shipping API](#shipping-api)
9. [Webhooks](#webhooks)
10. [Error Handling](#error-handling)

---

## Base URL & Authentication

### Base URL

```
Development:  http://localhost:3001/api
Production:   https://your-api-domain.com/api
```

### Authentication

All protected routes require JWT token in header or cookie:

```bash
# Option 1: Cookie (automatic)
Cookie: token=eyJhbGciOiJIUzI1NiIs...

# Option 2: Authorization Header
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Response Format

```json
{
  "status": "success",
  "data": { ... }
}
```

```json
{
  "status": "error",
  "message": "Error description"
}
```

---

## Auth API

### Register User

```
POST /api/auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "phone": "+1234567890"  // optional
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Login User

```
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

---

### Logout User

```
POST /api/auth/logout
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Logged out successfully"
}
```

---

### Get Current User

```
GET /api/auth/me
🔒 Protected
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "phone": "+1234567890",
      "role": "USER",
      "avatar": "https://...",
      "addresses": [...],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

## Products API

### Get All Products

```
GET /api/products
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 12 | Items per page |
| category | string | - | Category slug |
| brand | string | - | Brand name |
| minPrice | number | - | Minimum price |
| maxPrice | number | - | Maximum price |
| search | string | - | Search query |
| sort | string | createdAt | Sort field |
| order | string | desc | Sort order |

**Example Request:**
```bash
GET /api/products?category=running&minPrice=50&maxPrice=200&sort=price&order=asc&page=1&limit=12
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "id": "uuid",
        "name": "UltraBoost Pro",
        "slug": "ultraboost-pro",
        "description": "Premium running shoe...",
        "price": 189.99,
        "comparePrice": 219.99,
        "brand": "SportZone",
        "rating": 4.8,
        "reviewCount": 125,
        "images": [
          {
            "id": "uuid",
            "url": "https://...",
            "alt": "UltraBoost Pro",
            "isPrimary": true
          }
        ],
        "category": {
          "name": "Shoes",
          "slug": "shoes"
        },
        "variants": [
          {
            "size": "10",
            "color": "Black",
            "stock": 15
          }
        ],
        "tags": ["running", "comfort"],
        "stock": 150
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 12,
      "total": 50,
      "pages": 5
    }
  }
}
```

---

### Get Product by Slug

```
GET /api/products/:slug
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": "uuid",
      "name": "UltraBoost Pro",
      "slug": "ultraboost-pro",
      "description": "Experience ultimate comfort...",
      "price": 189.99,
      "comparePrice": 219.99,
      "sku": "UB-PRO-001",
      "brand": "SportZone",
      "stock": 150,
      "rating": 4.8,
      "reviewCount": 125,
      "tags": ["running", "comfort", "bestseller"],
      "images": [...],
      "variants": [...],
      "category": {...},
      "reviews": [
        {
          "id": "uuid",
          "rating": 5,
          "title": "Best shoes ever!",
          "comment": "Super comfortable...",
          "user": {
            "name": "John D.",
            "avatar": "https://..."
          },
          "createdAt": "2024-01-15T00:00:00.000Z"
        }
      ]
    }
  }
}
```

---

### Create Product (Admin Only)

```
POST /api/products
🔒 Protected (ADMIN)
```

**Request Body:**
```json
{
  "name": "New Product",
  "description": "Product description...",
  "price": 99.99,
  "comparePrice": 129.99,
  "sku": "NP-001",
  "brand": "SportZone",
  "categoryId": "category-uuid",
  "stock": 100,
  "tags": ["new", "featured"],
  "images": [
    { "url": "https://...", "alt": "Product image" }
  ],
  "variants": [
    {
      "name": "Black/Medium",
      "sku": "NP-001-BLK-M",
      "size": "M",
      "color": "Black",
      "colorCode": "#000000",
      "stock": 50
    }
  ]
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": "uuid",
      "name": "New Product",
      "slug": "new-product",
      ...
    }
  }
}
```

---

### Update Product (Admin Only)

```
PUT /api/products/:id
🔒 Protected (ADMIN)
```

**Request Body:**
```json
{
  "price": 89.99,
  "stock": 200
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "product": {
      "id": "uuid",
      "price": 89.99,
      "stock": 200,
      ...
    }
  }
}
```

---

### Delete Product (Admin Only)

```
DELETE /api/products/:id
🔒 Protected (ADMIN)
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Product deleted"
}
```

---

### Get Categories

```
GET /api/products/categories
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "categories": [
      {
        "id": "uuid",
        "name": "Shoes",
        "slug": "shoes",
        "description": "Performance footwear",
        "image": "https://...",
        "_count": {
          "products": 25
        }
      }
    ]
  }
}
```

---

## Cart API

### Get Cart

```
GET /api/cart
🔒 Protected
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "cart": {
      "id": "uuid",
      "total": 281.97,
      "items": [
        {
          "id": "uuid",
          "product": {
            "id": "uuid",
            "name": "UltraBoost Pro",
            "price": 189.99,
            "images": [
              { "url": "https://..." }
            ]
          },
          "variant": {
            "id": "uuid",
            "size": "10",
            "color": "Black"
          },
          "quantity": 1,
          "price": 189.99
        }
      ]
    }
  }
}
```

---

### Add to Cart

```
POST /api/cart
🔒 Protected
```

**Request Body:**
```json
{
  "productId": "product-uuid",
  "variantId": "variant-uuid",  // optional
  "quantity": 1
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "cart": {
      "id": "uuid",
      "total": 281.97,
      "items": [...]
    }
  }
}
```

---

### Update Cart Item

```
PUT /api/cart/:itemId
🔒 Protected
```

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "cart": {
      "id": "uuid",
      "total": 845.91,
      "items": [...]
    }
  }
}
```

---

### Remove from Cart

```
DELETE /api/cart/:itemId
🔒 Protected
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "cart": {
      "id": "uuid",
      "total": 91.98,
      "items": [...]
    }
  }
}
```

---

### Clear Cart

```
DELETE /api/cart
🔒 Protected
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Cart cleared"
}
```

---

## Orders API

### Create Order

```
POST /api/orders
🔒 Protected
```

**Request Body:**
```json
{
  "shippingAddress": {
    "label": "Home",
    "street": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90001",
    "country": "US",
    "phone": "+1234567890"
  },
  "billingAddress": {  // optional
    "street": "123 Main St",
    "city": "Los Angeles",
    "state": "CA",
    "postalCode": "90001",
    "country": "US"
  },
  "shippingService": "FedEx Express",
  "shippingCost": 19.99,
  "notes": "Please leave at door"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": "uuid",
      "orderNumber": "SZ-260606-A1B2C3",
      "status": "PENDING",
      "paymentStatus": "PENDING",
      "subtotal": 281.97,
      "shippingCost": 19.99,
      "tax": 28.20,
      "total": 330.16,
      "shippingAddress": {...},
      "items": [
        {
          "name": "UltraBoost Pro",
          "price": 189.99,
          "quantity": 1,
          "image": "https://..."
        }
      ],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Get User Orders

```
GET /api/orders
🔒 Protected
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 10 | Items per page |

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "orders": [
      {
        "id": "uuid",
        "orderNumber": "SZ-260606-A1B2C3",
        "status": "PAID",
        "total": 330.16,
        "items": [...],
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 5,
      "pages": 1
    }
  }
}
```

---

### Get Order by ID

```
GET /api/orders/:id
🔒 Protected
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": "uuid",
      "orderNumber": "SZ-260606-A1B2C3",
      "status": "SHIPPED",
      "paymentStatus": "COMPLETED",
      "subtotal": 281.97,
      "shippingCost": 19.99,
      "tax": 28.20,
      "total": 330.16,
      "trackingNumber": "FX123456789",
      "shippingService": "FedEx Express",
      "shippingAddress": {
        "street": "123 Main St",
        "city": "Los Angeles",
        "state": "CA",
        "postalCode": "90001"
      },
      "items": [...],
      "user": {
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+1234567890"
      },
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### Update Order Status (Admin Only)

```
PUT /api/orders/:id/status
🔒 Protected (ADMIN)
```

**Request Body:**
```json
{
  "status": "SHIPPED",
  "trackingNumber": "FX123456789"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": "uuid",
      "status": "SHIPPED",
      "trackingNumber": "FX123456789",
      ...
    }
  }
}
```

---

### Cancel Order

```
PUT /api/orders/:id/cancel
🔒 Protected
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "order": {
      "id": "uuid",
      "status": "CANCELLED",
      ...
    }
  }
}
```

---

## User API

### Update Profile

```
PUT /api/users/profile
🔒 Protected
```

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+0987654321",
  "avatar": "https://..."
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Updated",
      "email": "john@example.com",
      "phone": "+0987654321"
    }
  }
}
```

---

### Get Addresses

```
GET /api/users/addresses
🔒 Protected
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "addresses": [
      {
        "id": "uuid",
        "label": "Home",
        "street": "123 Main St",
        "city": "Los Angeles",
        "state": "CA",
        "postalCode": "90001",
        "country": "US",
        "isDefault": true
      }
    ]
  }
}
```

---

### Add Address

```
POST /api/users/addresses
🔒 Protected
```

**Request Body:**
```json
{
  "label": "Office",
  "street": "456 Business Ave",
  "city": "Los Angeles",
  "state": "CA",
  "postalCode": "90002",
  "country": "US",
  "phone": "+1234567890",
  "isDefault": false
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "address": {
      "id": "uuid",
      "label": "Office",
      ...
    }
  }
}
```

---

### Toggle Wishlist

```
POST /api/users/wishlist/:productId
🔒 Protected
```

**Response (200):**
```json
{
  "status": "success",
  "message": "Added to wishlist"
}
```

or

```json
{
  "status": "success",
  "message": "Removed from wishlist"
}
```

---

### Get Wishlist

```
GET /api/users/wishlist
🔒 Protected
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "wishlist": [
      {
        "id": "uuid",
        "product": {
          "id": "uuid",
          "name": "UltraBoost Pro",
          "price": 189.99,
          "images": [...]
        },
        "createdAt": "2024-01-01T00:00:00.000Z"
      }
    ]
  }
}
```

---

## AI API

### Create Chat Session

```
POST /api/ai/chat
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "sessionId": "uuid"
  }
}
```

---

### Send Message

```
POST /api/ai/chat/message
```

**Request Body:**
```json
{
  "sessionId": "session-uuid",
  "message": "Show me running shoes"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "message": "Here are our top running shoes:\n\n1. UltraBoost Pro - $189.99\n2. SpeedElite - $129.99\n\nWould you like more details?",
    "sessionId": "session-uuid"
  }
}
```

---

### Get Styling Advice

```
POST /api/ai/styling-advice
```

**Request Body:**
```json
{
  "occasion": "gym workout",
  "style": "sporty",
  "budget": 300
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "advice": "Here's a complete gym outfit:\n\n1. TOP: AeroFit Training Tee - $45.99\n2. BOTTOM: SpeedElite Shorts - $59.99\n3. FOOTWEAR: UltraBoost Pro - $189.99\n\nTOTAL: $295.97\n\nThis combo provides maximum comfort and performance!"
  }
}
```

---

## Shipping API

### Get Shipping Rates

```
POST /api/shipping/rates
```

**Request Body:**
```json
{
  "toZip": "90001",
  "toCountry": "US",
  "weight": 2.5,
  "dimensions": {
    "length": 12,
    "width": 8,
    "height": 4
  }
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "rates": [
      {
        "id": "rate_1",
        "carrier": "FedEx",
        "service": "Ground",
        "rate": "9.99",
        "currency": "USD",
        "deliveryDays": 5
      },
      {
        "id": "rate_2",
        "carrier": "FedEx",
        "service": "Express",
        "rate": "19.99",
        "currency": "USD",
        "deliveryDays": 2
      },
      {
        "id": "rate_3",
        "carrier": "UPS",
        "service": "Ground",
        "rate": "8.99",
        "currency": "USD",
        "deliveryDays": 5
      }
    ]
  }
}
```

---

### Track Shipment

```
GET /api/shipping/track/:carrier/:trackingNumber
```

**Example:**
```bash
GET /api/shipping/track/fedex/FX123456789
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "tracking": {
      "trackingNumber": "FX123456789",
      "carrier": "fedex",
      "status": "in_transit",
      "estimatedDelivery": "2024-01-06T00:00:00.000Z",
      "events": [
        {
          "status": "Picked up",
          "location": "New York, NY",
          "timestamp": "2024-01-01T10:00:00.000Z"
        },
        {
          "status": "In transit",
          "location": "Chicago, IL",
          "timestamp": "2024-01-02T14:30:00.000Z"
        }
      ]
    }
  }
}
```

---

## Webhooks

### Stripe Webhook

```
POST /api/webhooks/stripe
```

**Handled Events:**
- `payment_intent.succeeded` - Updates order to PAID
- `payment_intent.payment_failed` - Updates order payment status

**Response:**
```json
{
  "received": true
}
```

---

## Error Handling

### Error Response Format

```json
{
  "status": "error",
  "message": "Error description"
}
```

### Validation Error

```json
{
  "status": "error",
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Common HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Rate Limiting

API endpoints are rate limited:
- **Window:** 15 minutes
- **Max Requests:** 100 per window

Exceeding the limit returns:
```json
{
  "status": "error",
  "message": "Too many requests from this IP, please try again later."
}
```

---

<div align="center">

[![Back to README](https://img.shields.io/badge/←-Back_to_README-blue)](./README.md)

</div>
]]>