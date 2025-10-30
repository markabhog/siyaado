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
  Smartphone,
  Battery,
  Camera,
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

interface SmartphoneProduct {
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
  storage: string;
  color: string;
  features: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  description: string;
  warranty: string;
  screenSize: string;
  camera: string;
  battery: string;
  createdAt?: string;
}

export default function SmartphonesPage() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [smartphoneProducts, setSmartphoneProducts] = useState<SmartphoneProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchSmartphoneData();
  }, []);

  const fetchSmartphoneData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?category=smartphones');
      if (response.ok) {
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        
        const transformedProducts: SmartphoneProduct[] = products.map((product: any) => {
          const images = safeParseImages(product.images);
          const attributes = safeParseAttributes(product.attributes);
          const specifications = safeParseAttributes(product.specifications);
          
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
            processor: attributes?.processor || specifications?.processor || '',
            ram: attributes?.ram || specifications?.ram || '',
            storage: attributes?.storage || specifications?.storage || '',
            display: attributes?.display || specifications?.display || '',
            camera: attributes?.camera || specifications?.camera || '',
            battery: attributes?.battery || specifications?.battery || '',
            os: attributes?.os || specifications?.os || '',
            network: attributes?.network || specifications?.network || '5G',
            color: product.color || attributes?.color || '',
            isNew: product.isNew || false,
            isFeatured: product.featured || false,
            discount: product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0,
            description: product.description || product.shortDesc || ''
          };
        });
        
        setSmartphoneProducts(transformedProducts);
      } else {
        // Fallback to mock data
        setSmartphoneProducts(getMockSmartphoneProducts());
      }
    } catch (error) {
      console.error('Error fetching smartphone data:', error);
      setSmartphoneProducts(getMockSmartphoneProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockSmartphoneProducts = (): SmartphoneProduct[] => [
    {
      id: '1',
      title: 'iPhone 15 Pro',
      price: 99999,
      originalPrice: 109999,
      images: ['/api/placeholder/300/300'],
      slug: 'iphone-15-pro',
      rating: 4.9,
      reviewCount: 456,
      stock: 25,
      category: 'Smartphones',
      brand: 'Apple',
      storage: '256GB',
      color: 'Natural Titanium',
      features: ['A17 Pro Chip', '48MP Camera', 'USB-C'],
      isFeatured: true,
      discount: 9,
      description: 'Latest iPhone with titanium design and advanced camera system',
      warranty: '1 year',
      screenSize: '6.1"',
      camera: '48MP Main',
      battery: 'Up to 23 hours'
    },
    {
      id: '2',
      title: 'Samsung Galaxy S24',
      price: 79999,
      images: ['/api/placeholder/300/300'],
      slug: 'samsung-galaxy-s24',
      rating: 4.7,
      reviewCount: 389,
      stock: 42,
      category: 'Smartphones',
      brand: 'Samsung',
      storage: '128GB',
      color: 'Onyx Black',
      features: ['Snapdragon 8 Gen 3', 'AI Features', 'S Pen Support'],
      isNew: true,
      description: 'Premium Android smartphone with AI-powered features',
      warranty: '2 years',
      screenSize: '6.2"',
      camera: '50MP Main',
      battery: '4000mAh'
    },
    {
      id: '3',
      title: 'Google Pixel 8',
      price: 69999,
      images: ['/api/placeholder/300/300'],
      slug: 'google-pixel-8',
      rating: 4.8,
      reviewCount: 234,
      stock: 38,
      category: 'Smartphones',
      brand: 'Google',
      storage: '256GB',
      color: 'Obsidian',
      features: ['Tensor G3', 'Magic Eraser', 'Call Screen'],
      isFeatured: true,
      description: 'Google\'s flagship with advanced AI and photography',
      warranty: '1 year',
      screenSize: '6.2"',
      camera: '50MP Main',
      battery: '4575mAh'
    }
  ];

  const filteredSmartphoneProducts = smartphoneProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesPrice = product.price >= priceRange[0] * 100 && product.price <= priceRange[1] * 100;
    return matchesSearch && matchesBrand && matchesPrice;
  });

  const sortedSmartphoneProducts = [...filteredSmartphoneProducts].sort((a, b) => {
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

  const SmartphoneProductCard = ({ product, index, viewMode }: { product: SmartphoneProduct; index: number; viewMode: 'grid' | 'list' }) => (
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
            <span className="text-xs text-blue-600 font-medium">{product.storage}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{product.screenSize}</span>
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

        {/* CTA handled by SharedProductCard in main grid below */}
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading smartphones...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Smartphone Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">All Smartphones</h2>
              <p className="text-slate-600">Complete collection of smartphones from all brands</p>
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

          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Filters</h3>
                
                {/* Brand Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Brand</h4>
                  <div className="space-y-2">
                    {['Apple', 'Samsung', 'Google', 'OnePlus', 'Xiaomi', 'Huawei'].map((brand) => (
                      <label key={brand} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedBrand === brand}
                          onChange={(e) => setSelectedBrand(e.target.checked ? brand : '')}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Subcategory */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Subcategory</h4>
                  <div className="space-y-2">
                    {['Flagship', 'Midrange', 'Budget'].map((sub) => (
                      <label key={sub} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">{sub}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="2000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Storage Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Storage</h4>
                  <div className="space-y-2">
                    {['64GB', '128GB', '256GB', '512GB', '1TB'].map((storage) => (
                      <label key={storage} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">{storage}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Screen Size Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Screen Size</h4>
                  <div className="space-y-2">
                    {['5.5"', '6.0"', '6.1"', '6.2"', '6.7"', '6.9"'].map((size) => (
                      <label key={size} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">{size}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Features Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Features</h4>
                  <div className="space-y-2">
                    {['5G', 'Wireless Charging', 'Water Resistant', 'Dual Camera', 'Face ID', 'Fingerprint'].map((feature) => (
                      <label key={feature} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button 
                  onClick={() => {
                    setSelectedBrand('');
                    setPriceRange([0, 2000]);
                    setSearchQuery('');
                  }}
                  variant="outline" 
                  className="w-full"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-1">

              {smartphoneProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📱</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No smartphones found</h3>
                  <p className="text-slate-600">Check back later for amazing smartphones!</p>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' 
                  : 'space-y-4'
                }>
                  <AnimatePresence>
                {sortedSmartphoneProducts.map((product, index) => (
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
                      rating={product.rating}
                      reviewCount={product.reviewCount}
                      stock={product.stock}
                      onAddToCart={() => addItem({ productId: product.id, slug: product.slug, title: product.title, price: product.price }, 1)}
                      onBuyNow={() => { router.push(`/product/${product.slug}`); }}
                    />
                  </motion.div>
                ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Luul</h3>
              <p className="text-slate-400 mb-4">
                Your trusted destination for the latest smartphones and mobile technology.
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
              <h4 className="font-semibold mb-4">Smartphone Brands</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/electronics/smartphones" className="hover:text-white">Apple iPhone</Link></li>
                <li><Link href="/electronics/smartphones" className="hover:text-white">Samsung Galaxy</Link></li>
                <li><Link href="/electronics/smartphones" className="hover:text-white">Google Pixel</Link></li>
                <li><Link href="/electronics/smartphones" className="hover:text-white">OnePlus</Link></li>
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
