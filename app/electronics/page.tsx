"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui';
import CategoryHero from '@/app/components/CategoryHero';
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
  Laptop,
  Headphones,
  Camera,
  Watch,
  Gamepad2,
  Wifi,
  Battery,
  Cpu,
  HardDrive,
  Monitor,
  Speaker,
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
  WifiIcon,
  Bluetooth,
  Usb,
  WifiOff
} from 'lucide-react';

interface Electronic {
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
  model: string;
  specifications: {
    display?: string;
    processor?: string;
    storage?: string;
    battery?: string;
    connectivity?: string[];
  };
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  description: string;
  warranty: string;
  color: string;
  weight: string;
  createdAt?: string;
}

interface TechCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  productCount: number;
  features: string[];
}

const techCategories: TechCategory[] = [
  { 
    id: '1', 
    name: 'Smartphones', 
    icon: <Smartphone className="h-6 w-6" />, 
    color: 'bg-blue-500', 
    description: 'Latest mobile devices', 
    productCount: 45,
    features: ['5G', 'Camera', 'Battery']
  },
  { 
    id: '2', 
    name: 'Laptops', 
    icon: <Laptop className="h-6 w-6" />, 
    color: 'bg-gray-500', 
    description: 'Powerful computing devices', 
    productCount: 32,
    features: ['Performance', 'Portability', 'Display']
  },
  // Removed dedicated Headphones subcategory
  { 
    id: '4', 
    name: 'Cameras', 
    icon: <Camera className="h-6 w-6" />, 
    color: 'bg-red-500', 
    description: 'Professional photography', 
    productCount: 19,
    features: ['Resolution', 'Lens', 'Stabilization']
  },
  { 
    id: '5', 
    name: 'Wearables', 
    icon: <Watch className="h-6 w-6" />, 
    color: 'bg-green-500', 
    description: 'Smart watches & fitness', 
    productCount: 23,
    features: ['Health Tracking', 'Notifications', 'Battery']
  },
  { 
    id: '6', 
    name: 'Gaming', 
    icon: <Gamepad2 className="h-6 w-6" />, 
    color: 'bg-orange-500', 
    description: 'Gaming accessories', 
    productCount: 15,
    features: ['Performance', 'RGB', 'Comfort']
  }
];

const brands = [
  { name: 'Apple', logo: '🍎', color: 'bg-gray-100' },
  { name: 'Samsung', logo: '📱', color: 'bg-blue-100' },
  { name: 'Sony', logo: '🎧', color: 'bg-red-100' },
  { name: 'Dell', logo: '💻', color: 'bg-blue-100' },
  { name: 'HP', logo: '🖥️', color: 'bg-blue-100' },
  { name: 'Canon', logo: '📷', color: 'bg-red-100' }
];

export default function ElectronicsPage() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [electronics, setElectronics] = useState<Electronic[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchElectronicsData();
  }, []);

  const fetchElectronicsData = async () => {
    try {
      setLoading(true);
      // Fetch products from electronics category
      const response = await fetch('/api/products?category=electronics');
      if (response.ok) {
        const data = await response.json();
        
        // Parse and transform products to electronics format
        const products = Array.isArray(data) ? data : (data.products || []);
        const transformedElectronics: Electronic[] = products.map((product: any) => {
          // Parse JSON fields using safe helper functions
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
            category: product.categories?.[0]?.name || 'Electronics',
            brand: product.brand || attributes?.brand || 'Unknown Brand',
            model: attributes?.model || product.sku,
            specifications: {
              display: attributes?.display || specifications?.display,
              processor: attributes?.processor || specifications?.processor,
              storage: attributes?.storage || specifications?.storage,
              battery: attributes?.battery || specifications?.battery,
              connectivity: (() => {
                const conn = attributes?.connectivity || specifications?.connectivity;
                if (Array.isArray(conn)) return conn;
                if (typeof conn === 'string') return conn.split(',').map((c: string) => c.trim());
                return [];
              })()
            },
            isNew: product.isNew || false,
            isFeatured: product.featured || false,
            discount: product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0,
            description: product.description || product.shortDesc || '',
            warranty: product.warranty || attributes?.warranty || '1 Year',
            color: product.color || attributes?.color || '',
            weight: product.weight || attributes?.weight || ''
          };
        });
        
        setElectronics(transformedElectronics);
      } else {
        console.error('Failed to fetch electronics, using mock data');
        setElectronics(getMockElectronics());
      }
    } catch (error) {
      console.error('Error fetching electronics data:', error);
      setElectronics(getMockElectronics());
    } finally {
      setLoading(false);
    }
  };

  const getMockElectronics = (): Electronic[] => [
    {
      id: '1',
      title: 'iPhone 15 Pro Max',
      price: 119999,
      originalPrice: 129999,
      images: ['/api/placeholder/300/300'],
      slug: 'iphone-15-pro-max',
      rating: 4.8,
      reviewCount: 156,
      stock: 45,
      category: 'Smartphones',
      brand: 'Apple',
      model: 'A3102',
      specifications: {
        display: '6.7" Super Retina XDR',
        processor: 'A17 Pro chip',
        storage: '256GB',
        battery: 'Up to 29 hours video',
        connectivity: ['5G', 'Wi-Fi 6E', 'Bluetooth 5.3']
      },
      isNew: true,
      discount: 8,
      description: 'The most advanced iPhone with titanium design and A17 Pro chip',
      warranty: '1 Year',
      color: 'Natural Titanium',
      weight: '221g'
    },
    {
      id: '2',
      title: 'MacBook Pro 16"',
      price: 249999,
      images: ['/api/placeholder/300/300'],
      slug: 'macbook-pro-16',
      rating: 4.9,
      reviewCount: 89,
      stock: 12,
      category: 'Laptops',
      brand: 'Apple',
      model: 'M3 Pro',
      specifications: {
        display: '16.2" Liquid Retina XDR',
        processor: 'Apple M3 Pro chip',
        storage: '512GB SSD',
        battery: 'Up to 22 hours',
        connectivity: ['Wi-Fi 6E', 'Bluetooth 5.3', 'Thunderbolt 4']
      },
      isFeatured: true,
      description: 'Professional laptop with M3 Pro chip for ultimate performance',
      warranty: '1 Year',
      color: 'Space Gray',
      weight: '2.1kg'
    },
    {
      id: '3',
      title: 'Sony WH-1000XM5',
      price: 39999,
      originalPrice: 49999,
      images: ['/api/placeholder/300/300'],
      slug: 'sony-wh-1000xm5',
      rating: 4.7,
      reviewCount: 234,
      stock: 28,
      category: 'Audio',
      brand: 'Sony',
      model: 'WH-1000XM5',
      specifications: {
        display: 'N/A',
        processor: 'HD Noise Canceling Processor QN1',
        storage: 'N/A',
        battery: '30 hours',
        connectivity: ['Bluetooth 5.2', 'NFC', '3.5mm jack']
      },
      discount: 20,
      description: 'Industry-leading noise canceling wireless headphones',
      warranty: '1 Year',
      color: 'Black',
      weight: '250g'
    },
    {
      id: '4',
      title: 'Samsung Galaxy S24 Ultra',
      price: 99999,
      originalPrice: 109999,
      images: ['/api/placeholder/300/300'],
      slug: 'samsung-galaxy-s24-ultra',
      rating: 4.6,
      reviewCount: 178,
      stock: 32,
      category: 'Smartphones',
      brand: 'Samsung',
      model: 'SM-S928B',
      specifications: {
        display: '6.8" Dynamic AMOLED 2X',
        processor: 'Snapdragon 8 Gen 3',
        storage: '256GB',
        battery: '5000mAh',
        connectivity: ['5G', 'Wi-Fi 7', 'Bluetooth 5.3']
      },
      discount: 9,
      description: 'Premium Android smartphone with S Pen and advanced camera system',
      warranty: '1 Year',
      color: 'Titanium Black',
      weight: '232g'
    },
    {
      id: '5',
      title: 'Dell XPS 13',
      price: 129999,
      images: ['/api/placeholder/300/300'],
      slug: 'dell-xps-13',
      rating: 4.5,
      reviewCount: 92,
      stock: 18,
      category: 'Laptops',
      brand: 'Dell',
      model: 'XPS 13 9320',
      specifications: {
        display: '13.4" FHD+ InfinityEdge',
        processor: 'Intel Core i7-1260P',
        storage: '512GB SSD',
        battery: 'Up to 12 hours',
        connectivity: ['Wi-Fi 6E', 'Bluetooth 5.2', 'Thunderbolt 4']
      },
      description: 'Ultra-portable laptop with premium design and performance',
      warranty: '1 Year',
      color: 'Platinum Silver',
      weight: '1.27kg'
    },
    {
      id: '6',
      title: 'AirPods Pro 2nd Gen',
      price: 24999,
      originalPrice: 27999,
      images: ['/api/placeholder/300/300'],
      slug: 'airpods-pro-2nd-gen',
      rating: 4.8,
      reviewCount: 312,
      stock: 67,
      category: 'Audio',
      brand: 'Apple',
      model: 'A2931',
      specifications: {
        display: 'N/A',
        processor: 'H2 chip',
        storage: 'N/A',
        battery: '6 hours + 24 hours case',
        connectivity: ['Bluetooth 5.3', 'Lightning']
      },
      discount: 11,
      description: 'Premium wireless earbuds with active noise cancellation',
      warranty: '1 Year',
      color: 'White',
      weight: '5.3g'
    },
    {
      id: '7',
      title: 'Canon EOS R5',
      price: 399999,
      originalPrice: 429999,
      images: ['/api/placeholder/300/300'],
      slug: 'canon-eos-r5',
      rating: 4.9,
      reviewCount: 145,
      stock: 8,
      category: 'Cameras',
      brand: 'Canon',
      model: 'EOS R5',
      specifications: {
        display: '3.2" LCD',
        processor: 'DIGIC X',
        storage: 'CFexpress + SD',
        battery: 'LP-E6NH',
        connectivity: ['Wi-Fi', 'Bluetooth', 'USB-C']
      },
      discount: 7,
      description: 'Professional mirrorless camera with 45MP sensor and 8K video',
      warranty: '1 Year',
      color: 'Black',
      weight: '650g'
    },
    {
      id: '8',
      title: 'Apple Watch Series 9',
      price: 39999,
      images: ['/api/placeholder/300/300'],
      slug: 'apple-watch-series-9',
      rating: 4.7,
      reviewCount: 198,
      stock: 43,
      category: 'Wearables',
      brand: 'Apple',
      model: 'A3077',
      specifications: {
        display: '45mm Always-On Retina',
        processor: 'S9 SiP',
        storage: '64GB',
        battery: 'Up to 18 hours',
        connectivity: ['GPS', 'Cellular', 'Bluetooth 5.3']
      },
      description: 'Advanced smartwatch with health monitoring and fitness tracking',
      warranty: '1 Year',
      color: 'Midnight',
      weight: '39g'
    },
    {
      id: '9',
      title: 'PlayStation 5',
      price: 49999,
      originalPrice: 54999,
      images: ['/api/placeholder/300/300'],
      slug: 'playstation-5',
      rating: 4.8,
      reviewCount: 267,
      stock: 15,
      category: 'Gaming',
      brand: 'Sony',
      model: 'CFI-1215A',
      specifications: {
        display: '4K UHD',
        processor: 'AMD Zen 2',
        storage: '825GB SSD',
        battery: 'N/A',
        connectivity: ['Wi-Fi 6', 'Bluetooth 5.1', 'Ethernet']
      },
      discount: 9,
      description: 'Next-generation gaming console with 4K gaming and ray tracing',
      warranty: '1 Year',
      color: 'White',
      weight: '4.5kg'
    },
    {
      id: '10',
      title: 'iPad Pro 12.9"',
      price: 109999,
      images: ['/api/placeholder/300/300'],
      slug: 'ipad-pro-12-9',
      rating: 4.6,
      reviewCount: 134,
      stock: 25,
      category: 'Tablets',
      brand: 'Apple',
      model: 'A2764',
      specifications: {
        display: '12.9" Liquid Retina XDR',
        processor: 'M2 chip',
        storage: '256GB',
        battery: 'Up to 10 hours',
        connectivity: ['Wi-Fi 6E', 'Bluetooth 5.3', 'USB-C']
      },
      description: 'Professional tablet with M2 chip and Apple Pencil support',
      warranty: '1 Year',
      color: 'Space Gray',
      weight: '682g'
    }
  ];

  const filteredElectronics = electronics.filter(electronic => {
    const matchesSearch = electronic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         electronic.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         electronic.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || electronic.category === selectedCategory;
    const matchesBrand = !selectedBrand || electronic.brand === selectedBrand;
    const matchesPrice = electronic.price >= priceRange[0] * 100 && electronic.price <= priceRange[1] * 100;
    return matchesSearch && matchesCategory && matchesBrand && matchesPrice;
  });

  const sortedElectronics = [...filteredElectronics].sort((a, b) => {
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

  // Electronics product card aligned with furniture design (simplified)
  const ElectronicCard = ({ electronic, index }: { electronic: Electronic; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      <Link href={`/product/${electronic.slug}`} className="block cursor-pointer">
        <div className="relative h-48">
          <Image
            src={electronic.images[0]}
            alt={electronic.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            {electronic.discount && (
              <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                -{electronic.discount}%
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {electronic.title}
        </h3>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${
                  i < Math.floor(electronic.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-600">({electronic.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">
              ${(electronic.price / 100).toFixed(2)}
            </span>
            {electronic.originalPrice && (
              <span className="text-sm text-slate-500 line-through">
                ${(electronic.originalPrice / 100).toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-sm text-slate-500">
            {electronic.stock > 0 ? `${electronic.stock} left` : 'Out of stock'}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => router.push(`/product/${electronic.slug}`)}
            className="flex-1 rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
          >
            Options
          </button>
          <button
            onClick={() => addItem({ productId: electronic.id, slug: electronic.slug, title: electronic.title, price: electronic.price }, 1)}
            className="flex-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 py-2 text-sm font-semibold hover:bg-blue-100 cursor-pointer"
          >
            <span className="inline-flex items-center justify-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading latest tech...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <CategoryHero
        title="Top tech for your ride"
        subtitle="Explore in-car entertainment, GPS, security devices, and more."
        ctaText="Shop now"
        ctaHref="/electronics"
        bannerKey="electronics"
        items={[
          { title: 'Entertainment', imageSrc: '/assets/phones/banner.jpg', href: '/electronics/audio' },
          { title: 'GPS', imageSrc: '/assets/phones/g.png', href: '/electronics/smartphones' },
          { title: 'Security devices', imageSrc: '/assets/phones/h.png', href: '/electronics/cameras' },
        ]}
      />

      {/* Categories (kept as a simple, consistent strip) */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Browse:</span>
            {[
              { name: 'Smartphones', href: '/electronics/smartphones' },
              { name: 'Laptops', href: '/electronics/laptops' },
              { name: 'Cameras', href: '/electronics/cameras' },
              { name: 'Wearables', href: '/electronics/wearables' },
              { name: 'Gaming', href: '/electronics/gaming' },
            ].map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="px-4 py-2 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-lg transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Electronics Products (aligned with furniture layout) */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">All Electronics</h2>
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

          {electronics.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No electronics found</h3>
              <p className="text-slate-600">Check back later for amazing tech products!</p>
            </div>
          ) : (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              <AnimatePresence>
                {sortedElectronics.map((electronic, index) => (
                  <motion.div
                    key={electronic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <SharedProductCard
                      slug={electronic.slug}
                      title={electronic.title}
                      price={electronic.price}
                      image={electronic.images?.[0]}
                      discount={electronic.discount}
                      rating={electronic.rating}
                      reviewCount={electronic.reviewCount}
                      stock={electronic.stock}
                      onAddToCart={() => addItem({ productId: electronic.id, slug: electronic.slug, title: electronic.title, price: electronic.price }, 1)}
                      onBuyNow={() => { router.push(`/product/${electronic.slug}`); }}
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
                Your trusted destination for the latest electronics and technology products.
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
              <h4 className="font-semibold mb-4">Electronics</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/electronics" className="hover:text-white">Smartphones</Link></li>
                <li><Link href="/electronics" className="hover:text-white">Laptops</Link></li>
                <li><Link href="/electronics" className="hover:text-white">Headphones</Link></li>
                <li><Link href="/electronics" className="hover:text-white">Cameras</Link></li>
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
