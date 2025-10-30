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
  Dumbbell,
  Activity,
  Zap,
  Target,
  Award,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Search,
  Shield,
  Truck,
  Clock,
  Users,
  CheckCircle,
  Star as StarIcon,
  Crown,
  Flame,
  Trophy,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface FitnessProduct {
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
  sport: string;
  skillLevel: string;
  features: string[];
  specifications: {
    weight?: string;
    dimensions?: string;
    material?: string;
    color?: string;
  };
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  discount?: number;
  description: string;
  warranty: string;
  ageRange: string;
  gender: string;
  createdAt?: string;
}

interface FitnessCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  productCount: number;
  benefits: string[];
}

const fitnessCategories: FitnessCategory[] = [
  { 
    id: '1', 
    name: 'Strength Training', 
    icon: <Dumbbell className="h-6 w-6" />, 
    color: 'bg-blue-500', 
    description: 'Build muscle & strength', 
    productCount: 45,
    benefits: ['Muscle Building', 'Strength', 'Endurance']
  },
  { 
    id: '2', 
    name: 'Cardio Equipment', 
    icon: <Activity className="h-6 w-6" />, 
    color: 'bg-blue-500', 
    description: 'Heart health & endurance', 
    productCount: 32,
    benefits: ['Cardio', 'Weight Loss', 'Endurance']
  },
  { 
    id: '3', 
    name: 'Yoga & Pilates', 
    icon: <Target className="h-6 w-6" />, 
    color: 'bg-green-500', 
    description: 'Flexibility & mindfulness', 
    productCount: 28,
    benefits: ['Flexibility', 'Balance', 'Mindfulness']
  },
  { 
    id: '4', 
    name: 'Outdoor Sports', 
    icon: <Zap className="h-6 w-6" />, 
    color: 'bg-blue-500', 
    description: 'Adventure & exploration', 
    productCount: 19,
    benefits: ['Adventure', 'Nature', 'Exploration']
  },
  { 
    id: '5', 
    name: 'Team Sports', 
    icon: <Trophy className="h-6 w-6" />, 
    color: 'bg-purple-500', 
    description: 'Competitive team games', 
    productCount: 23,
    benefits: ['Teamwork', 'Competition', 'Strategy']
  },
  { 
    id: '6', 
    name: 'Accessories', 
    icon: <Award className="h-6 w-6" />, 
    color: 'bg-blue-500', 
    description: 'Gear & accessories', 
    productCount: 15,
    benefits: ['Protection', 'Performance', 'Comfort']
  }
];

const sports = [
  { name: 'Football', icon: '⚽', color: 'bg-green-100 text-green-700' },
  { name: 'Basketball', icon: '🏀', color: 'bg-blue-100 text-blue-700' },
  { name: 'Tennis', icon: '🎾', color: 'bg-blue-100 text-blue-700' },
  { name: 'Swimming', icon: '🏊', color: 'bg-blue-100 text-blue-700' },
  { name: 'Running', icon: '🏃', color: 'bg-blue-100 text-blue-700' },
  { name: 'Cycling', icon: '🚴', color: 'bg-purple-100 text-purple-700' }
];

const skillLevels = [
  { name: 'Beginner', icon: '🌱', color: 'bg-green-100 text-green-700' },
  { name: 'Intermediate', icon: '⚡', color: 'bg-blue-100 text-blue-700' },
  { name: 'Advanced', icon: '🔥', color: 'bg-blue-100 text-blue-700' },
  { name: 'Professional', icon: '👑', color: 'bg-purple-100 text-purple-700' }
];

export default function FitnessPage() {
  const [fitnessProducts, setFitnessProducts] = useState<FitnessProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedSkillLevel, setSelectedSkillLevel] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFitnessData();
  }, []);

  const fetchFitnessData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?category=fitness-sports');
      
      if (response.ok) {
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        
        const transformedProducts: FitnessProduct[] = products.map((product: any) => {
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
            category: product.categories?.[0]?.name || 'Fitness',
            brand: product.brand || attributes?.brand || 'Unknown',
            type: attributes?.type || 'Equipment',
            weight: product.weight || attributes?.weight || '',
            material: product.material || attributes?.material || '',
            isNew: product.isNew || false,
            isFeatured: product.featured || false,
            discount: product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0,
            description: product.description || product.shortDesc || '',
            specifications: attributes?.specifications || '',
            warranty: product.warranty || attributes?.warranty || '1 Year'
          };
        });
        
        setFitnessProducts(transformedProducts);
      } else {
        setFitnessProducts(getMockFitnessProducts());
      }
    } catch (error) {
      console.error('Error fetching fitness data:', error);
      setFitnessProducts(getMockFitnessProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockFitnessProducts = (): FitnessProduct[] => [
    {
      id: '1',
      title: 'Adjustable Dumbbells Set',
      price: 29999,
      originalPrice: 39999,
      images: ['/api/placeholder/300/300'],
      slug: 'adjustable-dumbbells-set',
      rating: 4.8,
      reviewCount: 156,
      stock: 45,
      category: 'Strength Training',
      brand: 'PowerFit',
      sport: 'Weightlifting',
      skillLevel: 'All Levels',
      features: ['Adjustable Weight', 'Space Saving', 'Durable'],
      specifications: {
        weight: '5-50 lbs',
        dimensions: '15×8×8 inches',
        material: 'Cast Iron',
        color: 'Black'
      },
      isNew: true,
      discount: 25,
      description: 'Professional adjustable dumbbells for home gym',
      warranty: '2 Years',
      ageRange: '16+',
      gender: 'Unisex'
    },
    {
      id: '2',
      title: 'Premium Yoga Mat',
      price: 4999,
      images: ['/api/placeholder/300/300'],
      slug: 'premium-yoga-mat',
      rating: 4.9,
      reviewCount: 234,
      stock: 32,
      category: 'Yoga & Pilates',
      brand: 'ZenFlow',
      sport: 'Yoga',
      skillLevel: 'All Levels',
      features: ['Non-Slip', 'Eco-Friendly', 'Extra Thick'],
      specifications: {
        weight: '2.5 lbs',
        dimensions: '72×24×0.25 inches',
        material: 'TPE',
        color: 'Purple'
      },
      isBestseller: true,
      description: 'High-quality yoga mat for all practice levels',
      warranty: '1 Year',
      ageRange: 'All Ages',
      gender: 'Unisex'
    },
    {
      id: '3',
      title: 'Smart Fitness Tracker',
      price: 19999,
      originalPrice: 24999,
      images: ['/api/placeholder/300/300'],
      slug: 'smart-fitness-tracker',
      rating: 4.7,
      reviewCount: 189,
      stock: 28,
      category: 'Accessories',
      brand: 'FitTech',
      sport: 'All Sports',
      skillLevel: 'All Levels',
      features: ['Heart Rate', 'GPS', 'Water Resistant'],
      specifications: {
        weight: '0.5 oz',
        dimensions: '1.5×0.8×0.3 inches',
        material: 'Silicone',
        color: 'Black'
      },
      discount: 20,
      description: 'Advanced fitness tracker with health monitoring',
      warranty: '1 Year',
      ageRange: '13+',
      gender: 'Unisex'
    }
  ];

  const filteredFitnessProducts = fitnessProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    const matchesSport = !selectedSport || product.sport === selectedSport;
    const matchesSkillLevel = !selectedSkillLevel || product.skillLevel === selectedSkillLevel;
    const matchesPrice = product.price >= priceRange[0] * 100 && product.price <= priceRange[1] * 100;
    return matchesSearch && matchesCategory && matchesSport && matchesSkillLevel && matchesPrice;
  });

  const sortedFitnessProducts = [...filteredFitnessProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return b.reviewCount - a.reviewCount; // Popular
    }
  });

  const FitnessProductCard = ({ product, index }: { product: FitnessProduct; index: number }) => {
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
            <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-blue-50">
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
            <span className="text-xs text-blue-600 font-medium">{product.brand}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{product.sport}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-500">{product.skillLevel}</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        
        {viewMode === 'list' && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>
        )}
        
        {/* Features */}
        {viewMode === 'list' && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {product.features.slice(0, 3).map((feature, i) => (
              <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {feature}
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
          <p className="mt-2 text-slate-600">Loading fitness gear...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <CategoryHero
        title="Gear up and go"
        subtitle="Strength, cardio, yoga and more."
        ctaText="Shop now"
        ctaHref="/fitness"
        bannerKey="fitness"
        items={[
          { title: 'Strength', imageSrc: '/assets/products/p7.png', href: '/fitness' },
          { title: 'Cardio', imageSrc: '/assets/products/p8.png', href: '/fitness' },
          { title: 'Accessories', imageSrc: '/assets/products/p1.png', href: '/fitness' },
        ]}
      />

      {/* Fitness Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Fitness Products</h2>
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
                <option value="name">Name A-Z</option>
              </select>
            </div>
          </div>

          {fitnessProducts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏃</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No fitness products found</h3>
              <p className="text-slate-600">Check back later for amazing fitness gear!</p>
            </div>
          ) : (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              <AnimatePresence>
                {sortedFitnessProducts.map((product, index) => (
                  <FitnessProductCard key={product.id} product={product} index={index} />
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
                Get the equipment you need to achieve your fitness goals and live a healthier lifestyle.
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
              <h4 className="font-semibold mb-4">Fitness Categories</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/fitness" className="hover:text-white">Cardio</Link></li>
                <li><Link href="/fitness" className="hover:text-white">Strength Training</Link></li>
                <li><Link href="/fitness" className="hover:text-white">Yoga & Pilates</Link></li>
                <li><Link href="/fitness" className="hover:text-white">Sports</Link></li>
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
