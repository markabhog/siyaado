import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const brand = searchParams.get('brand');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sortBy = searchParams.get('sortBy') || 'popular';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Build where clause
    const where: any = {
      active: true,
    };

    if (category) {
      where.categories = {
        some: {
          name: {
            contains: category,
          },
        },
      };
    }

    if (brand) {
      where.brand = {
        contains: brand,
      };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice) * 100;
      if (maxPrice) where.price.lte = parseInt(maxPrice) * 100;
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sortBy) {
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
      default:
        orderBy = { reviewCount: 'desc' };
    }

    // Fetch products
    const products = await prisma.product.findMany({
      where,
      include: {
        categories: true,
        variants: {
          where: { active: true },
          orderBy: { price: 'asc' },
        },
        discounts: {
          where: {
            active: true,
            OR: [
              { startsAt: null },
              { startsAt: { lte: new Date() } }
            ],
            AND: [
              {
                OR: [
                  { endsAt: null },
                  { endsAt: { gte: new Date() } }
                ]
              }
            ]
          }
        },
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
    });

    // Get total count for pagination
    const totalCount = await prisma.product.count({ where });

    // Build brand list from current result set
    const brandSet = new Set<string>();
    for (const p of products as any[]) {
      if (p.brand) brandSet.add(p.brand as string);
    }
    const brandList = Array.from(brandSet);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      filters: {
        brands: brandList,
      },
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  } finally {
    // Using a shared prisma client; do not disconnect here.
  }
}
