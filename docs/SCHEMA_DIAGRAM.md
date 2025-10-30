# Enhanced Schema Diagram

## 🗺️ Database Relationship Map

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER                                     │
│  • id, email, name, phone, password                             │
│  • role (CUSTOMER, ADMIN, RESELLER)                             │
│  • isWholesale, loyaltyPoints                                   │
└───────┬─────────────────────────────────────────────────────────┘
        │
        ├─────────────┬─────────────┬─────────────┬─────────────┐
        │             │             │             │             │
        ▼             ▼             ▼             ▼             ▼
    ┌───────┐   ┌──────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
    │ Order │   │ Wishlist │  │ Review  │  │ Address │  │  Cart   │
    └───┬───┘   └────┬─────┘  └────┬────┘  └─────────┘  └────┬────┘
        │            │             │                           │
        │            │             │                           │
        │            │             │                           │
        │            └─────────────┼───────────────────────────┘
        │                          │                           │
        │                          ▼                           ▼
        │                    ┌──────────────────────────────────────┐
        │                    │           PRODUCT                     │
        │                    │  • Core: id, sku, title, slug        │
        │                    │  • Pricing: price, compareAtPrice    │
        │                    │  • Inventory: stock, lowStockThresh  │
        │                    │  • Media: images, videos             │
        │                    │  • Attributes: JSON (flexible)       │
        │                    │  • SEO: metaTitle, metaDescription   │
        │                    └──────┬───────────────────────────────┘
        │                           │
        │                           ├──────────┬──────────┬──────────┐
        │                           │          │          │          │
        │                           ▼          ▼          ▼          ▼
        │                    ┌──────────┐ ┌────────┐ ┌────────┐ ┌──────────┐
        │                    │ Variant  │ │Discount│ │ Review │ │ Category │
        │                    │          │ │        │ │        │ │          │
        │                    │ • sku    │ │• type  │ │• rating│ │• name    │
        │                    │ • price  │ │• value │ │• comment│ │• slug   │
        │                    │ • stock  │ │• dates │ │• images│ │• parent │
        │                    │ • attrs  │ │• minQty│ │        │ │          │
        │                    └──────────┘ └────────┘ └────────┘ └──────────┘
        │
        └──────────────────────────┐
                                   ▼
                            ┌──────────────┐
                            │  OrderItem   │
                            │  • qty       │
                            │  • price     │
                            │  • discount  │
                            └──────────────┘
```

---

## 🏗️ Product Structure (Detailed)

```
PRODUCT (Parent)
├── Core Fields
│   ├── id (cuid)
│   ├── sku (unique)
│   ├── title
│   ├── slug (unique)
│   ├── description (long text)
│   └── shortDesc (150 chars)
│
├── Pricing
│   ├── price (cents) ─────────────────┐
│   ├── compareAtPrice (cents)         │ Regular Pricing
│   ├── costPrice (cents)              │
│   ├── wholesalePrice (cents) ────────┤
│   └── wholesaleMinQty                │ Wholesale Pricing
│                                       │
├── Inventory                           │
│   ├── stock                           │
│   ├── lowStockThreshold               │
│   ├── trackInventory (bool)           │
│   └── allowBackorder (bool)           │
│                                       │
├── Media                               │
│   ├── images (JSON array)             │
│   └── videos (JSON array)             │
│                                       │
├── Brand                               │
│   ├── brand                           │
│   └── manufacturer                    │
│                                       │
├── Physical                            │
│   ├── weight (kg)                     │
│   ├── dimensions (JSON)               │
│   ├── color                           │
│   ├── size                            │
│   └── material                        │
│                                       │
├── Attributes (JSON) ──────────────────┤ Category-specific
│   └── { processor, ram, ... }        │ Flexible structure
│                                       │
├── Features & Specs                    │
│   ├── features (JSON array)           │
│   ├── specifications (JSON object)    │
│   └── highlights (JSON array)         │
│                                       │
├── SEO                                 │
│   ├── metaTitle                       │
│   ├── metaDescription                 │
│   └── tags (array)                    │
│                                       │
├── Shipping                            │
│   ├── shippingWeight (kg)             │
│   └── freeShipping (bool)             │
│                                       │
├── Status                              │
│   ├── active (bool)                   │
│   ├── featured (bool)                 │
│   ├── isNew (bool)                    │
│   └── onSale (bool)                   │
│                                       │
├── Warranty & Returns                  │
│   ├── warranty (string)               │
│   └── returnDays (int)                │
│                                       │
├── Timestamps                          │
│   ├── createdAt                       │
│   ├── updatedAt                       │
│   └── publishedAt                     │
│                                       │
└── Relations                           │
    ├── categories (many-to-many) ──────┤
    ├── variants (one-to-many) ─────────┤
    ├── discounts (one-to-many) ────────┤
    └── reviews (one-to-many) ──────────┘
```

---

## 🎨 Product Variants Structure

```
PRODUCT: "iPhone 15 Pro Max"
├── price: $1,199 (base)
├── trackInventory: false (track on variants)
└── VARIANTS
    ├── Variant 1: "256GB - Natural Titanium"
    │   ├── sku: "IPHONE-15-PRO-256-TIT"
    │   ├── price: $1,199
    │   ├── stock: 45
    │   ├── image: "/iphone-titanium.jpg"
    │   └── attributes: { storage: "256GB", color: "Natural Titanium" }
    │
    ├── Variant 2: "512GB - Natural Titanium"
    │   ├── sku: "IPHONE-15-PRO-512-TIT"
    │   ├── price: $1,399
    │   ├── stock: 23
    │   ├── image: "/iphone-titanium.jpg"
    │   └── attributes: { storage: "512GB", color: "Natural Titanium" }
    │
    └── Variant 3: "256GB - Black Titanium"
        ├── sku: "IPHONE-15-PRO-256-BLK"
        ├── price: $1,199
        ├── stock: 38
        ├── image: "/iphone-black.jpg"
        └── attributes: { storage: "256GB", color: "Black Titanium" }
```

---

## 💰 Pricing & Discounts Flow

```
PRODUCT: "Wireless Mouse"
├── price: $50.00 (base price)
├── compareAtPrice: $70.00 (original price)
├── costPrice: $25.00 (your cost)
├── wholesalePrice: $40.00 (wholesale)
└── wholesaleMinQty: 50

DISCOUNTS
├── Discount 1: "Black Friday Sale"
│   ├── type: PERCENTAGE
│   ├── value: 30 (30% off)
│   ├── startsAt: 2024-11-25
│   ├── endsAt: 2024-11-30
│   └── Result: $50 → $35 (during sale)
│
├── Discount 2: "Bulk Discount 10+"
│   ├── type: PERCENTAGE
│   ├── value: 15 (15% off)
│   ├── minQuantity: 10
│   └── Result: Buy 10+ → $50 → $42.50 each
│
└── Discount 3: "Wholesale Only"
    ├── type: FIXED_AMOUNT
    ├── value: 1000 ($10 off)
    ├── wholesaleOnly: true
    ├── minQuantity: 50
    └── Result: Wholesale customers buying 50+ → $40 → $30 each

CUSTOMER SEES:
├── Regular customer (1 unit): $50.00
├── Regular customer (10 units): $42.50 each (bulk discount)
├── During Black Friday (1 unit): $35.00 (30% off)
└── Wholesale customer (50 units): $30.00 each (wholesale + discount)
```

---

## 🛒 Order Flow

```
CUSTOMER
│
├── Adds items to CART
│   └── CartItem
│       ├── productId
│       ├── variantId (if applicable)
│       ├── qty
│       └── price (snapshot)
│
├── Proceeds to CHECKOUT
│   ├── Selects/creates ADDRESS
│   ├── Chooses SHIPPING METHOD
│   │   ├── STANDARD (5-7 days)
│   │   ├── EXPRESS (2-3 days)
│   │   ├── OVERNIGHT (next day)
│   │   └── PICKUP (store pickup)
│   └── Enters PAYMENT info
│
└── Creates ORDER
    ├── orderNumber: "ORD-2024-00001"
    ├── status: PENDING
    ├── Pricing
    │   ├── subtotal: $150.00
    │   ├── discount: -$15.00
    │   ├── shipping: $10.00
    │   ├── tax: $12.00
    │   └── total: $157.00
    ├── OrderItems (snapshot)
    │   ├── Item 1: Product A × 2
    │   └── Item 2: Product B × 1
    └── Payment
        ├── method: MOBILE_MONEY
        ├── status: PENDING
        └── reference: "TXN123456"

ADMIN PROCESSES
│
├── Verifies payment → status: COMPLETED
├── Updates order → status: PROCESSING
├── Ships order → status: SHIPPED
│   └── Adds trackingNumber
└── Delivery confirmed → status: DELIVERED
```

---

## ⭐ Review System

```
PRODUCT
└── Reviews
    ├── Review 1
    │   ├── userId: "user123"
    │   ├── rating: 5 stars
    │   ├── title: "Amazing product!"
    │   ├── comment: "This is the best..."
    │   ├── images: ["review1.jpg", "review2.jpg"]
    │   ├── verified: true (verified purchase)
    │   ├── approved: true (admin approved)
    │   └── helpfulCount: 24
    │
    ├── Review 2
    │   ├── userId: "user456"
    │   ├── rating: 4 stars
    │   ├── title: "Good but..."
    │   ├── comment: "Quality is great but..."
    │   ├── images: []
    │   ├── verified: false
    │   ├── approved: true
    │   └── helpfulCount: 12
    │
    └── PRODUCT RATING (auto-calculated)
        ├── rating: 4.5 (average)
        └── reviewCount: 2
```

---

## 🏷️ Category Hierarchy

```
CATEGORIES
│
├── Electronics
│   ├── Smartphones
│   │   ├── Apple
│   │   ├── Samsung
│   │   └── Google
│   ├── Laptops
│   │   ├── MacBooks
│   │   ├── Windows Laptops
│   │   └── Chromebooks
│   └── Audio
│       ├── Headphones
│       ├── Speakers
│       └── Earbuds
│
├── Clothing
│   ├── Men
│   │   ├── T-Shirts
│   │   ├── Jeans
│   │   └── Jackets
│   └── Women
│       ├── Dresses
│       ├── Tops
│       └── Pants
│
└── Books
    ├── Fiction
    ├── Non-Fiction
    └── Self-Help

PRODUCT can belong to multiple categories:
Example: "iPhone 15 Pro"
├── Electronics
├── Smartphones
└── Apple
```

---

## 📊 Data Flow Examples

### **Adding a Product with Variants**

```
1. CREATE Product (parent)
   ├── title: "Premium T-Shirt"
   ├── price: $29.99 (base)
   └── trackInventory: false

2. CREATE Variants
   ├── Variant 1: S-Black (stock: 45)
   ├── Variant 2: M-Black (stock: 67)
   ├── Variant 3: L-Black (stock: 52)
   └── ... (12 total variants)

3. DISPLAY on product page
   └── Customer selects size & color
       └── Shows price & stock for that variant
```

### **Applying Discounts**

```
1. CUSTOMER adds product to cart
   └── Base price: $50.00

2. SYSTEM checks for discounts
   ├── Time-based: Black Friday (30% off) ✓
   ├── Quantity-based: Buy 10+ (15% off) ✗ (only 1 item)
   └── Customer-based: Wholesale (20% off) ✗ (not wholesale)

3. APPLY best discount
   └── Final price: $35.00 (30% off)
```

### **Processing an Order**

```
1. ORDER created (status: PENDING)
2. PAYMENT received (status: COMPLETED)
3. ADMIN processes (status: PROCESSING)
4. INVENTORY updated (stock - qty)
5. ORDER shipped (status: SHIPPED, trackingNumber added)
6. CUSTOMER receives (status: DELIVERED)
7. CUSTOMER reviews product
8. PRODUCT rating updated
```

---

## 🎯 Key Takeaways

1. **Flexible Structure**: JSON fields allow category-specific attributes
2. **Variant Support**: One product, multiple options
3. **Dynamic Pricing**: Multiple discount types and rules
4. **Complete Order Flow**: From cart to delivery
5. **Review System**: Customer feedback with verification
6. **Inventory Management**: Track stock, alerts, backorders
7. **Multi-level Categories**: Hierarchical organization

---

**This schema supports everything from simple products to complex e-commerce scenarios!**

