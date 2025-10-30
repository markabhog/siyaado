# Product Types Guide

## Overview
This guide shows how to handle different product categories using the flexible `attributes` JSON field while maintaining a single Product model.

---

## 🎯 Philosophy: One Model, Flexible Attributes

Instead of creating separate models for each product type (ElectronicsProduct, BookProduct, etc.), we use:

1. **Core fields**: Common to all products (title, price, stock, etc.)
2. **Attributes JSON**: Category-specific details
3. **Conditional rendering**: Show/hide sections based on available data

---

## 📱 Electronics

### **Smartphones**

```json
{
  "title": "iPhone 15 Pro Max 256GB Natural Titanium",
  "sku": "IPHONE-15-PRO-256-TIT",
  "price": 119999,
  "brand": "Apple",
  "attributes": {
    "processor": "A17 Pro chip",
    "ram": "8GB",
    "storage": "256GB",
    "display": "6.7\" Super Retina XDR",
    "displayResolution": "2796 x 1290",
    "refreshRate": "120Hz",
    "camera": {
      "main": "48MP",
      "ultraWide": "12MP",
      "telephoto": "12MP (5x optical zoom)",
      "front": "12MP"
    },
    "battery": "Up to 29 hours video playback",
    "charging": ["USB-C", "MagSafe", "Qi wireless"],
    "connectivity": ["5G", "Wi-Fi 6E", "Bluetooth 5.3", "NFC"],
    "os": "iOS 17",
    "waterResistance": "IP68",
    "biometric": "Face ID",
    "simType": "Dual eSIM",
    "releaseYear": 2024
  },
  "specifications": {
    "Display": "6.7-inch Super Retina XDR display",
    "Chip": "A17 Pro chip with 6-core GPU",
    "Camera System": "48MP Main | 12MP Ultra Wide | 12MP Telephoto (5x)",
    "Video Recording": "4K at 60fps, ProRes",
    "Battery Life": "Up to 29 hours video playback",
    "Water Resistance": "IP68 (6 meters for 30 minutes)",
    "Connector": "USB-C",
    "Operating System": "iOS 17"
  },
  "features": [
    "A17 Pro chip with 6-core GPU",
    "ProMotion technology with adaptive refresh rates up to 120Hz",
    "Always-On display",
    "Dynamic Island",
    "48MP Main camera with second-generation sensor-shift OIS",
    "5x Telephoto camera",
    "Titanium design with textured matte glass back",
    "Action button",
    "Emergency SOS via satellite"
  ]
}
```

### **Laptops**

```json
{
  "title": "MacBook Pro 16\" M3 Pro",
  "sku": "MBP-16-M3PRO-512",
  "price": 249999,
  "brand": "Apple",
  "attributes": {
    "processor": "Apple M3 Pro chip (12-core CPU, 18-core GPU)",
    "ram": "18GB unified memory",
    "storage": "512GB SSD",
    "display": "16.2\" Liquid Retina XDR",
    "displayResolution": "3456 x 2234",
    "refreshRate": "120Hz",
    "graphics": "18-core GPU",
    "battery": "Up to 22 hours",
    "ports": ["3x Thunderbolt 4", "HDMI", "SDXC card slot", "MagSafe 3", "3.5mm headphone jack"],
    "connectivity": ["Wi-Fi 6E", "Bluetooth 5.3"],
    "os": "macOS Sonoma",
    "keyboard": "Backlit Magic Keyboard with Touch ID",
    "webcam": "1080p FaceTime HD camera",
    "audio": "Six-speaker sound system with force-cancelling woofers",
    "weight": "2.15 kg",
    "releaseYear": 2024
  }
}
```

### **Headphones**

```json
{
  "title": "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
  "sku": "SONY-WH1000XM5-BLK",
  "price": 39999,
  "brand": "Sony",
  "attributes": {
    "type": "Over-ear",
    "connectivity": ["Bluetooth 5.2", "3.5mm wired"],
    "noiseCancellation": "Active Noise Cancellation",
    "drivers": "30mm",
    "frequencyResponse": "4Hz - 40kHz",
    "battery": "Up to 30 hours (ANC on), 40 hours (ANC off)",
    "charging": "USB-C, Quick charge (3 min = 3 hours)",
    "weight": "250g",
    "features": ["Multipoint connection", "Speak-to-chat", "Adaptive Sound Control"],
    "voiceAssistant": ["Google Assistant", "Alexa"],
    "foldable": true
  }
}
```

---

## 📚 Books

```json
{
  "title": "Atomic Habits: An Easy & Proven Way to Build Good Habits & Break Bad Ones",
  "sku": "BOOK-ATOMIC-HABITS-HC",
  "price": 2799,
  "brand": null,
  "attributes": {
    "author": "James Clear",
    "isbn": "978-0735211292",
    "isbn13": "978-0735211292",
    "publisher": "Avery",
    "publicationDate": "2018-10-16",
    "language": "English",
    "pages": 320,
    "format": "Hardcover",
    "dimensions": "21.6 x 14.7 x 2.5 cm",
    "genre": ["Self-Help", "Productivity", "Psychology", "Personal Development"],
    "ageRange": "Adult",
    "edition": "1st Edition",
    "illustrator": null,
    "translator": null
  },
  "specifications": {
    "Author": "James Clear",
    "ISBN-13": "978-0735211292",
    "Publisher": "Avery",
    "Publication Date": "October 16, 2018",
    "Language": "English",
    "Pages": "320",
    "Format": "Hardcover",
    "Dimensions": "21.6 x 14.7 x 2.5 cm",
    "Weight": "430g"
  },
  "features": [
    "New York Times Bestseller",
    "Over 10 million copies sold worldwide",
    "Practical strategies for forming good habits",
    "Breaking bad habits",
    "Based on proven psychological research"
  ],
  "shortDesc": "The #1 New York Times bestseller on habit formation and behavior change."
}
```

---

## 🪑 Furniture

```json
{
  "title": "Scandinavian Oak Dining Table",
  "sku": "FURN-TABLE-OAK-6SEAT",
  "price": 79999,
  "brand": "Nordic Living",
  "attributes": {
    "material": "Solid Oak Wood",
    "finish": "Natural oil finish",
    "style": "Scandinavian / Mid-Century Modern",
    "roomType": "Dining Room",
    "seatingCapacity": 6,
    "assembly": true,
    "assemblyTime": "45 minutes",
    "shape": "Rectangular",
    "legStyle": "Tapered",
    "extendable": false,
    "indoor": true,
    "outdoor": false,
    "careInstructions": "Wipe with damp cloth. Re-oil annually.",
    "countryOfOrigin": "Denmark",
    "sustainableMaterial": true,
    "certifications": ["FSC Certified"]
  },
  "dimensions": {
    "length": 180,
    "width": 90,
    "height": 75,
    "unit": "cm"
  },
  "weight": 45.5,
  "specifications": {
    "Material": "Solid Oak Wood",
    "Finish": "Natural oil finish",
    "Dimensions": "180 x 90 x 75 cm (L x W x H)",
    "Weight": "45.5 kg",
    "Seating Capacity": "6 people",
    "Assembly Required": "Yes (45 minutes)",
    "Care": "Wipe with damp cloth. Re-oil annually.",
    "Warranty": "5 years"
  },
  "warranty": "5 years",
  "returnDays": 30
}
```

---

## 👕 Clothing

### **T-Shirt with Variants**

**Parent Product:**
```json
{
  "title": "Premium Cotton T-Shirt",
  "sku": "TSHIRT-PREM-COTTON",
  "price": 2999,
  "brand": "Comfort Wear",
  "trackInventory": false,  // Track on variants
  "attributes": {
    "fabric": "100% Organic Cotton",
    "fit": "Regular",
    "neckline": "Crew neck",
    "sleeveLength": "Short sleeve",
    "occasion": "Casual",
    "season": "All Season",
    "careInstructions": "Machine wash cold. Tumble dry low.",
    "countryOfOrigin": "USA",
    "sustainableMaterial": true,
    "certifications": ["GOTS Certified Organic"]
  }
}
```

**Variants:**
```json
[
  {
    "sku": "TSHIRT-PREM-S-BLK",
    "title": "Small - Black",
    "price": 2999,
    "stock": 45,
    "attributes": {
      "size": "S",
      "color": "Black",
      "chest": "91-96 cm",
      "length": "71 cm"
    }
  },
  {
    "sku": "TSHIRT-PREM-M-BLK",
    "title": "Medium - Black",
    "price": 2999,
    "stock": 67,
    "attributes": {
      "size": "M",
      "color": "Black",
      "chest": "96-101 cm",
      "length": "74 cm"
    }
  },
  {
    "sku": "TSHIRT-PREM-L-WHT",
    "title": "Large - White",
    "price": 2999,
    "stock": 52,
    "attributes": {
      "size": "L",
      "color": "White",
      "chest": "101-106 cm",
      "length": "76 cm"
    }
  }
]
```

---

## 💄 Beauty & Cosmetics

```json
{
  "title": "Vitamin C Brightening Serum",
  "sku": "BEAUTY-SERUM-VITC-30ML",
  "price": 4999,
  "brand": "Glow Naturals",
  "attributes": {
    "productType": "Serum",
    "skinType": ["All", "Dry", "Normal", "Oily", "Combination"],
    "skinConcern": ["Dullness", "Dark spots", "Uneven tone", "Fine lines"],
    "activeIngredients": [
      "15% Vitamin C (L-Ascorbic Acid)",
      "Hyaluronic Acid",
      "Vitamin E",
      "Ferulic Acid"
    ],
    "allIngredients": "Water, L-Ascorbic Acid, Hyaluronic Acid, Vitamin E, Ferulic Acid, ...",
    "benefits": ["Brightening", "Hydration", "Anti-aging", "Antioxidant protection"],
    "volume": "30ml",
    "usage": "Apply 3-4 drops to clean face morning and evening",
    "expiryDate": "2025-12-31",
    "shelfLifeAfterOpening": "6 months",
    "isNatural": true,
    "isOrganic": false,
    "isCrueltyFree": true,
    "isVegan": true,
    "isParabenFree": true,
    "isSulfateFree": true,
    "scent": "Unscented",
    "texture": "Lightweight liquid",
    "spf": null,
    "dermatologistTested": true,
    "hypoallergenic": true
  },
  "specifications": {
    "Product Type": "Facial Serum",
    "Volume": "30ml / 1 fl oz",
    "Key Ingredients": "15% Vitamin C, Hyaluronic Acid, Vitamin E",
    "Skin Type": "All skin types",
    "Benefits": "Brightening, Anti-aging, Hydration",
    "Cruelty-Free": "Yes",
    "Vegan": "Yes",
    "Shelf Life": "6 months after opening"
  },
  "features": [
    "15% pure Vitamin C for maximum brightening",
    "Hyaluronic Acid for deep hydration",
    "Antioxidant-rich formula",
    "Lightweight, fast-absorbing texture",
    "Suitable for all skin types",
    "Cruelty-free and vegan",
    "Dermatologist tested"
  ]
}
```

---

## 🏋️ Fitness Equipment

```json
{
  "title": "Adjustable Dumbbell Set 5-52.5 lbs",
  "sku": "FITNESS-DUMBBELL-ADJ-52",
  "price": 39999,
  "brand": "PowerFit",
  "attributes": {
    "equipmentType": "Dumbbells",
    "adjustable": true,
    "weightRange": "5-52.5 lbs (2.5-24 kg)",
    "weightIncrements": "2.5 lbs",
    "numberOfSettings": 15,
    "material": "Steel, Rubber coating",
    "dimensions": "40 x 20 x 20 cm (per dumbbell)",
    "totalWeight": "52.5 lbs per dumbbell",
    "includes": ["2 dumbbells", "Storage tray", "Exercise guide"],
    "spaceEfficient": true,
    "replacesNumberOfDumbbells": 30,
    "warranty": "2 years"
  },
  "weight": 52.5,
  "specifications": {
    "Type": "Adjustable Dumbbells",
    "Weight Range": "5-52.5 lbs (2.5-24 kg) per dumbbell",
    "Weight Settings": "15 settings",
    "Increments": "2.5 lbs",
    "Material": "Steel with rubber coating",
    "Dimensions": "40 x 20 x 20 cm",
    "Warranty": "2 years"
  }
}
```

---

## 🎁 Gift Cards

```json
{
  "title": "$50 Gift Card",
  "sku": "GIFTCARD-50",
  "price": 5000,
  "brand": null,
  "trackInventory": false,  // Digital product
  "attributes": {
    "type": "Digital Gift Card",
    "value": 5000,  // cents
    "deliveryMethod": "Email",
    "expiryMonths": 12,
    "reloadable": false,
    "personalizable": true,
    "instantDelivery": true
  },
  "features": [
    "Delivered instantly via email",
    "Valid for 12 months",
    "Can be used online and in-store",
    "No fees or expiration charges",
    "Personalize with a message"
  ],
  "freeShipping": true,  // No physical shipping
  "returnDays": null  // Non-returnable
}
```

---

## 🎮 Gaming

```json
{
  "title": "PlayStation 5 Console - Digital Edition",
  "sku": "GAMING-PS5-DIGITAL",
  "price": 39999,
  "brand": "Sony",
  "attributes": {
    "platform": "PlayStation 5",
    "edition": "Digital Edition",
    "storage": "825GB SSD",
    "resolution": "Up to 8K",
    "frameRate": "Up to 120fps",
    "rayTracing": true,
    "processor": "AMD Zen 2",
    "gpu": "AMD RDNA 2",
    "ram": "16GB GDDR6",
    "discDrive": false,
    "ports": ["HDMI 2.1", "USB-A", "USB-C", "Ethernet"],
    "connectivity": ["Wi-Fi 6", "Bluetooth 5.1"],
    "controller": "DualSense Wireless Controller",
    "vr": "PlayStation VR2 compatible",
    "includes": ["Console", "DualSense controller", "HDMI cable", "Power cable", "USB cable"]
  }
}
```

---

## 🎨 Product Page Rendering Strategy

### **Conditional Sections Based on Attributes**

```tsx
// app/product/[slug]/ProductPageClient.tsx

export function ProductPageClient({ product }) {
  const attrs = product.attributes as any;
  
  return (
    <div>
      {/* Always show */}
      <ProductGallery images={product.images} videos={product.videos} />
      <ProductInfo product={product} />
      
      {/* Electronics-specific */}
      {attrs?.processor && (
        <TechSpecs
          processor={attrs.processor}
          ram={attrs.ram}
          storage={attrs.storage}
          display={attrs.display}
        />
      )}
      
      {/* Books-specific */}
      {attrs?.author && (
        <BookDetails
          author={attrs.author}
          isbn={attrs.isbn}
          publisher={attrs.publisher}
          pages={attrs.pages}
        />
      )}
      
      {/* Furniture-specific */}
      {attrs?.material && attrs?.roomType && (
        <FurnitureDetails
          material={attrs.material}
          dimensions={product.dimensions}
          assembly={attrs.assembly}
          seatingCapacity={attrs.seatingCapacity}
        />
      )}
      
      {/* Beauty-specific */}
      {attrs?.skinType && (
        <BeautyDetails
          skinType={attrs.skinType}
          ingredients={attrs.activeIngredients}
          benefits={attrs.benefits}
          volume={attrs.volume}
        />
      )}
      
      {/* Clothing-specific - Show size guide */}
      {product.variants?.length > 0 && attrs?.fabric && (
        <SizeGuide variants={product.variants} />
      )}
      
      {/* Always show if available */}
      {product.features && <FeaturesList features={product.features} />}
      {product.specifications && <SpecTable specs={product.specifications} />}
      {product.warranty && <WarrantyInfo warranty={product.warranty} />}
    </div>
  );
}
```

---

## 📊 Summary

### **Key Principles**

1. **One Product Model**: All products use the same model
2. **Flexible Attributes**: Category-specific details in JSON
3. **Conditional Rendering**: Show/hide sections based on data
4. **Type Safety**: Use TypeScript interfaces for attributes

### **Benefits**

- ✅ Easy to add new product types
- ✅ No database migrations for new categories
- ✅ Flexible and extensible
- ✅ Simple to maintain

### **Best Practices**

- Document your attribute schemas
- Use consistent naming (e.g., always `processor`, not `cpu` sometimes)
- Validate attributes in your API
- Create TypeScript interfaces for common attribute patterns

---

## 🚀 Next Steps

1. Choose your product categories
2. Define attribute schemas for each
3. Create products using the guide
4. Build conditional UI components
5. Test with real data

Need help with a specific product type? Let me know!

