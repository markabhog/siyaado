# Migration Guide: Current Schema → Enhanced Schema

## Overview
This guide walks you through migrating from the current product schema to the enhanced schema with support for variants, bulk pricing, reviews, and more.

---

## ⚠️ Before You Start

### **1. Backup Your Database**
```bash
# SQLite backup
cp prisma/dev.db prisma/dev.db.backup

# Or export data
npx prisma db pull
```

### **2. Review Changes**
- Read `docs/PRODUCT_FIELDS_GUIDE.md` to understand new fields
- Review `prisma/schema-enhanced.prisma` for the complete schema

---

## 🔄 Migration Steps

### **Step 1: Replace Schema File**

```bash
# Backup current schema
cp prisma/schema.prisma prisma/schema-old.prisma

# Replace with enhanced schema
cp prisma/schema-enhanced.prisma prisma/schema.prisma
```

### **Step 2: Create Migration**

```bash
# This will detect all changes and create a migration
npx prisma migrate dev --name enhance_product_schema

# If you get errors about data loss, you may need to:
# 1. Export existing products
# 2. Reset database
# 3. Re-import with new structure
```

### **Step 3: Generate Prisma Client**

```bash
npx prisma generate
```

### **Step 4: Update TypeScript Types**

The Prisma client will now have new types. Update your code to use them:

```typescript
// Old
import { Product } from '@prisma/client';

// New - same import, but Product now has more fields
import { Product, ProductVariant, Review, ProductDiscount } from '@prisma/client';
```

---

## 📝 Data Migration Script

If you have existing products, you'll need to migrate them to the new structure:

```typescript
// scripts/migrate-products.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateProducts() {
  const products = await prisma.product.findMany();
  
  for (const product of products) {
    // Update existing products with new fields
    await prisma.product.update({
      where: { id: product.id },
      data: {
        // Set defaults for new required fields
        lowStockThreshold: 10,
        trackInventory: true,
        allowBackorder: false,
        
        // Migrate pricing
        compareAtPrice: product.price, // If you had discounts
        
        // Add empty arrays/objects for JSON fields
        videos: [],
        dimensions: null,
        attributes: null,
        features: null,
        specifications: null,
        highlights: null,
        
        // Set defaults for new booleans
        featured: false,
        isNew: false,
        onSale: false,
        freeShipping: false,
        
        // Add default warranty/returns
        warranty: "1 year",
        returnDays: 30,
      }
    });
  }
  
  console.log(`Migrated ${products.length} products`);
}

migrateProducts()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run the migration:
```bash
npx tsx scripts/migrate-products.ts
```

---

## 🆕 New Features Setup

### **1. Product Variants**

For products with variations (size, color, etc.), create variants:

```typescript
// Example: Create iPhone with storage/color variants
const iphone = await prisma.product.create({
  data: {
    sku: 'IPHONE-15-PRO',
    title: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'Premium smartphone...',
    price: 119999, // Base price
    stock: 0, // Don't track on parent
    trackInventory: false,
    images: ['/images/iphone-main.jpg'],
    brand: 'Apple',
    categories: {
      connect: [{ slug: 'smartphones' }]
    },
    variants: {
      create: [
        {
          sku: 'IPHONE-15-PRO-256-TIT',
          title: '256GB - Natural Titanium',
          price: 119999,
          stock: 45,
          image: '/images/iphone-titanium.jpg',
          attributes: {
            storage: '256GB',
            color: 'Natural Titanium'
          }
        },
        {
          sku: 'IPHONE-15-PRO-512-TIT',
          title: '512GB - Natural Titanium',
          price: 139999,
          stock: 23,
          image: '/images/iphone-titanium.jpg',
          attributes: {
            storage: '512GB',
            color: 'Natural Titanium'
          }
        }
      ]
    }
  }
});
```

### **2. Bulk Pricing / Discounts**

Add time-limited or quantity-based discounts:

```typescript
// Black Friday Sale - 20% off
await prisma.productDiscount.create({
  data: {
    productId: iphone.id,
    name: 'Black Friday Sale',
    type: 'PERCENTAGE',
    value: 20,
    startsAt: new Date('2024-11-25T00:00:00Z'),
    endsAt: new Date('2024-11-30T23:59:59Z'),
    active: true
  }
});

// Bulk discount - Buy 10+, get 15% off
await prisma.productDiscount.create({
  data: {
    productId: iphone.id,
    name: 'Bulk Discount 10+',
    type: 'PERCENTAGE',
    value: 15,
    minQuantity: 10,
    active: true
  }
});
```

### **3. Customer Addresses**

Enable saved shipping addresses:

```typescript
await prisma.address.create({
  data: {
    userId: user.id,
    fullName: 'John Doe',
    phone: '+252612345678',
    addressLine1: '123 Main Street',
    city: 'Mogadishu',
    postalCode: '00100',
    country: 'Somalia',
    isDefault: true
  }
});
```

---

## 🔧 API Route Updates

### **Update Product API to Return New Fields**

```typescript
// app/api/products/route.ts
export async function GET(request: Request) {
  const products = await prisma.product.findMany({
    include: {
      variants: true,
      discounts: {
        where: {
          active: true,
          OR: [
            { startsAt: null },
            { startsAt: { lte: new Date() } }
          ],
          OR: [
            { endsAt: null },
            { endsAt: { gte: new Date() } }
          ]
        }
      },
      categories: true
    }
  });
  
  return Response.json({ products });
}
```

### **New Review API**

```typescript
// app/api/products/[id]/reviews/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const reviews = await prisma.review.findMany({
    where: {
      productId: params.id,
      approved: true
    },
    include: {
      user: {
        select: {
          name: true,
          image: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
  
  return Response.json({ reviews });
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const { rating, title, comment, images } = await request.json();
  
  // Check if user purchased this product
  const hasPurchased = await prisma.orderItem.findFirst({
    where: {
      productId: params.id,
      order: {
        userId: session.user.id,
        status: 'DELIVERED'
      }
    }
  });
  
  const review = await prisma.review.create({
    data: {
      productId: params.id,
      userId: session.user.id,
      rating,
      title,
      comment,
      images,
      verified: !!hasPurchased
    }
  });
  
  // Update product rating
  const avgRating = await prisma.review.aggregate({
    where: { productId: params.id, approved: true },
    _avg: { rating: true },
    _count: true
  });
  
  await prisma.product.update({
    where: { id: params.id },
    data: {
      rating: avgRating._avg.rating || 0,
      reviewCount: avgRating._count
    }
  });
  
  return Response.json({ review });
}
```

---

## 🎨 Frontend Updates

### **1. Product Card - Show Variants**

```typescript
// app/components/ProductCard.tsx
export function ProductCard({ product }: { product: Product & { variants: ProductVariant[] } }) {
  const hasVariants = product.variants && product.variants.length > 0;
  const displayPrice = hasVariants 
    ? Math.min(...product.variants.map(v => v.price || product.price))
    : product.price;
  
  return (
    <div>
      <h3>{product.title}</h3>
      <p>
        {hasVariants ? 'From ' : ''}
        ${(displayPrice / 100).toFixed(2)}
      </p>
      {hasVariants && (
        <p className="text-sm text-gray-500">
          {product.variants.length} options available
        </p>
      )}
    </div>
  );
}
```

### **2. Product Page - Variant Selector**

```typescript
// app/product/[slug]/VariantSelector.tsx
'use client';
import { useState } from 'react';

export function VariantSelector({ variants }: { variants: ProductVariant[] }) {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
  
  // Group variants by attribute (e.g., storage, color)
  const attributes = Object.keys(variants[0].attributes as any);
  
  return (
    <div className="space-y-4">
      {attributes.map(attr => {
        const options = [...new Set(variants.map(v => (v.attributes as any)[attr]))];
        
        return (
          <div key={attr}>
            <label className="block text-sm font-medium mb-2">
              {attr.charAt(0).toUpperCase() + attr.slice(1)}
            </label>
            <div className="flex gap-2">
              {options.map(option => (
                <button
                  key={option}
                  onClick={() => {
                    const variant = variants.find(v => 
                      (v.attributes as any)[attr] === option
                    );
                    if (variant) setSelectedVariant(variant);
                  }}
                  className={`px-4 py-2 border rounded ${
                    (selectedVariant.attributes as any)[attr] === option
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      })}
      
      <div className="mt-4">
        <p className="text-2xl font-bold">
          ${(selectedVariant.price || 0) / 100}
        </p>
        <p className="text-sm text-gray-600">
          {selectedVariant.stock > 0 
            ? `${selectedVariant.stock} in stock`
            : 'Out of stock'
          }
        </p>
      </div>
    </div>
  );
}
```

### **3. Review Form**

```typescript
// app/product/[slug]/ReviewForm.tsx
'use client';
import { useState } from 'react';

export function ReviewForm({ productId }: { productId: string }) {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rating, title, comment })
    });
    
    if (response.ok) {
      alert('Review submitted!');
      // Reset form or redirect
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Rating</label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <label className="block mb-2">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
          placeholder="Great product!"
        />
      </div>
      
      <div>
        <label className="block mb-2">Review</label>
        <textarea
          value={comment}
          onChange={e => setComment(e.target.value)}
          className="w-full border rounded px-3 py-2"
          rows={4}
          placeholder="Share your experience..."
          required
        />
      </div>
      
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Submit Review
      </button>
    </form>
  );
}
```

---

## ✅ Testing Checklist

After migration, test these features:

- [ ] Existing products still display correctly
- [ ] New products can be created with all fields
- [ ] Product variants display and can be selected
- [ ] Bulk discounts apply correctly at checkout
- [ ] Reviews can be submitted and displayed
- [ ] Low stock alerts work
- [ ] Wholesale pricing applies for wholesale customers
- [ ] Shipping methods are selectable at checkout
- [ ] Order tracking works with new order fields

---

## 🚨 Troubleshooting

### **Migration Fails with "Data Loss" Warning**

If Prisma warns about data loss:

1. **Export existing data**:
```bash
npx prisma db pull
# This creates a schema.prisma based on current DB
```

2. **Reset and migrate**:
```bash
npx prisma migrate reset --force
npx prisma migrate dev --name initial_enhanced
```

3. **Re-import data** using the migration script above

### **Type Errors After Migration**

```bash
# Regenerate Prisma client
npx prisma generate

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### **Existing Products Missing New Fields**

Run the data migration script (`scripts/migrate-products.ts`) to add defaults.

---

## 📞 Need Help?

- Check the [Product Fields Guide](./PRODUCT_FIELDS_GUIDE.md)
- Review the [Enhanced Schema](../prisma/schema-enhanced.prisma)
- Ask questions if anything is unclear!

