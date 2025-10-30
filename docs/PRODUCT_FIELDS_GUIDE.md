# Product Fields Guide

## Overview
This guide explains all fields in the enhanced product schema and how to use them when adding products to the platform.

---

## 📋 Core Product Fields

### **Required Fields**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `sku` | String | Unique product identifier | `"IPHONE-15-PRO-256-TIT"` |
| `title` | String | Product name | `"iPhone 15 Pro Max 256GB Titanium"` |
| `slug` | String | URL-friendly identifier | `"iphone-15-pro-max-256gb"` |
| `description` | String | Full product description (HTML supported) | `"<p>The most advanced iPhone...</p>"` |
| `price` | Int | Price in cents | `119999` (= $1,199.99) |
| `stock` | Int | Available quantity | `45` |
| `images` | JSON | Array of image URLs | `["url1.jpg", "url2.jpg"]` |

### **Optional but Recommended**

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `shortDesc` | String | Brief description (150 chars) | `"Premium smartphone with titanium design"` |
| `compareAtPrice` | Int | Original price (for showing discounts) | `129999` (= $1,299.99) |
| `brand` | String | Brand name | `"Apple"` |
| `manufacturer` | String | Manufacturer (if different from brand) | `"Foxconn"` |

---

## 💰 Pricing Fields

### **Regular Pricing**
- `price`: Base selling price (in cents)
- `compareAtPrice`: Original price for showing "Was $X, Now $Y"
- `costPrice`: Your cost (admin only, for profit calculations)

### **Wholesale Pricing**
- `wholesalePrice`: Special price for wholesale customers
- `wholesaleMinQty`: Minimum quantity to qualify for wholesale price

**Example:**
```json
{
  "price": 119999,           // $1,199.99 retail
  "compareAtPrice": 129999,  // $1,299.99 (10% off)
  "costPrice": 80000,        // $800 (your cost)
  "wholesalePrice": 100000,  // $1,000 for wholesale
  "wholesaleMinQty": 10      // Must buy 10+ units
}
```

---

## 📦 Inventory Management

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| `stock` | Int | Current quantity available | `0` |
| `lowStockThreshold` | Int | Alert when stock falls below this | `10` |
| `trackInventory` | Boolean | Enable/disable inventory tracking | `true` |
| `allowBackorder` | Boolean | Allow orders when out of stock | `false` |

**Use Cases:**
- **Digital products**: Set `trackInventory: false` (unlimited stock)
- **Pre-orders**: Set `allowBackorder: true`
- **Limited editions**: Set `lowStockThreshold: 5` for early alerts

---

## 🎨 Product Variants

Use variants for products with multiple options (size, color, storage, etc.)

### **Main Product**
```json
{
  "title": "iPhone 15 Pro Max",
  "price": 119999,  // Base price (256GB)
  "stock": 0,       // Don't track stock on parent
  "trackInventory": false
}
```

### **Variants**
```json
[
  {
    "sku": "IPHONE-15-PRO-256-TIT",
    "title": "256GB - Titanium",
    "price": 119999,
    "stock": 45,
    "attributes": {
      "storage": "256GB",
      "color": "Natural Titanium"
    },
    "image": "/images/iphone-titanium.jpg"
  },
  {
    "sku": "IPHONE-15-PRO-512-BLK",
    "title": "512GB - Black",
    "price": 139999,
    "stock": 23,
    "attributes": {
      "storage": "512GB",
      "color": "Black Titanium"
    },
    "image": "/images/iphone-black.jpg"
  }
]
```

---

## 🎯 Bulk Pricing & Discounts

### **ProductDiscount Model**

#### **Percentage Discount**
```json
{
  "name": "Black Friday Sale",
  "type": "PERCENTAGE",
  "value": 20,           // 20% off
  "startsAt": "2024-11-25T00:00:00Z",
  "endsAt": "2024-11-30T23:59:59Z",
  "active": true
}
```

#### **Bulk Discount**
```json
{
  "name": "Buy 10+ Save 15%",
  "type": "PERCENTAGE",
  "value": 15,
  "minQuantity": 10,
  "active": true
}
```

#### **Wholesale Discount**
```json
{
  "name": "Wholesale Price",
  "type": "FIXED_AMOUNT",
  "value": 20000,        // $200 off
  "wholesaleOnly": true,
  "minQuantity": 50,
  "active": true
}
```

---

## 📐 Physical Attributes

### **Weight & Dimensions**
```json
{
  "weight": 0.221,  // kg
  "dimensions": {
    "length": 16.0,
    "width": 7.7,
    "height": 0.83,
    "unit": "cm"
  },
  "shippingWeight": 0.5  // Includes packaging
}
```

### **Other Physical Attributes**
- `color`: "Natural Titanium", "Space Gray", etc.
- `size`: "S", "M", "L", "XL" (for clothing)
- `material`: "Titanium", "Aluminum", "Cotton", etc.

---

## 🏷️ Category-Specific Attributes (JSON)

### **Electronics**
```json
{
  "processor": "Apple M3 Pro",
  "ram": "16GB",
  "storage": "512GB SSD",
  "display": "16.2\" Liquid Retina XDR",
  "battery": "Up to 22 hours",
  "connectivity": ["Wi-Fi 6E", "Bluetooth 5.3", "Thunderbolt 4"],
  "os": "macOS Sonoma",
  "releaseYear": 2024,
  "warranty": "1 year"
}
```

### **Books**
```json
{
  "author": "James Clear",
  "isbn": "978-0735211292",
  "publisher": "Avery",
  "pages": 320,
  "language": "English",
  "format": "Hardcover",
  "publishedDate": "2018-10-16",
  "genre": ["Self-Help", "Productivity", "Psychology"],
  "ageRange": "Adult"
}
```

### **Furniture**
```json
{
  "material": "Solid Oak",
  "style": "Scandinavian",
  "assembly": true,
  "roomType": "Dining Room",
  "seatingCapacity": 6,
  "finish": "Natural",
  "careInstructions": "Wipe with damp cloth",
  "warranty": "5 years"
}
```

### **Clothing**
```json
{
  "fabric": "100% Cotton",
  "fit": "Regular",
  "occasion": "Casual",
  "season": "All Season",
  "careInstructions": "Machine wash cold",
  "countryOfOrigin": "USA",
  "sustainableMaterial": true
}
```

### **Beauty**
```json
{
  "skinType": "All",
  "ingredients": ["Vitamin C", "Hyaluronic Acid", "Niacinamide"],
  "benefits": ["Brightening", "Hydration", "Anti-aging"],
  "volume": "30ml",
  "expiryDate": "2025-12-31",
  "isNatural": true,
  "isCrueltyFree": true,
  "isVegan": true,
  "scent": "Unscented",
  "spf": 30
}
```

---

## ✨ Features & Specifications

### **Features (Bullet Points)**
```json
{
  "features": [
    "A17 Pro chip with 6-core GPU",
    "ProMotion technology with adaptive refresh rates up to 120Hz",
    "Always-On display",
    "Dynamic Island",
    "48MP Main camera",
    "Up to 29 hours video playback"
  ]
}
```

### **Specifications (Table Format)**
```json
{
  "specifications": {
    "Display": "6.7-inch Super Retina XDR display",
    "Chip": "A17 Pro chip",
    "Camera": "48MP Main | 12MP Ultra Wide | 12MP Telephoto",
    "Battery": "Up to 29 hours video playback",
    "Water Resistance": "IP68 (maximum depth of 6 meters up to 30 minutes)",
    "Connector": "USB-C",
    "Operating System": "iOS 17"
  }
}
```

### **Highlights (Key Selling Points)**
```json
{
  "highlights": [
    "Industry-leading A17 Pro chip",
    "Titanium design - strongest and lightest",
    "Advanced camera system with 5x optical zoom",
    "All-day battery life"
  ]
}
```

---

## 🚚 Shipping & Delivery

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `shippingWeight` | Float | Weight with packaging (kg) | `0.5` |
| `freeShipping` | Boolean | Eligible for free shipping | `true` |

### **Shipping Methods (Order Level)**
- `STANDARD`: 5-7 business days
- `EXPRESS`: 2-3 business days
- `OVERNIGHT`: Next day delivery
- `PICKUP`: In-store pickup

---

## 🛡️ Warranty & Returns

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `warranty` | String | Warranty period | `"1 year"`, `"2 years"`, `"Lifetime"` |
| `returnDays` | Int | Days allowed for returns | `7`, `30`, `90` |

---

## 🏷️ Product Status Flags

| Field | Type | Description |
|-------|------|-------------|
| `active` | Boolean | Product is visible on site |
| `featured` | Boolean | Show in featured sections |
| `isNew` | Boolean | Show "New" badge |
| `onSale` | Boolean | Show "Sale" badge |
| `publishedAt` | DateTime | Schedule product launch |

---

## 🔍 SEO & Marketing

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `metaTitle` | String | SEO title (60 chars) | `"iPhone 15 Pro Max - Buy Now | Luul"` |
| `metaDescription` | String | SEO description (160 chars) | `"Get the iPhone 15 Pro Max with titanium design..."` |
| `tags` | String[] | Searchable keywords | `["smartphone", "apple", "5g", "titanium"]` |

---

## 📝 Complete Product Example

```json
{
  // Core
  "sku": "IPHONE-15-PRO-256-TIT",
  "title": "iPhone 15 Pro Max 256GB Natural Titanium",
  "slug": "iphone-15-pro-max-256gb-titanium",
  "description": "<p>The most advanced iPhone ever...</p>",
  "shortDesc": "Premium smartphone with titanium design and A17 Pro chip",
  
  // Pricing
  "price": 119999,
  "compareAtPrice": 129999,
  "costPrice": 80000,
  "wholesalePrice": 100000,
  "wholesaleMinQty": 10,
  
  // Inventory
  "stock": 45,
  "lowStockThreshold": 10,
  "trackInventory": true,
  "allowBackorder": false,
  
  // Media
  "images": [
    "/products/iphone-15-pro-titanium-1.jpg",
    "/products/iphone-15-pro-titanium-2.jpg",
    "/products/iphone-15-pro-titanium-3.jpg"
  ],
  "videos": [
    "https://youtube.com/watch?v=xyz"
  ],
  
  // Brand
  "brand": "Apple",
  "manufacturer": "Apple Inc.",
  
  // Physical
  "weight": 0.221,
  "dimensions": {
    "length": 16.0,
    "width": 7.7,
    "height": 0.83,
    "unit": "cm"
  },
  "color": "Natural Titanium",
  
  // Category-specific
  "attributes": {
    "processor": "A17 Pro chip",
    "ram": "8GB",
    "storage": "256GB",
    "display": "6.7\" Super Retina XDR",
    "battery": "Up to 29 hours video",
    "connectivity": ["5G", "Wi-Fi 6E", "Bluetooth 5.3"],
    "os": "iOS 17"
  },
  
  // Features
  "features": [
    "A17 Pro chip with 6-core GPU",
    "ProMotion technology up to 120Hz",
    "48MP Main camera with 5x optical zoom",
    "Titanium design"
  ],
  
  "specifications": {
    "Display": "6.7-inch Super Retina XDR",
    "Chip": "A17 Pro",
    "Camera": "48MP Main | 12MP Ultra Wide | 12MP Telephoto",
    "Battery": "Up to 29 hours video playback",
    "Water Resistance": "IP68",
    "Connector": "USB-C"
  },
  
  "highlights": [
    "Industry-leading A17 Pro chip",
    "Titanium design - strongest and lightest",
    "Advanced camera system",
    "All-day battery life"
  ],
  
  // SEO
  "metaTitle": "iPhone 15 Pro Max 256GB - Buy Now | Luul",
  "metaDescription": "Get the iPhone 15 Pro Max with titanium design, A17 Pro chip, and advanced camera. Free shipping available.",
  "tags": ["smartphone", "apple", "iphone", "5g", "titanium", "pro"],
  
  // Shipping
  "shippingWeight": 0.5,
  "freeShipping": true,
  
  // Status
  "active": true,
  "featured": true,
  "isNew": true,
  "onSale": false,
  
  // Warranty
  "warranty": "1 year",
  "returnDays": 30,
  
  // Categories
  "categories": ["electronics", "smartphones", "apple"]
}
```

---

## 🎨 Product Variants Example

```json
// Parent Product
{
  "sku": "IPHONE-15-PRO",
  "title": "iPhone 15 Pro Max",
  "price": 119999,  // Base price
  "trackInventory": false,  // Track on variants
  // ... other fields
}

// Variants
[
  {
    "sku": "IPHONE-15-PRO-256-TIT",
    "title": "256GB - Natural Titanium",
    "price": 119999,
    "stock": 45,
    "image": "/images/iphone-titanium.jpg",
    "attributes": {
      "storage": "256GB",
      "color": "Natural Titanium"
    }
  },
  {
    "sku": "IPHONE-15-PRO-512-TIT",
    "title": "512GB - Natural Titanium",
    "price": 139999,
    "stock": 23,
    "image": "/images/iphone-titanium.jpg",
    "attributes": {
      "storage": "512GB",
      "color": "Natural Titanium"
    }
  },
  {
    "sku": "IPHONE-15-PRO-256-BLK",
    "title": "256GB - Black Titanium",
    "price": 119999,
    "stock": 38,
    "image": "/images/iphone-black.jpg",
    "attributes": {
      "storage": "256GB",
      "color": "Black Titanium"
    }
  }
]
```

---

## 📊 Next Steps

1. **Review the enhanced schema**: `prisma/schema-enhanced.prisma`
2. **Backup your current database**: `cp prisma/dev.db prisma/dev.db.backup`
3. **Apply the migration** (when ready)
4. **Start adding products** using this guide
5. **Test product pages** with different field combinations

---

## ❓ Questions?

- Missing a field you need? Let me know!
- Need help with a specific product type? Share an example!
- Want to customize the schema further? We can adjust!

