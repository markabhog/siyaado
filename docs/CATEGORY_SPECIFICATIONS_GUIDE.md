# Category-Specific Specifications Guide

## Overview

The product management system now includes **category-specific attribute templates** that dynamically adapt the admin form based on the selected product category. This ensures that each product type has relevant fields for its specifications.

---

## 📋 How It Works

### 1. **Category Selection**
When adding or editing a product in the admin panel:
- Navigate to **Step 2: Inventory & Categories**
- Select one or more categories for your product
- The form will automatically display category-specific fields based on the **first selected category**

### 2. **Dynamic Field Rendering**
The system uses the category's `slug` to match against predefined templates:
```typescript
CATEGORY_TEMPLATES[categorySlug]
```

### 3. **Field Types Supported**
- **text**: Single-line text input
- **number**: Numeric input
- **date**: Date picker
- **textarea**: Multi-line text input
- **select**: Dropdown with predefined options
- **checkbox**: Boolean yes/no field

### 4. **Required Fields**
Fields marked with `required: true` will:
- Display a red asterisk (*) next to the label
- Be validated before form submission

---

## 🗂️ Category Templates

### **Books** (`books`)
Perfect for: Novels, textbooks, reference books, eBooks

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Author | text | ✅ | Book author name |
| ISBN | text | ❌ | International Standard Book Number |
| Publisher | text | ❌ | Publishing company |
| Number of Pages | number | ❌ | Total page count |
| Language | text | ❌ | Language of the book |
| Format | select | ❌ | Hardcover, Paperback, eBook, Audiobook |
| Publication Date | date | ❌ | When the book was published |
| Genre | text | ❌ | Book category/genre |

---

### **Phones** (`phones`)
Perfect for: Smartphones, feature phones

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | text | ✅ | Manufacturer (Apple, Samsung, etc.) |
| Model | text | ✅ | Model name/number |
| Processor/Chipset | text | ❌ | CPU details |
| RAM | text | ❌ | Memory capacity (e.g., "8GB") |
| Internal Storage | text | ❌ | Storage capacity (e.g., "256GB") |
| Display Size & Type | text | ❌ | Screen size and technology |
| Display Resolution | text | ❌ | Screen resolution (e.g., "1080x2400") |
| Camera (Main/Front) | text | ❌ | Camera specifications |
| Battery Capacity | text | ❌ | Battery size (e.g., "5000mAh") |
| Operating System | text | ❌ | OS version |
| Connectivity | text | ❌ | 5G/4G/Wi-Fi support |
| SIM Type | select | ❌ | Single SIM, Dual SIM, eSIM, etc. |
| Warranty | text | ❌ | Warranty period |

---

### **Laptops** (`laptops`)
Perfect for: Notebooks, ultrabooks, gaming laptops

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | text | ✅ | Manufacturer |
| Model | text | ✅ | Model name/number |
| Processor | text | ✅ | CPU details (e.g., "Intel i7-12700H") |
| RAM | text | ✅ | Memory capacity |
| Storage | text | ✅ | Storage capacity |
| Storage Type | select | ❌ | SSD, HDD, SSD + HDD, NVMe SSD |
| Display Size | text | ❌ | Screen size (e.g., "15.6 inches") |
| Display Resolution | text | ❌ | Screen resolution |
| Graphics Card | text | ❌ | GPU details |
| Operating System | text | ❌ | Pre-installed OS |
| Battery Life | text | ❌ | Expected battery duration |
| Weight (kg) | number | ❌ | Laptop weight |
| Ports & Connectivity | textarea | ❌ | Available ports and connections |
| Warranty | text | ❌ | Warranty period |

---

### **Electronics** (`electronics`)
Perfect for: General electronic devices

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | text | ✅ | Manufacturer |
| Model Number | text | ❌ | Model identifier |
| Warranty | text | ❌ | Warranty period |
| Connectivity | text | ❌ | Connection types |
| Power Source | text | ❌ | Power requirements |

---

### **Watches** (`watches`)
Perfect for: Smartwatches, analog watches, fitness trackers

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | text | ✅ | Manufacturer |
| Model | text | ❌ | Model name |
| Type | select | ❌ | Smart Watch, Analog, Digital, Hybrid |
| Display | text | ❌ | Display type and size |
| Battery Life | text | ❌ | Expected battery duration |
| Water Resistance | text | ❌ | Water resistance rating |
| Compatible With | text | ❌ | Compatible devices/OS |
| Key Features | textarea | ❌ | Main features |
| Strap Material | text | ❌ | Material of the strap |
| Warranty | text | ❌ | Warranty period |

---

### **Accessories** (`accessories`)
Perfect for: Phone cases, chargers, cables, screen protectors

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | text | ✅ | Manufacturer |
| Compatible With | text | ❌ | Compatible devices |
| Material | text | ❌ | Construction material |
| Color | text | ❌ | Available colors |
| Features | textarea | ❌ | Key features |
| Warranty | text | ❌ | Warranty period |

---

### **Fashion & Clothing** (`fashion-clothing`, `men`, `women`, `kids`)
Perfect for: Apparel, garments

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | text | ✅ | Clothing brand |
| Fabric/Material | text | ✅ (fashion-clothing) | Material composition |
| Fit | select | ❌ | Regular, Slim, Loose, etc. |
| Occasion | text | ❌ | Suitable occasion |
| Season | select | ❌ | All Season, Summer, Winter, etc. |
| Care Instructions | textarea/text | ❌ | Washing/care instructions |
| Age Range | text | ✅ (kids) | Suitable age range |
| Gender | select | ❌ (kids) | Boys, Girls, Unisex |

---

### **Baby Supplies** (`baby-supplies`, `diapers`, `feeding`, `strollers`)
Perfect for: Baby products

#### Diapers
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | text | ✅ | Manufacturer |
| Size | select | ✅ | Newborn, Small, Medium, Large, XL, XXL |
| Weight Range | text | ❌ | Suitable weight range |
| Count per Pack | number | ❌ | Number of diapers |
| Features | textarea | ❌ | Special features |

#### Strollers
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | text | ✅ | Manufacturer |
| Type | select | ❌ | Standard, Lightweight, Jogging, etc. |
| Age Range | text | ❌ | Suitable age range |
| Weight Capacity | text | ❌ | Maximum weight |
| Foldable | checkbox | ❌ | Is it foldable? |
| Features | textarea | ❌ | Key features |

---

### **Beauty & Personal Care** (`beauty-personal-care`)
Perfect for: Skincare, cosmetics, hygiene products

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | text | ✅ | Product brand |
| Volume/Size | text | ✅ | Product size (e.g., "50ml") |
| Suitable for Skin Type | select | ❌ | All, Dry, Oily, Combination, Sensitive, Normal |
| Key Ingredients | textarea | ❌ | Main ingredients |
| Benefits | textarea | ❌ | Product benefits |
| How to Use | textarea | ❌ | Usage instructions |
| Natural/Organic | checkbox | ❌ | Is it natural/organic? |
| Cruelty-Free | checkbox | ❌ | Is it cruelty-free? |
| Vegan | checkbox | ❌ | Is it vegan? |
| Expiry Date | date | ❌ | Product expiry date |
| Made In | text | ❌ | Country of origin |

---

### **Home & Kitchen** (`home-kitchen`)
Perfect for: Kitchenware, home decor, appliances

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | text | ✅ | Manufacturer |
| Material | text | ✅ | Construction material |
| Dimensions | text | ❌ | Product dimensions |
| Capacity/Size | text | ❌ | Volume or size |
| Color | text | ❌ | Available colors |
| Dishwasher Safe | checkbox | ❌ | Is it dishwasher safe? |
| Care Instructions | textarea | ❌ | Maintenance instructions |

---

### **Sports & Outdoor** (`sports-outdoor`)
Perfect for: Fitness equipment, outdoor gear

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | text | ✅ | Manufacturer |
| Sport/Activity | text | ❌ | Intended sport/activity |
| Material | text | ❌ | Construction material |
| Size/Dimensions | text | ❌ | Product dimensions |
| Weight | text | ❌ | Product weight |
| Features | textarea | ❌ | Key features |
| Warranty | text | ❌ | Warranty period |

---

### **Education Materials** (`stationery`, `learning-kits`, `education-materials`)
Perfect for: School supplies, educational tools

#### Stationery
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | text | ✅ | Manufacturer |
| Material | text | ❌ | Construction material |
| Color | text | ❌ | Available colors |
| Quantity/Pack Size | text | ❌ | Items per pack |
| Dimensions | text | ❌ | Product dimensions |

#### Learning Kits
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| Brand | text | ❌ | Manufacturer |
| Age Range | text | ✅ | Suitable age range |
| Subject/Topic | text | ❌ | Educational subject |
| What's Included | textarea | ❌ | Kit contents |

---

## 🎯 Best Practices

### 1. **Choose the Most Specific Category First**
When a product belongs to multiple categories, select the most specific one first:
- ✅ **Good**: Select "Phones" for a smartphone (not just "Electronics")
- ✅ **Good**: Select "Diapers" for diapers (not just "Baby Supplies")
- ❌ **Bad**: Select "Electronics" for a laptop (use "Laptops" instead)

### 2. **Fill Required Fields**
Always fill fields marked with a red asterisk (*) to ensure complete product information.

### 3. **Be Consistent**
Use consistent formatting for similar fields:
- RAM: "8GB", "16GB" (not "8 GB", "16 gigabytes")
- Display: "6.7 inches AMOLED" (consistent format)
- Warranty: "1 Year", "2 Years" (consistent format)

### 4. **Use Textarea for Long Content**
For fields like "Key Ingredients", "Features", or "Care Instructions", use multiple lines for better readability.

### 5. **Leverage Checkboxes**
Use checkboxes for yes/no questions:
- "BPA Free"
- "Cruelty-Free"
- "Dishwasher Safe"

---

## 🔧 Adding New Category Templates

If you need to add a new category template:

1. **Identify the category slug** from your database
2. **Edit** `app/admin/products/page.tsx`
3. **Add a new entry** to `CATEGORY_TEMPLATES`:

```typescript
'your-category-slug': [
  { key: 'fieldName', label: 'Field Label', type: 'text', required: true },
  { key: 'anotherField', label: 'Another Field', type: 'select', options: ['Option1', 'Option2'] },
  // ... more fields
]
```

4. **Supported field types**: `text`, `number`, `date`, `textarea`, `select`, `checkbox`

---

## 📊 Example: Adding a Laptop

### Step 1: Basic Information
- **SKU**: `LAP-DELL-XPS15-001`
- **Title**: `Dell XPS 15 9520 Laptop`
- **Description**: `High-performance laptop with Intel i7 processor...`
- **Price**: `1499.99`

### Step 2: Categories & Specifications
- **Stock**: `25`
- **Categories**: ✅ Laptops, ✅ Electronics
- **Active**: ✅

**Laptop-Specific Fields** (automatically shown):
- **Brand**: `Dell` *
- **Model**: `XPS 15 9520` *
- **Processor**: `Intel Core i7-12700H` *
- **RAM**: `16GB DDR5` *
- **Storage**: `512GB` *
- **Storage Type**: `NVMe SSD`
- **Display Size**: `15.6 inches`
- **Display Resolution**: `3456x2160 (4K)`
- **Graphics Card**: `NVIDIA GeForce RTX 3050 Ti`
- **Operating System**: `Windows 11 Pro`
- **Battery Life**: `Up to 10 hours`
- **Weight (kg)**: `2.0`
- **Ports & Connectivity**: `2x USB-C Thunderbolt 4, 1x USB-C 3.2, 1x SD card reader, 1x 3.5mm headphone jack`
- **Warranty**: `1 Year Manufacturer Warranty`

### Step 3: Images
- Upload product images

---

## 🚀 Benefits

✅ **Consistency**: All products in a category have the same structure  
✅ **Flexibility**: Different categories have different fields  
✅ **Validation**: Required fields ensure complete data  
✅ **User-Friendly**: Dynamic forms adapt to the product type  
✅ **Scalable**: Easy to add new categories and fields  

---

## 📞 Support

If you need help with category specifications or want to add a new category template, refer to this guide or contact your development team.

---

**Last Updated**: October 26, 2025

