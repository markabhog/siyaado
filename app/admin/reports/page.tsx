"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  MousePointer,
  Download,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  Activity,
  FileText,
  FileSpreadsheet,
  Eye,
  RefreshCw,
  Target,
  Award,
  Globe,
  Smartphone,
  CreditCard,
  Package,
  Truck,
  Star,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Percent,
  Layers,
  Database,
  BarChart,
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AreaChart,
  Gauge,
  Thermometer,
  Wind,
  Sun,
  Moon,
  Search,
  Settings,
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
    Active: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    Completed: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    Failed: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
  };
  const iconMap: Record<string, React.ReactNode> = {
    Active: <CheckCircle2 className="h-3.5 w-3.5" />,
    Pending: <Clock className="h-3.5 w-3.5" />,
    Completed: <Award className="h-3.5 w-3.5" />,
    Failed: <AlertTriangle className="h-3.5 w-3.5" />,
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

// Enhanced KPI Cards
const KpiCard = ({ title, value, change, icon: Icon, trend, color = "blue" }: { title: string; value: string; change: string; icon: any; trend: "up" | "down" | "neutral"; color?: string }) => {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-300",
    green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-300",
    red: "bg-red-500/10 text-red-600 dark:text-red-300",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-300",
    indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300"
  };

  return (
    <Card className="backdrop-blur">
      <CardHeader>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{title}</p>
      </CardHeader>
      <CardContent className="flex items-end justify-between">
        <div>
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{value}</div>
          <div className={cls("flex items-center gap-1 mt-1 text-sm", 
            trend === "up" ? "text-emerald-600 dark:text-emerald-300" : 
            trend === "down" ? "text-red-600 dark:text-red-300" : 
            "text-slate-600 dark:text-slate-400"
          )}>
            {trend === "up" && <TrendingUp className="h-4 w-4" />}
            {trend === "down" && <TrendingDown className="h-4 w-4" />}
            {trend === "neutral" && <Activity className="h-4 w-4" />}
            <span>{change}</span>
          </div>
        </div>
        <div className={cls("ml-4 grid h-12 w-12 place-items-center rounded-xl", colorClasses[color])}>
          <Icon className="h-6 w-6" />
        </div>
      </CardContent>
    </Card>
  );
};

// Advanced Chart Component
const AdvancedChart = ({ title, type, data, height = "h-80" }: { title: string; type: string; data: any; height?: string }) => {
  const getChartIcon = () => {
    switch (type) {
      case 'line': return <LineChart className="h-8 w-8" />;
      case 'bar': return <BarChart className="h-8 w-8" />;
      case 'pie': return <PieChart className="h-8 w-8" />;
      case 'area': return <AreaChart className="h-8 w-8" />;
      case 'scatter': return <BarChart3 className="h-8 w-8" />;
      default: return <BarChart3 className="h-8 w-8" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              View
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={cls(height, "bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 rounded-xl flex items-center justify-center border border-slate-200 dark:border-slate-700")}>
          <div className="text-center">
            <div className="text-slate-400 mb-4">
              {getChartIcon()}
            </div>
            <p className="text-slate-600 dark:text-slate-400 font-medium">{title}</p>
            <p className="text-sm text-slate-500 dark:text-slate-500 mt-1">
              {type.charAt(0).toUpperCase() + type.slice(1)} Chart Visualization
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Export Options Component
const ExportOptions = ({ onExport }: { onExport: (format: string) => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Export Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            onClick={() => onExport('pdf')}
            className="w-full justify-start bg-red-600 hover:bg-red-700 text-white"
          >
            <FileText className="h-4 w-4 mr-2" />
            Export as PDF
          </Button>
          <Button 
            onClick={() => onExport('csv')}
            className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export as CSV
          </Button>
          <Button 
            onClick={() => onExport('excel')}
            className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white"
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Export as Excel
          </Button>
          <Button 
            onClick={() => onExport('json')}
            className="w-full justify-start bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Database className="h-4 w-4 mr-2" />
            Export as JSON
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

// Report Filters Component
const ReportFilters = ({ filters, onFilterChange }: { filters: any; onFilterChange: (filters: any) => void }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Report Filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date Range</label>
            <select
              value={filters.dateRange || ''}
              onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Report Type</label>
            <select
              value={filters.reportType || ''}
              onChange={(e) => onFilterChange({ ...filters, reportType: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
            >
              <option value="">All Reports</option>
              <option value="sales">Sales Report</option>
              <option value="customers">Customer Report</option>
              <option value="products">Product Report</option>
              <option value="marketing">Marketing Report</option>
              <option value="financial">Financial Report</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
            <select
              value={filters.category || ''}
              onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
            >
              <option value="">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="home">Home & Garden</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Search</label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={filters.search || ''}
                onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
                placeholder="Search reports..."
                className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Top Products Table
const TopProductsTable = ({ products }: { products: any[] }) => {
  const rows = products.map((product, index) => [
    <div key={product.id} className="flex items-center gap-3">
      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-sm font-semibold text-slate-600">
        {index + 1}
      </div>
      <div>
        <div className="text-sm font-medium text-slate-900">{product.name}</div>
        <div className="text-xs text-slate-500">{product.category}</div>
      </div>
    </div>,
    <div key={product.id} className="text-sm font-medium text-slate-900">
      ${product.price}
    </div>,
    <div key={product.id} className="text-sm text-slate-600">
      {product.sales}
    </div>,
    <div key={product.id} className="text-sm font-medium text-emerald-600">
      ${product.revenue}
    </div>,
    <div key={product.id} className="flex items-center gap-1">
      <Star className="h-4 w-4 text-amber-400 fill-current" />
      <span className="text-sm text-slate-600">{product.rating}</span>
    </div>
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Products</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={["Product", "Price", "Sales", "Revenue", "Rating"]}
          rows={rows}
        />
      </CardContent>
    </Card>
  );
};

// Sales by Category Component
const SalesByCategory = ({ categories }: { categories: any[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {categories.map((category, index) => (
            <div key={category.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cls("w-3 h-3 rounded-full", 
                  index === 0 ? "bg-blue-500" :
                  index === 1 ? "bg-emerald-500" :
                  index === 2 ? "bg-amber-500" :
                  index === 3 ? "bg-red-500" :
                  "bg-purple-500"
                )}></div>
                <span className="text-sm font-medium text-slate-900">{category.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 bg-slate-200 rounded-full h-2">
                  <div 
                    className={cls("h-2 rounded-full", 
                      index === 0 ? "bg-blue-500" :
                      index === 1 ? "bg-emerald-500" :
                      index === 2 ? "bg-amber-500" :
                      index === 3 ? "bg-red-500" :
                      "bg-purple-500"
                    )}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium text-slate-900 w-16 text-right">{category.percentage}%</span>
                <span className="text-sm text-slate-600 w-20 text-right">${category.sales}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default function AdminReportsPage() {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: '',
    reportType: '',
    category: '',
    search: ''
  });

  // Mock data for demonstration
  const [analyticsData, setAnalyticsData] = useState({
    totalRevenue: 125000,
    totalOrders: 1250,
    totalCustomers: 850,
    conversionRate: 3.2,
    averageOrderValue: 100,
    topProducts: [
      { id: 1, name: "iPhone 15 Pro", category: "Electronics", price: 999, sales: 45, revenue: 44955, rating: 4.8 },
      { id: 2, name: "MacBook Air M2", category: "Electronics", price: 1199, sales: 32, revenue: 38368, rating: 4.9 },
      { id: 3, name: "AirPods Pro", category: "Electronics", price: 249, sales: 78, revenue: 19422, rating: 4.7 },
      { id: 4, name: "Nike Air Max", category: "Clothing", price: 120, sales: 65, revenue: 7800, rating: 4.6 },
      { id: 5, name: "Samsung Galaxy S24", category: "Electronics", price: 799, sales: 28, revenue: 22372, rating: 4.8 }
    ],
    categories: [
      { name: "Electronics", sales: 125000, percentage: 45 },
      { name: "Clothing", sales: 45000, percentage: 20 },
      { name: "Books", sales: 35000, percentage: 15 },
      { name: "Home & Garden", sales: 30000, percentage: 12 },
      { name: "Sports", sales: 20000, percentage: 8 }
    ]
  });

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleExport = (format: string) => {
    console.log(`Exporting report as ${format}`);
    // In a real app, this would trigger the actual export functionality
    alert(`Exporting report as ${format.toUpperCase()}...`);
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
          <p className="mt-2 text-slate-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <>

      {/* Export Options */}
      <div className="mb-6">
        <ExportOptions onExport={handleExport} />
      </div>
      
      {/* Filters */}
      <ReportFilters filters={filters} onFilterChange={handleFilterChange} />
      
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        <KpiCard
          title="Total Revenue"
          value={`$${(analyticsData.totalRevenue / 1000).toFixed(0)}K`}
          change="+12.5% from last month"
          icon={DollarSign}
          trend="up"
          color="green"
        />
        <KpiCard
          title="Total Orders"
          value={analyticsData.totalOrders.toLocaleString()}
          change="+8.2% from last month"
          icon={ShoppingCart}
          trend="up"
          color="blue"
        />
        <KpiCard
          title="Total Customers"
          value={analyticsData.totalCustomers.toLocaleString()}
          change="+15.3% from last month"
          icon={Users}
          trend="up"
          color="purple"
        />
        <KpiCard
          title="Conversion Rate"
          value={`${analyticsData.conversionRate}%`}
          change="+0.3% from last month"
          icon={Target}
          trend="up"
          color="amber"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <AdvancedChart
          title="Revenue Trends"
          type="line"
          data={[]}
          height="h-80"
        />
        <AdvancedChart
          title="Sales Distribution"
          type="pie"
          data={[]}
          height="h-80"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <AdvancedChart
          title="Order Volume"
          type="bar"
          data={[]}
          height="h-80"
        />
        <AdvancedChart
          title="Customer Acquisition"
          type="area"
          data={[]}
          height="h-80"
        />
      </div>

      {/* Data Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TopProductsTable products={analyticsData.topProducts} />
        <SalesByCategory categories={analyticsData.categories} />
      </div>
    </>
  );
}