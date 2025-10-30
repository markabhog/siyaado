"use client";
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui';
import { ProductCard as SharedProductCard } from '@/app/components/ProductCard';
import { useCartStore } from '@/lib/cartStore';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye,
  ChevronDown,
  X,
  SlidersHorizontal,
  SortAsc,
  SortDesc,
  DollarSign,
  Truck,
  Shield,
  Clock
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
  category: string;
  brand: string;
  isNew?: boolean;
  isFeatured?: boolean;
  discount?: number;
  description: string;
  createdAt?: string;
}

interface FilterOptions {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  rating: number;
  inStock: boolean;
  onSale: boolean;
  isNew: boolean;
}

interface SortOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [correctedQuery, setCorrectedQuery] = useState<string | null>(null);
  const [originalQuery, setOriginalQuery] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState<FilterOptions>({
    categories: [],
    brands: [],
    priceRange: [0, 10000],
    rating: 0,
    inStock: false,
    onSale: false,
    isNew: false
  });
  const [availableFilters, setAvailableFilters] = useState<{
    categories: { name: string; count: number }[];
    brands: { name: string; count: number }[];
    maxPrice: number;
    priceRange?: { min: number; max: number };
    ratings?: { stars: number; count: number }[];
    availability?: { inStock: number; onSale: number; newProducts: number };
  }>({
    categories: [],
    brands: [],
    maxPrice: 10000
  });

  const sortOptions: SortOption[] = [
    { value: 'relevance', label: 'Relevance', icon: <Search className="h-4 w-4" /> },
    { value: 'price-low', label: 'Price: Low to High', icon: <SortAsc className="h-4 w-4" /> },
    { value: 'price-high', label: 'Price: High to Low', icon: <SortDesc className="h-4 w-4" /> },
    { value: 'rating', label: 'Highest Rated', icon: <Star className="h-4 w-4" /> },
    { value: 'newest', label: 'Newest First', icon: <Clock className="h-4 w-4" /> },
    { value: 'popular', label: 'Most Popular', icon: <Star className="h-4 w-4" /> }
  ];

  // Sync searchQuery with URL parameter
  useEffect(() => {
    const urlQuery = searchParams.get('q') || '';
    if (urlQuery !== searchQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchSearchResults();
  }, [searchQuery, filters, sortBy]);

  const fetchSearchResults = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (filters.categories.length) params.append('categories', filters.categories.join(','));
      if (filters.brands.length) params.append('brands', filters.brands.join(','));
      if (filters.priceRange[0] > 0) params.append('minPrice', filters.priceRange[0].toString());
      if (filters.priceRange[1] < 10000) params.append('maxPrice', filters.priceRange[1].toString());
      if (filters.rating > 0) params.append('minRating', filters.rating.toString());
      if (filters.inStock) params.append('inStock', 'true');
      if (filters.onSale) params.append('onSale', 'true');
      if (filters.isNew) params.append('isNew', 'true');
      params.append('sort', sortBy);

      const response = await fetch(`/api/search?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
        setAvailableFilters(data.filters || availableFilters);
        setCorrectedQuery(data.correctedQuery || null);
        setOriginalQuery(data.originalQuery || null);
      } else {
        // Fallback to mock data
        setProducts(getMockProducts());
        setAvailableFilters({
          categories: [
            { name: 'Electronics', count: 245 },
            { name: 'Fashion', count: 189 },
            { name: 'Home & Garden', count: 156 }
          ],
          brands: [
            { name: 'Apple', count: 45 },
            { name: 'Samsung', count: 38 },
            { name: 'Nike', count: 67 }
          ],
          maxPrice: 10000
        });
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setProducts(getMockProducts());
    } finally {
      setLoading(false);
    }
  };

  const getMockProducts = (): Product[] => [
    {
      id: '1',
      title: 'Wireless Bluetooth Headphones',
      price: 12999,
      originalPrice: 15999,
      images: ['/api/placeholder/300/300'],
      slug: 'wireless-bluetooth-headphones',
      rating: 4.8,
      reviewCount: 156,
      stock: 45,
      category: 'Electronics',
      brand: 'Sony',
      isFeatured: true,
      discount: 19,
      description: 'High-quality wireless headphones with noise cancellation'
    },
    {
      id: '2',
      title: 'Smart Fitness Watch',
      price: 29999,
      images: ['/api/placeholder/300/300'],
      slug: 'smart-fitness-watch',
      rating: 4.6,
      reviewCount: 89,
      stock: 12,
      category: 'Electronics',
      brand: 'Apple',
      isNew: true,
      description: 'Advanced fitness tracking with heart rate monitoring'
    },
    {
      id: '3',
      title: 'Premium Coffee Maker',
      price: 8999,
      originalPrice: 12999,
      images: ['/api/placeholder/300/300'],
      slug: 'premium-coffee-maker',
      rating: 4.9,
      reviewCount: 67,
      stock: 8,
      category: 'Home & Kitchen',
      brand: 'Breville',
      discount: 31,
      description: 'Professional-grade coffee maker for the perfect brew'
    }
  ];

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply filters
    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    if (filters.brands.length > 0) {
      filtered = filtered.filter(product => 
        filters.brands.includes(product.brand)
      );
    }

    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 10000) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
      );
    }

    if (filters.rating > 0) {
      filtered = filtered.filter(product => 
        product.rating >= filters.rating
      );
    }

    if (filters.inStock) {
      filtered = filtered.filter(product => product.stock > 0);
    }

    if (filters.onSale) {
      filtered = filtered.filter(product => product.discount && product.discount > 0);
    }

    if (filters.isNew) {
      filtered = filtered.filter(product => product.isNew);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      case 'popular':
        filtered.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // Relevance - keep original order
        break;
    }

    return filtered;
  }, [products, filters, sortBy]);

  const handleFilterChange = (filterType: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
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

  const ProductCard = ({ product, index }: { product: Product; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 group ${
        viewMode === 'list' ? 'flex' : ''
      }`}
    >
      <div className={`relative ${viewMode === 'grid' ? 'h-48' : 'w-32 h-32 flex-shrink-0'}`}>
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes={viewMode === 'grid' ? "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" : "128px"}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority={false}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              NEW
            </span>
          )}
          {product.discount && (
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
          <span className="text-xs text-slate-500 uppercase tracking-wide">{product.category}</span>
        </div>
        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {product.title}
        </h3>
        
        {viewMode === 'list' && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{product.description}</p>
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                {searchQuery ? `Search results for "${searchQuery}"` : 'Search Products'}
              </h1>
              <p className="text-slate-600">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
              </p>
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
                className="flex items-center gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Auto-correction Notice */}
        {correctedQuery && originalQuery && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-slate-700">
              Showing results for <span className="font-semibold text-blue-600">"{correctedQuery}"</span>
              <span className="text-slate-500 ml-2">
                (searched for: "{originalQuery}")
              </span>
            </p>
          </div>
        )}

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

              {/* Search */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="font-medium text-slate-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {availableFilters.categories.map((category) => (
                    <label key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category.name)}
                          onChange={(e) => {
                            const newCategories = e.target.checked
                              ? [...filters.categories, category.name]
                              : filters.categories.filter(c => c !== category.name);
                            handleFilterChange('categories', newCategories);
                          }}
                          className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-slate-700">{category.name}</span>
                      </div>
                      <span className="text-sm text-slate-500">({category.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brands */}
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
              {availableFilters.ratings && availableFilters.ratings.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Customer Ratings</h4>
                  <div className="space-y-2">
                    {availableFilters.ratings.map((ratingOption) => (
                      <label key={ratingOption.stars} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            name="rating"
                            checked={filters.rating === ratingOption.stars}
                            onChange={() => handleFilterChange('rating', ratingOption.stars)}
                            className="h-4 w-4 text-blue-600 border-slate-300 focus:ring-blue-500"
                          />
                          <div className="ml-2 flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < ratingOption.stars ? 'text-yellow-400 fill-current' : 'text-slate-300'
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-sm text-slate-700">& up</span>
                          </div>
                        </div>
                        <span className="text-sm text-slate-500">({ratingOption.count})</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Filters */}
              {availableFilters.availability && (
                <div className="mb-6">
                  <h4 className="font-medium text-slate-900 mb-3">Availability</h4>
                  <div className="space-y-2">
                    {availableFilters.availability.inStock > 0 && (
                      <label className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.inStock}
                            onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-slate-700">In Stock</span>
                        </div>
                        <span className="text-sm text-slate-500">({availableFilters.availability.inStock})</span>
                      </label>
                    )}
                    {availableFilters.availability.onSale > 0 && (
                      <label className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.onSale}
                            onChange={(e) => handleFilterChange('onSale', e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-slate-700">On Sale</span>
                        </div>
                        <span className="text-sm text-slate-500">({availableFilters.availability.onSale})</span>
                      </label>
                    )}
                    {availableFilters.availability.newProducts > 0 && (
                      <label className="flex items-center justify-between">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.isNew}
                            onChange={(e) => handleFilterChange('isNew', e.target.checked)}
                            className="h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                          />
                          <span className="ml-2 text-sm text-slate-700">New Arrivals</span>
                        </div>
                        <span className="text-sm text-slate-500">({availableFilters.availability.newProducts})</span>
                      </label>
                    )}
                  </div>
                </div>
              )}
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
              <div className="text-sm text-slate-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-2 text-slate-600">Searching products...</p>
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your search or filters</p>
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

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
