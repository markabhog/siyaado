"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/app/components/ui";
import { 
  Megaphone,
  CreditCard,
  Users,
  BarChart3,
  Plus,
  CheckCircle2,
  Clock8,
  TrendingUp,
  Mail,
  Gift,
  Target,
  Calendar
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
    Running: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    Scheduled: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
    Paused: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    Expired: "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300",
    Inactive: "bg-slate-100 text-slate-600 dark:bg-slate-500/15 dark:text-slate-300",
  };
  const iconMap: Record<string, React.ReactNode> = {
    Active: <CheckCircle2 className="h-3.5 w-3.5" />,
    Running: <CheckCircle2 className="h-3.5 w-3.5" />,
    Scheduled: <Clock8 className="h-3.5 w-3.5" />,
    Paused: <Clock8 className="h-3.5 w-3.5" />,
    Expired: <Clock8 className="h-3.5 w-3.5" />,
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

// Marketing Stats Component (Updated to use consistent design)
const MarketingStats = ({ stats }: { stats: any }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Active Campaigns</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-slate-900 dark:text-white">{stats.activeCampaigns}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-300">
            <Megaphone className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Total Coupons</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-300">{stats.totalCoupons}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-300">
            <Gift className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Email Subscribers</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-300">{stats.emailSubscribers}</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-300">
            <Mail className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="backdrop-blur">
        <CardHeader>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Campaign ROI</p>
        </CardHeader>
        <CardContent className="flex items-end justify-between">
          <div className="text-3xl font-bold text-orange-600 dark:text-orange-300">{stats.campaignROI}%</div>
          <div className="ml-4 grid h-10 w-10 place-items-center rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-300">
            <TrendingUp className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Campaign Table Component (Updated to use consistent design)
const CampaignTable = ({ campaigns, onStatusUpdate }: { campaigns: any[]; onStatusUpdate: (campaignId: string, status: string) => void }) => {
  const rows = campaigns.map((campaign) => [
    <div key={campaign.id}>
      <div className="text-sm font-medium text-slate-900">{campaign.name}</div>
      <div className="text-sm text-slate-500">ID: {campaign.id}</div>
    </div>,
    campaign.channel,
    <StatusPill key={campaign.id} status={campaign.status} />,
    <div key={campaign.id} className="flex items-center gap-1">
      <Calendar className="h-4 w-4 text-slate-400" />
      {campaign.starts}
    </div>,
    `$${(campaign.budget / 100).toFixed(2)}`,
    <div key={campaign.id} className="flex items-center gap-2">
      <Button
        onClick={() => onStatusUpdate(campaign.id, campaign.status === 'Running' ? 'Paused' : 'Running')}
        size="sm"
        variant="outline"
        className="text-xs"
      >
        {campaign.status === 'Running' ? 'Pause' : 'Resume'}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-xs"
      >
        Edit
      </Button>
    </div>
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={["Campaign", "Channel", "Status", "Start Date", "Budget", "Actions"]}
          rows={rows}
        />
      </CardContent>
    </Card>
  );
};

// Coupon Table Component (Updated to use consistent design)
const CouponTable = ({ coupons, onStatusUpdate }: { coupons: any[]; onStatusUpdate: (couponId: string, status: string) => void }) => {
  const rows = coupons.map((coupon) => [
    <div key={coupon.code} className="font-mono text-sm font-medium text-slate-900">{coupon.code}</div>,
    coupon.type,
    <div key={coupon.code} className="text-sm font-medium text-slate-900">
      {coupon.type === 'Percent' ? `${coupon.value}%` : 
       coupon.type === 'Fixed' ? `$${(coupon.value / 100).toFixed(2)}` : 
       'Free Shipping'}
    </div>,
    coupon.uses,
    <StatusPill key={coupon.code} status={coupon.status} />,
    <div key={coupon.code} className="flex items-center gap-2">
      <Button
        onClick={() => onStatusUpdate(coupon.code, coupon.status === 'Active' ? 'Expired' : 'Active')}
        size="sm"
        variant="outline"
        className="text-xs"
      >
        {coupon.status === 'Active' ? 'Deactivate' : 'Activate'}
      </Button>
      <Button
        size="sm"
        variant="outline"
        className="text-xs"
      >
        Edit
      </Button>
    </div>
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Coupons & Discounts</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={["Code", "Type", "Value", "Uses", "Status", "Actions"]}
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
      icon: <Megaphone className="h-6 w-6" />,
      title: "Create Campaign",
      desc: "Launch a new marketing campaign",
      onClick: () => console.log('Create Campaign')
    },
    {
      icon: <Gift className="h-6 w-6" />,
      title: "Generate Coupon",
      desc: "Create discount codes",
      onClick: () => console.log('Generate Coupon')
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Send Newsletter",
      desc: "Email your subscribers",
      onClick: () => console.log('Send Newsletter')
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "View Analytics",
      desc: "Check campaign performance",
      onClick: () => console.log('View Analytics')
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
      {actions.map((action, index) => (
        <Card key={index} className="group ring-1 ring-slate-200/60 dark:ring-slate-800 hover:shadow-md transition">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-indigo-600 to-sky-600 text-white shadow-sm">
              {action.icon}
            </div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{action.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{action.desc}</p>
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100">
              <Button size="sm" onClick={action.onClick} className="rounded-xl">Open</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function AdminMarketingPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState<any[]>([]);
  const [newBanner, setNewBanner] = useState<any>({ key: '', title: '', subtitle: '', imageUrl: '', ctaText: 'Shop now', ctaHref: '/', active: true, endsAt: null, discountPercent: null });
  const [showBannerForm, setShowBannerForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  
  // Mock data for demonstration
  useEffect(() => {
    const mockCampaigns = [
      {
        id: 'CMP-01',
        name: 'Black Friday Blast',
        channel: 'Banner + Push',
        status: 'Scheduled',
        starts: '2024-11-20',
        budget: 150000
      },
      {
        id: 'CMP-02',
        name: 'Back to School',
        channel: 'Email + SMS',
        status: 'Running',
        starts: '2024-08-15',
        budget: 90000
      },
      {
        id: 'CMP-03',
        name: 'Clearance Sale',
        channel: 'Homepage Tile',
        status: 'Paused',
        starts: '2024-09-01',
        budget: 40000
      }
    ];
    
    const mockCoupons = [
      {
        code: 'LUUL10',
        type: 'Percent',
        value: 10,
        uses: 152,
        status: 'Active'
      },
      {
        code: 'FREESHIP',
        type: 'Shipping',
        value: 0,
        uses: 88,
        status: 'Active'
      },
      {
        code: 'WELCOME5',
        type: 'Fixed',
        value: 500,
        uses: 240,
        status: 'Expired'
      }
    ];
    
    const mockStats = {
      activeCampaigns: 1,
      totalCoupons: 3,
      emailSubscribers: 2450,
      campaignROI: 340
    };
    
    setCampaigns(mockCampaigns);
    setCoupons(mockCoupons);
    setStats(mockStats);
    // Load banners
    fetch('/api/marketing/banners')
      .then(r => r.json())
      .then(data => setBanners(data.banners || []))
      .catch(() => setBanners([]));
    setLoading(false);
  }, []);
  
  const handleCampaignStatusUpdate = (campaignId: string, status: string) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === campaignId ? { ...campaign, status } : campaign
    ));
  };
  
  const handleCouponStatusUpdate = (couponCode: string, status: string) => {
    setCoupons(prev => prev.map(coupon => 
      coupon.code === couponCode ? { ...coupon, status } : coupon
    ));
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading marketing data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <>
      
      {/* Stats */}
      <MarketingStats stats={stats} />
      
      {/* Quick Actions */}
      <QuickActions />
      
      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CampaignTable campaigns={campaigns} onStatusUpdate={handleCampaignStatusUpdate} />
        <CouponTable coupons={coupons} onStatusUpdate={handleCouponStatusUpdate} />
      </div>

      {/* Enhanced Banners Manager */}
      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Hero Banners</CardTitle>
            <p className="text-sm text-slate-500 mt-1">Manage category hero banners displayed across your store</p>
          </div>
          <Button 
            onClick={() => {
              setShowBannerForm(!showBannerForm);
              setEditingBanner(null);
              setNewBanner({ key: '', title: '', subtitle: '', imageUrl: '', ctaText: 'Shop now', ctaHref: '/', active: true, endsAt: null, discountPercent: null });
              setImagePreview('');
            }}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {showBannerForm ? 'Cancel' : 'Add Banner'}
          </Button>
        </CardHeader>
      </Card>

      {/* Banner Form Modal */}
      {showBannerForm && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => {
            setShowBannerForm(false);
            setEditingBanner(null);
            setNewBanner({ key: '', title: '', subtitle: '', imageUrl: '', ctaText: 'Shop now', ctaHref: '/', active: true, discountPercent: null });
            setImagePreview('');
          }}
        >
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingBanner ? 'Edit Banner' : 'Create New Banner'}
              </h3>
              <button
                onClick={() => {
                  setShowBannerForm(false);
                  setEditingBanner(null);
                  setNewBanner({ key: '', title: '', subtitle: '', imageUrl: '', ctaText: 'Shop now', ctaHref: '/', active: true, endsAt: null, discountPercent: null });
                  setImagePreview('');
                }}
                className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Left Column - Form Fields */}
                <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Banner Placement <span className="text-red-500">*</span>
                      </label>
                      <select 
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newBanner.key} 
                        onChange={e => setNewBanner({ ...newBanner, key: e.target.value })}
                      >
                        <option value="">Select where this banner will appear...</option>
                        <optgroup label="Homepage - Hero Section (Top of page)">
                          <option value="homepage-hero">Homepage Hero (Main rotating banner)</option>
                        </optgroup>
                        <optgroup label="Homepage - Product Sections">
                          <option value="homepage-deals">Featured Deals Section</option>
                          <option value="homepage-offers">Special Offers Section</option>
                          <option value="homepage-sellers">Seller Banner (Start Selling Section)</option>
                        </optgroup>
                        <optgroup label="Category Pages">
                          <option value="electronics">Electronics Page</option>
                          <option value="beauty">Beauty Page</option>
                          <option value="books">Books Page</option>
                          <option value="fitness">Fitness Page</option>
                          <option value="furniture">Furniture Page</option>
                          <option value="gifts">Gifts Page</option>
                        </optgroup>
                        <optgroup label="Electronics Subcategory Pages">
                          <option value="laptops">Laptops</option>
                          <option value="smartphones">Smartphones</option>
                          <option value="cameras">Cameras</option>
                          <option value="gaming">Gaming</option>
                          <option value="wearables">Wearables</option>
                          <option value="audio">Audio</option>
                          <option value="home-tech">Home Tech</option>
                          <option value="networking">Networking</option>
                          <option value="smart-watches">Smart Watches</option>
                          <option value="storage">Storage</option>
                          <option value="accessories">Accessories</option>
                        </optgroup>
                      </select>
                      <p className="text-xs text-slate-500 mt-1">
                        💡 This determines WHERE the banner appears on your site
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Banner Title <span className="text-red-500">*</span>
                      </label>
                      <input 
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="e.g., Premium Electronics Collection" 
                        value={newBanner.title} 
                        onChange={e => setNewBanner({ ...newBanner, title: e.target.value })} 
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Subtitle
                      </label>
                      <input 
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="e.g., Up to 50% off on selected items" 
                        value={newBanner.subtitle} 
                        onChange={e => setNewBanner({ ...newBanner, subtitle: e.target.value })} 
                      />
                    </div>

                    {/* Only show discount percentage for homepage-deals */}
                    {newBanner.key === 'homepage-deals' && (
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Discount Percentage <span className="text-xs text-slate-500">(For Featured Deals)</span>
                        </label>
                        <input 
                          type="number"
                          min="0"
                          max="100"
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          placeholder="e.g., 30 (for 30% off)" 
                          value={newBanner.discountPercent || ''} 
                          onChange={e => setNewBanner({ ...newBanner, discountPercent: e.target.value ? parseInt(e.target.value) : null })} 
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          💡 Prices will be fetched from the linked product. This discount will be applied to calculate the sale price.
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                        Banner Image <span className="text-red-500">*</span>
                      </label>
                      
                      {/* Upload Button */}
                      <div className="mb-3">
                        <input
                          type="file"
                          id="banner-upload"
                          accept="image/*"
                          className="hidden"
                          disabled={uploading}
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setUploading(true);
                            const formData = new FormData();
                            formData.append('image', file);
                            formData.append('folder', 'banners');

                            try {
                              const response = await fetch('/api/admin/products/images', {
                                method: 'POST',
                                body: formData,
                              });

                              if (response.ok) {
                                const data = await response.json();
                                setNewBanner({ ...newBanner, imageUrl: data.url });
                                setImagePreview(data.url);
                              } else {
                                alert('Failed to upload image');
                              }
                            } catch (error) {
                              console.error('Error uploading image:', error);
                              alert('Error uploading image');
                            } finally {
                              setUploading(false);
                            }
                          }}
                        />
                        <label
                          htmlFor="banner-upload"
                          className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {uploading ? (
                            <>
                              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                              </svg>
                              Uploading...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                              </svg>
                              Upload Image
                            </>
                          )}
                        </label>
                        <span className="ml-2 text-sm text-slate-500">or enter URL below</span>
                      </div>

                      {/* URL Input */}
                      <input 
                        className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                        placeholder="/assets/banners/homehero.png or /uploads/banners/your-image.jpg" 
                        value={newBanner.imageUrl} 
                        onChange={e => {
                          setNewBanner({ ...newBanner, imageUrl: e.target.value });
                          setImagePreview(e.target.value);
                        }} 
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Recommended size: 1400x700px (Seller banner), 1920x600px (Hero), 800x600px (Mobile)
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Button Text
                        </label>
                        <input 
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          placeholder="Shop now" 
                          value={newBanner.ctaText} 
                          onChange={e => setNewBanner({ ...newBanner, ctaText: e.target.value })} 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          Button Link
                        </label>
                        <input 
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          placeholder="/electronics" 
                          value={newBanner.ctaHref} 
                          onChange={e => setNewBanner({ ...newBanner, ctaHref: e.target.value })} 
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                        <input 
                          type="checkbox" 
                          id="banner-active"
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          checked={newBanner.active} 
                          onChange={e => setNewBanner({ ...newBanner, active: e.target.checked })} 
                        />
                        <label htmlFor="banner-active" className="text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                          Active (Display this banner on the category page)
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                          End Date (for countdown timer) <span className="text-xs text-slate-500">(Optional)</span>
                        </label>
                        <input 
                          type="datetime-local"
                          className="w-full border border-slate-300 dark:border-slate-600 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                          value={newBanner.endsAt ? new Date(newBanner.endsAt).toISOString().slice(0, 16) : ''}
                          onChange={e => {
                            const endsAt = e.target.value ? new Date(e.target.value).toISOString() : null;
                            setNewBanner({ ...newBanner, endsAt });
                          }} 
                        />
                        <p className="text-xs text-slate-500 mt-1">
                          Set this to enable countdown timer. Leave empty for no timer.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button 
                        onClick={async () => {
                          if (!newBanner.key || !newBanner.title || !newBanner.imageUrl) {
                            alert('Please fill in all required fields (Placement, Title, Image URL)');
                            return;
                          }
                          
                          try {
                            const res = await fetch('/api/marketing/banners', { 
                              method: editingBanner ? 'PUT' : 'POST',
                              headers: {
                                'Content-Type': 'application/json'
                              },
                              body: JSON.stringify(editingBanner ? { ...newBanner, id: editingBanner.id } : newBanner) 
                            });
                            
                            if (!res.ok) {
                              const errorText = await res.text();
                              alert(`Error: ${errorText || 'Failed to save banner'}`);
                              return;
                            }

                            const data = await res.json();
                            
                            if (editingBanner) {
                              setBanners(prev => prev.map(b => b.id === editingBanner.id ? data.banner : b));
                            } else {
                              setBanners([data.banner, ...banners]);
                            }
                            setShowBannerForm(false);
                            setEditingBanner(null);
                            setNewBanner({ key: '', title: '', subtitle: '', imageUrl: '', ctaText: 'Shop now', ctaHref: '/', active: true, endsAt: null, discountPercent: null });
                            setImagePreview('');
                            alert('Banner created successfully!');
                          } catch (error) {
                            console.error('Error saving banner:', error);
                            alert(`Failed to save banner: ${error instanceof Error ? error.message : 'Unknown error'}`);
                          }
                        }}
                        className="flex-1"
                      >
                        {editingBanner ? 'Update Banner' : 'Create Banner'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowBannerForm(false);
                          setEditingBanner(null);
                          setNewBanner({ key: '', title: '', subtitle: '', imageUrl: '', ctaText: 'Shop now', ctaHref: '/', active: true, endsAt: null, discountPercent: null });
                          setImagePreview('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  {/* Right Column - Preview */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Live Preview
                    </label>
                    <div className="relative h-[400px] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl overflow-hidden border-2 border-slate-300 dark:border-slate-600">
                      {imagePreview || newBanner.imageUrl ? (
                        <img 
                          src={imagePreview || newBanner.imageUrl} 
                          alt="Banner preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-slate-400">
                            <svg className="mx-auto h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm">Enter an image URL to see preview</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Overlay with text preview */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-center">
                        <div className="p-8 max-w-xl">
                          <h3 className="text-3xl font-bold text-white mb-2">
                            {newBanner.title || 'Banner Title'}
                          </h3>
                          <p className="text-lg text-white/90 mb-4">
                            {newBanner.subtitle || (newBanner.key === 'homepage-deals' && newBanner.discountPercent ? `Save ${newBanner.discountPercent}% off!` : 'Banner subtitle will appear here')}
                          </p>
                          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition">
                            {newBanner.ctaText || 'Shop now'}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">💡 Banner Design Tips:</p>
                      <ul className="text-xs text-blue-700 dark:text-blue-400 space-y-1">
                        <li>• Use high-quality images (1920x600px recommended)</li>
                        <li>• Ensure text is readable with good contrast</li>
                        <li>• Keep titles concise and impactful</li>
                        <li>• Test on both desktop and mobile devices</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

      {/* Banners Grid Display */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Existing Banners</CardTitle>
        </CardHeader>
        <CardContent>
            {banners.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
                  <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No banners yet</h3>
                <p className="text-slate-500 dark:text-slate-400 mb-6">Create your first hero banner to get started</p>
                <Button onClick={() => setShowBannerForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Banner
                </Button>
              </div>
            ) : (
              <div className="grid gap-6">
                {banners.map((banner) => (
                  <motion.div
                    key={banner.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg transition-all duration-300"
                  >
                    <div className="grid md:grid-cols-3 gap-6 p-6">
                      {/* Banner Preview */}
                        <div className="relative h-48 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img 
                          src={banner.imageUrl} 
                          alt={banner.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          {/* Banner Type Badge */}
                          <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-lg">
                            {banner.key === 'homepage-hero' && '🏠 Homepage Hero'}
                            {banner.key === 'homepage-deals' && '⚡ Deals Section'}
                            {banner.key === 'homepage-offers' && '🎁 Offers Section'}
                            {banner.key === 'homepage-sellers' && '🛍️ Seller Section'}
                            {banner.key?.startsWith('electronics') || banner.key?.startsWith('beauty') || banner.key?.startsWith('books') || banner.key?.startsWith('fitness') || banner.key?.startsWith('furniture') || banner.key?.startsWith('gifts') ? `📂 ${banner.key.charAt(0).toUpperCase() + banner.key.slice(1)} Page` : `📄 ${banner.key || 'Unknown'}`}
                          </span>
                          {/* Active Status */}
                          {banner.active ? (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500 text-white shadow-lg">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-400 text-white shadow-lg">
                              Inactive
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Banner Details */}
                      <div className="md:col-span-2 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                {banner.title}
                              </h4>
                              {banner.subtitle && (
                                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                  {banner.subtitle}
                                </p>
                              )}
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                📍 Location: <span className="font-semibold">{banner.key}</span>
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-slate-500 dark:text-slate-400">Button:</span>
                              <span className="font-medium text-slate-900 dark:text-white">{banner.ctaText}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-slate-500 dark:text-slate-400">Link:</span>
                              <span className="font-mono text-xs text-blue-600 dark:text-blue-400 truncate">{banner.ctaHref}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingBanner(banner);
                              setNewBanner(banner);
                              setImagePreview(banner.imageUrl);
                              setShowBannerForm(true);
                            }}
                            className="flex-1"
                          >
                            Edit Banner
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              await fetch('/api/marketing/banners', { 
                                method: 'PUT', 
                                body: JSON.stringify({ ...banner, active: !banner.active }) 
                              });
                              setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, active: !b.active } : b));
                            }}
                            className="flex-1"
                          >
                            {banner.active ? 'Deactivate' : 'Activate'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this banner?')) {
                                await fetch(`/api/marketing/banners?id=${banner.id}`, { method: 'DELETE' });
                                setBanners(prev => prev.filter(b => b.id !== banner.id));
                              }
                            }}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
    </>
  );
}
