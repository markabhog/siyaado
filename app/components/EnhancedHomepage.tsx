"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye, 
  TrendingUp, 
  Clock, 
  Truck, 
  Shield, 
  ArrowRight,
  Search,
  Filter,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
  Zap,
  Award,
  Users,
  DollarSign
} from 'lucide-react';

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
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  productCount: number;
}

interface HomepageData {
  featuredProducts: Product[];
  onSaleProducts: Product[];
  topRatedProducts: Product[];
  newArrivals: Product[];
  categories: Category[];
  banners: {
    hero: string;
    deals: string;
    categories: string[];
  };
}

export default function EnhancedHomepage() {
  const [data, setData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('featured');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchHomepageData();
  }, []);

  const fetchHomepageData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/homepage');
      if (response.ok) {
        const homepageData = await response.json();
        setData(homepageData);
      } else {
        // Fallback to mock data
        setData(getMockData());
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
      setData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = (): HomepageData => ({
    featuredProducts: [
      {
        id: '1',
        title: 'Wireless Bluetooth Headphones',
        price: 12999,
        originalPrice: 15999,
        images: ['/api/placeholder/300/300'],
        slug: 'wireless-bluetooth-headphones',
        rating: 4.8,
        reviewCount: 156,
        stock: 45,
        category: 'Electronics',
        isFeatured: true,
        discount: 19
      },
      {
        id: '2',
        title: 'Smart Fitness Watch',
        price: 29999,
        images: ['/api/placeholder/300/300'],
        slug: 'smart-fitness-watch',
        rating: 4.6,
        reviewCount: 89,
        stock: 12,
        category: 'Electronics',
        isNew: true
      }
    ],
    onSaleProducts: [
      {
        id: '3',
        title: 'Premium Coffee Maker',
        price: 8999,
        originalPrice: 12999,
        images: ['/api/placeholder/300/300'],
        slug: 'premium-coffee-maker',
        rating: 4.9,
        reviewCount: 67,
        stock: 8,
        category: 'Home & Kitchen',
        discount: 31
      }
    ],
    topRatedProducts: [
      {
        id: '4',
        title: 'Organic Cotton T-Shirt',
        price: 2499,
        images: ['/api/placeholder/300/300'],
        slug: 'organic-cotton-t-shirt',
        rating: 4.9,
        reviewCount: 234,
        stock: 78,
        category: 'Fashion'
      }
    ],
    newArrivals: [
      {
        id: '5',
        title: 'Bluetooth Speaker',
        price: 7999,
        images: ['/api/placeholder/300/300'],
        slug: 'bluetooth-speaker',
        rating: 4.7,
        reviewCount: 45,
        stock: 25,
        category: 'Electronics',
        isNew: true
      }
    ],
    categories: [
      { id: '1', name: 'Electronics', slug: 'electronics', image: '/api/placeholder/200/200', productCount: 245 },
      { id: '2', name: 'Fashion', slug: 'fashion', image: '/api/placeholder/200/200', productCount: 189 },
      { id: '3', name: 'Home & Garden', slug: 'home-garden', image: '/api/placeholder/200/200', productCount: 156 }
    ],
    banners: {
      hero: '/api/placeholder/1200/400',
      deals: '/api/placeholder/800/300',
      categories: ['/api/placeholder/400/200', '/api/placeholder/400/200']
    }
  });

  const getCurrentProducts = () => {
    if (!data) return [];
    switch (activeTab) {
      case 'featured': return data.featuredProducts;
      case 'sale': return data.onSaleProducts;
      case 'top-rated': return data.topRatedProducts;
      case 'new': return data.newArrivals;
      default: return data.featuredProducts;
    }
  };

  const ProductCard = ({ product, index }: { product: Product; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      <div className="relative h-48">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={index < 4}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              NEW
            </span>
          )}
          {product.discount && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{product.discount}%
            </span>
          )}
          {product.isFeatured && (
            <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              FEATURED
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex flex-col gap-2">
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-blue-50">
              <Heart className="h-4 w-4 text-slate-600" />
            </button>
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-blue-50">
              <Eye className="h-4 w-4 text-slate-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-slate-500 uppercase tracking-wide">{product.category}</span>
        </div>
        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-slate-300'
                }`}
              />
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

        <div className="flex gap-2">
          <Link href={`/product/${product.slug}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
          <Button 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading amazing products...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Something went wrong</h2>
          <p className="text-slate-600 mb-6">We're working to fix this issue. Try again.</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <section className="relative h-96 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold text-white mb-6">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Shop the latest trends and find exactly what you're looking for
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Deals
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bar */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Free Shipping</div>
                <div className="text-sm text-slate-600">On orders over $50</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Secure Payment</div>
                <div className="text-sm text-slate-600">100% protected</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Fast Delivery</div>
                <div className="text-sm text-slate-600">Same day shipping</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <div className="font-semibold text-slate-900">Best Quality</div>
                <div className="text-sm text-slate-600">Premium products</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Shop by Category</h2>
            <p className="text-slate-600">Find exactly what you're looking for</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {data.categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <Link href={`/category/${category.slug}`}>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <span className="text-2xl">📱</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-slate-500">{category.productCount} products</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Products</h2>
              <p className="text-slate-600">Discover our most popular items</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mb-8 bg-slate-100 rounded-lg p-1 w-fit">
            {[
              { id: 'featured', label: 'Featured', icon: <Star className="h-4 w-4" /> },
              { id: 'sale', label: 'On Sale', icon: <TrendingUp className="h-4 w-4" /> },
              { id: 'top-rated', label: 'Top Rated', icon: <Award className="h-4 w-4" /> },
              { id: 'new', label: 'New Arrivals', icon: <Zap className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Products Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={viewMode === 'grid' 
                ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                : 'space-y-4'
              }
            >
              {getCurrentProducts().map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>

          {getCurrentProducts().length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
              <p className="text-slate-600">Try adjusting your filters or check back later</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Start Shopping?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of happy customers and discover amazing products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/search">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                <Search className="h-5 w-5 mr-2" />
                Search Products
              </Button>
            </Link>
            <Link href="/category/electronics">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
