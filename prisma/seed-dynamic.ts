import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedDynamicProducts() {
  const categories = await prisma.category.findMany();
  const bySlug = new Map(categories.map((c) => [c.slug, c]));

  // Dynamic products with proper image relationships
  const products = [
    {
      sku: "PHONE-001",
      title: "Smartphone X",
      slug: "smartphone-x",
      description: "6.5\" display, 128GB storage, dual SIM. Perfect for everyday use with long battery life.",
      price: 29900,
      stock: 25,
      images: [
        "/assets/products/phones/smartphone-x-1.jpg",
        "/assets/products/phones/smartphone-x-2.jpg",
        "/assets/products/phones/smartphone-x-3.jpg"
      ],
      categorySlugs: ["phones", "electronics"],
    },
    {
      sku: "LAPTOP-001", 
      title: "Ultrabook 13",
      slug: "ultrabook-13",
      description: "13\" ultrabook, 16GB RAM, 512GB SSD. Lightweight and powerful for professionals.",
      price: 89900,
      stock: 12,
      images: [
        "/assets/products/laptops/ultrabook-13-1.jpg",
        "/assets/products/laptops/ultrabook-13-2.jpg",
        "/assets/products/laptops/ultrabook-13-3.jpg"
      ],
      categorySlugs: ["laptops", "electronics"],
    },
    {
      sku: "WATCH-001",
      title: "Classic Watch",
      slug: "classic-watch", 
      description: "Stainless steel, water resistant. Timeless design for any occasion.",
      price: 9900,
      stock: 40,
      images: [
        "/assets/products/watches/classic-watch-1.jpg",
        "/assets/products/watches/classic-watch-2.jpg"
      ],
      categorySlugs: ["watches", "electronics"],
    },
    {
      sku: "TEE-001",
      title: "Men's Cotton Tee",
      slug: "mens-cotton-tee",
      description: "100% cotton t-shirt. Comfortable and durable for everyday wear.",
      price: 1500,
      stock: 100,
      images: [
        "/assets/products/clothing/mens-tee-1.jpg",
        "/assets/products/clothing/mens-tee-2.jpg"
      ],
      categorySlugs: ["men", "fashion-clothing"],
    },
    {
      sku: "DIAPER-001",
      title: "Baby Diapers (M)",
      slug: "baby-diapers-m",
      description: "Soft and absorbent baby diapers, size M. Gentle on baby's skin.",
      price: 2500,
      stock: 60,
      images: [
        "/assets/products/baby/diapers-m-1.jpg",
        "/assets/products/baby/diapers-m-2.jpg"
      ],
      categorySlugs: ["diapers", "baby-supplies"],
    },
    // Add more products
    {
      sku: "HEADPHONES-001",
      title: "Wireless Headphones",
      slug: "wireless-headphones",
      description: "Premium wireless headphones with noise cancellation and 30-hour battery life.",
      price: 19900,
      stock: 30,
      images: [
        "/assets/products/audio/headphones-1.jpg",
        "/assets/products/audio/headphones-2.jpg",
        "/assets/products/audio/headphones-3.jpg"
      ],
      categorySlugs: ["accessories", "electronics"],
    },
    {
      sku: "BOOK-001",
      title: "Programming Guide",
      slug: "programming-guide",
      description: "Complete guide to modern programming techniques and best practices.",
      price: 3500,
      stock: 50,
      images: [
        "/assets/products/books/programming-guide-1.jpg",
        "/assets/products/books/programming-guide-2.jpg"
      ],
      categorySlugs: ["books", "education-materials"],
    },
    {
      sku: "CAMERA-001",
      title: "Digital Camera",
      slug: "digital-camera",
      description: "Professional digital camera with 24MP sensor and 4K video recording.",
      price: 89900,
      stock: 8,
      images: [
        "/assets/products/cameras/digital-camera-1.jpg",
        "/assets/products/cameras/digital-camera-2.jpg",
        "/assets/products/cameras/digital-camera-3.jpg"
      ],
      categorySlugs: ["consumer-electronics", "electronics"],
    }
  ];

  for (const p of products) {
    const connect = p.categorySlugs
      .map((s) => bySlug.get(s))
      .filter(Boolean)
      .map((c) => ({ id: (c as any).id }));

    await prisma.product.upsert({
      where: { slug: p.slug },
      create: {
        sku: p.sku,
        title: p.title,
        slug: p.slug,
        description: p.description,
        price: p.price,
        stock: p.stock,
        images: p.images as unknown as any,
        categories: { connect },
      },
      update: {
        price: p.price,
        stock: p.stock,
        images: p.images as unknown as any,
        categories: { set: connect },
      },
    });
  }

  console.log("✅ Dynamic products seeded successfully!");
}

async function main() {
  await seedDynamicProducts();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
