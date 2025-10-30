import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fuzzyMatch, autoCorrectTypo, findBestMatch } from '@/lib/search-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let query = searchParams.get('q') || '';
    const categories = searchParams.get('categories')?.split(',') || [];
    const brands = searchParams.get('brands')?.split(',') || [];
    const minPrice = parseInt(searchParams.get('minPrice') || '0');
    const maxPrice = parseInt(searchParams.get('maxPrice') || '100000');
    const minRating = parseFloat(searchParams.get('minRating') || '0');
    const inStock = searchParams.get('inStock') === 'true';
    const onSale = searchParams.get('onSale') === 'true';
    const isNew = searchParams.get('isNew') === 'true';
    const sort = searchParams.get('sort') || 'relevance';
    
    // Auto-correct common typos
    const originalQuery = query;
    const correctedQuery = autoCorrectTypo(query);
    const didAutoCorrect = correctedQuery.toLowerCase() !== originalQuery.toLowerCase();
    query = correctedQuery;

    // Build where clause
    const where: any = {
      active: true
    };

    // Category filter
    if (categories.length > 0) {
      where.categories = {
        some: {
          name: { in: categories }
        }
      };
    }

    // Brand filter
    if (brands.length > 0) {
      where.brand = { in: brands };
    }

    // Price range
    if (minPrice > 0 || maxPrice < 100000) {
      where.price = {};
      if (minPrice > 0) where.price.gte = minPrice;
      if (maxPrice < 100000) where.price.lte = maxPrice;
    }

    // Rating filter
    if (minRating > 0) {
      where.rating = { gte: minRating };
    }

    // Stock filter
    if (inStock) {
      where.stock = { gt: 0 };
    }

    // Sale filter
    if (onSale) {
      where.onSale = true;
    }

    // New filter
    if (isNew) {
      where.isNew = true;
    }

    // Build orderBy clause
    let orderBy: any = {};
    switch (sort) {
      case 'price-low':
        orderBy = { price: 'asc' };
        break;
      case 'price-high':
        orderBy = { price: 'desc' };
        break;
      case 'rating':
        orderBy = { rating: 'desc' };
        break;
      case 'newest':
        orderBy = { createdAt: 'desc' };
        break;
      case 'popular':
        orderBy = { reviewCount: 'desc' };
        break;
      default:
        // Relevance - keep default order
        orderBy = { createdAt: 'desc' };
    }

    // Fetch products
    let products = await prisma.product.findMany({
      where,
      include: {
        categories: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy,
      take: 200 // Fetch more for text filtering
    });

    // Apply text search filter (case-insensitive with fuzzy matching)
    if (query) {
      const lowerQuery = query.toLowerCase();
      products = products.filter(product => {
        // Exact/substring matches (highest priority)
        const titleMatch = product.title?.toLowerCase().includes(lowerQuery);
        const descMatch = product.description?.toLowerCase().includes(lowerQuery);
        const categoryMatch = product.categories.some(cat => 
          cat.name.toLowerCase().includes(lowerQuery)
        );
        const brandMatch = product.brand?.toLowerCase().includes(lowerQuery);
        
        if (titleMatch || descMatch || categoryMatch || brandMatch) {
          return true;
        }
        
        // Fuzzy matching for typo tolerance (lower priority)
        const fuzzyTitleMatch = fuzzyMatch(lowerQuery, product.title || '', 0.7);
        const fuzzyBrandMatch = fuzzyMatch(lowerQuery, product.brand || '', 0.7);
        const fuzzyCategoryMatch = product.categories.some(cat => 
          fuzzyMatch(lowerQuery, cat.name, 0.7)
        );
        
        return fuzzyTitleMatch || fuzzyBrandMatch || fuzzyCategoryMatch;
      });
    }

    // Limit final results
    const limitedProducts = products.slice(0, 50);

    // Generate dynamic filters based on ACTUAL search results (not all products)
    // This makes filters relevant to what the user is searching for
    
    // Extract unique categories from search results
    const categoryMap = new Map<string, number>();
    products.forEach(product => {
      product.categories.forEach(cat => {
        const count = categoryMap.get(cat.name) || 0;
        categoryMap.set(cat.name, count + 1);
      });
    });

    // Extract unique brands from search results
    const brandMap = new Map<string, number>();
    products.forEach(product => {
      if (product.brand) {
        const count = brandMap.get(product.brand) || 0;
        brandMap.set(product.brand, count + 1);
      }
    });

    // Calculate price range from search results
    const prices = products.map(p => p.price).filter(p => p > 0);
    const minPriceInResults = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPriceInResults = prices.length > 0 ? Math.max(...prices) : 10000;

    // Calculate rating distribution from search results
    const ratingCounts = [0, 0, 0, 0, 0]; // 1-star to 5-star
    products.forEach(product => {
      const rating = Math.floor(product.rating || 0);
      if (rating >= 1 && rating <= 5) {
        ratingCounts[rating - 1]++;
      }
    });

    // Count products with special flags
    const inStockCount = products.filter(p => p.stock > 0).length;
    const onSaleCount = products.filter(p => p.onSale || (p as any).discount > 0).length;
    const newProductsCount = products.filter(p => p.isNew).length;

    // Helper function to safely parse images
    const safeParseImages = (images: any): string[] => {
      if (Array.isArray(images)) return images;
      if (typeof images === 'string') {
        try {
          const parsed = JSON.parse(images);
          return Array.isArray(parsed) ? parsed : [images];
        } catch {
          return [images];
        }
      }
      return ['/api/placeholder/300/300'];
    };

    // Transform products
    const transformedProducts = limitedProducts.map(product => ({
      id: product.id,
      title: product.title,
      price: product.price,
      originalPrice: product.compareAtPrice || product.price,
      images: safeParseImages(product.images),
      slug: product.slug,
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      stock: product.stock,
      category: product.categories[0]?.name || 'Uncategorized',
      brand: product.brand || 'Unknown',
      isNew: product.isNew || false,
      isFeatured: product.featured || false,
      discount: (product as any).discount || 0,
      description: product.description || ''
    }));

    // Transform filter options (based on actual search results)
    const filterOptions = {
      categories: Array.from(categoryMap.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count), // Sort by count descending
      brands: Array.from(brandMap.entries())
        .map(([name, count]) => ({ name, count }))
        .filter(b => b.name && b.name !== 'Unknown')
        .sort((a, b) => b.count - a.count), // Sort by count descending
      priceRange: {
        min: minPriceInResults,
        max: maxPriceInResults
      },
      ratings: [
        { stars: 5, count: ratingCounts[4] },
        { stars: 4, count: ratingCounts[3] },
        { stars: 3, count: ratingCounts[2] },
        { stars: 2, count: ratingCounts[1] },
        { stars: 1, count: ratingCounts[0] }
      ].filter(r => r.count > 0), // Only show ratings that exist
      availability: {
        inStock: inStockCount,
        onSale: onSaleCount,
        newProducts: newProductsCount
      },
      maxPrice: maxPriceInResults
    };

    return NextResponse.json({
      products: transformedProducts,
      filters: filterOptions,
      total: products.length,
      totalDisplayed: limitedProducts.length,
      correctedQuery: didAutoCorrect ? correctedQuery : null,
      originalQuery: didAutoCorrect ? originalQuery : null
    });
  } catch (error) {
    console.error('Error searching products:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}
