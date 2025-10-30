import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    
    console.log('Fetching sold count for product:', productId);
    
    // Count total quantity sold from OrderItems for this product
    const result = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        productId,
      },
      _sum: {
        qty: true,
      },
    });
    
    const count = result[0]?._sum.qty || 0;
    
    console.log('Sold count result:', { result, count });
    
    // Also fetch total order items count for debugging
    const totalOrderItems = await prisma.orderItem.count({
      where: { productId }
    });
    console.log('Total order items for this product:', totalOrderItems);
    
    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching sold count:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sold count' },
      { status: 500 }
    );
  }
}

