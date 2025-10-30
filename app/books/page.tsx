"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui';
import CategoryHero from '@/app/components/CategoryHero';
import { 
  Heart, 
  ShoppingCart, 
  Eye,
  Star,
  BookOpen,
  BookMarked,
  GraduationCap,
  Lightbulb,
  Award,
  Filter,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Search,
  Clock,
  Users,
  CheckCircle,
  Star as StarIcon,
  Book,
  PenTool,
  Globe,
  Zap,
  Crown,
  Shield,
  Truck
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { safeParseImages, safeParseAttributes, safeParseTags } from '@/lib/fetchCategoryProducts';

interface Book {
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
  author: string;
  publisher: string;
  isbn: string;
  pages: number;
  language: string;
  format: string;
  genre: string[];
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
  discount?: number;
  description: string;
  publishedDate: string;
  ageRange: string;
}

interface BookCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  productCount: number;
  popularAuthors: string[];
}

const bookCategories: BookCategory[] = [
  { 
    id: '1', 
    name: 'Fiction', 
    icon: <BookOpen className="h-6 w-6" />, 
    color: 'bg-blue-500', 
    description: 'Imaginative stories', 
    productCount: 245,
    popularAuthors: ['Stephen King', 'J.K. Rowling', 'George R.R. Martin']
  },
  { 
    id: '2', 
    name: 'Non-Fiction', 
    icon: <BookMarked className="h-6 w-6" />, 
    color: 'bg-green-500', 
    description: 'Real-world knowledge', 
    productCount: 189,
    popularAuthors: ['Malcolm Gladwell', 'Yuval Noah Harari', 'Brené Brown']
  },
  { 
    id: '3', 
    name: 'Education', 
    icon: <GraduationCap className="h-6 w-6" />, 
    color: 'bg-purple-500', 
    description: 'Learning resources', 
    productCount: 156,
    popularAuthors: ['Various Authors', 'Academic Publishers', 'Educational Experts']
  },
  { 
    id: '4', 
    name: 'Self-Help', 
    icon: <Lightbulb className="h-6 w-6" />, 
    color: 'bg-yellow-500', 
    description: 'Personal development', 
    productCount: 98,
    popularAuthors: ['Tony Robbins', 'Dale Carnegie', 'Napoleon Hill']
  },
  { 
    id: '5', 
    name: 'Children\'s', 
    icon: <Book className="h-6 w-6" />, 
    color: 'bg-pink-500', 
    description: 'Books for kids', 
    productCount: 134,
    popularAuthors: ['Dr. Seuss', 'Roald Dahl', 'J.K. Rowling']
  },
  { 
    id: '6', 
    name: 'Business', 
    icon: <Award className="h-6 w-6" />, 
    color: 'bg-indigo-500', 
    description: 'Professional growth', 
    productCount: 87,
    popularAuthors: ['Peter Drucker', 'Jim Collins', 'Seth Godin']
  }
];

const genres = [
  { name: 'Mystery', icon: '🔍', color: 'bg-gray-100 text-gray-700' },
  { name: 'Romance', icon: '💕', color: 'bg-pink-100 text-pink-700' },
  { name: 'Thriller', icon: '⚡', color: 'bg-red-100 text-red-700' },
  { name: 'Fantasy', icon: '🧙', color: 'bg-purple-100 text-purple-700' },
  { name: 'Sci-Fi', icon: '🚀', color: 'bg-blue-100 text-blue-700' },
  { name: 'Biography', icon: '📖', color: 'bg-green-100 text-green-700' }
];

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBooksData();
  }, []);

  const fetchBooksData = async () => {
    try {
      setLoading(true);
      // Fetch products from the books category
      const response = await fetch('/api/products?category=books');
      if (response.ok) {
        const data = await response.json();
        
        // Parse and transform products to book format
        const products = Array.isArray(data) ? data : (data.products || []);
        const transformedBooks: Book[] = products.map((product: any) => {
          // Parse JSON fields using safe helper functions
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
            category: product.categories?.[0]?.name || 'Books',
            author: attributes?.author || 'Unknown Author',
            publisher: attributes?.publisher || 'Unknown Publisher',
            isbn: attributes?.isbn || '',
            pages: attributes?.pages || 0,
            language: attributes?.language || 'English',
            format: attributes?.format || 'Paperback',
            genre: tags || [],
            isNew: product.isNew || false,
            isBestseller: tags?.includes('Best Seller') || false,
            isFeatured: product.featured || false,
            discount: product.compareAtPrice ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) : 0,
            description: product.description || product.shortDesc || '',
            publishedDate: attributes?.publicationDate || new Date().toISOString().split('T')[0],
            ageRange: attributes?.ageRange || 'Adult'
          };
        });
        
        setBooks(transformedBooks);
      } else {
        console.error('Failed to fetch books, using mock data');
        setBooks(getMockBooks());
      }
    } catch (error) {
      console.error('Error fetching books data:', error);
      setBooks(getMockBooks());
    } finally {
      setLoading(false);
    }
  };

  const getMockBooks = (): Book[] => [
    {
      id: '1',
      title: 'The Psychology of Money',
      price: 1999,
      originalPrice: 2499,
      images: ['/api/placeholder/300/300'],
      slug: 'psychology-of-money',
      rating: 4.8,
      reviewCount: 156,
      stock: 45,
      category: 'Non-Fiction',
      author: 'Morgan Housel',
      publisher: 'Harriman House',
      isbn: '978-0857197689',
      pages: 256,
      language: 'English',
      format: 'Paperback',
      genre: ['Finance', 'Psychology', 'Self-Help'],
      isBestseller: true,
      discount: 20,
      description: 'Timeless lessons on wealth, greed, and happiness',
      publishedDate: '2020-09-08',
      ageRange: 'Adult'
    },
    {
      id: '2',
      title: 'Atomic Habits',
      price: 1799,
      images: ['/api/placeholder/300/300'],
      slug: 'atomic-habits',
      rating: 4.9,
      reviewCount: 234,
      stock: 32,
      category: 'Self-Help',
      author: 'James Clear',
      publisher: 'Avery',
      isbn: '978-0735211292',
      pages: 320,
      language: 'English',
      format: 'Hardcover',
      genre: ['Self-Help', 'Productivity', 'Psychology'],
      isFeatured: true,
      description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones',
      publishedDate: '2018-10-16',
      ageRange: 'Adult'
    },
    {
      id: '3',
      title: 'Harry Potter and the Philosopher\'s Stone',
      price: 1299,
      originalPrice: 1599,
      images: ['/api/placeholder/300/300'],
      slug: 'harry-potter-philosophers-stone',
      rating: 4.7,
      reviewCount: 189,
      stock: 67,
      category: 'Fiction',
      author: 'J.K. Rowling',
      publisher: 'Bloomsbury',
      isbn: '978-0747532699',
      pages: 223,
      language: 'English',
      format: 'Paperback',
      genre: ['Fantasy', 'Children\'s', 'Adventure'],
      isNew: true,
      discount: 19,
      description: 'The magical first book in the Harry Potter series',
      publishedDate: '1997-06-26',
      ageRange: '9-12'
    }
  ];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || book.category === selectedCategory;
    const matchesGenre = !selectedGenre || book.genre.includes(selectedGenre);
    const matchesPrice = book.price >= priceRange[0] * 100 && book.price <= priceRange[1] * 100;
    return matchesSearch && matchesCategory && matchesGenre && matchesPrice;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'newest':
        return new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime();
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return b.reviewCount - a.reviewCount; // Popular
    }
  });

  const BookCard = ({ book, index }: { book: Book; index: number }) => {
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
        onClick={() => router.push(`/product/${book.slug}`)}
      >
        <Image
          src={book.images[0]}
          alt={book.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
      {/* Only discount badge */}
      <div className="absolute top-3 left-3">
        {book.discount && (
          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
            -{book.discount}%
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
            <span className="text-xs text-slate-500 uppercase tracking-wide">{book.category}</span>
            <span className="text-xs text-blue-600 font-medium">{book.format}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">{book.author}</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs text-slate-500">{book.pages} pages</span>
          </div>
        </div>
        
        <h3 className="font-semibold text-slate-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {book.title}
        </h3>
        
        {viewMode === 'list' && (
          <p className="text-sm text-slate-600 mb-3 line-clamp-2">{book.description}</p>
        )}
        
        {/* Genres */}
        {viewMode === 'list' && (
          <div className="mb-3">
            <div className="flex flex-wrap gap-1">
              {book.genre.slice(0, 3).map((genre, i) => (
                <span key={i} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                  {genre}
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
                  i < Math.floor(book.rating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-600">({book.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-slate-900">
              ${(book.price / 100).toFixed(2)}
            </span>
            {book.originalPrice && (
              <span className="text-sm text-slate-500 line-through">
                ${(book.originalPrice / 100).toFixed(2)}
              </span>
            )}
          </div>
          <div className="text-sm text-slate-500">
            {book.stock > 0 ? `${book.stock} left` : 'Out of stock'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => router.push(`/product/${book.slug}`)}
            className="rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
            disabled={book.stock === 0}
          >
            Options
          </button>
          <button
            onClick={() => { 
              addItem({ productId: book.id, slug: book.slug, title: book.title, price: book.price }, 1);
              try { window.dispatchEvent(new CustomEvent('eco:cart-open')); } catch {}
            }}
            className="rounded-lg bg-blue-50 text-blue-700 border border-blue-200 py-2 text-sm font-semibold hover:bg-blue-100 cursor-pointer"
            disabled={book.stock === 0}
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
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-slate-600">Loading amazing books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <CategoryHero
        title="Read more, spend less"
        subtitle="Fiction, non‑fiction, kids, and more."
        ctaText="Shop now"
        ctaHref="/books"
        bannerKey="books"
        items={[
          { title: 'Fiction', imageSrc: '/assets/books/1.jpg', href: '/books' },
          { title: 'Non‑fiction', imageSrc: '/assets/books/2.jpg', href: '/books' },
          { title: 'Education', imageSrc: '/assets/books/3.jpg', href: '/books' },
        ]}
      />

      {/* Books */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Featured Books</h2>
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
                <option value="title">Title A-Z</option>
              </select>
            </div>
          </div>

          {books.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">No books found</h3>
              <p className="text-slate-600">Check back later for amazing books!</p>
            </div>
          ) : (
            <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
              <AnimatePresence>
                {sortedBooks.map((book, index) => (
                  <BookCard key={book.id} book={book} index={index} />
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
                Expand your mind with amazing books and discover new worlds through reading.
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
              <h4 className="font-semibold mb-4">Book Categories</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/books" className="hover:text-white">Fiction</Link></li>
                <li><Link href="/books" className="hover:text-white">Non-Fiction</Link></li>
                <li><Link href="/books" className="hover:text-white">Biography</Link></li>
                <li><Link href="/books" className="hover:text-white">Children's</Link></li>
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
