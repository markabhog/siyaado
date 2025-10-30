"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui';
import { ProductCard as SharedProductCard } from '@/app/components/ProductCard';
import { useCartStore } from '@/lib/cartStore';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye,
  Filter,
  Grid,
  List,
  SlidersHorizontal,
  SortAsc,
  SortDesc,
  ChevronDown,
  Truck,
  Shield,
  Clock,
  Award,
  TrendingUp,
  DollarSign,
  Users
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
  brand: string;
  subcategory?: string; // e.g., Smartphones, Laptops, Tablets
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  description: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  subcategories: {
    id: string;
    name: string;
    slug: string;
    productCount: number;
  }[];
}

interface FilterOptions {
  subcategories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
}

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params.slug as string;
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [mostLoved, setMostLoved] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState<FilterOptions>({
    subcategories: [],
    brands: [],
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
    onSale: false,
    isNew: false
  });
  const [availableFilters, setAvailableFilters] = useState<{
    subcategories: { name: string; count: number }[];
    brands: { name: string; count: number }[];
    maxPrice: number;
  }>({
    subcategories: [],
    brands: [],
    maxPrice: 10000
  });

  const sortOptions = [
    { value: 'popular', label: 'Most Popular', icon: <TrendingUp className="h-4 w-4" /> },
    { value: 'price-low', label: 'Price: Low to High', icon: <SortAsc className="h-4 w-4" /> },
    { value: 'price-high', label: 'Price: High to Low', icon: <SortDesc className="h-4 w-4" /> },
    { value: 'rating', label: 'Highest Rated', icon: <Star className="h-4 w-4" /> },
    { value: 'newest', label: 'Newest First', icon: <Clock className="h-4 w-4" /> },
    { value: 'name', label: 'Name A-Z', icon: <Award className="h-4 w-4" /> }
  ];

  useEffect(() => {
    fetchCategoryData();
  }, [categorySlug]);

  const fetchCategoryData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/categories/${categorySlug}`);
      if (response.ok) {
        const data = await response.json();
        setCategory(data.category);
        setProducts(data.products);
        setAvailableFilters(data.filters);
        if (data.mostLovedProduct) setMostLoved(data.mostLovedProduct);
      } else {
        // Fallback to mock data
        setCategory(getMockCategory());
        setProducts(getMockProducts());
        setAvailableFilters({
          subcategories: [
            { name: 'Smartphones', count: 45 },
            { name: 'Laptops', count: 32 },
            { name: 'Tablets', count: 28 }
          ],
          brands: [
            { name: 'Apple', count: 25 },
            { name: 'Samsung', count: 18 },
            { name: 'Dell', count: 12 }
          ],
          maxPrice: 10000
        });
      }
    } catch (error) {
      console.error('Error fetching category data:', error);
      setCategory(getMockCategory());
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockCategory = (): Category => ({
    id: '1',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Discover the latest in electronics and technology',
    image: '/api/placeholder/800/400',
    productCount: 245,
    subcategories: [
      { id: '1', name: 'Smartphones', slug: 'smartphones', productCount: 45 },
      { id: '2', name: 'Laptops', slug: 'laptops', productCount: 32 },
      { id: '3', name: 'Tablets', slug: 'tablets', productCount: 28 }
    ]
  });

  const getMockProducts = (): Product[] => [
    {
      id: '1',
      title: 'iPhone 15 Pro',
      price: 99999,
      images: ['/api/placeholder/300/300'],
      slug: 'iphone-15-pro',
      rating: 4.8,
      reviewCount: 156,
      stock: 45,
      brand: 'Apple',
      subcategory: 'Smartphones',
      isNew: true,
      description: 'The latest iPhone with advanced features'
    },
    {
      id: '2',
      title: 'Samsung Galaxy S24',
      price: 89999,
      originalPrice: 99999,
      images: ['/api/placeholder/300/300'],
      slug: 'samsung-galaxy-s24',
      rating: 4.6,
      reviewCount: 89,
      stock: 12,
      brand: 'Samsung',
      subcategory: 'Smartphones',
      discount: 10,
      description: 'Premium Android smartphone'
    }
  ];

  const filteredProducts = products.filter(product => {
    // Subcategory filter
    if (filters.subcategories.length > 0) {
      const productSubcat = (product as any).subcategory || (product as any).category || '';
      if (!filters.subcategories.includes(productSubcat)) {
        return false;
      }
    }
    
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }
    
    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }
    
    if (filters.rating > 0 && product.rating < filters.rating) {
      return false;
    }
    
    if (filters.inStock && product.stock === 0) {
      return false;
    }
    
    if (filters.onSale && !product.discount) {
      return false;
    }
    
    if (filters.isNew && !product.isNew) {
      return false;
    }
    
    return true;
  });

  const handleFilterChange = (filterType: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      subcategories: [],
      brands: [],
      priceRange: [0, 10000],
      rating: 0,
      inStock: false,
      onSale: false,
      isNew: false
    });
  };

  const handleAddToCart = (product: Product) => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        price: product.price,
      },
      1
    );
  };

  const handleBuyNow = (product: Product) => {
    handleAddToCart(product);
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading category...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Category not found</h2>
          <p className="text-slate-600 mb-6">The category you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Category Hero */}
      <section className="relative h-64 bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-bold text-white mb-4">{category.name}</h1>
            <p className="text-xl text-blue-100 mb-4">{category.description}</p>
            <div className="flex items-center gap-4 text-blue-100">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{category.productCount} products</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                <span>Top rated</span>
              </div>
            </div>
          </div>
          {mostLoved && (
            <div className="ml-auto hidden md:flex items-center gap-4 bg-white/90 rounded-2xl p-4 shadow-sm">
              <div className="w-24 h-24 relative rounded-xl overflow-hidden bg-slate-100">
                <Image src={mostLoved.images[0]} alt={mostLoved.title} fill className="object-cover" />
              </div>
              <div className="max-w-xs">
                <div className="text-xs text-slate-500 mb-1">Most loved</div>
                <div className="font-semibold text-slate-900 line-clamp-1">{mostLoved.title}</div>
                <div className="text-blue-600 font-bold">${(mostLoved.price/100).toFixed(2)}</div>
                <div className="mt-2 flex gap-2">
                  <Button onClick={() => handleBuyNow(mostLoved)} className="bg-blue-600 hover:bg-blue-700 text-white">Buy Now</Button>
                  <Button variant="outline" onClick={() => handleAddToCart(mostLoved)}>Add to Cart</Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Subcategories */}
      {category.subcategories.length > 0 && (
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex items-center gap-6 overflow-x-auto">
              <span className="text-sm font-medium text-slate-700 whitespace-nowrap">Shop by:</span>
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/category/${category.slug}/${subcategory.slug}`}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  <span>{subcategory.name}</span>
                  <span className="text-xs text-slate-500">({subcategory.productCount})</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  size="sm"
                  className="text-slate-600"
                >
                  Clear All
                </Button>
              </div>

              {/* Subcategories */}
              {availableFilters.subcategories.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Subcategories</h4>
                  <div className="space-y-2">
                    {availableFilters.subcategories.map((subcategory) => (
                      <label key={subcategory.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.subcategories.includes(subcategory.name)}
                            onChange={(e) => {
                              const newSubcategories = e.target.checked
                                ? [...filters.subcategories, subcategory.name]
                                : filters.subcategories.filter(s => s !== subcategory.name);
                              handleFilterChange('subcategories', newSubcategories);
                            }}
                            className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-slate-700">{subcategory.name}</span>
                        </div>
                        <span className="text-sm text-slate-500">({subcategory.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Brands */}
              {availableFilters.brands.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Brands</h4>
                  <div className="space-y-2">
                    {availableFilters.brands.map((brand) => (
                      <label key={brand.name} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.brands.includes(brand.name)}
                            onChange={(e) => {
                              const newBrands = e.target.checked
                                ? [...filters.brands, brand.name]
                                : filters.brands.filter(b => b !== brand.name);
                              handleFilterChange('brands', newBrands);
                            }}
                            className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-slate-700">{brand.name}</span>
                        </div>
                        <span className="text-sm text-slate-500">({brand.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={filters.priceRange[0]}
                      onChange={(e) => handleFilterChange('priceRange', [parseInt(e.target.value) || 0, filters.priceRange[1]])}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      placeholder="Min"
                    />
                    <span className="text-slate-500">to</span>
                    <input
                      type="number"
                      value={filters.priceRange[1]}
                      onChange={(e) => handleFilterChange('priceRange', [filters.priceRange[0], parseInt(e.target.value) || 10000])}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      placeholder="Max"
                    />
                  </div>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">Minimum Rating</h4>
                <div className="space-y-2">
                  {[4, 3, 2, 1].map((rating) => (
                    <label key={rating} className="flex items-center">
                      <input
                        type="radio"
                        name="rating"
                        checked={filters.rating === rating}
                        onChange={() => handleFilterChange('rating', rating)}
                        className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                      />
                      <div className="ml-2 flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < rating ? 'text-yellow-400 fill-current' : 'text-slate-300'
                            }`}
                          />
                        ))}
                        <span className="ml-1 text-sm text-slate-700">& up</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quick Filters */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">Quick Filters</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">In Stock Only</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.onSale}
                      onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">On Sale</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.isNew}
                      onChange={(e) => handleFilterChange('isNew', e.target.checked)}
                      className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-slate-700">New Arrivals</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="lg:col-span-3">
            {/* Sort and View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
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
                <Button
                  onClick={() => setShowFilters(!showFilters)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your filters</p>
                <Button onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' 
                : 'space-y-4'
              }>
                <AnimatePresence>
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      className={viewMode === 'list' ? 'flex' : ''}
                    >
                      <SharedProductCard
                        slug={product.slug}
                        title={product.title}
                        price={product.price}
                        image={product.images?.[0]}
                        discount={product.discount}
                        onAddToCart={() => handleAddToCart(product)}
                        onBuyNow={() => handleBuyNow(product)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
