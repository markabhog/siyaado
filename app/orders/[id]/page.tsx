"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { OrderLogic } from "@/lib/order-logic";
import { Button } from "@/app/components/ui";

const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(' ');

// Status Badge Component
const StatusBadge = ({ status, label, color }: { status: string; label: string; color: string }) => {
  const colorClasses = {
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClasses[color as keyof typeof colorClasses]}`}>
      {label}
    </span>
  );
};

// Progress Bar Component
const ProgressBar = ({ progress, status }: { progress: number; status: string }) => {
  const statusLabels = {
    pending: 'Order Placed',
    confirmed: 'Order Confirmed',
    shipped: 'Order Shipped',
    delivered: 'Order Delivered',
    cancelled: 'Order Cancelled',
    refunded: 'Order Refunded'
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Order Progress</h3>
        <span className="text-sm text-slate-600">{progress}% Complete</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div 
          className="bg-blue-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="text-center">
        <div className="text-sm font-medium text-slate-900">
          {statusLabels[status as keyof typeof statusLabels] || 'Unknown Status'}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {progress === 100 ? 'Order completed successfully!' : 'Processing your order...'}
        </div>
      </div>
    </div>
  );
};

// Order Timeline Component
const OrderTimeline = ({ timeline }: { timeline: any[] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Timeline</h3>
      <div className="space-y-6">
        {timeline.map((step, index) => (
          <div key={step.status} className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
              step.completed 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-500'
            }`}>
              {step.completed ? '✓' : index + 1}
            </div>
            <div className="flex-1">
              <div className="font-medium text-slate-900">{step.label}</div>
              <div className="text-sm text-slate-600 mb-1">{step.description}</div>
              <div className="text-xs text-slate-500">
                {new Date(step.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Order Items Component
const OrderItems = ({ items }: { items: any[] }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Items</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
            <div className="w-16 h-16 bg-slate-200 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-slate-900">{item.title}</h4>
              <div className="text-sm text-slate-600">Quantity: {item.quantity}</div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-slate-900">
                ${(item.total / 100).toFixed(2)}
              </div>
              <div className="text-sm text-slate-600">
                ${(item.price / 100).toFixed(2)} each
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Order Summary Component
const OrderSummary = ({ order }: { order: any }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h3>
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Subtotal</span>
          <span>${(order.subtotal / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span>${(order.shipping / 100).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${(order.tax / 100).toFixed(2)}</span>
        </div>
        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${(order.total / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Shipping Information Component
const ShippingInfo = ({ order }: { order: any }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Shipping Information</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-slate-700">Name</label>
          <div className="text-slate-900">{order.shippingName}</div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Address</label>
          <div className="text-slate-900">
            {order.shippingAddress}<br />
            {order.shippingCity}, {order.shippingPostalCode}<br />
            {order.shippingCountry}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Shipping Method</label>
          <div className="text-slate-900">{order.shippingMethod}</div>
        </div>
        {order.estimatedDelivery && (
          <div>
            <label className="text-sm font-medium text-slate-700">Estimated Delivery</label>
            <div className="text-slate-900">
              {new Date(order.estimatedDelivery).toLocaleDateString()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Payment Information Component
const PaymentInfo = ({ order }: { order: any }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Payment Information</h3>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-slate-700">Payment Method</label>
          <div className="text-slate-900 capitalize">
            {order.paymentMethod.replace('_', ' ')}
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Payment Status</label>
          <div className="mt-1">
            <StatusBadge 
              status={order.paymentStatus} 
              label={order.paymentStatus} 
              color={order.paymentStatus === 'paid' ? 'green' : 'yellow'} 
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700">Order Date</label>
          <div className="text-slate-900">
            {new Date(order.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Mock order data for demonstration
    const mockOrder = {
      id: orderId,
      orderNumber: 'LUUL-1703123456789',
      status: 'shipped',
      paymentStatus: 'paid',
      subtotal: 10000, // $100.00
      shipping: 500, // $5.00
      tax: 500, // $5.00
      total: 11000, // $110.00
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-16'),
      estimatedDelivery: new Date('2024-01-20'),
      shippingName: 'Ahmed Hassan',
      shippingAddress: '123 Main Street, Mogadishu',
      shippingCity: 'Mogadishu',
      shippingPostalCode: '10001',
      shippingCountry: 'Somalia',
      shippingMethod: 'Express Shipping',
      paymentMethod: 'mobile_money',
      orderItems: [
        { 
          title: 'iPhone 15 Pro', 
          quantity: 1, 
          price: 10000, 
          total: 10000 
        },
        { 
          title: 'Screen Protector', 
          quantity: 2, 
          price: 1250, 
          total: 2500 
        }
      ]
    };
    
    setOrder(mockOrder);
    setLoading(false);
  }, [orderId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading order details...</p>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            📦
          </div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">Order not found</h2>
          <p className="text-slate-600 mb-6">The order you're looking for doesn't exist.</p>
          <Link href="/orders">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Back to Orders
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  const trackingInfo = OrderLogic.generateTrackingInfo(order);
  const timeline = OrderLogic.getOrderTimeline(order);
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/orders">
              <Button variant="outline" className="flex items-center gap-2">
                ← Back to Orders
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Order Details</h1>
          <p className="text-slate-600 mt-2">Order #{order.orderNumber}</p>
        </div>
        
        {/* Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ProgressBar progress={trackingInfo.progress} status={order.status} />
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Status</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-slate-700">Current Status</label>
                <div className="mt-1">
                  <StatusBadge 
                    status={order.status} 
                    label={trackingInfo.statusLabel} 
                    color={trackingInfo.statusColor} 
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700">Last Updated</label>
                <div className="text-slate-900">
                  {new Date(order.updatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <OrderTimeline timeline={timeline} />
            <OrderItems items={order.orderItems} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <OrderSummary order={order} />
            <ShippingInfo order={order} />
            <PaymentInfo order={order} />
          </div>
        </div>
        
        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <Link href="/orders">
            <Button variant="outline">
              Back to Orders
            </Button>
          </Link>
          {order.status === 'delivered' && (
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Reorder Items
            </Button>
          )}
          {order.status === 'pending' && (
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Cancel Order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
