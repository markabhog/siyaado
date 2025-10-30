"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Gauge, 
  ShoppingCart, 
  Package, 
  Users, 
  Banknote, 
  BarChart3, 
  Megaphone, 
  Settings, 
  Search, 
  Bell, 
  Sun, 
  Moon, 
  ChevronRight,
  Truck,
  CreditCard
} from "lucide-react";

const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(' ');

// Sidebar Component
const Sidebar = ({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (collapsed: boolean) => void }) => {
  const pathname = usePathname();
  
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <Gauge className="h-5 w-5" />, href: '/admin/dashboard' },
    { key: 'orders', label: 'Orders', icon: <ShoppingCart className="h-5 w-5" />, href: '/admin/orders' },
    { key: 'products', label: 'Products', icon: <Package className="h-5 w-5" />, href: '/admin/products' },
    { key: 'vendors', label: 'Vendors', icon: <Truck className="h-5 w-5" />, href: '/admin/vendors' },
    { key: 'transactions', label: 'Transactions', icon: <Banknote className="h-5 w-5" />, href: '/admin/payments' },
    { key: 'customers', label: 'Customers', icon: <Users className="h-5 w-5" />, href: '/admin/customers' },
    { key: 'marketing', label: 'Marketing', icon: <Megaphone className="h-5 w-5" />, href: '/admin/marketing' },
    { key: 'reports', label: 'Reports', icon: <BarChart3 className="h-5 w-5" />, href: '/admin/reports' },
    { key: 'settings', label: 'Settings', icon: <Settings className="h-5 w-5" />, href: '/admin/settings' }
  ];

  return (
    <aside
      className={cls(
        'group relative text-slate-100 flex flex-col py-6 px-4 overflow-hidden bg-gradient-to-b from-slate-900 via-slate-800 to-slate-700 transition-all duration-300 shadow-2xl',
        collapsed ? 'w-20 hover:w-72' : 'w-72'
      )}
    >
      {/* Enhanced decor */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-56 h-56 rounded-full bg-blue-600/20 blur-3xl"/>
      <div className="pointer-events-none absolute bottom-0 left-0 w-72 h-24 bg-gradient-to-r from-blue-500/5 to-transparent"/>
      <div className="pointer-events-none absolute top-1/2 -right-5 w-32 h-32 rounded-full bg-indigo-500/10 blur-2xl"/>
      {/* Brand */}
      <div className="flex items-center gap-3 px-2 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 grid place-items-center font-extrabold text-slate-900">
          L
        </div>
        <div className={cls('transition-all duration-200 origin-left', collapsed ? 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100' : 'opacity-100')}>
          <div className="text-lg font-bold tracking-wide">Luul Admin</div>
          <div className="text-[11px] text-slate-400">Control Center</div>
        </div>
        <button
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? 'Expand' : 'Collapse'}
          className="ml-auto text-slate-300 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <ChevronRight className={cls("w-5 h-5 transition-transform", collapsed ? "rotate-0" : "rotate-180")} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={cls(
                'group/item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative hover:scale-[1.02]',
                isActive ? 'bg-gradient-to-r from-blue-600/20 to-indigo-600/20 ring-1 ring-white/20 shadow-lg backdrop-blur-sm' : 'hover:bg-white/10 hover:backdrop-blur-sm'
              )}
            >
              <span className={cls('absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full transition-all duration-200', isActive ? 'bg-blue-400 shadow-lg' : 'bg-transparent group-hover/item:bg-blue-300/60')} />
              <span className={cls('transition-all duration-200', isActive ? 'text-white scale-110' : 'text-slate-200 group-hover/item:text-white group-hover/item:scale-105')}>{item.icon}</span>
              <span className={cls('text-sm font-medium transition-all duration-200 origin-left', isActive ? 'text-white' : 'text-slate-300 group-hover/item:text-white', collapsed ? 'opacity-0 scale-x-0 group-hover:opacity-100 group-hover:scale-x-100' : 'opacity-100')}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Enhanced Footer */}
      <div className="mt-auto pt-6">
        <div className={cls('mx-2 p-3 rounded-xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/10', collapsed ? 'opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100' : 'opacity-100')}>
          <div className="text-xs text-slate-400 mb-1">System Status</div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"/>
            <span className="text-slate-200">All systems operational</span>
          </div>
        </div>
        <div className={cls('mt-3 mx-2 flex items-center gap-3 p-3 rounded-xl bg-white/5 ring-1 ring-white/10 backdrop-blur-sm transition-all duration-200 hover:bg-white/10', collapsed ? 'opacity-0 scale-y-0 group-hover:opacity-100 group-hover:scale-y-100' : 'opacity-100')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-fuchsia-500 shadow-lg" />
          <div className="text-sm">
            <div className="font-semibold leading-tight text-white">Admin</div>
            <div className="text-[11px] text-slate-400">admin@luul.com</div>
          </div>
          <button className="ml-auto text-xs px-2 py-1 rounded-lg bg-white/10 hover:bg-white/15 transition-all duration-200 hover:scale-105">
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

// Topbar Component
const Topbar = ({ title, subtitle, dark, setDark, onThemeToggle }: { 
  title: string; 
  subtitle?: string; 
  dark: boolean; 
  setDark: (dark: boolean) => void;
  onThemeToggle: (newDark: boolean) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Implement search functionality based on current page
      console.log('Searching for:', query);
      
      // Show a simple alert for now - you can implement more sophisticated search later
      alert(`Searching for: "${query}"\n\nThis will search across:\n- Products\n- Orders\n- Customers\n- Vendors\n\nSearch functionality can be enhanced to filter data in real-time.`);
    }
  };


  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div>
          <div className="flex items-center text-sm text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-800 dark:text-slate-200">Admin</span>
            <ChevronRight className="mx-1 h-4 w-4" />
            <span className="font-medium text-slate-800 dark:text-slate-200">{title}</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          <p className="text-sm text-slate-600 dark:text-slate-400">{subtitle || "Manage your e-commerce store with powerful tools and insights."}</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Current theme: {dark ? 'Dark' : 'Light'}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <input
            className="w-64 rounded-xl border border-slate-300 bg-white pl-4 pr-12 py-2 text-sm outline-none ring-indigo-500 focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            placeholder="Search products, orders, customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch(searchQuery);
              }
            }}
          />
          <button
            onClick={() => handleSearch(searchQuery)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Search"
          >
            <Search className="h-4 w-4 text-slate-400" />
          </button>
        </div>
        <button className="inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 h-10 px-4 text-sm">
          <Bell className="h-5 w-5" />
        </button>
        <button 
          onClick={() => onThemeToggle(!dark)}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 border border-slate-300 text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 h-10 px-4 text-sm hover:scale-105"
          title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {dark ? <Sun className="h-5 w-5 transition-transform duration-300" /> : <Moon className="h-5 w-5 transition-transform duration-300" />}
        </button>
      </div>
    </div>
  );
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sidebar-collapsed') === 'true';
    }
    return false;
  });
  const [dark, setDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      return storedTheme === 'dark';
    }
    return false; // Default to light mode
  });

  // Persist sidebar state
  const handleSidebarToggle = (newCollapsed: boolean) => {
    setCollapsed(newCollapsed);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', newCollapsed.toString());
    }
  };

  // Persist theme state
  const handleThemeToggle = (newDark: boolean) => {
    setDark(newDark);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newDark ? 'dark' : 'light');
      // Force update the document class immediately
      if (newDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        document.body.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        document.body.classList.remove('dark-mode');
      }
    }
  };

  // Apply theme to document element
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (dark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        document.body.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        document.body.classList.remove('dark-mode');
      }
    }
  }, [dark]);

  // Initialize theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem('theme');
      const isDark = storedTheme === 'dark';
      setDark(isDark);
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
        document.body.classList.add('dark-mode');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
        document.body.classList.remove('dark-mode');
      }
    }
  }, []);

  // Get page title and subtitle based on current path
  const getTitleAndSubtitle = (path: string) => {
    if (path.startsWith('/admin/dashboard')) return { title: 'Dashboard', subtitle: 'Welcome back! Here\'s what\'s happening with your store.' };
    if (path.startsWith('/admin/orders')) return { title: 'Orders', subtitle: 'Manage and track all orders' };
    if (path.startsWith('/admin/products')) return { title: 'Products', subtitle: 'Manage your product catalog' };
    if (path.startsWith('/admin/vendors')) return { title: 'Vendors', subtitle: 'Manage your store\'s vendors and resellers.' };
    if (path.startsWith('/admin/payments')) return { title: 'Transactions', subtitle: 'Review and verify all payment transactions' };
    if (path.startsWith('/admin/customers')) return { title: 'Customers', subtitle: 'Manage your store\'s customer base.' };
    if (path.startsWith('/admin/marketing')) return { title: 'Marketing', subtitle: 'Manage your campaigns and discount coupons.' };
    if (path.startsWith('/admin/reports')) return { title: 'Reports', subtitle: 'Comprehensive analytics and business insights with export capabilities.' };
    if (path.startsWith('/admin/settings')) return { title: 'Settings', subtitle: 'Configure your store settings and preferences.' };
    return { title: 'Admin Panel', subtitle: 'Welcome to the administration panel.' };
  };

  const pathname = usePathname();
  const { title, subtitle } = getTitleAndSubtitle(pathname);

  return (
    <div 
      className={cls("min-h-screen w-full font-inter antialiased transition-all duration-300", dark ? "dark" : "")}
      style={{
        backgroundColor: dark ? '#0f172a' : '#f8fafc',
        color: dark ? '#f1f5f9' : '#1e293b',
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}
    >
      <div 
        className="flex min-h-screen bg-slate-50 dark:bg-slate-950 transition-all duration-300"
        style={{
          backgroundColor: dark ? '#0f172a' : '#f8fafc',
          transition: 'background-color 0.3s ease'
        }}
      >
        <Sidebar collapsed={collapsed} setCollapsed={handleSidebarToggle} />
        <main className="flex-1 p-4 md:p-8 transition-all duration-300">
          <Topbar 
            title={title} 
            subtitle={subtitle} 
            dark={dark} 
            setDark={setDark}
            onThemeToggle={handleThemeToggle}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
