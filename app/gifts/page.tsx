"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui';
import { 
  Heart, 
  ShoppingCart, 
  Eye,
  Star,
  Gift,
  Sparkles,
  Crown,
  Zap,
  Clock,
  Truck,
  Shield,
  Award,
  Users,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Search,
  Tag,
  Ribbon,
  // WrappedGift, // Removed due to import error
  PartyPopper,
  Cake,
  Flower2,
  Diamond
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { safeParseImages, safeParseAttributes, safeParseTags } from '@/lib/fetchCategoryProducts';

interface Gift {
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
  occasion: string;
  recipient: string;
  ageRange: string;
  isPopular?: boolean;
  isPremium?: boolean;
  discount?: number;
  description: string;
  giftWrap?: boolean;
  personalization?: boolean;
  createdAt?: string;
}

interface GiftCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  productCount: number;
}

const giftCategories: GiftCategory[] = [
  { id: '1', name: 'Birthday Gifts', icon: <Cake className="h-6 w-6" />, color: 'bg-pink-500', description: 'Perfect birthday surprises', productCount: 45 },
  { id: '2', name: 'Anniversary', icon: <span className="text-2xl">❤️</span>, color: 'bg-red-500', description: 'Romantic anniversary gifts', productCount: 32 },
  { id: '3', name: 'Wedding Gifts', icon: <Diamond className="h-6 w-6" />, color: 'bg-purple-500', description: 'Elegant wedding presents', productCount: 28 },
  { id: '4', name: 'Holiday Gifts', icon: <span className="text-2xl">🎁</span>, color: 'bg-green-500', description: 'Festive holiday presents', productCount: 67 },
  { id: '5', name: 'Baby Gifts', icon: <Flower2 className="h-6 w-6" />, color: 'bg-blue-500', description: 'Adorable baby presents', productCount: 23 },
  { id: '6', name: 'Corporate Gifts', icon: <Award className="h-6 w-6" />, color: 'bg-indigo-500', description: 'Professional business gifts', productCount: 19 }
];

const recipientTypes = [
  { name: 'For Her', icon: '👩', color: 'bg-pink-100 text-pink-700' },
  { name: 'For Him', icon: '👨', color: 'bg-blue-100 text-blue-700' },
  { name: 'For Kids', icon: '👶', color: 'bg-yellow-100 text-yellow-700' },
  { name: 'For Couples', icon: '💑', color: 'bg-red-100 text-red-700' },
  { name: 'For Parents', icon: '👨‍👩‍👧‍👦', color: 'bg-green-100 text-green-700' },
  { name: 'For Friends', icon: '👥', color: 'bg-purple-100 text-purple-700' }
];

const GiftCard = ({ gift, index, viewMode, onBuyNow, onAddToCart }: { gift: Gift; index: number; viewMode: 'grid' | 'list'; onBuyNow: () => void; onAddToCart: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.05 }}
    className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
  >
    <div className="relative h-48">
      <Image
        src={gift.images[0]}
        alt={gift.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      
      <div className="absolute top-3 left-3">
        {gift.discount && (
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{gift.discount}%
          </span>
        )}
      </div>
    </div>

    <div className="p-4">
      <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
        {gift.title}
      </h3>
      
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(gift.rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-slate-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-slate-600">({gift.reviewCount})</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900">
            ${(gift.price / 100).toFixed(2)}
          </span>
          {gift.originalPrice && (
            <span className="text-sm text-slate-500 line-through">
              ${(gift.originalPrice / 100).toFixed(2)}
            </span>
          )}
        </div>
        <div className="text-sm text-slate-500">
          {gift.stock > 0 ? `${gift.stock} left` : 'Out of stock'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          className="rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
          disabled={gift.stock === 0}
          onClick={onBuyNow}
        >
          Options
        </button>
        <button
          className="rounded-lg bg-blue-50 text-blue-700 border border-blue-200 py-2 text-sm font-semibold hover:bg-blue-100"
          disabled={gift.stock === 0}
          onClick={onAddToCart}
        >
          <span className="inline-flex items-center justify-center gap-2 whitespace-nowrap">
            <Gift className="h-4 w-4" />
            Add to Cart
          </span>
        </button>
      </div>
    </div>
  </motion.div>
);

export default function GiftsPage() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [gifts, setGifts] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchGiftsData();
  }, []);

  const fetchGiftsData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?category=gifts');
      
      if (response.ok) {
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        
        const transformedProducts: Gift[] = products.map((product: any) => {
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
            category: product.categories?.[0]?.name || 'Gifts',
            occasion: attributes?.occasion || 'Any',
            recipient: attributes?.recipient || 'Anyone',
            isPersonalizable: attributes?.isPersonalizable || false,
            isNew: product.isNew || false,
            isFeatured: product.featured || false,
            discount: product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0,
            description: product.description || product.shortDesc || '',
            brand: product.brand || attributes?.brand || 'Unknown'
          };
        });
        
        setGifts(transformedProducts);
      } else {
        setGifts(getMockGifts());
      }
    } catch (error) {
      console.error('Error fetching gifts data:', error);
      setGifts(getMockGifts());
    } finally {
      setLoading(false);
    }
  };

  const getMockGifts = (): Gift[] => [
    {
      id: '1',
      title: 'Personalized Photo Frame',
      price: 2999,
      originalPrice: 3999,
      images: ['/api/placeholder/300/300'],
      slug: 'personalized-photo-frame',
      rating: 4.8,
      reviewCount: 156,
      stock: 45,
      category: 'Home Decor',
      occasion: 'Birthday',
      recipient: 'For Her',
      ageRange: '25-45',
      isPopular: true,
      discount: 25,
      description: 'Beautiful personalized photo frame with custom engraving',
      giftWrap: true,
      personalization: true,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Premium Coffee Gift Set',
      price: 4999,
      images: ['/api/placeholder/300/300'],
      slug: 'premium-coffee-gift-set',
      rating: 4.6,
      reviewCount: 89,
      stock: 32,
      category: 'Food & Beverage',
      occasion: 'Anniversary',
      recipient: 'For Him',
      ageRange: '30-50',
      isPremium: true,
      description: 'Luxury coffee gift set with artisanal beans and accessories',
      giftWrap: true,
      personalization: false,
      createdAt: '2024-01-20T14:15:00Z'
    },
    {
      id: '3',
      title: 'Spa Relaxation Kit',
      price: 7999,
      originalPrice: 9999,
      images: ['/api/placeholder/300/300'],
      slug: 'spa-relaxation-kit',
      rating: 4.9,
      reviewCount: 234,
      stock: 18,
      category: 'Beauty & Wellness',
      occasion: 'Holiday',
      recipient: 'For Her',
      ageRange: '25-55',
      isPopular: true,
      discount: 20,
      description: 'Complete spa experience with premium bath products',
      giftWrap: true,
      personalization: true,
      createdAt: '2024-01-25T09:45:00Z'
    }
  ];

  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         gift.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || gift.category === selectedCategory;
    const matchesRecipient = !selectedRecipient || gift.recipient === selectedRecipient;
    const matchesPrice = gift.price >= priceRange[0] * 100 && gift.price <= priceRange[1] * 100;
    return matchesSearch && matchesCategory && matchesRecipient && matchesPrice;
  });

  const sortedGifts = [...filteredGifts].sort((a, b) => {
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
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
          <p className="mt-2 text-slate-600">Loading perfect gifts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Gift className="h-12 w-12 text-pink-600" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                Perfect Gifts for Every Occasion
              </h1>
              <Sparkles className="h-12 w-12 text-purple-600" />
            </div>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Discover thoughtful gifts that will make your loved ones smile. From personalized items to luxury presents, find the perfect gift for every special moment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white">
                <Gift className="h-5 w-5 mr-2" />
                Browse All Gifts
              </Button>
              <Button size="lg" variant="outline" className="border-pink-300 text-pink-600 hover:bg-pink-50">
                <Sparkles className="h-5 w-5 mr-2" />
                Gift Recommendations
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gift Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Gifts</h2>
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

          {gifts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No gifts found</h3>
              <p className="text-slate-600">Check back later for amazing gift options!</p>
            </div>
          ) : (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              <AnimatePresence>
                {sortedGifts.map((gift, index) => (
                  <GiftCard
                    key={gift.id}
                    gift={gift}
                    index={index}
                    viewMode={viewMode}
                    onAddToCart={() => addItem({ productId: gift.id, slug: gift.slug, title: gift.title, price: gift.price }, 1)}
                    onBuyNow={() => { router.push(`/product/${gift.slug}`); }}
                  />
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
                Find the perfect gifts for every occasion and make someone's day special.
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
              <h4 className="font-semibold mb-4">Gift Categories</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/gifts" className="hover:text-white">Birthday Gifts</Link></li>
                <li><Link href="/gifts" className="hover:text-white">Anniversary</Link></li>
                <li><Link href="/gifts" className="hover:text-white">Wedding Gifts</Link></li>
                <li><Link href="/gifts" className="hover:text-white">Holiday Gifts</Link></li>
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
