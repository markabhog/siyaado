"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { ProductCard as SharedProductCard } from '@/app/components/ProductCard';

interface Deal {
  id: string;
  title: string;
  description: string;
  discount: number;
  originalPrice: number;
  salePrice: number;
  image: string;
  endTime: string;
  stock: number;
  sold: number;
  category: string;
  isFlashSale?: boolean;
  isLimitedTime?: boolean;
}

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  images: string[];
  slug: string;
  rating: number;
  reviewCount: number;
  stock: number;
  category: string;
  discount?: number;
}

const DealCard = ({ deal, index }: { deal: Deal; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 group"
  >
    <div className="relative h-48">
      <Image
        src={deal.image}
        alt={deal.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      
      {/* Deal Badges */}
      <div className="absolute top-3 left-3 flex flex-col gap-2">
        {deal.isFlashSale && (
          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            🔥 FLASH SALE
          </span>
        )}
        {deal.isLimitedTime && (
          <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            ⏰ LIMITED TIME
          </span>
        )}
      </div>

      {/* Discount Badge */}
      <div className="absolute top-3 right-3">
        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          -{deal.discount}%
        </span>
      </div>

      {/* Time Left and Stock bar */}
      <div className="absolute bottom-3 left-3 right-3 space-y-2">
        <div className="bg-black/70 text-white px-3 py-2 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span>⏰ Ends in: {deal.endTime}</span>
            <span>Stock: {deal.stock - deal.sold}</span>
          </div>
        </div>
        <div className="w-full h-2 bg-white/70 rounded-full overflow-hidden">
          <div className="h-full bg-red-500" style={{ width: `${Math.min(100, Math.round((deal.sold / Math.max(1, deal.stock + deal.sold)) * 100))}%` }} />
        </div>
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
        {deal.title}
      </h3>
      
      <p className="text-sm text-slate-600 mb-3 line-clamp-2">
        {deal.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900">
            ${(deal.salePrice / 100).toFixed(2)}
          </span>
          <span className="text-sm text-slate-500 line-through">
            ${(deal.originalPrice / 100).toFixed(2)}
          </span>
        </div>
        <div className="text-sm text-slate-500">
          {deal.stock > 0 ? `${deal.stock} left` : 'Sold out'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" className="col-span-1">
          View Deal
        </Button>
        <Button className="col-span-1 bg-blue-600 hover:bg-blue-700 text-white">
          Options
        </Button>
      </div>
    </div>
  </motion.div>
);

const ProductCard = ({ product, index }: { product: Product; index: number }) => {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
  >
    <div className="relative h-48 cursor-pointer" onClick={() => router.push(`/product/${product.slug}`)}>
      <Image
        src={product.images[0]}
        alt={product.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      
      {product.discount && (
        <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
          -{product.discount}%
        </span>
      )}

      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-col gap-2">
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-blue-50">
            ❤️
          </button>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-blue-50">
            👁️
          </button>
        </div>
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
        {product.title}
      </h3>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className={`text-sm ${
                i < Math.floor(product.rating)
                  ? 'text-yellow-400'
                  : 'text-slate-300'
              }`}
            >
              ⭐
            </span>
          ))}
        </div>
        <span className="text-sm text-slate-600">({product.reviewCount})</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900">
            ${(product.price / 100).toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-slate-500 line-through">
              ${(product.originalPrice / 100).toFixed(2)}
            </span>
          )}
        </div>
        <div className="text-sm text-slate-500">
          {product.stock > 0 ? `${product.stock} left` : 'Out of stock'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button onClick={() => router.push(`/product/${product.slug}`)} className="bg-blue-600 hover:bg-blue-700 text-white" disabled={product.stock === 0}>
          Options
        </Button>
        <Button 
          onClick={() => { addItem({ productId: product.id, slug: product.slug, title: product.title, price: product.price }, 1); try { window.dispatchEvent(new CustomEvent('eco:cart-open')); } catch {} }}
          className="bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100"
          disabled={product.stock === 0}
        >
          🛒 Add to Cart
        </Button>
      </div>
    </div>
  </motion.div>
);
}

export default function DealsPage() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');

  useEffect(() => {
    fetchDealsData();
  }, []);

  const fetchDealsData = async () => {
    try {
      setLoading(true);
      setDeals(getMockDeals());
      setProducts(getMockProducts());
    } catch (error) {
      console.error('Error fetching deals data:', error);
      setDeals(getMockDeals());
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockDeals = (): Deal[] => [
    {
      id: '1',
      title: 'Flash Sale: Premium Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      discount: 50,
      originalPrice: 29999,
      salePrice: 14999,
      image: '/api/placeholder/400/300',
      endTime: '2h 30m',
      stock: 15,
      sold: 85,
      category: 'Electronics',
      isFlashSale: true,
      isLimitedTime: true
    },
    {
      id: '2',
      title: 'Limited Time: Smart Watch',
      description: 'Advanced fitness tracking with heart rate monitor',
      discount: 40,
      originalPrice: 39999,
      salePrice: 23999,
      image: '/api/placeholder/400/300',
      endTime: '5h 15m',
      stock: 8,
      sold: 92,
      category: 'Electronics',
      isFlashSale: true
    },
    {
      id: '3',
      title: 'Weekend Special: Coffee Maker',
      description: 'Professional-grade espresso machine for home use',
      discount: 35,
      originalPrice: 19999,
      salePrice: 12999,
      image: '/api/placeholder/400/300',
      endTime: '1d 2h',
      stock: 25,
      sold: 75,
      category: 'Home & Kitchen',
      isLimitedTime: true
    }
  ];

  const getMockProducts = (): Product[] => [
    {
      id: '1',
      title: 'Wireless Bluetooth Speaker',
      price: 7999,
      originalPrice: 11999,
      images: ['/api/placeholder/300/300'],
      slug: 'wireless-bluetooth-speaker',
      rating: 4.5,
      reviewCount: 128,
      stock: 50,
      category: 'Electronics',
      discount: 33
    },
    {
      id: '2',
      title: 'Smart Fitness Tracker',
      price: 12999,
      images: ['/api/placeholder/300/300'],
      slug: 'smart-fitness-tracker',
      rating: 4.7,
      reviewCount: 89,
      stock: 30,
      category: 'Electronics'
    },
    {
      id: '3',
      title: 'Premium Coffee Beans',
      price: 2499,
      originalPrice: 3499,
      images: ['/api/placeholder/300/300'],
      slug: 'premium-coffee-beans',
      rating: 4.3,
      reviewCount: 156,
      stock: 100,
      category: 'Food & Beverage',
      discount: 29
    }
  ];

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return b.id.localeCompare(a.id);
      default:
        return b.reviewCount - a.reviewCount;
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading amazing deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-500 to-orange-500 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <h1 className="text-4xl font-bold text-white">Hot Deals & Flash Sales</h1>
            <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
          <p className="text-xl text-orange-100 mb-8">
            Limited time offers with massive discounts. Don't miss out!
          </p>
          <div className="flex items-center justify-center gap-8 text-orange-100">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
              </svg>
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,7C13.4,7 14.8,8.6 14.8,10V11.5C15.4,11.5 16,12.4 16,13V16C16,16.6 15.6,17 15,17H9C8.4,17 8,16.6 8,16V13C8,12.4 8.4,11.5 9,11.5V10C9,8.6 10.6,7 12,7M12,8.2C11.2,8.2 10.2,9.2 10.2,10V11.5H13.8V10C13.8,9.2 12.8,8.2 12,8.2Z"/>
              </svg>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              <span>Best Prices</span>
            </div>
          </div>
        </div>
      </section>

      {/* Deals Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Flash Sales</h2>
              <p className="text-slate-600">Limited time offers ending soon</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="popular">Most Popular</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
              <Button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {viewMode === 'grid' ? '📋 List View' : '⊞ Grid View'}
              </Button>
            </div>
          </div>

          {deals.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No deals found</h3>
              <p className="text-slate-600">Check back later for amazing deals!</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' 
              : 'space-y-4'
            }>
              <AnimatePresence>
                {deals.map((deal, index) => (
                  <DealCard key={deal.id} deal={deal} index={index} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Products</h2>
              <p className="text-slate-600">Best deals on popular items</p>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-600">Check back later for amazing products!</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'space-y-4'
            }>
              <AnimatePresence>
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <SharedProductCard
                      slug={product.slug}
                      title={product.title}
                      price={product.price}
                      image={product.images?.[0]}
                      discount={product.discount}
                      onAddToCart={() => addItem({ productId: product.id, slug: product.slug, title: product.title, price: product.price }, 1)}
                      onBuyNow={() => { addItem({ productId: product.id, slug: product.slug, title: product.title, price: product.price }, 1); router.push('/checkout'); }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Luul</h3>
              <p className="text-slate-400 mb-4">
                Discover amazing deals and flash sales on your favorite products.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-sm">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-sm">t</span>
                </div>
                <div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center">
                  <span className="text-sm">i</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Deal Categories</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/deals" className="hover:text-white">Flash Sales</Link></li>
                <li><Link href="/deals" className="hover:text-white">Limited Time</Link></li>
                <li><Link href="/deals" className="hover:text-white">Weekend Specials</Link></li>
                <li><Link href="/deals" className="hover:text-white">Clearance</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/shipping" className="hover:text-white">Shipping Info</Link></li>
                <li><Link href="/returns" className="hover:text-white">Returns</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link href="/press" className="hover:text-white">Press</Link></li>
                <li><Link href="/reseller" className="hover:text-white">Sell on Luul</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 Luul. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}