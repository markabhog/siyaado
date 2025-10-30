import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Testing Enhanced Product Schema...\n');

  // 1. Create a product with variants (iPhone example)
  console.log('1️⃣ Creating product with variants...');
  const iphone = await prisma.product.create({
    data: {
      sku: 'IPHONE-15-PRO-MAX',
      title: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: '<p>The most advanced iPhone ever with titanium design and A17 Pro chip.</p>',
      shortDesc: 'Premium smartphone with titanium design and A17 Pro chip',
      
      // Pricing
      price: 119999, // $1,199.99
      compareAtPrice: 129999, // $1,299.99 (was price)
      costPrice: 80000, // $800 (your cost)
      wholesalePrice: 100000, // $1,000
      wholesaleMinQty: 10,
      
      // Inventory
      stock: 0, // Track on variants
      lowStockThreshold: 5,
      trackInventory: false, // Track on variants instead
      allowBackorder: false,
      
      // Media
      images: [
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
        'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800'
      ],
      videos: ['https://youtube.com/watch?v=example'],
      
      // Brand
      brand: 'Apple',
      manufacturer: 'Apple Inc.',
      
      // Physical
      weight: 0.221,
      dimensions: {
        length: 16.0,
        width: 7.7,
        height: 0.83,
        unit: 'cm'
      },
      
      // Category-specific attributes
      attributes: {
        processor: 'A17 Pro chip',
        ram: '8GB',
        display: '6.7" Super Retina XDR',
        camera: '48MP Main | 12MP Ultra Wide | 12MP Telephoto',
        battery: 'Up to 29 hours video playback',
        connectivity: ['5G', 'Wi-Fi 6E', 'Bluetooth 5.3'],
        os: 'iOS 17'
      },
      
      // Features
      features: [
        'A17 Pro chip with 6-core GPU',
        'ProMotion technology up to 120Hz',
        '48MP Main camera with 5x optical zoom',
        'Titanium design - strongest and lightest',
        'Dynamic Island',
        'Always-On display'
      ],
      
      specifications: {
        'Display': '6.7-inch Super Retina XDR',
        'Chip': 'A17 Pro',
        'Camera': '48MP Main | 12MP Ultra Wide | 12MP Telephoto',
        'Battery': 'Up to 29 hours video playback',
        'Water Resistance': 'IP68',
        'Connector': 'USB-C'
      },
      
      highlights: [
        'Industry-leading A17 Pro chip',
        'Titanium design',
        'Advanced camera system',
        'All-day battery life'
      ],
      
      // SEO
      metaTitle: 'iPhone 15 Pro Max - Buy Now | Your Store',
      metaDescription: 'Get the iPhone 15 Pro Max with titanium design, A17 Pro chip, and advanced camera. Free shipping available.',
      tags: ['smartphone', 'apple', 'iphone', '5g', 'titanium', 'pro'],
      
      // Shipping
      shippingWeight: 0.5,
      freeShipping: true,
      
      // Status
      active: true,
      featured: true,
      isNew: true,
      onSale: false,
      
      // Warranty
      warranty: '1 year',
      returnDays: 30,
      
      // Create variants
      variants: {
        create: [
          {
            sku: 'IPHONE-15-PRO-256-TIT',
            title: '256GB - Natural Titanium',
            price: 119999,
            stock: 45,
            image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
            attributes: {
              storage: '256GB',
              color: 'Natural Titanium'
            },
            active: true
          },
          {
            sku: 'IPHONE-15-PRO-512-TIT',
            title: '512GB - Natural Titanium',
            price: 139999,
            stock: 23,
            image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
            attributes: {
              storage: '512GB',
              color: 'Natural Titanium'
            },
            active: true
          },
          {
            sku: 'IPHONE-15-PRO-256-BLK',
            title: '256GB - Black Titanium',
            price: 119999,
            stock: 38,
            image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
            attributes: {
              storage: '256GB',
              color: 'Black Titanium'
            },
            active: true
          }
        ]
      },
      
      // Create discounts
      discounts: {
        create: [
          {
            name: 'Bulk Discount 10+',
            type: 'PERCENTAGE',
            value: 15,
            minQuantity: 10,
            wholesaleOnly: false,
            active: true
          }
        ]
      },
      
      // Connect to categories
      categories: {
        connect: [
          { slug: 'electronics' },
          { slug: 'phones' }
        ]
      }
    },
    include: {
      variants: true,
      discounts: true,
      categories: true
    }
  });

  console.log('✅ Created iPhone with', iphone.variants.length, 'variants\n');

  // 2. Create a simple product without variants (Book example)
  console.log('2️⃣ Creating simple product (book)...');
  const book = await prisma.product.create({
    data: {
      sku: 'BOOK-ATOMIC-HABITS',
      title: 'Atomic Habits',
      slug: 'atomic-habits',
      description: '<p>An Easy & Proven Way to Build Good Habits & Break Bad Ones</p>',
      shortDesc: 'The #1 New York Times bestseller on habit formation.',
      
      price: 2799, // $27.99
      compareAtPrice: 3299, // $32.99
      stock: 150,
      lowStockThreshold: 20,
      trackInventory: true,
      
      images: [
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800'
      ],
      
      attributes: {
        author: 'James Clear',
        isbn: '978-0735211292',
        publisher: 'Avery',
        pages: 320,
        language: 'English',
        format: 'Hardcover',
        publicationDate: '2018-10-16'
      },
      
      features: [
        'New York Times Bestseller',
        'Over 10 million copies sold worldwide',
        'Practical strategies for forming good habits',
        'Based on proven psychological research'
      ],
      
      specifications: {
        'Author': 'James Clear',
        'ISBN-13': '978-0735211292',
        'Publisher': 'Avery',
        'Pages': '320',
        'Format': 'Hardcover',
        'Language': 'English'
      },
      
      metaTitle: 'Atomic Habits by James Clear - Buy Now',
      metaDescription: 'Transform your life with Atomic Habits. Learn how to build good habits and break bad ones.',
      tags: ['book', 'self-help', 'productivity', 'habits', 'james-clear'],
      
      freeShipping: true,
      active: true,
      featured: true,
      warranty: null,
      returnDays: 30,
      
      categories: {
        connect: [
          { slug: 'books' }
        ]
      }
    }
  });

  console.log('✅ Created book:', book.title, '\n');

  // 3. Fetch products with all relations
  console.log('3️⃣ Fetching products with relations...');
  const products = await prisma.product.findMany({
    include: {
      variants: true,
      discounts: true,
      categories: true
    }
  });

  console.log('✅ Found', products.length, 'products\n');

  // 4. Display summary
  console.log('📊 Summary:');
  for (const product of products) {
    console.log(`\n📦 ${product.title}`);
    console.log(`   SKU: ${product.sku}`);
    console.log(`   Price: $${(product.price / 100).toFixed(2)}`);
    console.log(`   Stock: ${product.stock}`);
    console.log(`   Variants: ${product.variants?.length || 0}`);
    console.log(`   Discounts: ${product.discounts?.length || 0}`);
    console.log(`   Categories: ${product.categories?.map(c => c.name).join(', ')}`);
    console.log(`   Featured: ${product.featured ? '⭐' : '❌'}`);
    console.log(`   New: ${product.isNew ? '🆕' : '❌'}`);
  }

  console.log('\n✅ Enhanced schema test completed successfully! 🎉');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

