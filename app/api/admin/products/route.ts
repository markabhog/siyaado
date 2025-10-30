import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// GET /api/admin/products - List all products (admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search') || '';

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { sku: { contains: search } },
        { brand: { contains: search } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        categories: true,
        variants: true,
        _count: {
          select: {
            variants: true,
            reviews: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: (page - 1) * limit
    });

    const total = await prisma.product.count({ where });

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create new product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    // Check if user is admin (you should implement proper auth check)
    // if (!session || session.user.role !== 'ADMIN') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const data = await request.json();

    // Validate required fields
    const missingFields: string[] = [];
    if (!data.sku) missingFields.push('SKU');
    if (!data.title) missingFields.push('Product Title');
    if (data.price === undefined || data.price === null) missingFields.push('Price');
    if (data.stock === undefined || data.stock === null) missingFields.push('Stock Quantity');

    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Auto-generate slug if not provided
    let slug = data.slug || data.title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug already exists, if so, add a random suffix
    const existingSlug = await prisma.product.findUnique({
      where: { slug }
    });

    if (existingSlug) {
      // Add timestamp or random number to make it unique
      slug = `${slug}-${Date.now()}`;
    }

    // Check if SKU already exists
    const existing = await prisma.product.findUnique({
      where: { sku: data.sku }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Product with this SKU already exists' },
        { status: 400 }
      );
    }

    // Create product
    const product = await prisma.product.create({
      data: {
        sku: data.sku,
        title: data.title,
        slug: slug,
        description: data.description || '',
        shortDesc: data.shortDesc || null,
        price: data.price,
        compareAtPrice: data.compareAtPrice || null,
        costPrice: data.costPrice || null,
        wholesalePrice: data.wholesalePrice || null,
        wholesaleMinQty: data.wholesaleMinQty || null,
        stock: data.stock || 0,
        lowStockThreshold: data.lowStockThreshold || 10,
        trackInventory: data.trackInventory !== false,
        allowBackorder: data.allowBackorder || false,
        images: data.images || [],
        videos: data.videos || null,
        brand: data.brand || null,
        manufacturer: data.manufacturer || null,
        rating: 0,
        reviewCount: 0,
        weight: data.weight || null,
        dimensions: data.dimensions || null,
        color: data.color || null,
        size: data.size || null,
        material: data.material || null,
        attributes: data.attributes || null,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
        tags: data.tags || null,
        features: data.features || null,
        specifications: data.specifications || null,
        highlights: data.highlights || null,
        shippingWeight: data.shippingWeight || null,
        freeShipping: data.freeShipping || false,
        active: data.active !== false,
        featured: data.featured || false,
        isNew: data.isNew || false,
        onSale: data.onSale || false,
        warranty: data.warranty || null,
        returnDays: data.returnDays || 30,
        publishedAt: data.publishedAt || null,
        categories: data.categories && data.categories.length > 0
          ? {
              connect: data.categories.map((id: string) => ({ id }))
            }
          : undefined
      },
      include: {
        categories: true
      }
    });

    return NextResponse.json({ product }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] - Update product
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    const data = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        shortDesc: data.shortDesc,
        price: data.price,
        compareAtPrice: data.compareAtPrice,
        stock: data.stock,
        images: data.images,
        attributes: data.attributes,
        specifications: data.specifications,
        features: data.features,
        active: data.active,
        featured: data.featured,
        // ... other fields
      },
      include: {
        categories: true,
        variants: true
      }
    });

    return NextResponse.json({ product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    await prisma.product.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
