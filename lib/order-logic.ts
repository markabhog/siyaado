import { prisma } from './prisma';
import { OrderStatus, PaymentStatus } from '@prisma/client';

// Order Management Logic
export class OrderLogic {
  
  // Create a new order
  static async createOrder(orderData: {
    contact: any;
    shipping: any;
    payment: any;
    items: any[];
  }) {
    const orderNumber = `LUUL-${Date.now()}`;
    
    // Calculate totals
    const subtotal = orderData.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = orderData.shipping.shippingOption?.price || 0;
    const tax = Math.round(subtotal * 0.05);
    const paymentFees = this.calculatePaymentFees(subtotal, orderData.payment.method);
    const total = subtotal + shipping + tax + paymentFees;
    
    // Create order
    const order = await prisma.order.create({
      data: {
        orderNumber,
        status: 'PENDING',
        subtotal,
        shipping,
        tax,
        total,
        paymentStatus: 'PENDING',
        email: orderData.contact.email,
        phone: orderData.contact.phone,
        shippingAddress: {
          fullName: orderData.shipping.fullName,
          address: orderData.shipping.address,
          city: orderData.shipping.city,
          postalCode: orderData.shipping.postalCode,
          country: orderData.shipping.country,
        },
        shippingMethod: 'STANDARD',
        estimatedDelivery: this.calculateDeliveryDate(orderData.shipping.shippingOption),
        items: {
          create: orderData.items.map(item => ({
            productId: item.productId,
            title: item.title,
            sku: item.sku || item.productId,
            price: item.price,
            qty: item.qty,
            total: item.price * item.qty
          }))
        }
      },
      include: {
        items: true
      }
    });
    
    return order;
  }
  
  // Get order by ID
  static async getOrderById(orderId: string) {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        payment: true
      }
    });
  }
  
  // Get order by order number
  static async getOrderByNumber(orderNumber: string) {
    return await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payment: true
      }
    });
  }
  
  // Get orders by email
  static async getOrdersByEmail(email: string) {
    return await prisma.order.findMany({
      where: { email: email },
      include: {
        items: true,
        payment: true
      },
      orderBy: { createdAt: 'desc' }
    });
  }
  
  // Update order status
  static async updateOrderStatus(orderId: string, status: OrderStatus) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
  }
  
  // Update payment status
  static async updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus) {
    return await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus }
    });
  }
  
  // Get all orders (admin)
  static async getAllOrders(filters: {
    status?: string;
    paymentStatus?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
    offset?: number;
  } = {}) {
    const where: any = {};
    
    if (filters.status) where.status = filters.status;
    if (filters.paymentStatus) where.paymentStatus = filters.paymentStatus;
    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = filters.dateFrom;
      if (filters.dateTo) where.createdAt.lte = filters.dateTo;
    }
    
    return await prisma.order.findMany({
      where,
      include: {
        items: true,
        payment: true
      },
      orderBy: { createdAt: 'desc' },
      take: filters.limit || 50,
      skip: filters.offset || 0
    });
  }
  
  // Get order statistics
  static async getOrderStats() {
    const totalOrders = await prisma.order.count();
    const pendingOrders = await prisma.order.count({ where: { status: 'PENDING' } });
    const completedOrders = await prisma.order.count({ where: { status: 'DELIVERED' } });
    const totalRevenue = await prisma.order.aggregate({
      where: { status: 'DELIVERED' },
      _sum: { total: true }
    });
    
    return {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue._sum.total || 0,
      averageOrderValue: totalOrders > 0 ? (totalRevenue._sum.total || 0) / totalOrders : 0
    };
  }
  
  // Calculate payment fees
  static calculatePaymentFees(amount: number, paymentMethod: string): number {
    const feeRates = {
      'mobile_money': 0.02, // 2%
      'bank_transfer': 0.01, // 1%
      'cash_on_delivery': 0.05, // 5%
      'crypto': 0.005, // 0.5%
      'installments': 0.03, // 3%
    };
    
    const rate = feeRates[paymentMethod as keyof typeof feeRates] || 0;
    return Math.round(amount * rate);
  }
  
  // Calculate delivery date
  static calculateDeliveryDate(shippingOption: any): Date {
    const days = shippingOption?.days || '3-5 business days';
    const businessDays = parseInt(days.split('-')[0]);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + businessDays);
    return deliveryDate;
  }
  
  // Get order status options
  static getOrderStatuses() {
    return [
      { value: 'pending', label: 'Pending', color: 'yellow', description: 'Order received, awaiting payment verification' },
      { value: 'confirmed', label: 'Confirmed', color: 'blue', description: 'Payment verified, preparing for shipment' },
      { value: 'shipped', label: 'Shipped', color: 'purple', description: 'Order has been shipped' },
      { value: 'delivered', label: 'Delivered', color: 'green', description: 'Order has been delivered' },
      { value: 'cancelled', label: 'Cancelled', color: 'red', description: 'Order has been cancelled' },
      { value: 'refunded', label: 'Refunded', color: 'gray', description: 'Order has been refunded' }
    ];
  }
  
  // Get payment status options
  static getPaymentStatuses() {
    return [
      { value: 'pending', label: 'Pending', color: 'yellow', description: 'Awaiting payment' },
      { value: 'paid', label: 'Paid', color: 'green', description: 'Payment received' },
      { value: 'failed', label: 'Failed', color: 'red', description: 'Payment failed' },
      { value: 'refunded', label: 'Refunded', color: 'gray', description: 'Payment refunded' }
    ];
  }
  
  // Generate order tracking info
  static generateTrackingInfo(order: any) {
    const statuses = this.getOrderStatuses();
    const currentStatus = statuses.find(s => s.value === order.status);
    
    return {
      orderNumber: order.orderNumber,
      status: order.status,
      statusLabel: currentStatus?.label || 'Unknown',
      statusColor: currentStatus?.color || 'gray',
      statusDescription: currentStatus?.description || '',
      estimatedDelivery: order.estimatedDelivery,
      trackingNumber: order.trackingNumber || null,
      lastUpdated: order.updatedAt,
      progress: this.calculateOrderProgress(order.status)
    };
  }
  
  // Calculate order progress percentage
  static calculateOrderProgress(status: string): number {
    const progressMap = {
      'pending': 20,
      'confirmed': 40,
      'shipped': 70,
      'delivered': 100,
      'cancelled': 0,
      'refunded': 0
    };
    
    return progressMap[status as keyof typeof progressMap] || 0;
  }
  
  // Get order timeline
  static getOrderTimeline(order: any) {
    const timeline = [
      {
        status: 'pending',
        label: 'Order Placed',
        description: 'Your order has been received',
        timestamp: order.createdAt,
        completed: true
      }
    ];
    
    if (order.status !== 'PENDING') {
      timeline.push({
        status: 'confirmed',
        label: 'Order Confirmed',
        description: 'Payment verified, preparing shipment',
        timestamp: order.updatedAt,
        completed: ['PROCESSING', 'SHIPPED', 'DELIVERED'].includes(order.status)
      });
    }
    
    if (['SHIPPED', 'DELIVERED'].includes(order.status)) {
      timeline.push({
        status: 'shipped',
        label: 'Order Shipped',
        description: 'Your order is on its way',
        timestamp: order.updatedAt,
        completed: order.status === 'DELIVERED'
      });
    }
    
    if (order.status === 'DELIVERED') {
      timeline.push({
        status: 'delivered',
        label: 'Order Delivered',
        description: 'Your order has been delivered',
        timestamp: order.updatedAt,
        completed: true
      });
    }
    
    return timeline;
  }
}
