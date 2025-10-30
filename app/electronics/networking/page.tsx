"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui';
import { ProductCard as SharedProductCard } from '@/app/components/ProductCard';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { safeParseImages, safeParseAttributes, safeParseTags } from '@/lib/fetchCategoryProducts';
import { 
  Heart, 
  ShoppingCart, 
  Eye,
  Star,
  Wifi,
  Router,
  Cable,
  Zap,
  Shield,
  Truck,
  Award,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Search,
  Settings,
  ArrowLeft
} from 'lucide-react';

interface NetworkingProduct {
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
  brand: string;
  type: string;
  speed: string;
  features: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  description: string;
  warranty: string;
  color: string;
  createdAt?: string;
}

export default function NetworkingPage() {
  const [networkingProducts, setNetworkingProducts] = useState<NetworkingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedType, setSelectedType] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2500]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNetworkingData();
  }, []);

  const fetchNetworkingData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?category=networking');
      
      if (response.ok) {
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        
        const transformedProducts: NetworkingProduct[] = products.map((product: any) => {
          const images = safeParseImages(product.images);
          const attributes = safeParseAttributes(product.attributes);
          
          return {
            id: product.id,
            title: product.title,
            price: product.price,
            originalPrice: product.compareAtPrice || undefined,
            images: images || [],
            slug: product.slug,
            rating: product.rating || 4.5,
            reviewCount: product.reviewCount || 0,
            stock: product.stock,
            brand: product.brand || attributes?.brand || 'Unknown',
            type: attributes?.type || 'Networking',
            speed: attributes?.speed || '',
            ports: attributes?.ports || '',
            coverage: attributes?.coverage || '',
            isNew: product.isNew || false,
            isFeatured: product.featured || false,
            discount: product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0,
            description: product.description || product.shortDesc || ''
          };
        });
        
        setNetworkingProducts(transformedProducts);
      } else {
        setNetworkingProducts(getMockNetworkingProducts());
      }
    } catch (error) {
      console.error('Error fetching networking data:', error);
      setNetworkingProducts(getMockNetworkingProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockNetworkingProducts = (): NetworkingProduct[] => [
    {
      id: '1',
      title: 'WiFi 6 Router',
      price: 19999,
      originalPrice: 24999,
      images: ['/api/placeholder/300/300'],
      slug: 'wifi-6-router',
      rating: 4.8,
      reviewCount: 189,
      stock: 25,
      category: 'Networking',
      brand: 'NetMax',
      type: 'Router',
      speed: 'AX6000',
      features: ['WiFi 6', 'Gigabit Ethernet', 'MU-MIMO'],
      isFeatured: true,
      discount: 20,
      description: 'High-performance WiFi 6 router with advanced features',
      warranty: '2 years',
      color: 'Black'
    },
    {
      id: '2',
      title: 'Gigabit Switch 8-Port',
      price: 7999,
      images: ['/api/placeholder/300/300'],
      slug: 'gigabit-switch-8-port',
      rating: 4.6,
      reviewCount: 156,
      stock: 42,
      category: 'Networking',
      brand: 'SwitchPro',
      type: 'Switch',
      speed: '1Gbps',
      features: ['8 Ports', 'Auto-negotiation', 'Plug & Play'],
      isNew: true,
      description: '8-port gigabit Ethernet switch for network expansion',
      warranty: '3 years',
      color: 'White'
    },
    {
      id: '3',
      title: 'Cat6 Ethernet Cable',
      price: 1999,
      images: ['/api/placeholder/300/300'],
      slug: 'cat6-ethernet-cable',
      rating: 4.7,
      reviewCount: 234,
      stock: 89,
      category: 'Networking',
      brand: 'CableTech',
      type: 'Cable',
      speed: '1Gbps',
      features: ['Cat6', '50ft Length', 'Gold Plated'],
      isFeatured: true,
      description: 'High-quality Cat6 Ethernet cable for reliable connections',
      warranty: '1 year',
      color: 'Blue'
    }
  ];

  const filteredNetworkingProducts = networkingProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = !selectedType || product.type === selectedType;
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesPrice = product.price >= priceRange[0] * 100 && product.price <= priceRange[1] * 100;
    return matchesSearch && matchesType && matchesBrand && matchesPrice;
  });

  const sortedNetworkingProducts = [...filteredNetworkingProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      default:
        return b.reviewCount - a.reviewCount; // Popular
    }
  });

  const NetworkingProductCard = ({ product, index, viewMode }: { product: NetworkingProduct; index: number; viewMode: 'grid' | 'list' }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      <div className="relative h-48">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            NEW
          </span>
        )}
        
        {product.isFeatured && (
          <span className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            FEATURED
          </span>
        )}
        
        {product.discount && (
          <span className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{product.discount}%
          </span>
        )}

        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-slate-500 uppercase tracking-wide">{product.brand}</span>
            <span className="text-xs text-blue-600 font-medium">{product.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{product.speed}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-500">{product.color}</span>
          </div>
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading networking products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-purple-600/10"></div>
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <Link href="/electronics" className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <ArrowLeft className="h-5 w-5" />
                Back to Electronics
              </Link>
            </div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Wifi className="h-12 w-12 text-blue-600" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Networking
              </h1>
            </div>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Build reliable networks with routers, switches, cables, and networking equipment for home and office.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Networking Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Networking Equipment</h2>
              <p className="text-slate-600">Reliable networking solutions for all environments</p>
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
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                {viewMode === 'grid' ? 'List View' : 'Grid View'}
              </Button>
            </div>
          </div>

          {networkingProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌐</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No networking products found</h3>
              <p className="text-slate-600">Check back later for amazing networking equipment!</p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'space-y-4'
            }>
              <AnimatePresence>
                {sortedNetworkingProducts.map((product, index) => (
                  <NetworkingProductCard key={product.id} product={product} index={index} viewMode={viewMode} />
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
                Your trusted destination for networking equipment and connectivity solutions.
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
              <h4 className="font-semibold mb-4">Networking Categories</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/electronics/networking" className="hover:text-white">Routers</Link></li>
                <li><Link href="/electronics/networking" className="hover:text-white">Switches</Link></li>
                <li><Link href="/electronics/networking" className="hover:text-white">Cables</Link></li>
                <li><Link href="/electronics/networking" className="hover:text-white">Access Points</Link></li>
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
