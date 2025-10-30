"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui";
import { 
  CreditCard,
  CheckCircle2,
  Clock8,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Search,
  Filter,
  Download,
  Eye,
  Shield,
  Banknote,
  Smartphone,
  Globe,
  Calendar,
  User,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft
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
    Verified: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Pending: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    Failed: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    Refunded: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    Processing: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
  };
  const iconMap: Record<string, React.ReactNode> = {
    Verified: <CheckCircle2 className="h-3.5 w-3.5" />,
    Pending: <Clock8 className="h-3.5 w-3.5" />,
    Failed: <AlertCircle className="h-3.5 w-3.5" />,
    Refunded: <ArrowDownLeft className="h-3.5 w-3.5" />,
    Processing: <Clock8 className="h-3.5 w-3.5" />,
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

// Payment Stats Component
const PaymentStats = ({ stats }: { stats: any }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Total Revenue</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">${(stats.totalRevenue / 100).toFixed(2)}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <DollarSign className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Verified Payments</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">{stats.verifiedPayments}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Pending Verification</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-amber-600 dark:text-amber-300">{stats.pendingPayments}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-300">
            <Clock8 className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Failed Transactions</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-red-600 dark:text-red-300">{stats.failedPayments}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-red-500/10 text-red-600 dark:text-red-300">
            <AlertCircle className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Payment Method Icon Component
const PaymentMethodIcon = ({ method }: { method: string }) => {
  const iconMap = {
    'credit_card': <CreditCard className="h-4 w-4" />,
    'debit_card': <CreditCard className="h-4 w-4" />,
    'paypal': <Globe className="h-4 w-4" />,
    'stripe': <Shield className="h-4 w-4" />,
    'apple_pay': <Smartphone className="h-4 w-4" />,
    'google_pay': <Smartphone className="h-4 w-4" />,
    'bank_transfer': <Banknote className="h-4 w-4" />,
    'cash': <DollarSign className="h-4 w-4" />,
  };
  
  return (
    <div className="flex items-center gap-2">
      {iconMap[method as keyof typeof iconMap] || <CreditCard className="h-4 w-4" />}
      <span className="text-sm font-medium capitalize">{method.replace('_', ' ')}</span>
    </div>
  );
};

// Payment Table Component
const PaymentTable = ({ payments, onVerifyPayment }: { payments: any[]; onVerifyPayment: (id: string) => void }) => {
  const rows = payments.map((payment) => [
    <div key={payment.id} className="flex items-center gap-2">
      <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
        <Receipt className="h-4 w-4 text-slate-600" />
      </div>
      <div>
        <div className="text-sm font-medium text-slate-900">{payment.id.slice(0, 8)}...</div>
        <div className="text-xs text-slate-500">{new Date(payment.createdAt).toISOString().slice(0, 10)}</div>
      </div>
    </div>,
    <div key={payment.id} className="text-lg font-semibold text-slate-900">
      ${(payment.amount / 100).toFixed(2)}
    </div>,
    <PaymentMethodIcon key={payment.id} method={payment.method} />,
    <div key={payment.id} className="text-sm text-slate-600">
      {payment.provider}
    </div>,
    <div key={payment.id} className="text-sm font-mono text-slate-600">
      {payment.reference || 'N/A'}
    </div>,
    <StatusPill key={payment.id} status={payment.verified ? 'Verified' : 'Pending'} />,
    <div key={payment.id} className="flex items-center gap-2">
      {!payment.verified ? (
        <Button
          onClick={() => onVerifyPayment(payment.id)}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white"
        >
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Verify
        </Button>
      ) : (
        <Button
          size="sm"
          variant="outline"
          className="text-emerald-600 border-emerald-200"
        >
          <CheckCircle2 className="h-4 w-4 mr-1" />
          Verified
        </Button>
      )}
      <Button size="sm" variant="outline">
        <Eye className="h-4 w-4" />
      </Button>
    </div>
  ]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payment Transactions</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={["Transaction", "Amount", "Method", "Provider", "Reference", "Status", "Actions"]}
          rows={rows}
        />
      </CardContent>
    </Card>
  );
};

// Filters Component
const PaymentFilters = ({ filters, onFilterChange }: { filters: any; onFilterChange: (filters: any) => void }) => {
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
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Payment Method</label>
            <select
              value={filters.method || ''}
              onChange={(e) => onFilterChange({ ...filters, method: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm dark:bg-slate-900 dark:border-slate-700 dark:text-slate-100"
            >
              <option value="">All Methods</option>
              <option value="credit_card">Credit Card</option>
              <option value="debit_card">Debit Card</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
              <option value="apple_pay">Apple Pay</option>
              <option value="google_pay">Google Pay</option>
            </select>
          </div>
          
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
                placeholder="Search transactions..."
                className="w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    verifiedPayments: 0,
    pendingPayments: 0,
    failedPayments: 0
  });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    method: '',
    dateRange: '',
    search: ''
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockPayments = [
      {
        id: 'pay_1234567890',
        amount: 12500,
        method: 'credit_card',
        provider: 'Stripe',
        reference: 'txn_abc123',
        verified: true,
        createdAt: new Date('2024-01-15')
      },
      {
        id: 'pay_1234567891',
        amount: 8500,
        method: 'paypal',
        provider: 'PayPal',
        reference: 'PP-456789',
        verified: false,
        createdAt: new Date('2024-01-14')
      },
      {
        id: 'pay_1234567892',
        amount: 25000,
        method: 'apple_pay',
        provider: 'Apple',
        reference: 'AP-789012',
        verified: true,
        createdAt: new Date('2024-01-13')
      },
      {
        id: 'pay_1234567893',
        amount: 15000,
        method: 'bank_transfer',
        provider: 'Bank of America',
        reference: 'BT-345678',
        verified: false,
        createdAt: new Date('2024-01-12')
      },
      {
        id: 'pay_1234567894',
        amount: 5000,
        method: 'google_pay',
        provider: 'Google',
        reference: 'GP-901234',
        verified: true,
        createdAt: new Date('2024-01-11')
      }
    ];

    const mockStats = {
      totalRevenue: 66000,
      verifiedPayments: 3,
      pendingPayments: 2,
      failedPayments: 0
    };

    setPayments(mockPayments);
    setStats(mockStats);
    setLoading(false);
  }, []);

  const handleVerifyPayment = (id: string) => {
    setPayments(prev => prev.map(payment => 
      payment.id === id ? { ...payment, verified: true } : payment
    ));
    setStats(prev => ({
      ...prev,
      verifiedPayments: prev.verifiedPayments + 1,
      pendingPayments: prev.pendingPayments - 1
    }));
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
          <p className="mt-2 text-slate-600">Loading payments...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      
      {/* Stats */}
      <PaymentStats stats={stats} />
      
      {/* Filters */}
      <PaymentFilters filters={filters} onFilterChange={handleFilterChange} />
      
      {/* Payments Table */}
      <PaymentTable payments={payments} onVerifyPayment={handleVerifyPayment} />
    </>
  );
}


