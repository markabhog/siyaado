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
  Camera,
  Zap,
  Battery,
  Wifi,
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

interface CameraProduct {
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
  megapixels: string;
  features: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  description: string;
  warranty: string;
  color: string;
  sensor: string;
  createdAt?: string;
}

export default function CamerasPage() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [cameraProducts, setCameraProducts] = useState<CameraProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCameraData();
  }, []);

  const fetchCameraData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?category=cameras');
      
      if (response.ok) {
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        
        const transformedProducts: CameraProduct[] = products.map((product: any) => {
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
            type: attributes?.type || 'Camera',
            megapixels: attributes?.megapixels || specifications?.megapixels || '',
            sensor: attributes?.sensor || specifications?.sensor || '',
            videoResolution: attributes?.videoResolution || specifications?.videoResolution || '',
            lens: attributes?.lens || specifications?.lens || '',
            isNew: product.isNew || false,
            isFeatured: product.featured || false,
            discount: product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0,
            description: product.description || product.shortDesc || ''
          };
        });
        
        setCameraProducts(transformedProducts);
      } else {
        setCameraProducts(getMockCameraProducts());
      }
    } catch (error) {
      console.error('Error fetching camera data:', error);
      setCameraProducts(getMockCameraProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockCameraProducts = (): CameraProduct[] => [
    {
      id: '1',
      title: 'Canon EOS R5',
      price: 389999,
      originalPrice: 429999,
      images: ['/api/placeholder/300/300'],
      slug: 'canon-eos-r5',
      rating: 4.9,
      reviewCount: 189,
      stock: 12,
      category: 'Cameras',
      brand: 'Canon',
      type: 'Mirrorless',
      megapixels: '45MP',
      features: ['8K Video', 'In-body IS', 'Dual Pixel AF'],
      isFeatured: true,
      discount: 9,
      description: 'Professional mirrorless camera with 8K video recording',
      warranty: '1 year',
      color: 'Black',
      sensor: 'Full Frame'
    },
    {
      id: '2',
      title: 'Sony A7 IV',
      price: 249999,
      images: ['/api/placeholder/300/300'],
      slug: 'sony-a7-iv',
      rating: 4.8,
      reviewCount: 234,
      stock: 18,
      category: 'Cameras',
      brand: 'Sony',
      type: 'Mirrorless',
      megapixels: '33MP',
      features: ['4K Video', 'Real-time Tracking', '5-axis IS'],
      isNew: true,
      description: 'Versatile full-frame mirrorless camera for professionals',
      warranty: '1 year',
      color: 'Black',
      sensor: 'Full Frame'
    },
    {
      id: '3',
      title: 'Nikon Z6 III',
      price: 199999,
      images: ['/api/placeholder/300/300'],
      slug: 'nikon-z6-iii',
      rating: 4.7,
      reviewCount: 156,
      stock: 25,
      category: 'Cameras',
      brand: 'Nikon',
      type: 'Mirrorless',
      megapixels: '24MP',
      features: ['4K Video', 'EXPEED 7', 'Dual Memory Slots'],
      isFeatured: true,
      description: 'Advanced mirrorless camera with excellent low-light performance',
      warranty: '1 year',
      color: 'Black',
      sensor: 'Full Frame'
    }
  ];

  const filteredCameraProducts = cameraProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesPrice = product.price >= priceRange[0] * 100 && product.price <= priceRange[1] * 100;
    return matchesSearch && matchesBrand && matchesPrice;
  });

  const sortedCameraProducts = [...filteredCameraProducts].sort((a, b) => {
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

  const CameraProductCard = ({ product, index, viewMode }: { product: CameraProduct; index: number; viewMode: 'grid' | 'list' }) => (
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
            <span className="text-xs text-slate-500">{product.megapixels}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-500">{product.sensor}</span>
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
          <p className="mt-2 text-slate-600">Loading cameras...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Camera Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Professional Cameras</h2>
              <p className="text-slate-600">High-quality cameras for every photographer</p>
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
              
            </div>
          </div>

          <div className="flex gap-8">
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Filters</h3>
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Brand</h4>
                  <div className="space-y-2">
                    {['Canon','Sony','Nikon','Fujifilm','Panasonic'].map((brand) => (
                      <label key={brand} className="flex items-center">
                        <input type="checkbox" checked={selectedBrand === brand} onChange={(e)=> setSelectedBrand(e.target.checked ? brand : '')} className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-slate-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Type</h4>
                  <div className="space-y-2">
                    {['Mirrorless','DSLR','Action','Point & Shoot'].map((t) => (
                      <label key={t} className="flex items-center">
                        <input type="checkbox" className="rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-slate-700">{t}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input type="range" min="0" max="5000" value={priceRange[1]} onChange={(e)=> setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full" />
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full" onClick={()=>{ setSelectedBrand(''); setPriceRange([0,5000]); setSearchQuery(''); }}>Clear All Filters</Button>
              </div>
            </div>
            <div className="flex-1">
              {cameraProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📷</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No cameras found</h3>
                  <p className="text-slate-600">Check back later for amazing cameras!</p>
                </div>
              ) : (
                <div className={'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
                  <AnimatePresence>
                    {sortedCameraProducts.map((product, index) => (
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
                Your trusted destination for professional cameras and photography equipment.
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
              <h4 className="font-semibold mb-4">Camera Types</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/electronics/cameras" className="hover:text-white">Mirrorless</Link></li>
                <li><Link href="/electronics/cameras" className="hover:text-white">DSLR</Link></li>
                <li><Link href="/electronics/cameras" className="hover:text-white">Action Cameras</Link></li>
                <li><Link href="/electronics/cameras" className="hover:text-white">Point & Shoot</Link></li>
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
