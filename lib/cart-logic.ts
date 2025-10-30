import { CartItem } from './cartStore';

// Cart Logic - Dynamic pricing, taxes, and calculations
export class CartLogic {
  
  // Calculate subtotal
  static calculateSubtotal(items: CartItem[]): number {
    return items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  }

  // Calculate shipping based on total and location
  static calculateShipping(subtotal: number, location: string = 'Somalia'): number {
    // Free shipping over $50
    if (subtotal >= 5000) return 0; // $50 in cents
    
    // Shipping rates by location
    const shippingRates = {
      'Somalia': 500, // $5
      'Kenya': 800,   // $8
      'Ethiopia': 1000, // $10
      'International': 2000, // $20
    };
    
    return shippingRates[location as keyof typeof shippingRates] || 2000;
  }

  // Calculate tax based on location and product type
  static calculateTax(subtotal: number, location: string = 'Somalia'): number {
    // Tax rates by location
    const taxRates = {
      'Somalia': 0.05, // 5%
      'Kenya': 0.08,   // 8%
      'Ethiopia': 0.10, // 10%
      'International': 0.12, // 12%
    };
    
    const rate = taxRates[location as keyof typeof taxRates] || 0.10;
    return Math.round(subtotal * rate);
  }

  // Calculate discount based on cart value and promotions
  static calculateDiscount(subtotal: number, promoCode?: string): { amount: number; type: 'percentage' | 'fixed'; description: string } {
    if (!promoCode) return { amount: 0, type: 'fixed', description: '' };
    
    const promotions = {
      'WELCOME10': { amount: 0.10, type: 'percentage' as const, description: '10% off your first order' },
      'SAVE20': { amount: 0.20, type: 'percentage' as const, description: '20% off orders over $100' },
      'FREESHIP': { amount: 0, type: 'fixed' as const, description: 'Free shipping on your order' },
      'NEWUSER': { amount: 1000, type: 'fixed' as const, description: '$10 off for new users' },
      'BULK15': { amount: 0.15, type: 'percentage' as const, description: '15% off bulk orders' },
    };
    
    const promo = promotions[promoCode as keyof typeof promotions];
    if (!promo) return { amount: 0, type: 'fixed', description: 'Invalid promo code' };
    
    // Apply percentage discount
    if (promo.type === 'percentage') {
      return {
        amount: Math.round(subtotal * promo.amount),
        type: 'percentage',
        description: promo.description
      };
    }
    
    // Apply fixed discount
    return {
      amount: Math.min(promo.amount, subtotal), // Can't discount more than subtotal
      type: 'fixed',
      description: promo.description
    };
  }

  // Calculate total with all fees
  static calculateTotal(items: CartItem[], location: string = 'Somalia', promoCode?: string): {
    subtotal: number;
    shipping: number;
    tax: number;
    discount: { amount: number; type: 'percentage' | 'fixed'; description: string };
    total: number;
    savings: number;
  } {
    const subtotal = this.calculateSubtotal(items);
    const shipping = this.calculateShipping(subtotal, location);
    const tax = this.calculateTax(subtotal, location);
    const discount = this.calculateDiscount(subtotal, promoCode);
    
    const total = subtotal + shipping + tax - discount.amount;
    const savings = discount.amount;
    
    return {
      subtotal,
      shipping,
      tax,
      discount,
      total: Math.max(0, total), // Ensure total is never negative
      savings
    };
  }

  // Get cart summary for display
  static getCartSummary(items: CartItem[], location: string = 'Somalia', promoCode?: string) {
    const calculations = this.calculateTotal(items, location, promoCode);
    const itemCount = items.reduce((sum, item) => sum + item.qty, 0);
    
    return {
      itemCount,
      ...calculations,
      hasFreeShipping: calculations.shipping === 0,
      freeShippingThreshold: 5000, // $50 in cents
      freeShippingRemaining: Math.max(0, 5000 - calculations.subtotal),
      isEligibleForDiscount: calculations.subtotal >= 10000, // $100 for bulk discount
    };
  }

  // Get recommended products based on cart contents
  static getRecommendedProducts(cartItems: CartItem[]): string[] {
    // In a real app, this would query the database for related products
    // For now, return some sample recommendations
    const recommendations = [
      'Screen Protector',
      'Protective Case',
      'Charging Cable',
      'Wireless Mouse',
      'Laptop Bag',
      'Bookmark Set',
      'Watch Band',
      'Memory Card'
    ];
    
    return recommendations.slice(0, 4);
  }

  // Validate cart for checkout
  static validateCart(items: CartItem[]): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (items.length === 0) {
      errors.push('Your cart is empty');
    }
    
    // Check for out of stock items (in real app, would check database)
    const outOfStockItems = items.filter(item => item.qty > 10); // Mock: items with qty > 10 are "out of stock"
    if (outOfStockItems.length > 0) {
      errors.push(`Some items are out of stock: ${outOfStockItems.map(item => item.title).join(', ')}`);
    }
    
    // Check for minimum order value
    const subtotal = this.calculateSubtotal(items);
    if (subtotal < 1000) { // $10 minimum
      errors.push('Minimum order value is $10');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get shipping options
  static getShippingOptions(location: string = 'Somalia') {
    const options = {
      'Somalia': [
        { id: 'standard', name: 'Standard Shipping', price: 500, days: '3-5 business days' },
        { id: 'express', name: 'Express Shipping', price: 1000, days: '1-2 business days' },
        { id: 'overnight', name: 'Overnight Delivery', price: 2000, days: 'Next business day' }
      ],
      'Kenya': [
        { id: 'standard', name: 'Standard Shipping', price: 800, days: '5-7 business days' },
        { id: 'express', name: 'Express Shipping', price: 1500, days: '2-3 business days' }
      ],
      'Ethiopia': [
        { id: 'standard', name: 'Standard Shipping', price: 1000, days: '7-10 business days' },
        { id: 'express', name: 'Express Shipping', price: 2000, days: '3-5 business days' }
      ],
      'International': [
        { id: 'standard', name: 'Standard Shipping', price: 2000, days: '10-15 business days' },
        { id: 'express', name: 'Express Shipping', price: 4000, days: '5-7 business days' }
      ]
    };
    
    return options[location as keyof typeof options] || options['International'];
  }

  // Get payment methods (placeholder for your unique system)
  static getPaymentMethods() {
    return [
      { id: 'mobile_money', name: 'Mobile Money', description: 'Pay with your mobile wallet', icon: '📱' },
      { id: 'bank_transfer', name: 'Bank Transfer', description: 'Direct bank transfer', icon: '🏦' },
      { id: 'cash_on_delivery', name: 'Cash on Delivery', description: 'Pay when you receive', icon: '💵' },
      { id: 'crypto', name: 'Cryptocurrency', description: 'Pay with Bitcoin or other crypto', icon: '₿' },
      { id: 'installments', name: 'Installments', description: 'Pay in 3 easy installments', icon: '💳' }
    ];
  }
}
