import { prisma } from './prisma';

// Product Detail Page Logic - Enhanced with dynamic data from attributes
export class ProductLogic {
  
  // Get enhanced product data with dynamic calculations
  static async getEnhancedProduct(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { 
        categories: true,
        variants: true,
        discounts: {
          where: {
            active: true,
            OR: [
              { startsAt: null },
              { startsAt: { lte: new Date() } }
            ],
            AND: [
              {
                OR: [
                  { endsAt: null },
                  { endsAt: { gte: new Date() } }
                ]
              }
            ]
          }
        }
      },
    });

    if (!product) return null;

    // Parse JSON fields
    const images = this.parseJSON(product.images) || [];
    const attributes = this.parseJSON(product.attributes) || {};
    const specifications = this.parseJSON(product.specifications) || {};
    const features = this.parseJSON(product.features) || {};
    const highlights = this.parseJSON(product.highlights) || [];
    const tags = this.parseJSON(product.tags) || [];

    // Calculate dynamic pricing
    const mrp = product.compareAtPrice || Math.round(product.price * 1.4); // Use compareAtPrice or 40% markup
    const discount = Math.round(((mrp - product.price) / mrp) * 100);
    
    // Generate dynamic highlights based on product data
    const dynamicHighlights = this.generateHighlights(product, attributes, highlights);
    
    // Generate dynamic specifications from attributes
    const dynamicSpecifications = this.generateSpecifications(product, attributes, specifications);
    
    // Get real reviews from database
    const reviews = await this.getReviews(product.id);
    
    // Use product rating or calculate from reviews
    const rating = product.rating || this.calculateRating(reviews);
    const reviewsCount = product.reviewCount || reviews.length;

    // Generate trust badges based on product attributes
    const trustBadges = this.generateTrustBadges(product, attributes);

    // Generate category-specific features
    const categoryFeatures = this.generateCategoryFeatures(product, attributes);

    return {
      id: product.id,
      slug: product.slug,
      sku: product.sku,
      title: product.title,
      description: product.description || product.shortDesc || 'Premium quality product with excellent features.',
      price: product.price,
      stock: product.stock,
      images,
      categories: product.categories,
      rating,
      reviewsCount,
      mrp,
      discount,
      highlights: dynamicHighlights,
      specifications: dynamicSpecifications,
      reviews,
      brand: product.brand || attributes.brand || 'Luul',
      features: features,
      attributes,
      tags,
      trustBadges,
      categoryFeatures,
      variants: product.variants,
      discounts: product.discounts,
      warranty: product.warranty || attributes.warranty || '1 Year Warranty',
      returnPolicy: product.returnDays ? `${product.returnDays}-Day Returns` : '7-Day Returns',
      freeShipping: product.freeShipping !== false,
      estimatedDelivery: '3-5 Business Days',
      lowStock: product.trackInventory && product.stock <= (product.lowStockThreshold || 10),
      isNew: product.isNew,
      onSale: product.onSale,
      featured: product.featured,
    };
  }

  // Parse JSON fields safely
  static parseJSON(field: any): any {
    if (!field) return null;
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return null;
      }
    }
    return field;
  }

  // Generate category-specific highlights from product data
  static generateHighlights(product: any, attributes: any, highlights: any[]) {
    // If product has custom highlights, use them
    if (highlights && highlights.length > 0) {
      return highlights;
    }

    const category = product.categories[0]?.slug || '';
    const generatedHighlights: string[] = [];

    // Category-specific highlights based on attributes
    if (category.includes('phone')) {
      if (attributes.processor) generatedHighlights.push(`Powerful ${attributes.processor} Processor`);
      if (attributes.ram) generatedHighlights.push(`${attributes.ram} RAM for Smooth Performance`);
      if (attributes.camera) generatedHighlights.push(`${attributes.camera} Camera System`);
      if (attributes.battery) generatedHighlights.push(`${attributes.battery} Long-lasting Battery`);
      if (attributes.display) generatedHighlights.push(`${attributes.display} Display`);
    } else if (category.includes('laptop')) {
      if (attributes.processor) generatedHighlights.push(`${attributes.processor} Processor`);
      if (attributes.ram) generatedHighlights.push(`${attributes.ram} RAM`);
      if (attributes.storage) generatedHighlights.push(`${attributes.storage} Storage`);
      if (attributes.graphics) generatedHighlights.push(`${attributes.graphics} Graphics`);
      if (attributes.display) generatedHighlights.push(`${attributes.display} Display`);
    } else if (category.includes('book')) {
      if (attributes.author) generatedHighlights.push(`By ${attributes.author}`);
      if (attributes.pages) generatedHighlights.push(`${attributes.pages} Pages`);
      if (attributes.publisher) generatedHighlights.push(`Published by ${attributes.publisher}`);
      if (attributes.format) generatedHighlights.push(`${attributes.format} Edition`);
      if (attributes.language) generatedHighlights.push(`${attributes.language} Language`);
    } else if (category.includes('beauty') || category.includes('personal-care')) {
      if (attributes.volume) generatedHighlights.push(`${attributes.volume} Size`);
      if (attributes.isNatural) generatedHighlights.push('Natural & Organic');
      if (attributes.isCrueltyFree) generatedHighlights.push('Cruelty-Free');
      if (attributes.isVegan) generatedHighlights.push('100% Vegan');
      if (attributes.skinType) generatedHighlights.push(`Suitable for ${attributes.skinType} Skin`);
    } else if (category.includes('watch')) {
      if (attributes.type) generatedHighlights.push(`${attributes.type}`);
      if (attributes.battery) generatedHighlights.push(`${attributes.battery} Battery Life`);
      if (attributes.waterResistance) generatedHighlights.push(`${attributes.waterResistance} Water Resistant`);
      if (attributes.display) generatedHighlights.push(`${attributes.display} Display`);
    } else if (category.includes('diaper')) {
      if (attributes.size) generatedHighlights.push(`Size: ${attributes.size}`);
      if (attributes.count) generatedHighlights.push(`${attributes.count} Diapers per Pack`);
      if (attributes.weightRange) generatedHighlights.push(`For ${attributes.weightRange}`);
    } else if (category.includes('fashion') || category.includes('clothing') || category.includes('men') || category.includes('women') || category.includes('kids')) {
      if (attributes.fabric) generatedHighlights.push(`${attributes.fabric} Fabric`);
      if (attributes.fit) generatedHighlights.push(`${attributes.fit} Fit`);
      if (attributes.season) generatedHighlights.push(`${attributes.season}`);
      if (attributes.occasion) generatedHighlights.push(`Perfect for ${attributes.occasion}`);
    }

    // Add generic highlights if not enough
    if (generatedHighlights.length < 3) {
      if (product.brand) generatedHighlights.push(`Authentic ${product.brand} Product`);
      if (product.warranty) generatedHighlights.push(product.warranty);
      if (product.freeShipping !== false) generatedHighlights.push('Free Shipping Available');
      generatedHighlights.push('Premium Quality Guaranteed');
      generatedHighlights.push('Fast & Secure Delivery');
    }

    return generatedHighlights.slice(0, 5); // Return top 5 highlights
  }

  // Generate specifications from product attributes
  static generateSpecifications(product: any, attributes: any, specifications: any) {
    // If product has custom specifications, merge with attributes
    const specs: Record<string, string> = {};

    // Add all attributes as specifications
    if (attributes && typeof attributes === 'object') {
      Object.entries(attributes).forEach(([key, value]) => {
        if (value && typeof value !== 'object') {
          // Convert camelCase to Title Case
          const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
          specs[label] = String(value);
        }
      });
    }

    // Add custom specifications
    if (specifications && typeof specifications === 'object') {
      Object.entries(specifications).forEach(([key, value]) => {
        if (value) {
          specs[key] = String(value);
        }
      });
    }

    // Add product-level specifications
    if (product.brand) specs['Brand'] = product.brand;
    if (product.sku) specs['SKU'] = product.sku;
    if (product.weight) specs['Weight'] = `${product.weight}`;
    if (product.color) specs['Color'] = product.color;
    if (product.size) specs['Size'] = product.size;
    if (product.material) specs['Material'] = product.material;
    if (product.manufacturer) specs['Manufacturer'] = product.manufacturer;
    if (product.warranty) specs['Warranty'] = product.warranty;
    if (product.returnPolicy) specs['Return Policy'] = product.returnPolicy;

    return specs;
  }

  // Get real reviews from database
  static async getReviews(productId: string) {
    try {
      const reviews = await prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      return reviews.map(review => ({
        id: review.id,
        name: review.user?.name || review.user?.email?.split('@')[0] || 'Anonymous',
        rating: review.rating,
        date: this.formatDate(review.createdAt),
        text: review.comment,
        title: review.title,
        images: this.parseJSON(review.images) || [],
        verified: review.verified,
      }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  // Calculate average rating from reviews
  static calculateRating(reviews: any[]) {
    if (reviews.length === 0) return 4.3;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  }

  // Format date for display
  static formatDate(date: Date) {
    const now = new Date();
    const diffTime = now.getTime() - new Date(date).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 1) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return new Date(date).toLocaleDateString();
  }

  // Generate trust badges based on product attributes
  static generateTrustBadges(product: any, attributes: any) {
    const badges: Array<{ icon: string; text: string; color: string }> = [];

    if (product.freeShipping !== false) {
      badges.push({ icon: '🚚', text: 'Free Delivery', color: 'green' });
    }

    if (product.returnPolicy || attributes.returnPolicy) {
      badges.push({ icon: '↩️', text: '7-Day Returns', color: 'blue' });
    }

    if (product.warranty || attributes.warranty) {
      const warranty = product.warranty || attributes.warranty;
      badges.push({ icon: '🛡️', text: warranty, color: 'purple' });
    }

    badges.push({ icon: '🔒', text: 'Secure Payment', color: 'orange' });

    if (attributes.isCrueltyFree) {
      badges.push({ icon: '🐰', text: 'Cruelty-Free', color: 'pink' });
    }

    if (attributes.isVegan) {
      badges.push({ icon: '🌱', text: 'Vegan', color: 'green' });
    }

    if (attributes.isNatural) {
      badges.push({ icon: '🍃', text: 'Natural', color: 'green' });
    }

    return badges.slice(0, 4); // Return top 4 badges
  }

  // Generate category-specific features
  static generateCategoryFeatures(product: any, attributes: any) {
    const category = product.categories[0]?.slug || '';
    const features: Array<{ title: string; description: string }> = [];

    if (category.includes('phone') || category.includes('laptop') || category.includes('electronics')) {
      if (attributes.processor) {
        features.push({
          title: 'High Performance',
          description: `Powered by ${attributes.processor} for lightning-fast performance and multitasking.`
        });
      }
      if (attributes.battery) {
        features.push({
          title: 'Long Battery Life',
          description: `${attributes.battery} battery keeps you powered throughout the day.`
        });
      }
      if (attributes.display) {
        features.push({
          title: 'Stunning Display',
          description: `${attributes.display} display delivers vibrant colors and sharp details.`
        });
      }
    } else if (category.includes('beauty') || category.includes('personal-care')) {
      if (attributes.ingredients) {
        features.push({
          title: 'Premium Ingredients',
          description: attributes.ingredients
        });
      }
      if (attributes.benefits) {
        features.push({
          title: 'Key Benefits',
          description: attributes.benefits
        });
      }
      if (attributes.howToUse) {
        features.push({
          title: 'How to Use',
          description: attributes.howToUse
        });
      }
    } else if (category.includes('book')) {
      if (attributes.author) {
        features.push({
          title: 'About the Author',
          description: `Written by ${attributes.author}, a renowned expert in the field.`
        });
      }
      if (attributes.genre) {
        features.push({
          title: 'Genre',
          description: attributes.genre
        });
      }
    }

    return features;
  }

  // Get related products based on categories and price range
  static async getRelatedProducts(productId: string, categories: any[], price: number) {
    try {
      const products = await prisma.product.findMany({
      where: {
        id: { not: productId },
        active: true,
        stock: { gt: 0 },
        categories: { some: { id: { in: categories.map(c => c.id) } } },
        price: {
            gte: Math.floor(price * 0.5), // Within 50% price range
            lte: Math.ceil(price * 1.5)
        }
      },
      include: { categories: true },
      take: 8,
      orderBy: { createdAt: 'desc' }
    });

      return products.map(p => ({
        ...p,
        images: this.parseJSON(p.images) || [],
        rating: p.rating || 4.3,
      }));
    } catch (error) {
      console.error('Error fetching related products:', error);
      return [];
    }
  }

  // Get frequently bought together items
  static async getFrequentlyBoughtTogether(product: any) {
    try {
      // Get products from the same category with lower price (accessories)
      const accessories = await prisma.product.findMany({
        where: {
          id: { not: product.id },
          active: true,
          stock: { gt: 0 },
          categories: { some: { id: { in: product.categories.map((c: any) => c.id) } } },
          price: {
            lt: product.price * 0.3, // Accessories are typically cheaper
          }
        },
        take: 3,
        orderBy: { createdAt: 'desc' }
      });

      return accessories.map(acc => {
        const images = this.parseJSON(acc.images) || [];
        return {
          id: acc.id,
          title: acc.title,
          price: acc.price / 100, // Convert to dollars
          img: images[0] || '/assets/products/placeholder.png',
          checked: true,
        };
      });
    } catch (error) {
      console.error('Error fetching frequently bought together:', error);
      return [];
    }
  }
}
