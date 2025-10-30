import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// GET /api/products/[id]/reviews - Get reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviews = await prisma.review.findMany({
      where: {
        productId: id,
        approved: true,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

// POST /api/products/[id]/reviews - Submit a review
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { rating, title, comment, images } = await request.json();

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Check if user has purchased this product
    const hasPurchased = await prisma.orderItem.findFirst({
      where: {
        productId: id,
        order: {
          userId: (session.user as any).id,
          status: 'DELIVERED'
        }
      }
    });

    // Create review
    const review = await prisma.review.create({
      data: {
        productId: id,
        userId: (session.user as any).id,
        rating,
        title,
        comment,
        images: images || [],
        verified: !!hasPurchased,
        approved: true, // Auto-approve for now
      }
    });

    // Update product rating
    const avgRating = await prisma.review.aggregate({
      where: { 
        productId: id, 
        approved: true 
      },
      _avg: { rating: true },
      _count: true
    });

    await prisma.product.update({
      where: { id },
      data: {
        rating: avgRating._avg.rating || 0,
        reviewCount: avgRating._count
      }
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}

