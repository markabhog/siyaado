import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get total revenue from completed orders (DELIVERED status in enhanced schema)
    const totalRevenue = await prisma.order.aggregate({
      where: {
        status: 'DELIVERED'
      },
      _sum: {
        total: true
      }
    });

    // Get total orders count
    const totalOrders = await prisma.order.count();

    // Get active products count
    const activeProducts = await prisma.product.count({
      where: {
        active: true
      }
    });

    // Get pending orders count
    const pendingOrders = await prisma.order.count({
      where: {
        status: 'PENDING'
      }
    });

    return NextResponse.json({
      totalRevenue: totalRevenue._sum.total || 0,
      totalOrders,
      activeProducts,
      pendingOrders
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values on error instead of error response
    return NextResponse.json({
      totalRevenue: 0,
      totalOrders: 0,
      activeProducts: 0,
      pendingOrders: 0
    });
  }
}
