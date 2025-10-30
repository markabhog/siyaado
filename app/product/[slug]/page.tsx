import React from 'react';
import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { ProductPageClient } from "./ProductPageClient";
import { ProductLogic } from "@/lib/product-logic";
import { mockProducts } from "@/lib/simple-db";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const awaitedParams = await params;

  let enhancedProduct: any | null = null;
  try {
    enhancedProduct = await ProductLogic.getEnhancedProduct(awaitedParams.slug);
  } catch (error) {
    console.error('Enhanced product fetch failed, will fall back:', error);
  }

  if (enhancedProduct) {
    const primaryCategory = enhancedProduct.categories[0];
    const breadcrumbItems: Array<{ href?: string; label: string }> = [{ href: "/", label: "Home" }];

    if (primaryCategory) {
      let current = await prisma.category.findUnique({ where: { id: primaryCategory.id } });
      const stack: Array<{ href?: string; label: string }> = [];
      while (current) {
        stack.unshift({ href: `/category/${current.slug}`, label: current.name });
        if (!current.parentId) break;
        current = await prisma.category.findUnique({ where: { id: current.parentId } });
      }
      breadcrumbItems.push(...stack);
    }
    breadcrumbItems.push({ label: enhancedProduct.title });

    const images = Array.isArray(enhancedProduct.images) ? (enhancedProduct.images as unknown as string[]) : [];
    const fbt = await ProductLogic.getFrequentlyBoughtTogether(enhancedProduct);
    const related = await ProductLogic.getRelatedProducts(
      enhancedProduct.id,
      enhancedProduct.categories,
      enhancedProduct.price
    );

    return (
      <ProductPageClient
        product={enhancedProduct}
        images={images}
        breadcrumbItems={breadcrumbItems}
        fbt={fbt}
        related={related}
      />
    );
  }

  // Fallback to mock data - try to find by slug or create a fallback product
  const product = mockProducts.find(p => p.slug === awaitedParams.slug) || {
    id: awaitedParams.slug,
    slug: awaitedParams.slug,
    title: awaitedParams.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()),
    description: `Premium ${awaitedParams.slug.replace(/-/g, ' ')} with excellent quality and features.`,
    price: 29999,
    stock: 10,
    images: ["/assets/products/p1.png"],
    categories: [{ id: "1", name: "Products", slug: "products" }],
    rating: 4.5,
    reviewsCount: 25,
    highlights: [
      "Premium quality materials",
      "Fast shipping available",
      "1-year warranty included",
      "Excellent customer support"
    ],
    bullets: [
      "Premium quality materials",
      "Fast shipping available",
      "1-year warranty included",
      "Excellent customer support"
    ],
    specifications: {
      "Material": "High-quality",
      "Warranty": "1 year",
      "Shipping": "Fast delivery",
      "Support": "24/7 customer service"
    },
    reviews: [
      {
        id: "1",
        author: "Customer",
        rating: 5,
        comment: "Great product! Highly recommended.",
        date: "2024-01-15"
      }
    ],
    mrp: 39999,
    createdAt: new Date()
  } as any;

  const breadcrumbItems = [
    { href: "/", label: "Home" },
    { href: `/category/${product.categories[0].slug}`, label: product.categories[0].name },
    { label: product.title }
  ];

  const images = Array.isArray(product.images) ? product.images : [product.images];

  const fbt = mockProducts
    .filter(p => p.id !== product.id)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      title: p.title,
      price: p.price,
      img: Array.isArray(p.images) ? p.images[0] : p.images,
      checked: false
    }));

  const related = mockProducts
    .filter(p => p.id !== product.id && p.categories[0].name === product.categories[0].name)
    .slice(0, 4);

  return (
    <ProductPageClient
      product={product}
      images={images}
      breadcrumbItems={breadcrumbItems}
      fbt={fbt}
      related={related}
    />
  );
}