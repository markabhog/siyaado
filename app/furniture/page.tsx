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
  Sofa,
  Bed,
  Table,
  // Chair, // Removed due to import error
  Lamp,
  Home,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Search,
  Ruler,
  Palette,
  Shield,
  Truck,
  Award,
  CheckCircle,
  Star as StarIcon,
  Zap,
  Crown,
  Users,
  Clock,
  MapPin,
  Camera,
  Maximize2,
  RotateCcw
} from 'lucide-react';
// duplicate imports removed

interface Furniture {
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
  material: string;
  color: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  weight: number;
  assembly: boolean;
  warranty: string;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  description: string;
  roomType: string;
  style: string;
  deliveryTime: string;
  createdAt?: string;
}

interface FurnitureCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  productCount: number;
  popularStyles: string[];
}

const furnitureCategories: FurnitureCategory[] = [
  { 
    id: '1', 
    name: 'Living Room', 
    icon: <Sofa className="h-6 w-6" />, 
    color: 'bg-orange-500', 
    description: 'Comfortable seating & decor', 
    productCount: 45,
    popularStyles: ['Modern', 'Contemporary', 'Scandinavian']
  },
  { 
    id: '2', 
    name: 'Bedroom', 
    icon: <Bed className="h-6 w-6" />, 
    color: 'bg-blue-500', 
    description: 'Sleep & storage solutions', 
    productCount: 32,
    popularStyles: ['Minimalist', 'Traditional', 'Industrial']
  },
  { 
    id: '3', 
    name: 'Dining', 
    icon: <Table className="h-6 w-6" />, 
    color: 'bg-green-500', 
    description: 'Tables & dining chairs', 
    productCount: 28,
    popularStyles: ['Rustic', 'Mid-Century', 'Farmhouse']
  },
  { 
    id: '4', 
    name: 'Office', 
    icon: <span className="text-2xl">🪑</span>, 
    color: 'bg-purple-500', 
    description: 'Work & study furniture', 
    productCount: 19,
    popularStyles: ['Ergonomic', 'Modern', 'Executive']
  },
  { 
    id: '5', 
    name: 'Storage', 
    icon: <Home className="h-6 w-6" />, 
    color: 'bg-gray-500', 
    description: 'Wardrobes & storage', 
    productCount: 23,
    popularStyles: ['Built-in', 'Modular', 'Vintage']
  },
  { 
    id: '6', 
    name: 'Lighting', 
    icon: <Lamp className="h-6 w-6" />, 
    color: 'bg-yellow-500', 
    description: 'Lamps & lighting', 
    productCount: 15,
    popularStyles: ['LED', 'Vintage', 'Designer']
  }
];

const roomStyles = [
  { name: 'Modern', icon: '🏢', color: 'bg-gray-100 text-gray-700' },
  { name: 'Traditional', icon: '🏛️', color: 'bg-brown-100 text-brown-700' },
  { name: 'Scandinavian', icon: '❄️', color: 'bg-blue-100 text-blue-700' },
  { name: 'Industrial', icon: '🏭', color: 'bg-gray-100 text-gray-700' },
  { name: 'Minimalist', icon: '⚪', color: 'bg-white text-gray-700' },
  { name: 'Bohemian', icon: '🌿', color: 'bg-green-100 text-green-700' }
];

const materials = [
  { name: 'Wood', icon: '🪵', color: 'bg-amber-100 text-amber-700' },
  { name: 'Metal', icon: '🔩', color: 'bg-gray-100 text-gray-700' },
  { name: 'Glass', icon: '🪟', color: 'bg-blue-100 text-blue-700' },
  { name: 'Fabric', icon: '🧵', color: 'bg-pink-100 text-pink-700' },
  { name: 'Leather', icon: '👜', color: 'bg-brown-100 text-brown-700' },
  { name: 'Plastic', icon: '🧱', color: 'bg-yellow-100 text-yellow-700' }
];

const FurnitureCard = ({ item, index, viewMode }: { item: Furniture; index: number; viewMode: 'grid' | 'list' }) => {
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
      onClick={() => router.push(`/product/${item.slug}`)}
    >
      <Image
        src={item.images[0]}
        alt={item.title}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-300"
      />
      
      {/* Only discount badge */}
      <div className="absolute top-3 left-3">
        {item.discount && (
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{item.discount}%
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
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-blue-50">
            <Camera className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>
    </div>

    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
      <div className="mb-2">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs text-slate-500 uppercase tracking-wide">{item.category}</span>
          <span className="text-xs text-blue-600 font-medium">{item.brand}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">{item.material}</span>
          <span className="text-xs text-slate-500">•</span>
          <span className="text-xs text-slate-500">{item.color}</span>
        </div>
      </div>
      
      <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
        {item.title}
      </h3>
      
      {viewMode === 'list' && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.description}</p>
      )}
      
      {/* Dimensions & Details */}
      {viewMode === 'list' && (
        <div className="mb-3">
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
            <div className="flex items-center gap-1">
              <Ruler className="h-3 w-3" />
              <span>{item.dimensions.length}×{item.dimensions.width}×{item.dimensions.height}cm</span>
            </div>
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>{item.warranty}</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="h-3 w-3" />
              <span>{item.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Palette className="h-3 w-3" />
              <span>{item.style}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(item.rating)
                  ? 'text-yellow-400 fill-current'
                  : 'text-slate-300'
              }`}
            />
          ))}
        </div>
        <span className="text-sm text-slate-600">({item.reviewCount})</span>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-slate-900">
            ${(item.price / 100).toFixed(2)}
          </span>
          {item.originalPrice && (
            <span className="text-sm text-slate-500 line-through">
              ${(item.originalPrice / 100).toFixed(2)}
            </span>
          )}
        </div>
        <div className="text-sm text-slate-500">
          {item.stock > 0 ? `${item.stock} left` : 'Out of stock'}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => router.push(`/product/${item.slug}`)}
          className="rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
          disabled={item.stock === 0}
        >
          Options
        </button>
        <button
          onClick={() => { 
            addItem({ productId: item.id, slug: item.slug, title: item.title, price: item.price }, 1);
            try { window.dispatchEvent(new CustomEvent('eco:cart-open')); } catch {}
          }}
          className="rounded-lg bg-blue-50 text-blue-700 border border-blue-200 py-2 text-sm font-semibold hover:bg-blue-100 cursor-pointer"
          disabled={item.stock === 0}
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

export default function FurniturePage() {
  const [furniture, setFurniture] = useState<Furniture[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchFurnitureData();
  }, []);

  const fetchFurnitureData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?category=furniture');
      
      if (response.ok) {
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        
        const transformedProducts: Furniture[] = products.map((product: any) => {
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
            category: product.categories?.[0]?.name || 'Furniture',
            brand: product.brand || attributes?.brand || 'Unknown',
            material: product.material || attributes?.material || '',
            color: product.color || attributes?.color || '',
            dimensions: attributes?.dimensions || '',
            weight: product.weight || attributes?.weight || '',
            isNew: product.isNew || false,
            isFeatured: product.featured || false,
            discount: product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0,
            description: product.description || product.shortDesc || '',
            assembly: attributes?.assembly || 'Required',
            warranty: product.warranty || attributes?.warranty || '1 Year'
          };
        });
        
        setFurniture(transformedProducts);
      } else {
        setFurniture(getMockFurniture());
      }
    } catch (error) {
      console.error('Error fetching furniture data:', error);
      setFurniture(getMockFurniture());
    } finally {
      setLoading(false);
    }
  };

  const getMockFurniture = (): Furniture[] => [
    {
      id: '1',
      title: 'Modern Sectional Sofa',
      price: 29999,
      originalPrice: 39999,
      images: ['/api/placeholder/300/300'],
      slug: 'modern-sectional-sofa',
      rating: 4.8,
      reviewCount: 156,
      stock: 45,
      category: 'Living Room',
      brand: 'FurniLux',
      material: 'Fabric',
      color: 'Gray',
      dimensions: { length: 240, width: 180, height: 85 },
      weight: 85,
      assembly: true,
      warranty: '2 Years',
      isNew: true,
      discount: 25,
      description: 'Comfortable modern sectional sofa perfect for any living space',
      roomType: 'Living Room',
      style: 'Modern',
      deliveryTime: '3-5 days'
    },
    {
      id: '2',
      title: 'Oak Dining Table',
      price: 19999,
      images: ['/api/placeholder/300/300'],
      slug: 'oak-dining-table',
      rating: 4.6,
      reviewCount: 89,
      stock: 32,
      category: 'Dining',
      brand: 'WoodCraft',
      material: 'Wood',
      color: 'Natural Oak',
      dimensions: { length: 180, width: 90, height: 75 },
      weight: 45,
      assembly: true,
      warranty: '5 Years',
      isFeatured: true,
      description: 'Beautiful solid oak dining table with natural finish',
      roomType: 'Dining Room',
      style: 'Scandinavian',
      deliveryTime: '5-7 days'
    },
    {
      id: '3',
      title: 'Ergonomic Office Chair',
      price: 8999,
      originalPrice: 12999,
      images: ['/api/placeholder/300/300'],
      slug: 'ergonomic-office-chair',
      rating: 4.9,
      reviewCount: 234,
      stock: 28,
      category: 'Office',
      brand: 'ComfortPro',
      material: 'Mesh',
      color: 'Black',
      dimensions: { length: 60, width: 60, height: 120 },
      weight: 15,
      assembly: false,
      warranty: '3 Years',
      discount: 31,
      description: 'Professional ergonomic office chair with lumbar support',
      roomType: 'Office',
      style: 'Modern',
      deliveryTime: '2-3 days'
    }
  ];

  const filteredFurniture = furniture.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesStyle = !selectedStyle || item.style === selectedStyle;
    const matchesMaterial = !selectedMaterial || item.material === selectedMaterial;
    const matchesPrice = item.price >= priceRange[0] * 100 && item.price <= priceRange[1] * 100;
    return matchesSearch && matchesCategory && matchesStyle && matchesMaterial && matchesPrice;
  });

  const sortedFurniture = [...filteredFurniture].sort((a, b) => {
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


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="mt-2 text-slate-600">Loading beautiful furniture...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <CategoryHero
        title="Style your home"
        subtitle="Living room, bedroom, dining and more."
        ctaText="Shop now"
        ctaHref="/furniture"
        bannerKey="furniture"
        items={[
          { title: 'Living room', imageSrc: '/assets/products/p4.png', href: '/furniture' },
          { title: 'Bedroom', imageSrc: '/assets/products/p5.png', href: '/furniture' },
          { title: 'Dining', imageSrc: '/assets/products/p6.png', href: '/furniture' },
        ]}
      />

      {/* Furniture Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Furniture</h2>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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

          {furniture.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🪑</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No furniture found</h3>
              <p className="text-slate-600">Check back later for amazing furniture pieces!</p>
            </div>
          ) : (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              <AnimatePresence>
                {sortedFurniture.map((item, index) => (
                  <FurnitureCard key={item.id} item={item} index={index} viewMode={viewMode} />
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
                Transform your space with beautiful furniture and home decor.
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
              <h4 className="font-semibold mb-4">Furniture Categories</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/furniture" className="hover:text-white">Living Room</Link></li>
                <li><Link href="/furniture" className="hover:text-white">Bedroom</Link></li>
                <li><Link href="/furniture" className="hover:text-white">Dining Room</Link></li>
                <li><Link href="/furniture" className="hover:text-white">Office</Link></li>
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
