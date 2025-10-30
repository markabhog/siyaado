import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { contact, shipping, payment, items } = body;

    console.log('=== Order Creation Debug ===');
    console.log('Contact:', contact);
    console.log('Shipping:', shipping);
    console.log('Payment:', payment);
    console.log('Items:', items);

    // Validate required fields
    if (!contact?.email || !contact?.phone) {
      return NextResponse.json({ error: "Contact information is required" }, { status: 400 });
    }

    if (!shipping?.fullName || !shipping?.address || !shipping?.city || !shipping?.postalCode) {
      return NextResponse.json({ error: "Shipping information is required" }, { status: 400 });
    }

    if (!payment?.method) {
      return NextResponse.json({ error: "Payment method is required" }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Get user session
    const session = await getServerSession();
    let userId = null;
    
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      userId = user?.id;
    }

    // Fetch products and calculate totals
    const productIds = items.map((i: any) => i.productId || i.id);
    const products = await prisma.product.findMany({ 
      where: { id: { in: productIds } } 
    });
    const productById = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItems: any[] = [];
    
    for (const item of items) {
      const productId = item.productId || item.id;
      const product = productById.get(productId);
      if (!product) {
        return NextResponse.json({ 
          error: `Product not found: ${item.title}` 
        }, { status: 404 });
      }
      
      const price = product.price;
      const quantity = item.qty || 1;
      const itemTotal = price * quantity;
      
      subtotal += itemTotal;
      orderItems.push({ 
        productId: product.id,
        title: product.title,
        price: price,
        quantity: quantity,
        total: itemTotal
      });
    }

    // Calculate additional costs
    const shippingCost = shipping.shippingOption?.price || 0;
    const tax = Math.round(subtotal * 0.05); // 5% tax
    const total = subtotal + shippingCost + tax;

    // Generate order number
    const orderNumber = `LUUL-${Date.now()}`;

    // Map payment method to Prisma enum
    const paymentMethodMap: Record<string, string> = {
      'cash_on_delivery': 'COD',
      'mobile_money': 'MOBILE_MONEY',
      'bank_transfer': 'BANK_TRANSFER',
      'credit_card': 'CREDIT_CARD'
    };
    
    const prismaPaymentMethod = paymentMethodMap[payment.method] || payment.method;

    // Create payment record
    const paymentRecord = await prisma.payment.create({
      data: {
        method: prismaPaymentMethod,
        amount: total,
        reference: payment.data?.transactionId || `PAY-${Date.now()}`,
        provider: prismaPaymentMethod === 'MOBILE_MONEY' ? 'MobileMoney' : 
                  prismaPaymentMethod === 'COD' ? 'CashOnDelivery' : 'Card',
        status: 'PENDING'
      },
    });

    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        email: contact.email,
        phone: contact.phone,
        shippingAddress: {
          fullName: shipping.fullName,
          address: shipping.address,
          city: shipping.city,
          postalCode: shipping.postalCode,
          country: shipping.country || 'Uganda'
        },
        subtotal,
        shipping: shippingCost,
        tax,
        total,
        status: "PENDING",
        paymentId: paymentRecord.id,
        paymentStatus: 'PENDING',
        shippingMethod: shipping.shippingOption?.name || 'STANDARD',
        estimatedDelivery: shipping.shippingOption?.estimatedDays 
          ? new Date(Date.now() + shipping.shippingOption.estimatedDays * 24 * 60 * 60 * 1000)
          : null,
        items: { 
          create: orderItems 
        },
      },
      select: { 
        id: true,
        orderNumber: true
      },
    });

    console.log('Order created successfully:', order);

    return NextResponse.json({ 
      orderId: order.id,
      orderNumber: order.orderNumber
    });
  } catch (error: any) {
    console.error('=== Order Creation Error ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('========================');
    
    return NextResponse.json({ 
      error: error.message || "Failed to create order" 
    }, { status: 500 });
  }
}


