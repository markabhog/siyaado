"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/app/components/ui';
import { 
  Store, 
  TrendingUp, 
  TrendingDown,
  Users, 
  DollarSign, 
  ShoppingBag, 
  Eye, 
  Star,
  Plus,
  BarChart3,
  Package,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Filter,
  Search,
  Calendar,
  Target,
  Zap,
  Award,
  MessageCircle,
  Settings,
  LogOut
} from 'lucide-react';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  monthlyGrowth: number;
  orderGrowth: number;
  productViews: number;
  conversionRate: number;
}

interface RecentOrder {
  id: string;
  customerName: string;
  productName: string;
  amount: number;
  status: string;
  date: string;
  image: string;
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  growth: number;
  image: string;
}

const quickActions = [
  { title: "Add Product", icon: <Plus className="h-5 w-5" />, href: "/reseller/products/new", color: "bg-blue-500" },
  { title: "View Orders", icon: <ShoppingBag className="h-5 w-5" />, href: "/reseller/orders", color: "bg-green-500" },
  { title: "Analytics", icon: <BarChart3 className="h-5 w-5" />, href: "/reseller/analytics", color: "bg-purple-500" },
  { title: "Store Settings", icon: <Settings className="h-5 w-5" />, href: "/reseller/settings", color: "bg-orange-500" }
];

export default function VendorDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    monthlyGrowth: 0,
    orderGrowth: 0,
    productViews: 0,
    conversionRate: 0
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Simulate API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app, fetch from API
      setStats({
        totalRevenue: 28470,
        totalOrders: 156,
        totalProducts: 24,
        totalCustomers: 89,
        monthlyGrowth: 12.5,
        orderGrowth: 8.3,
        productViews: 1240,
        conversionRate: 3.2
      });

      setRecentOrders([
        {
          id: "ORD-001",
          customerName: "Sarah Johnson",
          productName: "Wireless Headphones",
          amount: 129.99,
          status: "shipped",
          date: "2024-01-15",
          image: "/api/placeholder/60/60"
        },
        {
          id: "ORD-002", 
          customerName: "Mike Chen",
          productName: "Smart Watch",
          amount: 299.99,
          status: "processing",
          date: "2024-01-14",
          image: "/api/placeholder/60/60"
        },
        {
          id: "ORD-003",
          customerName: "Emma Davis",
          productName: "Bluetooth Speaker",
          amount: 79.99,
          status: "delivered",
          date: "2024-01-13",
          image: "/api/placeholder/60/60"
        }
      ]);

      setTopProducts([
        {
          id: "1",
          name: "Wireless Headphones",
          sales: 45,
          revenue: 5849.55,
          growth: 15.2,
          image: "/api/placeholder/60/60"
        },
        {
          id: "2", 
          name: "Smart Watch",
          sales: 32,
          revenue: 9599.68,
          growth: 8.7,
          image: "/api/placeholder/60/60"
        },
        {
          id: "3",
          name: "Bluetooth Speaker",
          sales: 28,
          revenue: 2239.72,
          growth: -2.1,
          image: "/api/placeholder/60/60"
        }
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />;
      case 'shipped':
        return <Package className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-slate-600">Welcome back! Here's what's happening with your store.</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                <DollarSign className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-semibold">+{stats.monthlyGrowth}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              ${stats.totalRevenue.toLocaleString()}
            </div>
            <div className="text-slate-600">Total Revenue</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-green-600">
                <ArrowUpRight className="h-4 w-4" />
                <span className="text-sm font-semibold">+{stats.orderGrowth}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {stats.totalOrders}
            </div>
            <div className="text-slate-600">Total Orders</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                <Package className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <span className="text-sm font-semibold">{stats.totalProducts}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {stats.totalProducts}
            </div>
            <div className="text-slate-600">Active Products</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                <Users className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-1 text-slate-600">
                <span className="text-sm font-semibold">{stats.totalCustomers}</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {stats.totalCustomers}
            </div>
            <div className="text-slate-600">Total Customers</div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <Link
                    key={index}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className={`p-2 ${action.color} text-white rounded-lg`}>
                      {action.icon}
                    </div>
                    <span className="font-medium text-slate-900">{action.title}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Store Performance */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Store Performance</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Product Views</span>
                  <span className="font-semibold text-slate-900">{stats.productViews.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Conversion Rate</span>
                  <span className="font-semibold text-slate-900">{stats.conversionRate}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Store Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold text-slate-900">4.8</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Recent Orders & Top Products */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Recent Orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Recent Orders</h3>
                <Link href="/reseller/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {recentOrders.map((order, index) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900">{order.customerName}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-sm text-slate-500">{order.productName}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>Order #{order.id}</span>
                        <span>${order.amount}</span>
                        <span>{new Date(order.date).toISOString().slice(0, 10)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Top Products</h3>
                <Link href="/reseller/products" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View all
                </Link>
              </div>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg"
                  >
                    <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-900 mb-1">{product.name}</div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span>{product.sales} sales</span>
                        <span>${product.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {product.growth > 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-600" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`text-sm font-semibold ${product.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.growth > 0 ? '+' : ''}{product.growth}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
