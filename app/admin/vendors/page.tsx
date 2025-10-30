"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui";
import { 
  Store,
  CheckCircle2,
  Clock8,
  Building2,
  Warehouse,
  Star,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Package,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Globe,
  Shield,
  Award,
  Truck
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
    Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Verified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    Suspended: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    Inactive: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
  };
  const iconMap: Record<string, React.ReactNode> = {
    Active: <CheckCircle2 className="h-3.5 w-3.5" />,
    Verified: <CheckCircle2 className="h-3.5 w-3.5" />,
    Pending: <Clock8 className="h-3.5 w-3.5" />,
    Suspended: <Clock8 className="h-3.5 w-3.5" />,
    Inactive: <Clock8 className="h-3.5 w-3.5" />,
  };
  return (
    <span className={cls("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium", map[status] || "")}>
      {iconMap[status] || null}
      {status}
    </span>
  );
};

// Badge Component
const Badge = ({ tone = 'blue', children }: { tone?: string; children: React.ReactNode }) => {
  const colorClasses = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700'
  };

  return (
    <span className={cls('px-3 py-1 rounded-full text-xs font-semibold', colorClasses[tone as keyof typeof colorClasses])}>
      {children}
    </span>
  );
};

// Vendor Stats Component (Updated with better icons)
const VendorStats = ({ stats }: { stats: any }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Total Vendors</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.totalVendors}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
            <Store className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Verified Vendors</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">{stats.verifiedVendors}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <Shield className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Pending Approval</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-300">{stats.pendingVendors}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300">
            <Clock8 className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Total Sales</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-300">${(stats.totalSales / 100).toFixed(2)}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-300">
            <DollarSign className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Vendor Table Component
const VendorTable = ({ vendors, onStatusUpdate }: { vendors: any[]; onStatusUpdate: (vendorId: string, status: string) => void }) => {
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  
  const handleSelectAll = () => {
    if (selectedVendors.length === vendors.length) {
      setSelectedVendors([]);
    } else {
      setSelectedVendors(vendors.map(vendor => vendor.id));
    }
  };
  
  const handleSelectVendor = (vendorId: string) => {
    setSelectedVendors(prev => 
      prev.includes(vendorId) 
        ? prev.filter(id => id !== vendorId)
        : [...prev, vendorId]
    );
  };
  
  const handleBulkStatusUpdate = (status: string) => {
    selectedVendors.forEach(vendorId => {
      onStatusUpdate(vendorId, status);
    });
    setSelectedVendors([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={selectedVendors.length === vendors.length && vendors.length > 0}
              onChange={handleSelectAll}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-slate-700">
              {selectedVendors.length} of {vendors.length} selected
            </span>
          </div>
          
          {selectedVendors.length > 0 && (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handleBulkStatusUpdate('verified')}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Approve Selected
              </Button>
              <Button
                onClick={() => handleBulkStatusUpdate('rejected')}
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reject Selected
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
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Products
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedVendors.includes(vendor.id)}
                      onChange={() => handleSelectVendor(vendor.id)}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <div>
                      <div className="text-sm font-medium text-slate-900">{vendor.name}</div>
                      <div className="text-sm text-slate-500">{vendor.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge 
                    tone={vendor.status === 'verified' ? 'green' : vendor.status === 'pending' ? 'yellow' : 'red'}
                  >
                    {vendor.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900">{vendor.products}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-slate-900">
                    ${(vendor.sales / 100).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm text-slate-900">{vendor.rating}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => onStatusUpdate(vendor.id, 'verified')}
                      size="sm"
                      variant="outline"
                      className="text-xs"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => onStatusUpdate(vendor.id, 'rejected')}
                      size="sm"
                      variant="outline"
                      className="text-xs text-red-600 border-red-300 hover:bg-red-50"
                    >
                      Reject
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

// Filters Component
const VendorFilters = ({ filters, onFilterChange }: { filters: any; onFilterChange: (filters: any) => void }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Filters</h3>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            placeholder="Search vendors..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Min Rating</label>
          <select
            value={filters.minRating || ''}
            onChange={(e) => onFilterChange({ ...filters, minRating: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any Rating</option>
            <option value="4">4+ Stars</option>
            <option value="3">3+ Stars</option>
            <option value="2">2+ Stars</option>
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
            <option value="sales">Sales</option>
            <option value="rating">Rating</option>
            <option value="products">Products</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    minRating: '',
    sortBy: ''
  });
  
  // Mock data for demonstration
  useEffect(() => {
    const mockVendors = [
      {
        id: 'VND-2001',
        name: 'TechHub Mogadishu',
        email: 'contact@techhub.so',
        status: 'verified',
        products: 142,
        sales: 4200000,
        rating: 4.6
      },
      {
        id: 'VND-2002',
        name: 'SomFashion',
        email: 'info@somfashion.com',
        status: 'pending',
        products: 58,
        sales: 1180000,
        rating: 4.2
      },
      {
        id: 'VND-2003',
        name: 'BlueOcean Electronics',
        email: 'sales@blueocean.so',
        status: 'verified',
        products: 96,
        sales: 2875000,
        rating: 4.4
      },
      {
        id: 'VND-2004',
        name: 'Digital Solutions',
        email: 'hello@digitalsolutions.so',
        status: 'rejected',
        products: 23,
        sales: 450000,
        rating: 3.8
      }
    ];
    
    const mockStats = {
      totalVendors: 4,
      verifiedVendors: 2,
      pendingVendors: 1,
      totalSales: 8705000
    };
    
    setVendors(mockVendors);
    setStats(mockStats);
    setLoading(false);
  }, []);
  
  const handleStatusUpdate = (vendorId: string, status: string) => {
    setVendors(prev => prev.map(vendor => 
      vendor.id === vendorId ? { ...vendor, status } : vendor
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
          <p className="mt-2 text-slate-600">Loading vendors...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <VendorStats stats={stats} />
        <VendorFilters filters={filters} onFilterChange={handleFilterChange} />
        <VendorTable vendors={vendors} onStatusUpdate={handleStatusUpdate} />
      </div>
    </div>
  );
}
