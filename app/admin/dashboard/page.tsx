"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui";
import Link from "next/link";
import { 
  Gauge, 
  ShoppingCart, 
  Package, 
  Users, 
  Banknote, 
  BarChart3, 
  Megaphone, 
  Settings, 
  Plus,
  CreditCard,
  Clock8,
  CheckCircle2,
  TrendingUp
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
    Scheduled: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    Cancelled: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    Inactive: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
    Draft: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
  };
  const iconMap: Record<string, React.ReactNode> = {
    Completed: <CheckCircle2 className="h-3.5 w-3.5" />,
    Active: <CheckCircle2 className="h-3.5 w-3.5" />,
    Pending: <Clock8 className="h-3.5 w-3.5" />,
    Scheduled: <Clock8 className="h-3.5 w-3.5" />,
    Cancelled: <Clock8 className="h-3.5 w-3.5" />,
    Inactive: <Clock8 className="h-3.5 w-3.5" />,
    Draft: <Clock8 className="h-3.5 w-3.5" />,
  };
  return (
    <span className={cls("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", map[status] || "")}>
      {iconMap[status] || null}
      {status}
    </span>
  );
};

const KpiCard = ({ title, value, delta, icon }: { title: string; value: string; delta: string; icon: React.ReactNode }) => (
  <Card className="backdrop-blur">
    <CardHeader>
      <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
    </CardHeader>
    <CardContent className="flex items-end justify-between">
      <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
      <div className="text-xs font-medium text-emerald-600 dark:text-emerald-300">{delta}</div>
      <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">{icon}</div>
    </CardContent>
  </Card>
);

const QuickAction = ({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void }) => (
  <Card className="group ring-1 ring-slate-200/60 dark:ring-slate-800 hover:shadow-md transition">
    <CardContent className="flex items-center gap-4 p-4">
      <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-600 text-white shadow-sm">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-slate-800 dark:text-slate-100">{title}</p>
        <p className="text-xs text-slate-500 dark:text-slate-400">{desc}</p>
      </div>
      <div className="ml-auto opacity-0 group-hover:opacity-100">
        <Button size="sm" onClick={onClick} className="rounded-xl">Open</Button>
      </div>
    </CardContent>
  </Card>
);

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

// Utility functions
const currency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
const pct = (n: number) => `${n > 0 ? '+' : ''}${Number(n).toFixed(1)}%`;

// Stat Card Component (Updated to use consistent design)
const StatCard = ({ title, value, change, icon, color = "blue" }: { 
  title: string; 
  value: string; 
  change: number; 
  icon: React.ReactNode; 
  color?: string;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <KpiCard
        title={title}
        value={value}
        delta={`${pct(change)} from last week`}
        icon={icon}
      />
    </motion.div>
  );
};

// Chart Component (Updated to use consistent design)
const Chart = ({ title, data, type = "line" }: { title: string; data: any[]; type?: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-gradient-to-b from-blue-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 dark:text-slate-400">Chart visualization would go here</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">Using Chart.js, Recharts, or similar</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Recent Orders Component (Updated to use consistent design)
const RecentOrders = ({ orders }: { orders: any[] }) => {
  // Ensure orders is an array
  const ordersArray = Array.isArray(orders) ? orders : [];
  
  const rows = ordersArray.slice(0, 5).map((order) => {
    // Extract customer name from shippingAddress JSON or use email
    let customerName = order.email || 'N/A';
    if (order.shippingAddress && typeof order.shippingAddress === 'object') {
      customerName = order.shippingAddress.fullName || order.email || 'N/A';
    }
    
    return [
      order.orderNumber || order.id,
      customerName,
      `$${(order.total / 100).toFixed(2)}`,
      <StatusPill key={order.id} status={order.status.charAt(0).toUpperCase() + order.status.slice(1)} />
    ];
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={["Order ID", "Customer", "Amount", "Status"]}
          rows={rows}
        />
      </CardContent>
    </Card>
  );
};

// Top Products Component (Updated to use consistent design)
const TopProducts = ({ products }: { products: any[] }) => {
  // Ensure products is an array
  const productsArray = Array.isArray(products) ? products : [];
  
  const rows = productsArray.slice(0, 5).map((product, index) => [
    `${index + 1}. ${product.title}`,
    product.sku,
    `$${(product.price / 100).toFixed(2)}`,
    product.stock
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Top Products</CardTitle>
          <Link href="/admin/products">
            <Button variant="outline" size="sm">Manage</Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={["Product", "SKU", "Price", "Stock"]}
          rows={rows}
        />
      </CardContent>
    </Card>
  );
};

// Quick Actions Component (Updated to use consistent design)
const QuickActions = () => {
  const actions = [
    {
      icon: <Plus className="h-6 w-6" />,
      title: "Add Product",
      desc: "Create and publish a new item",
      onClick: () => window.location.href = "/admin/products"
    },
    {
      icon: <Package className="h-6 w-6" />,
      title: "Manage Orders",
      desc: "Review and fulfill orders",
      onClick: () => window.location.href = "/admin/orders"
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Verify Payments",
      desc: "Check recent transactions",
      onClick: () => window.location.href = "/admin/payments"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "View Analytics",
      desc: "See performance trends",
      onClick: () => window.location.href = "/admin/analytics"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {actions.map((action, index) => (
        <QuickAction
          key={index}
          icon={action.icon}
          title={action.title}
          desc={action.desc}
          onClick={action.onClick}
        />
      ))}
    </div>
  );
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    activeProducts: 0,
    pendingOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<Array<Record<string, unknown>>>([]);
  const [topProducts, setTopProducts] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch('/api/admin/dashboard/stats');
        const statsData = await statsRes.json();
        setStats(statsData);

        // Fetch recent orders
        const ordersRes = await fetch('/api/admin/orders?limit=5');
        const ordersData = await ordersRes.json();
        setRecentOrders(ordersData);

        // Fetch top products
        const productsRes = await fetch('/api/admin/products?limit=5');
        const productsData = await productsRes.json();
        setTopProducts(productsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Fallback to mock data
        setStats({
          totalRevenue: 125000,
          totalOrders: 47,
          activeProducts: 23,
          pendingOrders: 8
        });
        setRecentOrders([
          {
            id: '1',
            orderNumber: 'ORD-2024-00001',
            status: 'PENDING',
            total: 12500,
            email: 'ahmed@example.com',
            shippingAddress: { fullName: 'Ahmed Hassan' }
          },
          {
            id: '2',
            orderNumber: 'ORD-2024-00002',
            status: 'SHIPPED',
            total: 8500,
            email: 'fatima@example.com',
            shippingAddress: { fullName: 'Fatima Ali' }
          }
        ]);
        setTopProducts([
          {
            id: '1',
            title: 'iPhone 15 Pro',
            price: 99900,
            stock: 12,
            sku: 'IPH15P-256'
          },
          {
            id: '2',
            title: 'MacBook Air M2',
            price: 129900,
            stock: 8,
            sku: 'MBA-M2-256'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={currency((stats.totalRevenue || 0) / 100)}
          change={12.5}
          icon={<CreditCard className="h-6 w-6" />}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={(stats.totalOrders || 0).toString()}
          change={8.2}
          icon={<ShoppingCart className="h-6 w-6" />}
          color="blue"
        />
        <StatCard
          title="Active Products"
          value={(stats.activeProducts || 0).toString()}
          change={3.1}
          icon={<Package className="h-6 w-6" />}
          color="purple"
        />
        <StatCard
          title="Pending Orders"
          value={(stats.pendingOrders || 0).toString()}
          change={-2.0}
          icon={<Clock8 className="h-6 w-6" />}
          color="orange"
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <QuickActions />
      </div>

      {/* Content Grid */}
      <div className="mt-8 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentOrders orders={recentOrders} />
        </div>
        <div>
          <TopProducts products={topProducts} />
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Chart title="Revenue Over Time" data={[]} />
        <Chart title="Orders Over Time" data={[]} />
      </div>
    </>
  );
}
