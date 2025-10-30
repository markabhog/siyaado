import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAutocompleteSuggestions, extractSearchTerms, autoCorrectTypo } from '@/lib/search-utils';

// Cache for search terms (refresh every 5 minutes)
let cachedTerms: string[] = [];
let lastCacheUpdate = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getSearchTerms(): Promise<string[]> {
  const now = Date.now();
  
  // Return cached terms if still valid
  if (cachedTerms.length > 0 && now - lastCacheUpdate < CACHE_DURATION) {
    return cachedTerms;
  }
  
  // Fetch fresh data
  const products = await prisma.product.findMany({
    where: { active: true },
    select: {
      title: true,
      brand: true,
      categories: {
        select: {
          name: true
        }
      }
    },
    take: 500 // Limit for performance
  });
  
  // Extract and cache terms
  cachedTerms = extractSearchTerms(products);
  lastCacheUpdate = now;
  
  return cachedTerms;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }
    
    // Get all search terms
    const allTerms = await getSearchTerms();
    
    // Auto-correct common typos
    const correctedQuery = autoCorrectTypo(query);
    const didCorrect = correctedQuery.toLowerCase() !== query.toLowerCase();
    
    // Get autocomplete suggestions
    const suggestions = getAutocompleteSuggestions(
      didCorrect ? correctedQuery : query,
      allTerms,
      8 // Max 8 suggestions
    );
    
    // Get popular products matching the query
    const products = await prisma.product.findMany({
      where: {
        active: true,
        OR: [
          { title: { contains: correctedQuery.toLowerCase() } },
          { brand: { contains: correctedQuery.toLowerCase() } }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        price: true,
        images: true,
        brand: true
      },
      take: 5,
      orderBy: [
        { reviewCount: 'desc' },
        { rating: 'desc' }
      ]
    });
    
    return NextResponse.json({
      suggestions,
      products,
      correctedQuery: didCorrect ? correctedQuery : null,
      originalQuery: query
    });
  } catch (error) {
    console.error('Error getting search suggestions:', error);
    return NextResponse.json({ 
      suggestions: [],
      products: [],
      correctedQuery: null
    });
  }
}

