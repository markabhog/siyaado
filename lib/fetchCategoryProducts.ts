/**
 * Utility function to safely parse JSON fields
 * Handles both string and already-parsed objects
 */
export function safeParseJSON(value: any, defaultValue: any = null) {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  if (typeof value === 'string') {
    if (!value.trim()) return defaultValue;
    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  }
  return value;
}

/**
 * Safe parse for images - ensures array
 */
export function safeParseImages(value: any): string[] {
  const parsed = safeParseJSON(value, []);
  return Array.isArray(parsed) ? parsed : [];
}

/**
 * Safe parse for attributes - ensures object
 */
export function safeParseAttributes(value: any): Record<string, any> {
  const parsed = safeParseJSON(value, {});
  return parsed && typeof parsed === 'object' && !Array.isArray(parsed) ? parsed : {};
}

/**
 * Safe parse for tags - ensures array
 */
export function safeParseTags(value: any): string[] {
  const parsed = safeParseJSON(value, []);
  return Array.isArray(parsed) ? parsed : [];
}

/**
 * Utility function to fetch products by category
 * Handles JSON parsing and data transformation
 */
export async function fetchCategoryProducts(categorySlug: string) {
  try {
    const response = await fetch(`/api/products?category=${categorySlug}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    const products = Array.isArray(data) ? data : (data.products || []);
    
    // Parse JSON fields - handle both strings and already-parsed objects
    return products.map((product: any) => ({
      ...product,
      images: Array.isArray(safeParseJSON(product.images, [])) 
        ? safeParseJSON(product.images, [])
        : [],
      attributes: typeof safeParseJSON(product.attributes, {}) === 'object'
        ? safeParseJSON(product.attributes, {})
        : {},
      tags: Array.isArray(safeParseJSON(product.tags, []))
        ? safeParseJSON(product.tags, [])
        : [],
      specifications: typeof safeParseJSON(product.specifications, {}) === 'object'
        ? safeParseJSON(product.specifications, {})
        : {}
    }));
  } catch (error) {
    console.error(`Error fetching ${categorySlug} products:`, error);
    throw error;
  }
}

