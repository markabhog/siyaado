import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Fetch featured products
    const featuredProducts = await prisma.product.findMany({
      where: {
        active: true,
        featured: true
      },
      take: 8,
      include: {
        categories: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Fetch on-sale products (with discount)
    const onSaleProducts = await prisma.product.findMany({
      where: { 
        active: true,
        // Note: Using discounts relation to find products with active discounts
        discounts: {
          some: {
            active: true
          }
        }
      },
      take: 8,
      include: {
        categories: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Fetch top-rated products
    const topRatedProducts = await prisma.product.findMany({
      where: { 
        active: true,
        rating: {
          gte: 4.5
        }
      },
      take: 8,
      include: {
        categories: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        rating: 'desc'
      }
    });

    // Fetch new arrivals
    const newArrivals = await prisma.product.findMany({
      where: { 
        active: true,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
        }
      },
      take: 8,
      include: {
        categories: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Fetch categories with product counts
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: {
              where: {
                active: true
              }
            }
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    // Transform data for frontend
    const transformProduct = (product: any) => ({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice: product.originalPrice,
      images: Array.isArray(product.images) ? product.images : [product.images],
      slug: product.slug,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      stock: product.stock,
      category: product.categories[0]?.name || 'Uncategorized',
      isNew: product.isNew || false,
      isFeatured: product.featured || false,
      discount: (product as any).discount || 0
    });

    const homepageData = {
      featuredProducts: featuredProducts.map(transformProduct),
      onSaleProducts: onSaleProducts.map(transformProduct),
      topRatedProducts: topRatedProducts.map(transformProduct),
      newArrivals: newArrivals.map(transformProduct),
      categories: categories.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: category.image || '/api/placeholder/200/200',
        productCount: category._count.products
      })),
      banners: {
        hero: '/api/placeholder/1200/400',
        deals: '/api/placeholder/800/300',
        categories: ['/api/placeholder/400/200', '/api/placeholder/400/200']
      }
    };

    return NextResponse.json(homepageData);
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return NextResponse.json({ error: 'Failed to fetch homepage data' }, { status: 500 });
  }
}
