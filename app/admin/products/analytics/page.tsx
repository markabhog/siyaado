"use client";
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";

const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(' ');

// Product Analytics Component
const ProductAnalytics = () => {
  const [analytics, setAnalytics] = useState<{
    topSelling: Array<Record<string, unknown>>;
    lowStock: Array<Record<string, unknown>>;
    outOfStock: Array<Record<string, unknown>>;
    recentlyAdded: Array<Record<string, unknown>>;
    categories: Array<Record<string, unknown>>;
  }>({
    topSelling: [],
    lowStock: [],
    outOfStock: [],
    recentlyAdded: [],
    categories: []
  });

  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    // Mock analytics data
    const mockAnalytics = {
      topSelling: [
        { id: '1', title: 'iPhone 15 Pro', sales: 45, revenue: 4495500 },
        { id: '2', title: 'MacBook Air M2', sales: 32, revenue: 4156800 },
        { id: '3', title: 'AirPods Pro', sales: 67, revenue: 1668300 }
      ],
      lowStock: [
        { id: '4', title: 'iPad Pro', stock: 3, threshold: 10 },
        { id: '5', title: 'Apple Watch', stock: 7, threshold: 10 }
      ],
      outOfStock: [
        { id: '6', title: 'Samsung Galaxy', stock: 0 },
        { id: '7', title: 'Dell Laptop', stock: 0 }
      ],
      recentlyAdded: [
        { id: '8', title: 'New Product 1', addedDate: '2024-01-20' },
        { id: '9', title: 'New Product 2', addedDate: '2024-01-19' }
      ],
      categories: [
        { name: 'Electronics', count: 45, percentage: 60 },
        { name: 'Accessories', count: 20, percentage: 27 },
        { name: 'Books', count: 10, percentage: 13 }
      ]
    };
    
    setAnalytics(mockAnalytics);
  }, [timeRange]);

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex gap-2">
        {['7d', '30d', '90d', '1y'].map(range => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
              timeRange === range
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {range}
          </button>
        ))}
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Selling Products</h3>
          <div className="space-y-3">
            {analytics.topSelling.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-slate-900">{String(product.title || '')}</div>
                    <div className="text-sm text-slate-500">{String(product.sales || 0)} sales</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-slate-900">${((Number(product.revenue) || 0) / 100).toFixed(2)}</div>
                  <div className="text-sm text-slate-500">revenue</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Stock Alerts</h3>
          
          {/* Low Stock */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-yellow-700 mb-2">Low Stock ({analytics.lowStock.length})</h4>
            <div className="space-y-2">
              {analytics.lowStock.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-yellow-50 rounded">
                  <span className="text-sm text-slate-700">{String(product.title || '')}</span>
                  <span className="text-sm font-semibold text-yellow-700">{String(product.stock || 0)} left</span>
                </div>
              ))}
            </div>
          </div>

          {/* Out of Stock */}
          <div>
            <h4 className="text-sm font-medium text-red-700 mb-2">Out of Stock ({analytics.outOfStock.length})</h4>
            <div className="space-y-2">
              {analytics.outOfStock.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                  <span className="text-sm text-slate-700">{String(product.title || '')}</span>
                  <span className="text-sm font-semibold text-red-700">0 in stock</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {analytics.categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded"></div>
                  <span className="text-sm font-medium text-slate-700">{String(category.name || '')}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-slate-900">{String(category.count || 0)} products</div>
                  <div className="text-xs text-slate-500">{String(category.percentage || 0)}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recently Added</h3>
          <div className="space-y-3">
            {analytics.recentlyAdded.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">{String(product.title || '')}</div>
                  <div className="text-sm text-slate-500">Added {String(product.addedDate || '')}</div>
                </div>
                <div className="text-xs text-slate-400">New</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAnalytics;
