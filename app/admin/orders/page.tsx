"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { OrderLogic } from "@/lib/order-logic";
import { Button } from "@/app/components/ui";
import { 
  ShoppingCart,
  Clock8,
  CheckCircle2,
  Truck,
  Package,
  TrendingUp,
  Users,
  DollarSign,
  Filter,
  Search,
  MoreHorizontal
} from "lucide-react";

const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(' ');

// Consistent UI Components
const Card = ({ className = "", ...props }) => (
  <div className={["rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/40", className].join(" ")} {...props} />
);

const CardHeader = ({ className = "", ...props }) => (
  <div className={["px-5 pt-5", className].join(" ")} {...props} />
);

const CardTitle = ({ className = "", ...props }) => (
  <h3 className={["text-base font-semibold text-slate-800 dark:text-slate-100", className].join(" ")} {...props} />
);

const CardContent = ({ className = "", ...props }) => (
  <div className={["px-5 pb-5", className].join(" ")} {...props} />
);

const StatusPill = ({ status }: { status: string }) => {
  const map: Record<string, string> = {
    Completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    Shipped: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    Delivered: "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300",
    Cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    Inactive: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
  };
  const iconMap: Record<string, React.ReactNode> = {
    Completed: <CheckCircle2 className="h-3.5 w-3.5" />,
    Active: <CheckCircle2 className="h-3.5 w-3.5" />,
    Pending: <Clock8 className="h-3.5 w-3.5" />,
    Shipped: <Truck className="h-3.5 w-3.5" />,
    Delivered: <CheckCircle2 className="h-3.5 w-3.5" />,
    Cancelled: <Clock8 className="h-3.5 w-3.5" />,
    Inactive: <Clock8 className="h-3.5 w-3.5" />,
  };
  return (
    <span className={cls("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", map[status] || "")}>
      {iconMap[status] || null}
      {status}
    </span>
  );
};

const DataTable = ({ columns, rows }: { columns: string[]; rows: any[][] }) => (
  <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
    <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
      <thead className="bg-slate-50/60 dark:bg-slate-900/50">
        <tr>
          {columns.map((c) => (
            <th key={c} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">{c}</th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 bg-white dark:bg-slate-950/40 dark:divide-slate-900">
        {rows.map((r, i) => (
          <tr key={i} className="hover:bg-slate-50/70 dark:hover:bg-slate-900/40">
            {r.map((cell, j) => (
              <td key={j} className="px-4 py-3 align-middle">{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

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
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${colorClasses[color as keyof typeof colorClasses]}`}>
      {label}
    </span>
  );
};

// Order Stats Component (Updated to use consistent design)
const OrderStats = ({ stats }: { stats: any }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Total Orders</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalOrders}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
            <ShoppingCart className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Pending Orders</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-300">{stats.pendingOrders}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300">
            <Clock8 className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Completed Orders</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">{stats.completedOrders}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Total Revenue</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">${(stats.totalRevenue / 100).toFixed(2)}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-300">
            <DollarSign className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Order Table Component (Updated to use consistent design)
const OrderTable = ({ orders, onStatusUpdate }: { orders: any[]; onStatusUpdate: (orderId: string, status: string) => void }) => {
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  
  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map(order => order.id));
    }
  };
  
  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };
  
  const handleBulkStatusUpdate = (status: string) => {
    selectedOrders.forEach(orderId => {
      onStatusUpdate(orderId, status);
    });
    setSelectedOrders([]);
  };

  const rows = orders.map((order) => [
    <div key={order.id} className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={selectedOrders.includes(order.id)}
        onChange={() => handleSelectOrder(order.id)}
        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
      />
      <div>
        <div className="text-sm font-medium text-slate-900">{order.orderNumber}</div>
        <div className="text-sm text-slate-500">{order.orderItems.length} items</div>
      </div>
    </div>,
    <div key={order.id}>
      <div className="text-sm font-medium text-slate-900">{order.shippingName}</div>
      <div className="text-sm text-slate-500">{order.contactEmail}</div>
    </div>,
    <StatusPill key={order.id} status={order.status} />,
    <div key={order.id}>
      <div className="text-sm text-slate-900 capitalize">{order.paymentMethod.replace('_', ' ')}</div>
      <StatusPill status={order.paymentStatus} />
    </div>,
    `$${(order.total / 100).toFixed(2)}`,
    new Date(order.createdAt).toISOString().slice(0, 10),
    <div key={order.id} className="flex items-center gap-2">
      <Button
        onClick={() => onStatusUpdate(order.id, 'confirmed')}
        size="sm"
        variant="outline"
        className="text-xs"
      >
        Confirm
      </Button>
      <Button
        onClick={() => onStatusUpdate(order.id, 'shipped')}
        size="sm"
        variant="outline"
        className="text-xs"
      >
        Ship
      </Button>
    </div>
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Orders</CardTitle>
          {selectedOrders.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleBulkStatusUpdate('confirmed')}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Mark as Confirmed
              </Button>
              <Button
                onClick={() => handleBulkStatusUpdate('shipped')}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Mark as Shipped
              </Button>
            </div>
          )}
        </div>
        {selectedOrders.length > 0 && (
          <div className="flex items-center gap-4 mt-2">
            <input
              type="checkbox"
              checked={selectedOrders.length === orders.length && orders.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">
              {selectedOrders.length} of {orders.length} selected
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <DataTable
          columns={["Order", "Customer", "Status", "Payment", "Total", "Date", "Actions"]}
          rows={rows}
        />
      </CardContent>
    </Card>
  );
};

// Filters Component (Updated to use consistent design)
const OrderFilters = ({ filters, onFilterChange }: { filters: any; onFilterChange: (filters: any) => void }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Filters & Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Status</label>
            <select
              value={filters.paymentStatus || ''}
              onChange={(e) => onFilterChange({ ...filters, paymentStatus: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
            >
              <option value="">All Payment Statuses</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date From</label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date To</label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([
    {
      id: '1',
      orderNumber: 'LUUL-1703123456789',
      status: 'pending',
      paymentStatus: 'paid',
      total: 12500,
      createdAt: new Date('2024-01-15'),
      shippingName: 'Ahmed Hassan',
      contactEmail: 'ahmed@example.com',
      paymentMethod: 'mobile_money',
      orderItems: [{ title: 'iPhone 15 Pro', quantity: 1 }]
    },
    {
      id: '2',
      orderNumber: 'LUUL-1703123456790',
      status: 'shipped',
      paymentStatus: 'paid',
      total: 8500,
      createdAt: new Date('2024-01-10'),
      shippingName: 'Fatima Ali',
      contactEmail: 'fatima@example.com',
      paymentMethod: 'credit_card',
      orderItems: [{ title: 'Samsung Galaxy S24', quantity: 1 }]
    }
  ]);
  const [stats, setStats] = useState<any>({
    totalOrders: 2,
    pendingOrders: 1,
    completedOrders: 1,
    totalRevenue: 36000
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    paymentStatus: '',
    dateFrom: '',
    dateTo: ''
  });
  
  
  const handleStatusUpdate = (orderId: string, status: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
  };
  
  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    // In a real app, this would trigger a new API call
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading orders...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      {/* Stats */}
      <OrderStats stats={stats} />
      
      {/* Filters */}
      <OrderFilters filters={filters} onFilterChange={handleFilterChange} />
      
      {/* Orders Table */}
      <OrderTable orders={orders} onStatusUpdate={handleStatusUpdate} />
    </>
  );
}
