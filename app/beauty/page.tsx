"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { safeParseImages, safeParseAttributes, safeParseTags } from '@/lib/fetchCategoryProducts';
import CategoryHero from '@/app/components/CategoryHero';
import { 
  Heart, 
  ShoppingCart, 
  Eye,
  Star,
  Sparkles,
  Flower2,
  Droplets,
  Sun,
  Moon,
  Shield,
  Award,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Search,
  Leaf,
  Zap,
  Crown,
  Gem,
  Scissors,
  Palette,
  Wifi,
  Truck,
  Clock,
  Users,
  CheckCircle,
  Star as StarIcon
} from 'lucide-react';
// duplicate imports removed

interface BeautyProduct {
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
  skinType: string;
  ingredients: string[];
  benefits: string[];
  isNatural?: boolean;
  isCrueltyFree?: boolean;
  isVegan?: boolean;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  description: string;
  size: string;
  expiryDate: string;
  createdAt?: string;
}

interface BeautyCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  productCount: number;
  benefits: string[];
}

const beautyCategories: BeautyCategory[] = [
  { 
    id: '1', 
    name: 'Skincare', 
    icon: <Droplets className="h-6 w-6" />, 
    color: 'bg-pink-500', 
    description: 'Nourish your skin', 
    productCount: 45,
    benefits: ['Hydration', 'Anti-aging', 'Brightening']
  },
  { 
    id: '2', 
    name: 'Makeup', 
    icon: <Palette className="h-6 w-6" />, 
    color: 'bg-purple-500', 
    description: 'Express your beauty', 
    productCount: 32,
    benefits: ['Long-lasting', 'Natural look', 'Easy application']
  },
  { 
    id: '3', 
    name: 'Hair Care', 
    icon: <Scissors className="h-6 w-6" />, 
    color: 'bg-blue-500', 
    description: 'Beautiful, healthy hair', 
    productCount: 28,
    benefits: ['Repair', 'Volume', 'Shine']
  },
  { 
    id: '4', 
    name: 'Fragrance', 
    icon: <Flower2 className="h-6 w-6" />, 
    color: 'bg-green-500', 
    description: 'Captivating scents', 
    productCount: 19,
    benefits: ['Long-lasting', 'Unique', 'Luxury']
  },
  { 
    id: '5', 
    name: 'Wellness', 
    icon: <Leaf className="h-6 w-6" />, 
    color: 'bg-emerald-500', 
    description: 'Health & wellness', 
    productCount: 23,
    benefits: ['Natural', 'Organic', 'Holistic']
  },
  { 
    id: '6', 
    name: 'Men\'s Care', 
    icon: <Shield className="h-6 w-6" />, 
    color: 'bg-gray-500', 
    description: 'Grooming essentials', 
    productCount: 15,
    benefits: ['Quality', 'Effective', 'Modern']
  }
];

const skinTypes = [
  { name: 'Dry', icon: '🌵', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Oily', icon: '💧', color: 'bg-blue-100 text-blue-700' },
  { name: 'Combination', icon: '⚖️', color: 'bg-green-100 text-green-700' },
  { name: 'Sensitive', icon: '🌹', color: 'bg-pink-100 text-pink-700' },
  { name: 'Normal', icon: '✨', color: 'bg-purple-100 text-purple-700' },
  { name: 'Mature', icon: '👑', color: 'bg-gold-100 text-gold-700' }
];

const BeautyProductCard = ({ product, index, viewMode }: { product: BeautyProduct; index: number; viewMode: 'grid' | 'list' }) => {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  return (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
    className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group ${
      viewMode === 'list' ? 'flex' : ''
    }`}
  >
    <div 
      className={`relative ${viewMode === 'grid' ? 'h-48' : 'w-32 h-32 flex-shrink-0'} cursor-pointer`}
      onClick={() => router.push(`/product/${product.slug}`)}
    >
      <Image
        src={product.images[0]}
        alt={product.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      
      {/* Only discount badge */}
      <div className="absolute top-3 left-3">
        {product.discount && (
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{product.discount}%
          </span>
        )}
      </div>

      {/* No extra feature badges */}

      {/* Quick Actions */}
      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex flex-col gap-2">
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-pink-50">
            <Heart className="h-4 w-4 text-slate-600" />
          </button>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-blue-50">
            <Eye className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>

    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-slate-500 uppercase tracking-wide">{product.category}</span>
          <span className="text-xs text-pink-600 font-medium">{product.brand}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{product.skinType} skin</span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-500">{product.size}</span>
        </div>
      </div>
      
      <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-pink-600 transition-colors">
        {product.title}
      </h3>
      
      {viewMode === 'list' && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>
      )}
      
      {/* Benefits */}
      {viewMode === 'list' && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {product.benefits.slice(0, 3).map((benefit, i) => (
              <span key={i} className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded">
                {benefit}
              </span>
            ))}
          </div>
        </div>
      )}
      
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

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => router.push(`/product/${product.slug}`)}
          className="rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
          disabled={product.stock === 0}
        >
          Options
        </button>
        <button
          onClick={() => { 
            addItem({ productId: product.id, slug: product.slug, title: product.title, price: product.price }, 1);
            try { window.dispatchEvent(new CustomEvent('eco:cart-open')); } catch {}
          }}
          className="rounded-lg bg-blue-50 text-blue-700 border border-blue-200 py-2 text-sm font-semibold hover:bg-blue-100 cursor-pointer"
          disabled={product.stock === 0}
        >
          <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </span>
        </button>
      </div>
    </div>
  </motion.div>
);
}

export default function BeautyPage() {
  const [beautyProducts, setBeautyProducts] = useState<BeautyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSkinType, setSelectedSkinType] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBeautyData();
  }, []);

  const fetchBeautyData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?category=beauty-personal-care');
      
      if (response.ok) {
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        
        const transformedProducts: BeautyProduct[] = products.map((product: any) => {
          const images = safeParseImages(product.images);
          const attributes = safeParseAttributes(product.attributes);
          const tags = safeParseTags(product.tags);
          
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
            category: product.categories?.[0]?.name || 'Beauty',
            brand: product.brand || attributes?.brand || 'Unknown',
            skinType: attributes?.skinType || 'All',
            ingredients: attributes?.ingredients || '',
            benefits: attributes?.benefits || '',
            isNew: product.isNew || false,
            isFeatured: product.featured || false,
            isOrganic: attributes?.isNatural || false,
            isCrueltyFree: attributes?.isCrueltyFree || false,
            discount: product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0,
            description: product.description || product.shortDesc || '',
            size: attributes?.volume || product.size || '',
            scent: attributes?.scent || ''
          };
        });
        
        setBeautyProducts(transformedProducts);
      } else {
        setBeautyProducts(getMockBeautyProducts());
      }
    } catch (error) {
      console.error('Error fetching beauty data:', error);
      setBeautyProducts(getMockBeautyProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockBeautyProducts = (): BeautyProduct[] => [
    {
      id: '1',
      title: 'Vitamin C Brightening Serum',
      price: 4999,
      originalPrice: 6999,
      images: ['/api/placeholder/300/300'],
      slug: 'vitamin-c-brightening-serum',
      rating: 4.8,
      reviewCount: 156,
      stock: 45,
      category: 'Skincare',
      brand: 'GlowLab',
      skinType: 'All',
      ingredients: ['Vitamin C', 'Hyaluronic Acid', 'Niacinamide'],
      benefits: ['Brightening', 'Hydration', 'Anti-aging'],
      isNatural: true,
      isCrueltyFree: true,
      isVegan: true,
      isNew: true,
      discount: 29,
      description: 'Powerful vitamin C serum for radiant, youthful skin',
      size: '30ml',
      expiryDate: '2025-12-31'
    },
    {
      id: '2',
      title: 'Luxury Foundation',
      price: 7999,
      images: ['/api/placeholder/300/300'],
      slug: 'luxury-foundation',
      rating: 4.6,
      reviewCount: 89,
      stock: 32,
      category: 'Makeup',
      brand: 'Luxe Beauty',
      skinType: 'Combination',
      ingredients: ['SPF 30', 'Vitamin E', 'Hyaluronic Acid'],
      benefits: ['Full coverage', 'Long-lasting', 'SPF protection'],
      isCrueltyFree: true,
      isFeatured: true,
      description: 'Premium foundation with SPF protection and full coverage',
      size: '30ml',
      expiryDate: '2025-06-30'
    },
    {
      id: '3',
      title: 'Organic Hair Oil',
      price: 2999,
      originalPrice: 3999,
      images: ['/api/placeholder/300/300'],
      slug: 'organic-hair-oil',
      rating: 4.9,
      reviewCount: 234,
      stock: 28,
      category: 'Hair Care',
      brand: 'Nature\'s Best',
      skinType: 'All',
      ingredients: ['Argan Oil', 'Coconut Oil', 'Jojoba Oil'],
      benefits: ['Repair', 'Shine', 'Growth'],
      isNatural: true,
      isCrueltyFree: true,
      isVegan: true,
      discount: 25,
      description: 'Nourishing organic hair oil for healthy, shiny hair',
      size: '100ml',
      expiryDate: '2026-03-15'
    }
  ];

  const filteredBeautyProducts = beautyProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSkinType = !selectedSkinType || product.skinType === selectedSkinType || product.skinType === 'All';
    const matchesPrice = product.price >= priceRange[0] * 100 && product.price <= priceRange[1] * 100;
    return matchesSearch && matchesCategory && matchesSkinType && matchesPrice;
  });

  const sortedBeautyProducts = [...filteredBeautyProducts].sort((a, b) => {
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


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="mt-2 text-slate-600">Loading beauty essentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-rose-50">
      <CategoryHero
        title="Glow up your routine"
        subtitle="Skincare, makeup, hair care and more."
        ctaText="Shop now"
        ctaHref="/beauty"
        bannerKey="beauty"
        items={[
          { title: 'Skincare', imageSrc: '/assets/products/p1.png', href: '/beauty' },
          { title: 'Makeup', imageSrc: '/assets/products/p2.png', href: '/beauty' },
          { title: 'Hair care', imageSrc: '/assets/products/p3.png', href: '/beauty' },
        ]}
      />

      {/* Beauty Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Beauty Products</h2>
            </div>
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>
            </div>
          </div>

          {beautyProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">💄</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No beauty products found</h3>
              <p className="text-slate-600">Check back later for amazing beauty essentials!</p>
            </div>
          ) : (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              <AnimatePresence>
                {sortedBeautyProducts.map((product, index) => (
                  <BeautyProductCard key={product.id} product={product} index={index} viewMode={viewMode} />
                ))}
              </AnimatePresence>
            </div>
          )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Luul</h3>
              <p className="text-slate-400 mb-4">
                Discover premium beauty and wellness products for your daily routine.
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
              <h4 className="font-semibold mb-4">Beauty Categories</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/beauty" className="hover:text-white">Skincare</Link></li>
                <li><Link href="/beauty" className="hover:text-white">Makeup</Link></li>
                <li><Link href="/beauty" className="hover:text-white">Hair Care</Link></li>
                <li><Link href="/beauty" className="hover:text-white">Fragrance</Link></li>
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
