# Implementation Guide - Product Pages & Admin Features

## ✅ Completed Components

### **1. VariantSelector Component**
**Location**: `app/product/[slug]/VariantSelector.tsx`

**Features**:
- Dynamic attribute selection (size, color, storage, etc.)
- Real-time price updates
- Stock availability checking
- Visual feedback for unavailable options
- Responsive design with animations

**Usage**:
```tsx
import { VariantSelector } from './VariantSelector';

<VariantSelector
  variants={product.variants}
  basePrice={product.price}
  onVariantChange={(variant) => setSelectedVariant(variant)}
/>
```

---

### **2. ReviewForm Component**
**Location**: `app/product/[slug]/ReviewForm.tsx`

**Features**:
- Star rating selector
- Optional title field
- Required comment field
- Authentication check
- Success/error handling
- Verified purchase badge support

**Usage**:
```tsx
import { ReviewForm } from './ReviewForm';

<ReviewForm
  productId={product.id}
  onReviewSubmitted={() => refreshReviews()}
/>
```

---

### **3. ReviewsList Component**
**Location**: `app/product/[slug]/ReviewsList.tsx`

**Features**:
- Average rating display
- Rating distribution chart
- Sort options (recent, helpful, rating)
- Verified purchase badges
- Review images support
- Helpful voting

**Usage**:
```tsx
import { ReviewsList } from './ReviewsList';

<ReviewsList
  productId={product.id}
  refreshTrigger={refreshCount}
/>
```

---

## 📋 Next Steps - Remaining Components

### **4. Specifications Display**

Create `app/product/[slug]/SpecificationsTable.tsx`:

```tsx
"use client";

interface SpecificationsTableProps {
  specifications: Record<string, string>;
  attributes?: any;
}

export function SpecificationsTable({ specifications, attributes }: SpecificationsTableProps) {
  const specs = specifications || {};
  const attrs = attributes || {};
  
  // Combine specifications and attributes
  const allSpecs = { ...specs, ...attrs };
  const entries = Object.entries(allSpecs);

  if (entries.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 bg-slate-50 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-900">Specifications</h3>
      </div>
      <div className="divide-y divide-slate-200">
        {entries.map(([key, value], index) => (
          <div
            key={key}
            className={`px-6 py-4 grid grid-cols-3 gap-4 ${
              index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
            }`}
          >
            <div className="font-medium text-slate-700 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </div>
            <div className="col-span-2 text-slate-900">
              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### **5. Related Products**

Create `app/product/[slug]/RelatedProducts.tsx`:

```tsx
"use client";
import { useState, useEffect } from 'react';
import { ProductCard } from '@/app/components/ProductCard';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';

interface RelatedProductsProps {
  productId: string;
  categorySlug?: string;
}

export function RelatedProducts({ productId, categorySlug }: RelatedProductsProps) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchRelatedProducts();
  }, [productId, categorySlug]);

  const fetchRelatedProducts = async () => {
    try {
      const url = categorySlug
        ? `/api/products?category=${categorySlug}&limit=4`
        : `/api/products?limit=4`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      // Filter out current product
      const filtered = (data.products || []).filter((p: any) => p.id !== productId);
      setProducts(filtered.slice(0, 4));
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">You May Also Like</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product: any) => (
          <ProductCard
            key={product.id}
            slug={product.slug}
            title={product.title}
            price={product.price}
            image={Array.isArray(product.images) ? product.images[0] : null}
            discount={product.compareAtPrice 
              ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
              : undefined
            }
            rating={product.rating}
            reviewCount={product.reviewCount}
            onBuyNow={() => router.push(`/product/${product.slug}`)}
            onAddToCart={() => addItem({
              id: product.id,
              title: product.title,
              price: product.price,
              image: Array.isArray(product.images) ? product.images[0] : null,
              quantity: 1
            })}
          />
        ))}
      </div>
    </div>
  );
}
```

---

### **6. Update Product Page**

Update `app/product/[slug]/ProductPageClient.tsx` to include all new components:

```tsx
import { VariantSelector } from './VariantSelector';
import { ReviewForm } from './ReviewForm';
import { ReviewsList } from './ReviewsList';
import { SpecificationsTable } from './SpecificationsTable';
import { RelatedProducts } from './RelatedProducts';

// Inside your component:
<div className="space-y-12">
  {/* Existing product info */}
  
  {/* Add Variant Selector if variants exist */}
  {product.variants && product.variants.length > 0 && (
    <VariantSelector
      variants={product.variants}
      basePrice={product.price}
      onVariantChange={(variant) => setSelectedVariant(variant)}
    />
  )}
  
  {/* Add Specifications */}
  {(product.specifications || product.attributes) && (
    <SpecificationsTable
      specifications={product.specifications}
      attributes={product.attributes}
    />
  )}
  
  {/* Add Reviews Section */}
  <div className="space-y-8">
    <h2 className="text-2xl font-bold">Customer Reviews</h2>
    <ReviewsList productId={product.id} refreshTrigger={reviewRefresh} />
    <ReviewForm 
      productId={product.id} 
      onReviewSubmitted={() => setReviewRefresh(prev => prev + 1)}
    />
  </div>
  
  {/* Add Related Products */}
  <RelatedProducts 
    productId={product.id}
    categorySlug={product.categories?.[0]?.slug}
  />
</div>
```

---

## 🔧 Admin Features Implementation

### **7. Product Management UI**

Create `app/admin/products/ProductForm.tsx`:

This will be a comprehensive form for adding/editing products with:
- Basic info (title, SKU, description, price)
- Images upload
- Category selection
- Inventory settings
- SEO fields
- Attributes (JSON editor)
- Features & specifications
- Variant management (add/remove variants)

### **8. Discount Management UI**

Create `app/admin/discounts/page.tsx`:

Features:
- List all discounts
- Create new discount
- Edit existing discount
- Schedule start/end dates
- Set conditions (min quantity, customer type)
- Preview discount impact

### **9. Review Moderation UI**

Create `app/admin/reviews/page.tsx`:

Features:
- List all reviews (pending, approved, rejected)
- Filter by product, rating, status
- Approve/reject reviews
- Delete inappropriate reviews
- View verified purchase status

### **10. Low Stock Alerts**

Create `app/admin/inventory/alerts/page.tsx`:

Features:
- List products below threshold
- Configurable threshold per product
- Email notifications (future)
- Quick restock actions
- Stock history

---

## 📝 Implementation Priority

### **Phase 1: Product Page Enhancements** ✅
1. ✅ Variant Selector
2. ✅ Review Form
3. ✅ Reviews List
4. ⏳ Specifications Table
5. ⏳ Related Products

### **Phase 2: Admin Product Management**
1. Product CRUD (Create, Read, Update, Delete)
2. Variant Management
3. Image Upload
4. Bulk Actions

### **Phase 3: Admin Marketing & Sales**
1. Discount Management
2. Flash Sales
3. Bulk Pricing Rules
4. Coupon Codes (future)

### **Phase 4: Admin Operations**
1. Review Moderation
2. Low Stock Alerts
3. Inventory Management
4. Order Fulfillment

---

## 🚀 Quick Start

### **Test the New Components**

1. **Visit a product with variants**:
   ```
   http://localhost:3000/product/iphone-15-pro-max
   ```
   - You should see the variant selector
   - Try selecting different storage/color options
   - Price and stock should update

2. **Submit a review**:
   - Sign in first
   - Scroll to reviews section
   - Fill out the review form
   - Submit and see it appear in the list

3. **View reviews**:
   - See average rating
   - View rating distribution
   - Sort reviews by different criteria

---

## 📦 Required API Endpoints

All API endpoints are already created:

- ✅ `GET /api/products` - List products with variants
- ✅ `GET /api/products/[id]/reviews` - Get reviews
- ✅ `POST /api/products/[id]/reviews` - Submit review
- ⏳ `PUT /api/admin/reviews/[id]` - Approve/reject review (TODO)
- ⏳ `GET /api/admin/inventory/low-stock` - Get low stock products (TODO)
- ⏳ `POST /api/admin/discounts` - Create discount (TODO)

---

## 🎨 Styling Notes

All components use:
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Consistent color scheme**: Blue primary, slate neutrals
- **Responsive design**: Mobile-first approach
- **Accessibility**: ARIA labels, keyboard navigation

---

## 🔐 Authentication

Components that require auth:
- `ReviewForm` - Must be signed in to submit
- All admin pages - Must have ADMIN role

---

## 📊 Next Steps

1. **Create the remaining components** (Specifications, Related Products)
2. **Test all product page features**
3. **Build admin product management UI**
4. **Implement discount management**
5. **Add review moderation**
6. **Create inventory alerts**

---

**Ready to continue? Let me know which feature you'd like to implement next!** 🚀

