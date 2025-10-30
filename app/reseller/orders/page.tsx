"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/app/components/ui';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  X,
  MoreHorizontal,
  Calendar,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
  Star,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  items: {
    id: string;
    productName: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  shippingAddress: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
  notes?: string;
}

const statusConfig = {
  pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  processing: { color: 'bg-blue-100 text-blue-800', icon: Package, label: 'Processing' },
  shipped: { color: 'bg-purple-100 text-purple-800', icon: Truck, label: 'Shipped' },
  delivered: { color: 'bg-green-100 text-green-800', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'bg-red-100 text-red-800', icon: X, label: 'Cancelled' }
};

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setOrders([
        {
          id: '1',
          orderNumber: 'ORD-001',
          customer: {
            name: 'Sarah Johnson',
            email: 'sarah@example.com',
            phone: '+1 (555) 123-4567',
            address: '123 Main St, New York, NY 10001'
          },
          items: [
            {
              id: '1',
              productName: 'Wireless Bluetooth Headphones',
              quantity: 1,
              price: 12999,
              image: '/api/placeholder/60/60'
            }
          ],
          status: 'shipped',
          total: 12999,
          shippingAddress: '123 Main St, New York, NY 10001',
          paymentMethod: 'Credit Card',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T14:20:00Z',
          trackingNumber: 'TRK123456789',
          notes: 'Customer requested express shipping'
        },
        {
          id: '2',
          orderNumber: 'ORD-002',
          customer: {
            name: 'Mike Chen',
            email: 'mike@example.com',
            phone: '+1 (555) 987-6543',
            address: '456 Oak Ave, Los Angeles, CA 90210'
          },
          items: [
            {
              id: '2',
              productName: 'Smart Fitness Watch',
              quantity: 1,
              price: 29999,
              image: '/api/placeholder/60/60'
            },
            {
              id: '3',
              productName: 'Wireless Charger',
              quantity: 2,
              price: 4999,
              image: '/api/placeholder/60/60'
            }
          ],
          status: 'processing',
          total: 39997,
          shippingAddress: '456 Oak Ave, Los Angeles, CA 90210',
          paymentMethod: 'PayPal',
          createdAt: '2024-01-14T16:45:00Z',
          updatedAt: '2024-01-14T16:45:00Z'
        },
        {
          id: '3',
          orderNumber: 'ORD-003',
          customer: {
            name: 'Emma Davis',
            email: 'emma@example.com',
            phone: '+1 (555) 456-7890',
            address: '789 Pine St, Chicago, IL 60601'
          },
          items: [
            {
              id: '4',
              productName: 'Organic Cotton T-Shirt',
              quantity: 3,
              price: 2499,
              image: '/api/placeholder/60/60'
            }
          ],
          status: 'delivered',
          total: 7497,
          shippingAddress: '789 Pine St, Chicago, IL 60601',
          paymentMethod: 'Credit Card',
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-16T11:30:00Z',
          trackingNumber: 'TRK987654321'
        }
      ]);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesDate = !dateFilter || new Date(order.createdAt).toISOString().slice(0,10) === new Date(dateFilter).toISOString().slice(0,10);
    return matchesSearch && matchesStatus && matchesDate;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'amount-high':
        return b.total - a.total;
      case 'amount-low':
        return a.total - b.total;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === sortedOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(sortedOrders.map(o => o.id));
    }
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus as any, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const getStatusConfig = (status: string) => {
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
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
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
              <p className="text-slate-600">Manage your customer orders</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid gap-4 md:grid-cols-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search orders..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="amount-high">Highest Amount</option>
                  <option value="amount-low">Lowest Amount</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bulk Actions */}
        {selectedOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-blue-900">
                  {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => {
                      selectedOrders.forEach(id => updateOrderStatus(id, 'processing'));
                      setSelectedOrders([]);
                    }}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Mark as Processing
                  </Button>
                  <Button
                    onClick={() => {
                      selectedOrders.forEach(id => updateOrderStatus(id, 'shipped'));
                      setSelectedOrders([]);
                    }}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    Mark as Shipped
                  </Button>
                </div>
              </div>
              <Button
                onClick={() => setSelectedOrders([])}
                variant="outline"
                size="sm"
              >
                Clear Selection
              </Button>
            </div>
          </motion.div>
        )}

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No orders found</h3>
            <p className="text-slate-600">Orders will appear here when customers place them</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {sortedOrders.map((order, index) => {
                const statusConfig = getStatusConfig(order.status);
                return (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => handleSelectOrder(order.id)}
                          className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-slate-900">
                              {order.orderNumber}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                              <statusConfig.icon className="h-3 w-3" />
                              {statusConfig.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {order.customer.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${(order.total / 100).toFixed(2)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(order.createdAt).toISOString().slice(0, 10)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                      {/* Customer Info */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Customer</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-slate-400" />
                            <span>{order.customer.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-slate-400" />
                            <span>{order.customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-slate-400" />
                            <span>{order.customer.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-slate-400" />
                            <span className="truncate">{order.shippingAddress}</span>
                          </div>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Items ({order.items.length})</h4>
                        <div className="space-y-2">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                              <div className="w-10 h-10 bg-slate-200 rounded-lg flex items-center justify-center">
                                <Package className="h-5 w-5 text-slate-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">{item.productName}</p>
                                <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                              </div>
                              <div className="text-sm font-semibold text-slate-900">
                                ${(item.price / 100).toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Actions */}
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Actions</h4>
                        <div className="space-y-2">
                          {order.status === 'pending' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'processing')}
                              size="sm"
                              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Start Processing
                            </Button>
                          )}
                          {order.status === 'processing' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'shipped')}
                              size="sm"
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                            >
                              Mark as Shipped
                            </Button>
                          )}
                          {order.status === 'shipped' && (
                            <Button
                              onClick={() => updateOrderStatus(order.id, 'delivered')}
                              size="sm"
                              className="w-full bg-green-600 hover:bg-green-700 text-white"
                            >
                              Mark as Delivered
                            </Button>
                          )}
                          {order.trackingNumber && (
                            <div className="text-sm text-slate-600">
                              <span className="font-medium">Tracking:</span> {order.trackingNumber}
                            </div>
                          )}
                          {order.notes && (
                            <div className="text-sm text-slate-600">
                              <span className="font-medium">Notes:</span> {order.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Results Summary */}
        {filteredOrders.length !== orders.length && (
          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Showing {filteredOrders.length} of {orders.length} orders
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
