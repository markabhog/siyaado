"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui';
import { ProductCard as SharedProductCard } from '@/app/components/ProductCard';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { safeParseImages, safeParseAttributes, safeParseTags } from '@/lib/fetchCategoryProducts';
// no icon imports needed for this simplified subcategory layout

interface LaptopProduct {
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
  processor: string;
  ram: string;
  storage: string;
  features: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  description: string;
  warranty: string;
  color: string;
  screenSize: string;
  graphics: string;
  createdAt?: string;
}

export default function LaptopsPage() {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [laptopProducts, setLaptopProducts] = useState<LaptopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [sortBy, setSortBy] = useState('popular');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [priceRange, setPriceRange] = useState([0, 3000]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLaptopData();
  }, []);

  const fetchLaptopData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?category=laptops');
      if (response.ok) {
        const data = await response.json();
        const products = Array.isArray(data) ? data : (data.products || []);
        
        const transformedProducts: LaptopProduct[] = products.map((product: any) => {
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
            graphics: attributes?.graphics || specifications?.graphics || '',
            battery: attributes?.battery || specifications?.battery || '',
            weight: product.weight || attributes?.weight || '',
            os: attributes?.os || specifications?.os || '',
            ports: attributes?.ports || specifications?.ports || '',
            isNew: product.isNew || false,
            isFeatured: product.featured || false,
            discount: product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0,
            description: product.description || product.shortDesc || ''
          };
        });
        
        setLaptopProducts(transformedProducts);
      } else {
        // Fallback to mock data
        setLaptopProducts(getMockLaptopProducts());
      }
    } catch (error) {
      console.error('Error fetching laptop data:', error);
      setLaptopProducts(getMockLaptopProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockLaptopProducts = (): LaptopProduct[] => [
    {
      id: '1',
      title: 'MacBook Pro 16" M3',
      price: 249999,
      originalPrice: 269999,
      images: ['/api/placeholder/300/300'],
      slug: 'macbook-pro-16-m3',
      rating: 4.9,
      reviewCount: 234,
      stock: 15,
      category: 'Laptops',
      brand: 'Apple',
      processor: 'M3 Pro',
      ram: '18GB',
      storage: '512GB SSD',
      features: ['Liquid Retina XDR', '22-hour battery', '6-speaker system'],
      isFeatured: true,
      discount: 7,
      description: 'Powerful MacBook Pro with M3 chip for professional workflows',
      warranty: '1 year',
      color: 'Space Gray',
      screenSize: '16.2"',
      graphics: 'M3 Pro GPU'
    },
    {
      id: '2',
      title: 'Dell XPS 15',
      price: 189999,
      images: ['/api/placeholder/300/300'],
      slug: 'dell-xps-15',
      rating: 4.7,
      reviewCount: 189,
      stock: 28,
      category: 'Laptops',
      brand: 'Dell',
      processor: 'Intel i7-13700H',
      ram: '16GB',
      storage: '1TB SSD',
      features: ['4K OLED Display', 'NVIDIA RTX 4060', 'Thunderbolt 4'],
      isNew: true,
      description: 'Premium Windows laptop with stunning 4K OLED display',
      warranty: '2 years',
      color: 'Platinum Silver',
      screenSize: '15.6"',
      graphics: 'NVIDIA RTX 4060'
    },
    {
      id: '3',
      title: 'ASUS ROG Zephyrus G14',
      price: 149999,
      images: ['/api/placeholder/300/300'],
      slug: 'asus-rog-zephyrus-g14',
      rating: 4.8,
      reviewCount: 156,
      stock: 32,
      category: 'Laptops',
      brand: 'ASUS',
      processor: 'AMD Ryzen 9 7940HS',
      ram: '32GB',
      storage: '1TB SSD',
      features: ['Gaming Performance', 'AniMe Matrix', 'ROG Nebula Display'],
      isFeatured: true,
      description: 'Gaming laptop with AMD Ryzen 9 and RTX 4060',
      warranty: '2 years',
      color: 'Moonlight White',
      screenSize: '14"',
      graphics: 'NVIDIA RTX 4060'
    }
  ];

  const filteredLaptopProducts = laptopProducts.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = !selectedBrand || product.brand === selectedBrand;
    const matchesPrice = product.price >= priceRange[0] * 100 && product.price <= priceRange[1] * 100;
    return matchesSearch && matchesBrand && matchesPrice;
  });

  const sortedLaptopProducts = [...filteredLaptopProducts].sort((a, b) => {
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

  // no custom card; list uses shared ProductCard below

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading laptops...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      {/* Laptop Products */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">All Laptops</h2>
              
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
            {/* Filters Sidebar */}
            <div className="w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-6">Filters</h3>
                
                {/* Brand Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Brand</h4>
                  <div className="space-y-2">
                    {['Apple', 'Dell', 'HP', 'Lenovo', 'ASUS', 'MSI', 'Acer'].map((brand) => (
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

                {/* Price Range Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="5000"
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

                {/* Processor Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Processor</h4>
                  <div className="space-y-2">
                    {['Intel i3', 'Intel i5', 'Intel i7', 'Intel i9', 'AMD Ryzen 5', 'AMD Ryzen 7', 'AMD Ryzen 9', 'Apple M1', 'Apple M2', 'Apple M3'].map((processor) => (
                      <label key={processor} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">{processor}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* RAM Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">RAM</h4>
                  <div className="space-y-2">
                    {['8GB', '16GB', '32GB', '64GB'].map((ram) => (
                      <label key={ram} className="flex items-center">
                        <input
                          type="checkbox"
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">{ram}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Screen Size Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Screen Size</h4>
                  <div className="space-y-2">
                    {['13"', '14"', '15"', '16"', '17"'].map((size) => (
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

                <Button 
                  onClick={() => {
                    setSelectedBrand('');
                    setPriceRange([0, 5000]);
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

              {laptopProducts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">💻</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No laptops found</h3>
                  <p className="text-slate-600">Check back later for amazing laptops!</p>
                </div>
              ) : (
                <div className={'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'}>
                  <AnimatePresence>
                {sortedLaptopProducts.map((product, index) => (
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
                Your trusted destination for premium laptops and computing solutions.
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
              <h4 className="font-semibold mb-4">Laptop Categories</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/electronics/laptops" className="hover:text-white">MacBook</Link></li>
                <li><Link href="/electronics/laptops" className="hover:text-white">Gaming Laptops</Link></li>
                <li><Link href="/electronics/laptops" className="hover:text-white">Business Laptops</Link></li>
                <li><Link href="/electronics/laptops" className="hover:text-white">Ultrabooks</Link></li>
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
