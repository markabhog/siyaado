"use client";
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/app/components/ui';
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Eye, 
  Plus, 
  Minus,
  Search,
  Filter,
  SortAsc,
  Grid,
  List,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    slug: string;
    stock: number;
    active: boolean;
    categories: {
      name: string;
      slug: string;
    }[];
  };
  createdAt: string;
}

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState('');
  const [categories, setCategories] = useState<{id: string, name: string, slug: string}[]>([]);
  const [removingItems, setRemovingItems] = useState<string[]>([]);
  const [addingToCart, setAddingToCart] = useState<string[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetchWishlistItems();
      fetchCategories();
    }
  }, [session]);

  const fetchWishlistItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wishlist');
      if (response.ok) {
        const data = await response.json();
        setWishlistItems(data);
      } else {
        console.error('Failed to fetch wishlist items');
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const removeFromWishlist = async (itemId: string) => {
    try {
      setRemovingItems(prev => [...prev, itemId]);
      const response = await fetch(`/api/wishlist/${itemId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      } else {
        alert('Failed to remove item from wishlist');
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      alert('Error removing item from wishlist');
    } finally {
      setRemovingItems(prev => prev.filter(id => id !== itemId));
    }
  };

  const addToCart = async (productId: string) => {
    try {
      setAddingToCart(prev => [...prev, productId]);
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          quantity: 1
        })
      });
      
      if (response.ok) {
        // Show success feedback
        alert('Item added to cart successfully!');
      } else {
        alert('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding item to cart');
    } finally {
      setAddingToCart(prev => prev.filter(id => id !== productId));
    }
  };

  const filteredItems = wishlistItems.filter(item => {
    const matchesSearch = item.product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.product.categories.some(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !filterCategory || item.product.categories.some(cat => cat.slug === filterCategory);
    return matchesSearch && matchesCategory;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'price-low':
        return a.product.price - b.product.price;
      case 'price-high':
        return b.product.price - a.product.price;
      case 'name':
        return a.product.title.localeCompare(b.product.title);
      default:
        return 0;
    }
  });

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">My Wishlist</h1>
              <p className="text-slate-600 mt-2">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            <div className="flex items-center gap-3">
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
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-slate-600">Loading wishlist...</p>
            </div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Your wishlist is empty</h3>
            <p className="text-slate-600 mb-6">Start adding items you love to your wishlist</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Filters and Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search items..."
                      className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name A-Z</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      setSearchQuery('');
                      setFilterCategory('');
                      setSortBy('newest');
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* Wishlist Items */}
            <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'space-y-4'}>
              <AnimatePresence>
                {sortedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 ${
                      viewMode === 'list' ? 'flex' : ''
                    }`}
                  >
                    {/* Product Image */}
                    <div className={`relative ${viewMode === 'grid' ? 'h-48' : 'w-32 h-32 flex-shrink-0'}`}>
                      {item.product.images && item.product.images.length > 0 ? (
                        <Image
                          src={Array.isArray(item.product.images) ? item.product.images[0] : item.product.images}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                          <div className="text-2xl text-slate-400">📦</div>
                        </div>
                      )}
                      
                      {/* Remove Button */}
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        disabled={removingItems.includes(item.id)}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-sm transition-colors disabled:opacity-50"
                      >
                        {removingItems.includes(item.id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-600" />
                        )}
                      </button>

                      {/* Stock Status */}
                      {item.product.stock === 0 && (
                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                          Out of Stock
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <div className="mb-3">
                        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-1">
                          {item.product.title}
                        </h3>
                        <p className="text-2xl font-bold text-blue-600">
                          ${(item.product.price / 100).toFixed(2)}
                        </p>
                        {item.product.categories.length > 0 && (
                          <p className="text-sm text-slate-500 mt-1">
                            {item.product.categories[0].name}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/product/${item.product.slug}`} className="flex-1">
                          <Button variant="outline" className="w-full flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </Link>
                        <Button
                          onClick={() => addToCart(item.product.id)}
                          disabled={addingToCart.includes(item.product.id) || item.product.stock === 0 || !item.product.active}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                        >
                          {addingToCart.includes(item.product.id) ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="h-4 w-4 mr-2" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>

                      {!item.product.active && (
                        <div className="mt-2 flex items-center gap-2 text-amber-600 text-sm">
                          <AlertCircle className="h-4 w-4" />
                          Product no longer available
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Results Summary */}
            {filteredItems.length !== wishlistItems.length && (
              <div className="mt-6 text-center">
                <p className="text-slate-600">
                  Showing {filteredItems.length} of {wishlistItems.length} items
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
