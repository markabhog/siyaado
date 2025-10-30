import { prisma } from './prisma';

// E-commerce homepage logic - like Amazon, Shopify, etc.
export class HomepageLogic {
  
  // 1. FEATURED PRODUCTS - Best sellers, highest rated, newest
  static async getFeaturedProducts(limit: number = 8) {
    return await prisma.product.findMany({
      where: { 
        active: true,
        stock: { gt: 0 } // Only products in stock
      },
      include: { categories: true },
      orderBy: [
        { createdAt: 'desc' }, // Newest first
        { stock: 'desc' }       // Then by stock level
      ],
      take: limit
    });
  }

  // 2. ON SALE PRODUCTS - Products with discounts, low stock urgency
  static async getOnSaleProducts(limit: number = 8) {
    // Get products with low stock (urgency) or recent price drops
    const lowStockProducts = await prisma.product.findMany({
      where: { 
        active: true,
        stock: { lte: 10, gt: 0 } // Low stock creates urgency
      },
      include: { categories: true },
      orderBy: { stock: 'asc' },
      take: Math.ceil(limit / 2)
    });

    // Get newest products (perceived as "deals")
    const newProducts = await prisma.product.findMany({
      where: { 
        active: true,
        stock: { gt: 0 }
      },
      include: { categories: true },
      orderBy: { createdAt: 'desc' },
      take: Math.ceil(limit / 2)
    });

    // Combine and deduplicate
    const combined = [...lowStockProducts, ...newProducts];
    const unique = combined.filter((product, index, self) => 
      index === self.findIndex(p => p.id === product.id)
    );

    return unique.slice(0, limit);
  }

  // 3. TOP RATED PRODUCTS - Based on reviews, ratings, popularity
  static async getTopRatedProducts(limit: number = 8) {
    // For now, get products with highest stock (popularity indicator)
    // In real e-commerce, this would be based on actual ratings/reviews
    return await prisma.product.findMany({
      where: { 
        active: true,
        stock: { gt: 0 }
      },
      include: { categories: true },
      orderBy: [
        { stock: 'desc' },    // High stock = popular
        { createdAt: 'desc' } // Then by newest
      ],
      take: limit
    });
  }

  // 4. CATEGORY SHOWCASE - Smartphones only section
  static async getCategoryShowcase() {
    // Get smartphones category with products
    const smartphonesCategory = await prisma.category.findFirst({
      where: {
        slug: 'smartphones'
      },
      include: {
        products: {
          where: {
            active: true,
            stock: { gt: 0 }
          },
          take: 8,
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    return smartphonesCategory ? [smartphonesCategory] : [];
  }

  // 5. LAPTOP DEALS - Category-specific showcase
  static async getLaptopDeals(limit: number = 4) {
    return await prisma.product.findMany({
      where: {
        active: true,
        stock: { gt: 0 },
        categories: {
          some: {
            slug: 'laptops'
          }
        }
      },
      include: { categories: true },
      orderBy: [
        { stock: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    });
  }

  // 6. BOOK CAROUSEL - Education materials
  static async getBookCarousel(limit: number = 6) {
    return await prisma.product.findMany({
      where: {
        active: true,
        stock: { gt: 0 },
        categories: {
          some: {
            slug: 'books'
          }
        }
      },
      include: { categories: true },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
  }

  // 7. SPECIAL OFFER - Featured product with urgency
  static async getSpecialOffer() {
    // Get a product with low stock for urgency
    const urgentProduct = await prisma.product.findFirst({
      where: {
        active: true,
        stock: { lte: 5, gt: 0 } // Very low stock
      },
      include: { categories: true },
      orderBy: { stock: 'asc' }
    });

    return urgentProduct;
  }

  // 8. HERO BANNER - Featured category or promotion
  static async getHeroBanner() {
    // Get the most popular category for hero
    const popularCategory = await prisma.category.findFirst({
      where: {
        products: {
          some: {
            active: true,
            stock: { gt: 0 }
          }
        }
      },
      include: {
        products: {
          where: {
            active: true,
            stock: { gt: 0 }
          },
          take: 1,
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: { products: true }
        }
      },
      orderBy: {
        products: {
          _count: 'desc'
        }
      }
    });

    return popularCategory;
  }

  // 9. COMPLETE HOMEPAGE DATA
  static async getHomepageData() {
    const [
      featuredProducts,
      onSaleProducts,
      topRatedProducts,
      categoryShowcase,
      laptopDeals,
      bookCarousel,
      specialOffer,
      heroBanner
    ] = await Promise.all([
      this.getFeaturedProducts(8),
      this.getOnSaleProducts(8),
      this.getTopRatedProducts(8),
      this.getCategoryShowcase(),
      this.getLaptopDeals(4),
      this.getBookCarousel(6),
      this.getSpecialOffer(),
      this.getHeroBanner()
    ]);

    return {
      featuredProducts,
      onSaleProducts,
      topRatedProducts,
      categoryShowcase,
      laptopDeals,
      bookCarousel,
      specialOffer,
      heroBanner,
      // Image arrays for each section
      featuredImages: featuredProducts.map(p => 
        Array.isArray(p.images) ? (p.images as string[])[0] : '/assets/products/p1.png'
      ),
      onSaleImages: onSaleProducts.map(p => 
        Array.isArray(p.images) ? (p.images as string[])[0] : '/assets/products/p2.png'
      ),
      topRatedImages: topRatedProducts.map(p => 
        Array.isArray(p.images) ? (p.images as string[])[0] : '/assets/products/p3.png'
      ),
      laptopImages: laptopDeals.map(p => 
        Array.isArray(p.images) ? (p.images as string[])[0] : '/assets/laptops/mbp.jpg'
      ),
      bookImages: bookCarousel.map(p => 
        Array.isArray(p.images) ? (p.images as string[])[0] : '/assets/books/1.jpg'
      )
    };
  }
}
