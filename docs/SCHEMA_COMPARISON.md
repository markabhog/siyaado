# Schema Comparison: Current vs. Enhanced

## Quick Overview

| Feature | Current Schema | Enhanced Schema |
|---------|---------------|-----------------|
| **Basic Product Info** | ✅ Yes | ✅ Yes (Enhanced) |
| **Product Variants** | ❌ No | ✅ Yes |
| **Bulk Pricing** | ❌ No | ✅ Yes |
| **Time-Limited Sales** | ❌ No | ✅ Yes |
| **Wholesale Pricing** | ❌ No | ✅ Yes |
| **Customer Reviews** | ❌ No | ✅ Yes |
| **Low Stock Alerts** | ❌ No | ✅ Yes |
| **Backorders** | ❌ No | ✅ Yes |
| **Shipping Addresses** | ❌ No | ✅ Yes |
| **Multiple Shipping Methods** | ❌ No | ✅ Yes |
| **Product Videos** | ❌ No | ✅ Yes |
| **Warranty Info** | ❌ No | ✅ Yes |
| **Return Policy** | ❌ No | ✅ Yes |
| **SEO Fields** | ❌ No | ✅ Yes |
| **Scheduled Publishing** | ❌ No | ✅ Yes |

---

## Product Model Changes

### **Current Product Model**
```prisma
model Product {
  id          String      @id @default(cuid())
  sku         String      @unique
  title       String
  slug        String      @unique
  description String
  price       Int         // cents
  stock       Int         @default(0)
  images      Json        // URLs
  brand       String?
  rating      Float       @default(0)
  reviewCount Int         @default(0)
  active      Boolean     @default(true)
  categories  Category[]
  createdAt   DateTime    @default(now())
}
```

### **Enhanced Product Model**
```prisma
model Product {
  // ✅ EXISTING FIELDS (unchanged)
  id          String      @id @default(cuid())
  sku         String      @unique
  title       String
  slug        String      @unique
  description String
  price       Int
  stock       Int         @default(0)
  images      Json
  brand       String?
  rating      Float       @default(0)
  reviewCount Int         @default(0)
  active      Boolean     @default(true)
  categories  Category[]
  createdAt   DateTime    @default(now())
  
  // 🆕 NEW FIELDS
  shortDesc   String?     // Brief description for cards
  
  // Pricing enhancements
  compareAtPrice Int?     // Original price for discounts
  costPrice   Int?        // Your cost (admin only)
  wholesalePrice Int?     // Wholesale customer price
  wholesaleMinQty Int?    // Min qty for wholesale
  
  // Inventory management
  lowStockThreshold Int   @default(10)
  trackInventory Boolean  @default(true)
  allowBackorder Boolean  @default(false)
  
  // Media
  videos      Json?       // Video URLs
  
  // Brand
  manufacturer String?
  
  // Physical attributes
  weight      Float?
  dimensions  Json?
  color       String?
  size        String?
  material    String?
  
  // Category-specific attributes
  attributes  Json?
  
  // SEO
  metaTitle       String?
  metaDescription String?
  tags            String[]
  
  // Features & specs
  features        Json?
  specifications  Json?
  highlights      Json?
  
  // Shipping
  shippingWeight  Float?
  freeShipping    Boolean   @default(false)
  
  // Status flags
  featured    Boolean     @default(false)
  isNew       Boolean     @default(false)
  onSale      Boolean     @default(false)
  
  // Warranty & returns
  warranty    String?
  returnDays  Int?
  
  // Timestamps
  updatedAt   DateTime    @updatedAt
  publishedAt DateTime?
  
  // 🆕 NEW RELATIONS
  variants    ProductVariant[]
  discounts   ProductDiscount[]
  reviews     Review[]
}
```

---

## New Models Added

### **1. ProductVariant**
For products with multiple options (size, color, storage, etc.)

```prisma
model ProductVariant {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(...)
  
  sku         String   @unique
  title       String   // "Large - Red"
  price       Int?     // If different from base
  compareAtPrice Int?
  stock       Int      @default(0)
  image       String?
  images      Json?
  attributes  Json     // {size: "L", color: "Red"}
  active      Boolean  @default(true)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Use Case**: iPhone with different storage/color options, T-shirts in different sizes

---

### **2. ProductDiscount**
For bulk pricing, flash sales, and time-limited offers

```prisma
model ProductDiscount {
  id          String       @id @default(cuid())
  productId   String
  product     Product      @relation(...)
  
  name        String       // "Black Friday Sale"
  type        DiscountType // PERCENTAGE | FIXED_AMOUNT | BUY_X_GET_Y
  value       Int          // 20 (for 20%) or amount in cents
  
  minQuantity Int?         // For bulk discounts
  maxQuantity Int?
  wholesaleOnly Boolean    @default(false)
  
  startsAt    DateTime?
  endsAt      DateTime?
  active      Boolean      @default(true)
  
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}
```

**Use Case**: "Buy 10+ get 15% off", "Black Friday 20% off", "Wholesale customers only"

---

### **3. Review**
Customer product reviews with ratings

```prisma
model Review {
  id          String   @id @default(cuid())
  productId   String
  product     Product  @relation(...)
  userId      String?
  user        User?    @relation(...)
  
  rating      Int      // 1-5 stars
  title       String?
  comment     String
  images      Json?    // Review photos
  
  verified    Boolean  @default(false) // Verified purchase
  approved    Boolean  @default(true)  // Admin moderation
  helpfulCount Int     @default(0)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

**Use Case**: Customer reviews with star ratings, photos, and verified purchase badges

---

### **4. Address**
Saved shipping addresses for customers

```prisma
model Address {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(...)
  
  fullName    String
  phone       String
  addressLine1 String
  addressLine2 String?
  city        String
  state       String?
  postalCode  String
  country     String   @default("Somalia")
  isDefault   Boolean  @default(false)
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  orders      Order[]
}
```

**Use Case**: Customers can save multiple addresses, faster checkout

---

## Order Model Enhancements

### **Current Order**
```prisma
model Order {
  id        String       @id
  userId    String?
  subtotal  Int
  total     Int
  status    OrderStatus
  items     OrderItem[]
  createdAt DateTime
}
```

### **Enhanced Order**
```prisma
model Order {
  // ✅ EXISTING
  id        String       @id
  userId    String?
  subtotal  Int
  total     Int
  status    OrderStatus
  items     OrderItem[]
  createdAt DateTime
  
  // 🆕 NEW FIELDS
  orderNumber String     @unique  // "ORD-2024-00001"
  email     String
  phone     String
  
  // Shipping
  addressId String?
  address   Address?
  shippingAddress Json    // Snapshot
  shippingMethod ShippingMethod
  trackingNumber String?
  estimatedDelivery DateTime?
  actualDelivery DateTime?
  
  // Pricing breakdown
  discount  Int          @default(0)
  shipping  Int          @default(0)
  tax       Int          @default(0)
  
  // Payment
  paymentId String?
  payment   Payment?
  paymentStatus PaymentStatus
  
  // Notes
  customerNotes String?
  adminNotes    String?
  
  updatedAt DateTime     @updatedAt
}
```

**New Features**:
- Human-readable order numbers
- Shipping method selection (Standard, Express, Overnight, Pickup)
- Order tracking with tracking number
- Detailed pricing breakdown
- Customer and admin notes

---

## User Model Enhancements

### **Added Fields**
```prisma
model User {
  // ... existing fields ...
  
  // 🆕 NEW
  isWholesale   Boolean  @default(false) // For wholesale pricing
  loyaltyPoints Int      @default(0)     // Future loyalty program
  
  // 🆕 NEW RELATIONS
  reviews       Review[]
  addresses     Address[]
}
```

---

## Enums Added

```prisma
enum ShippingMethod {
  STANDARD      // 5-7 days
  EXPRESS       // 2-3 days
  OVERNIGHT     // Next day
  PICKUP        // Store pickup
}

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
  BUY_X_GET_Y
}
```

---

## Migration Impact

### **Breaking Changes**
❌ **None!** All existing fields are preserved.

### **New Required Fields with Defaults**
✅ All new fields have sensible defaults, so existing data won't break.

### **Optional Fields**
✅ Most new fields are optional (`?`), so you can add them gradually.

---

## Benefits Summary

### **For Customers**
- ✅ Product variants (choose size, color, storage)
- ✅ Bulk discounts (save when buying more)
- ✅ Customer reviews (see what others think)
- ✅ Saved addresses (faster checkout)
- ✅ Multiple shipping options
- ✅ Order tracking

### **For Admins**
- ✅ Low stock alerts
- ✅ Wholesale customer management
- ✅ Time-limited sales (flash sales, Black Friday)
- ✅ Detailed product specifications
- ✅ SEO optimization fields
- ✅ Scheduled product launches
- ✅ Profit tracking (cost price)

### **For Developers**
- ✅ Flexible JSON fields for category-specific attributes
- ✅ Type-safe Prisma client
- ✅ Easy to extend further
- ✅ Backward compatible

---

## Next Steps

1. **Review**: Read the [Product Fields Guide](./PRODUCT_FIELDS_GUIDE.md)
2. **Migrate**: Follow the [Migration Guide](./MIGRATION_GUIDE.md)
3. **Test**: Add a few products with the new fields
4. **Deploy**: Roll out to production when ready

---

## Questions?

- Need clarification on any field? Ask!
- Want to customize the schema? We can adjust!
- Need help with migration? Let me know!

