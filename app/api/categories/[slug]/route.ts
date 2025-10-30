import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'popular';
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '100000');
    const brands = searchParams.get('brands')?.split(',') || [];
    const inStock = searchParams.get('inStock') === 'true';
    const onSale = searchParams.get('onSale') === 'true';
    const isNew = searchParams.get('isNew') === 'true';

    // Get category
    const category = await prisma.category.findUnique({
      where: { slug },
      include: {
        children: {
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
          }
        },
        _count: {
          select: {
            products: {
              where: {
                active: true
              }
            }
          }
        }
      }
    });

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Build where clause for products
    const where: any = {
      active: true,
      categories: {
        some: {
          slug: slug
        }
      }
    };

    // Price range
    if (minPrice > 0 || maxPrice < 100000) {
      where.price = {};
      if (minPrice > 0) where.price.gte = minPrice;
      if (maxPrice < 100000) where.price.lte = maxPrice;
    }

    // Brand filter
    if (brands.length > 0) {
      where.brand = { in: brands };
    }

    // Stock filter
    if (inStock) {
      where.stock = { gt: 0 };
    }

    // Sale filter
    if (onSale) {
      where.discount = { gt: 0 };
    }

    // New filter
    if (isNew) {
      where.isNew = true;
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sort) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'name':
        orderBy = { title: 'asc' };
        break;
      default:
        // Popular - by review count
        orderBy = { reviewCount: 'desc' };
    }

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      include: {
        categories: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy,
      take: 50
    });

    // Compute most-loved product (by wishlist count) within this category
    let mostLovedProduct: any = null;
    if (products.length > 0) {
      const productIds = products.map((p) => p.id);
      const mostLoved = await prisma.wishlistItem.groupBy({
        by: ['productId'],
        _count: { productId: true },
        where: { productId: { in: productIds } },
        orderBy: { _count: { productId: 'desc' } },
        take: 1,
      });
      if (mostLoved.length > 0) {
        const topId = mostLoved[0].productId;
        const top = products.find((p) => p.id === topId);
        if (top) {
          mostLovedProduct = {
            id: top.id,
            title: top.title,
            price: top.price,
            originalPrice: (top as any).originalPrice,
            images: Array.isArray(top.images) ? top.images : [top.images],
            slug: top.slug,
            rating: (top as any).rating || 0,
            reviewCount: (top as any).reviewCount || 0,
            stock: top.stock,
            brand: (top as any).brand || 'Unknown',
            discount: (top as any).discount || 0,
            description: top.description || '',
          };
        }
      }
    }

    // Get filter options
    const allBrands = await prisma.product.findMany({
      where: { 
        active: true,
        categories: {
          some: {
            slug: slug
          }
        }
      },
      select: { brand: true },
      distinct: ['brand']
    });

    const maxPriceResult = await prisma.product.aggregate({
      where: { 
        active: true,
        categories: {
          some: {
            slug: slug
          }
        }
      },
      _max: { price: true }
    });

    // Transform products
    const transformedProducts = products.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice: (product as any).originalPrice || product.price,
      images: Array.isArray(product.images) ? product.images : [product.images],
      slug: product.slug,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      stock: product.stock,
      brand: product.brand || 'Unknown',
      isNew: product.isNew || false,
      isFeatured: product.featured || false,
      discount: (product as any).discount || 0,
      description: product.description || ''
    }));

    // Transform category
    const transformedCategory = {
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image: category.image || '/api/placeholder/800/400',
      productCount: category._count.products,
      subcategories: category.children.map(sub => ({
        id: sub.id,
        name: sub.name,
        slug: sub.slug,
        productCount: sub._count.products
      }))
    };

    // Transform filter options
    const filterOptions = {
      subcategories: category.children.map(sub => ({
        name: sub.name,
        count: sub._count.products
      })),
      brands: allBrands.map(b => ({
        name: b.brand || 'Unknown',
        count: 0 // Would need separate query for counts
      })),
      maxPrice: maxPriceResult._max.price || 10000
    };

    return NextResponse.json({
      category: transformedCategory,
      products: transformedProducts,
      filters: filterOptions,
      total: products.length,
      mostLovedProduct,
    });
  } catch (error) {
    console.error('Error fetching category data:', error);
    return NextResponse.json({ error: 'Failed to fetch category data' }, { status: 500 });
  }
}
