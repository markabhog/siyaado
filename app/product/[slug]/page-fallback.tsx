import { mockProducts } from "@/lib/simple-db";
import { notFound } from "next/navigation";
import { ProductPageClient } from "./ProductPageClient";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const awaitedParams = await params;
  
  // Find product in mock data
  const product = mockProducts.find(p => p.slug === awaitedParams.slug);
  
  if (!product) return notFound();

  // Build breadcrumbs
  const breadcrumbItems = [
    { href: "/", label: "Home" },
    { href: `/category/${product.categories[0].slug}`, label: product.categories[0].name },
    { label: product.title }
  ];

  const images = Array.isArray(product.images) ? product.images : [product.images];
  
  // Mock FBT and related products
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
