// Converted to JS in-place later; keep TS for now but we'll run via node-compatible JS import
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedCategories() {
  const categoryTree: Array<{
    name: string;
    slug: string;
    children?: Array<{ name: string; slug: string }>
  }> = [
    {
      name: "Electronics",
      slug: "electronics",
      children: [
        { name: "Phones", slug: "phones" },
        { name: "Laptops", slug: "laptops" },
        { name: "Accessories", slug: "accessories" },
        { name: "Consumer Electronics", slug: "consumer-electronics" },
        { name: "Watches", slug: "watches" },
      ],
    },
    {
      name: "Fashion & Clothing",
      slug: "fashion-clothing",
      children: [
        { name: "Men", slug: "men" },
        { name: "Women", slug: "women" },
        { name: "Kids", slug: "kids" },
      ],
    },
    {
      name: "Baby Supplies",
      slug: "baby-supplies",
      children: [
        { name: "Diapers", slug: "diapers" },
        { name: "Feeding", slug: "feeding" },
        { name: "Strollers", slug: "strollers" },
      ],
    },
    {
      name: "Education Materials",
      slug: "education-materials",
      children: [
        { name: "Books", slug: "books" },
        { name: "Stationery", slug: "stationery" },
        { name: "Learning Kits", slug: "learning-kits" },
      ],
    },
    { name: "Home & Kitchen", slug: "home-kitchen" },
    { name: "Beauty & Personal Care", slug: "beauty-personal-care" },
    { name: "Sports & Outdoor", slug: "sports-outdoor" },
  ];

  for (const top of categoryTree) {
    const parent = await prisma.category.upsert({
      where: { slug: top.slug },
      create: { name: top.name, slug: top.slug },
      update: {},
    });

    if (top.children) {
      for (const child of top.children) {
        await prisma.category.upsert({
          where: { slug: child.slug },
          create: { name: child.name, slug: child.slug, parentId: parent.id },
          update: { parentId: parent.id },
        });
      }
    }
  }
}

async function seedProducts() {
  const categories = await prisma.category.findMany();
  const bySlug = new Map(categories.map((c) => [c.slug, c]));

  const products: Array<{
    sku: string;
    title: string;
    slug: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    categorySlugs: string[];
  }> = [
    {
      sku: "PHONE-001",
      title: "Smartphone X",
      slug: "smartphone-x",
      description: "6.5\" display, 128GB storage, dual SIM",
      price: 29900,
      stock: 25,
      images: [
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&auto=format&fit=crop&w=1600",
      ],
      categorySlugs: ["phones", "electronics"],
    },
    {
      sku: "LAPTOP-001",
      title: "Ultrabook 13",
      slug: "ultrabook-13",
      description: "13\" ultrabook, 16GB RAM, 512GB SSD",
      price: 89900,
      stock: 12,
      images: [
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&auto=format&fit=crop&w=1600",
      ],
      categorySlugs: ["laptops", "electronics"],
    },
    {
      sku: "WATCH-001",
      title: "Classic Watch",
      slug: "classic-watch",
      description: "Stainless steel, water resistant",
      price: 9900,
      stock: 40,
      images: [
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&auto=format&fit=crop&w=1600",
      ],
      categorySlugs: ["watches", "electronics"],
    },
    {
      sku: "FASHION-MEN-TEE-001",
      title: "Men's Cotton Tee",
      slug: "mens-cotton-tee",
      description: "100% cotton t-shirt",
      price: 1500,
      stock: 100,
      images: [
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&auto=format&fit=crop&w=1600",
      ],
      categorySlugs: ["men", "fashion-clothing"],
    },
    {
      sku: "BABY-DIAPER-001",
      title: "Baby Diapers (M)",
      slug: "baby-diapers-m",
      description: "Soft and absorbent baby diapers, size M",
      price: 2500,
      stock: 60,
      images: [
        "https://images.unsplash.com/photo-1580476262791-07522a1b9ebf?q=80&auto=format&fit=crop&w=1600",
      ],
      categorySlugs: ["diapers", "baby-supplies"],
    },
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
}

async function main() {
  await seedCategories();
  await seedProducts();
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


