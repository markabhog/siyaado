"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui";
import { 
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Heart,
  ShoppingBag,
  CreditCard,
  MapPin,
  Star,
  TrendingUp,
  DollarSign,
  Clock,
  Award,
  Shield
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

// Badge Component
const Badge = ({ tone = 'blue', children }: { tone?: string; children: React.ReactNode }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  return (
    <span className={cls('px-3 py-1 rounded-full text-xs font-semibold', colorClasses[tone as keyof typeof colorClasses])}>
      {children}
    </span>
  );
};

// Customer Stats Component (Updated with better icons)
const CustomerStats = ({ stats }: { stats: any }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Total Customers</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalCustomers}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
            <Users className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">VIP Customers</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-300">{stats.vipCustomers}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300">
            <Award className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Active Customers</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">{stats.activeCustomers}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <UserCheck className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">New This Month</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-300">{stats.newCustomers}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-300">
            <UserPlus className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Customer Table Component
const CustomerTable = ({ customers, onSegmentUpdate }: { customers: any[]; onSegmentUpdate: (customerId: string, segment: string) => void }) => {
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  
  const handleSelectAll = () => {
    if (selectedCustomers.length === customers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(customers.map(customer => customer.id));
    }
  };
  
  const handleSelectCustomer = (customerId: string) => {
    setSelectedCustomers(prev => 
      prev.includes(customerId) 
        ? prev.filter(id => id !== customerId)
        : [...prev, customerId]
    );
  };
  
  const handleBulkSegmentUpdate = (segment: string) => {
    selectedCustomers.forEach(customerId => {
      onSegmentUpdate(customerId, segment);
    });
    setSelectedCustomers([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedCustomers.length === customers.length && customers.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">
              {selectedCustomers.length} of {customers.length} selected
            </span>
          </div>
          
          {selectedCustomers.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleBulkSegmentUpdate('VIP')}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Mark as VIP
              </Button>
              <Button
                onClick={() => handleBulkSegmentUpdate('Active')}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Mark as Active
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Orders
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Total Spent
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Last Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Segment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {customers.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedCustomers.includes(customer.id)}
                      onChange={() => handleSelectCustomer(customer.id)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-slate-900">{customer.name}</div>
                      <div className="text-sm text-slate-500">ID: {customer.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{customer.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{customer.orders}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    ${(customer.spent / 100).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{customer.lastOrder}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    tone={customer.segment === 'VIP' ? 'purple' : customer.segment === 'Active' ? 'green' : 'yellow'}
                  >
                    {customer.segment}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onSegmentUpdate(customer.id, 'VIP')}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      Make VIP
                    </Button>
                    <Button
                      onClick={() => onSegmentUpdate(customer.id, 'Active')}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      View Details
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Customer Filters Component
const CustomerFilters = ({ filters, onFilterChange }: { filters: any; onFilterChange: (filters: any) => void }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Segment</label>
          <select
            value={filters.segment || ''}
            onChange={(e) => onFilterChange({ ...filters, segment: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Segments</option>
            <option value="VIP">VIP</option>
            <option value="Active">Active</option>
            <option value="New">New</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search customers..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Min Orders</label>
          <select
            value={filters.minOrders || ''}
            onChange={(e) => onFilterChange({ ...filters, minOrders: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any Orders</option>
            <option value="1">1+ Orders</option>
            <option value="5">5+ Orders</option>
            <option value="10">10+ Orders</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
          <select
            value={filters.sortBy || ''}
            onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Default</option>
            <option value="name">Name</option>
            <option value="spent">Total Spent</option>
            <option value="orders">Order Count</option>
            <option value="lastOrder">Last Order</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    segment: '',
    search: '',
    minOrders: '',
    sortBy: ''
  });
  
  // Mock data for demonstration
  useEffect(() => {
    const mockCustomers = [
      {
        id: 'CUS-3001',
        name: 'Mohamed Ali',
        email: 'mohamed@example.com',
        orders: 7,
        spent: 129000,
        lastOrder: '2024-01-23',
        segment: 'VIP'
      },
      {
        id: 'CUS-3002',
        name: 'Fatima Hassan',
        email: 'fatima@example.com',
        orders: 3,
        spent: 38000,
        lastOrder: '2024-01-23',
        segment: 'Active'
      },
      {
        id: 'CUS-3003',
        name: 'Abdi Rahman',
        email: 'abdi@example.com',
        orders: 5,
        spent: 86000,
        lastOrder: '2024-01-22',
        segment: 'Active'
      },
      {
        id: 'CUS-3004',
        name: 'Amina Yusuf',
        email: 'amina@example.com',
        orders: 1,
        spent: 9900,
        lastOrder: '2024-01-22',
        segment: 'New'
      },
      {
        id: 'CUS-3005',
        name: 'Sagal Noor',
        email: 'sagal@example.com',
        orders: 12,
        spent: 245000,
        lastOrder: '2024-01-21',
        segment: 'VIP'
      }
    ];
    
    const mockStats = {
      totalCustomers: 5,
      vipCustomers: 2,
      activeCustomers: 3,
      newCustomers: 1
    };
    
    setCustomers(mockCustomers);
    setStats(mockStats);
    setLoading(false);
  }, []);
  
  const handleSegmentUpdate = (customerId: string, segment: string) => {
    setCustomers(prev => prev.map(customer => 
      customer.id === customerId ? { ...customer, segment } : customer
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
          <p className="mt-2 text-slate-600">Loading customers...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <CustomerStats stats={stats} />
        <CustomerFilters filters={filters} onFilterChange={handleFilterChange} />
        <CustomerTable customers={customers} onSegmentUpdate={handleSegmentUpdate} />
      </div>
    </div>
  );
}
