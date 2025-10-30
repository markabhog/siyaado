import { CartItem } from './cartStore';

// Checkout Logic - Enhanced checkout process with validation
export class CheckoutLogic {
  
  // Validate contact information
  static validateContact(email: string, phone: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!email.trim()) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Please enter a valid email address');
    }
    
    if (!phone.trim()) {
      errors.push('Phone number is required');
    } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(phone)) {
      errors.push('Please enter a valid phone number');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate shipping information
  static validateShipping(address: string, city: string, postalCode: string, country: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!address.trim()) {
      errors.push('Address is required');
    } else if (address.trim().length < 10) {
      errors.push('Please enter a complete address');
    }
    
    if (!city.trim()) {
      errors.push('City is required');
    }
    
    if (!postalCode.trim()) {
      errors.push('Postal code is required');
    }
    
    if (!country.trim()) {
      errors.push('Country is required');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate payment information
  static validatePayment(paymentMethod: string, paymentData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!paymentMethod) {
      errors.push('Please select a payment method');
      return { isValid: false, errors };
    }
    
    switch (paymentMethod) {
      case 'mobile_money':
        if (!paymentData.phoneNumber) {
          errors.push('Mobile money phone number is required');
        } else if (!/^[\+]?[0-9\s\-\(\)]{10,}$/.test(paymentData.phoneNumber)) {
          errors.push('Please enter a valid phone number');
        }
        break;
        
      case 'bank_transfer':
        if (!paymentData.accountNumber) {
          errors.push('Account number is required');
        }
        if (!paymentData.bankName) {
          errors.push('Bank name is required');
        }
        break;
        
      case 'cash_on_delivery':
        // No additional validation needed
        break;
        
      case 'crypto':
        if (!paymentData.walletAddress) {
          errors.push('Crypto wallet address is required');
        }
        if (!paymentData.cryptoType) {
          errors.push('Please select cryptocurrency type');
        }
        break;
        
      case 'installments':
        if (!paymentData.downPayment) {
          errors.push('Down payment amount is required');
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get payment methods with enhanced details
  static getPaymentMethods() {
    return [
      {
        id: 'mobile_money',
        name: 'Mobile Money',
        description: 'Pay with your mobile wallet',
        icon: '📱',
        popular: true,
        processingTime: 'Instant',
        fees: '2%',
        countries: ['Somalia', 'Kenya', 'Ethiopia'],
        instructions: 'Send payment to +25261 123 4567 and enter transaction ID'
      },
      {
        id: 'bank_transfer',
        name: 'Bank Transfer',
        description: 'Direct bank transfer',
        icon: '🏦',
        popular: false,
        processingTime: '1-2 business days',
        fees: '1%',
        countries: ['Somalia', 'Kenya', 'Ethiopia'],
        instructions: 'Transfer to account: 1234567890 (Somalia Bank)'
      },
      {
        id: 'cash_on_delivery',
        name: 'Cash on Delivery',
        description: 'Pay when you receive your order',
        icon: '💵',
        popular: true,
        processingTime: 'On delivery',
        fees: '5%',
        countries: ['Somalia'],
        instructions: 'Pay cash to delivery person upon receiving your order'
      },
      {
        id: 'crypto',
        name: 'Cryptocurrency',
        description: 'Pay with Bitcoin or other crypto',
        icon: '₿',
        popular: false,
        processingTime: '10-30 minutes',
        fees: '0.5%',
        countries: ['All'],
        instructions: 'Send crypto to wallet address provided after order confirmation'
      },
      {
        id: 'installments',
        name: 'Installments',
        description: 'Pay in 3 easy installments',
        icon: '💳',
        popular: false,
        processingTime: 'Monthly',
        fees: '3%',
        countries: ['Somalia'],
        instructions: 'Pay 1/3 now, remaining in 2 monthly payments'
      }
    ];
  }

  // Get shipping options with enhanced details
  static getShippingOptions(country: string = 'Somalia') {
    const options = {
      'Somalia': [
        {
          id: 'standard',
          name: 'Standard Shipping',
          description: 'Regular delivery',
          price: 500, // $5 in cents
          days: '3-5 business days',
          tracking: true,
          insurance: false
        },
        {
          id: 'express',
          name: 'Express Shipping',
          description: 'Fast delivery',
          price: 1000, // $10 in cents
          days: '1-2 business days',
          tracking: true,
          insurance: true
        },
        {
          id: 'overnight',
          name: 'Overnight Delivery',
          description: 'Next day delivery',
          price: 2000, // $20 in cents
          days: 'Next business day',
          tracking: true,
          insurance: true
        }
      ],
      'Kenya': [
        {
          id: 'standard',
          name: 'Standard Shipping',
          description: 'Regular delivery',
          price: 800, // $8 in cents
          days: '5-7 business days',
          tracking: true,
          insurance: false
        },
        {
          id: 'express',
          name: 'Express Shipping',
          description: 'Fast delivery',
          price: 1500, // $15 in cents
          days: '2-3 business days',
          tracking: true,
          insurance: true
        }
      ],
      'Ethiopia': [
        {
          id: 'standard',
          name: 'Standard Shipping',
          description: 'Regular delivery',
          price: 1000, // $10 in cents
          days: '7-10 business days',
          tracking: true,
          insurance: false
        },
        {
          id: 'express',
          name: 'Express Shipping',
          description: 'Fast delivery',
          price: 2000, // $20 in cents
          days: '3-5 business days',
          tracking: true,
          insurance: true
        }
      ]
    };
    
    return options[country as keyof typeof options] || options['Somalia'];
  }

  // Calculate order total with all fees
  static calculateOrderTotal(
    items: CartItem[],
    shippingOption: any,
    paymentMethod: string,
    promoCode?: string
  ): {
    subtotal: number;
    shipping: number;
    tax: number;
    paymentFees: number;
    discount: number;
    total: number;
    breakdown: any;
  } {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const shipping = shippingOption?.price || 0;
    const tax = Math.round(subtotal * 0.05); // 5% tax
    
    // Payment method fees
    const paymentFees = this.calculatePaymentFees(subtotal, paymentMethod);
    
    // Discount calculation
    const discount = this.calculateDiscount(subtotal, promoCode);
    
    const total = subtotal + shipping + tax + paymentFees - discount;
    
    return {
      subtotal,
      shipping,
      tax,
      paymentFees,
      discount,
      total: Math.max(0, total),
      breakdown: {
        items: items.length,
        itemTotal: subtotal,
        shippingCost: shipping,
        taxAmount: tax,
        paymentFees,
        discountAmount: discount,
        finalTotal: total
      }
    };
  }

  // Calculate payment method fees
  static calculatePaymentFees(amount: number, paymentMethod: string): number {
    const feeRates = {
      'mobile_money': 0.02, // 2%
      'bank_transfer': 0.01, // 1%
      'cash_on_delivery': 0.05, // 5%
      'crypto': 0.005, // 0.5%
      'installments': 0.03, // 3%
    };
    
    const rate = feeRates[paymentMethod as keyof typeof feeRates] || 0;
    return Math.round(amount * rate);
  }

  // Calculate discount
  static calculateDiscount(amount: number, promoCode?: string): number {
    if (!promoCode) return 0;
    
    const discounts = {
      'WELCOME10': 0.10, // 10%
      'SAVE20': 0.20, // 20%
      'FREESHIP': 0, // Free shipping (handled separately)
      'NEWUSER': 1000, // $10 fixed
      'BULK15': 0.15, // 15%
    };
    
    const discount = discounts[promoCode as keyof typeof discounts];
    if (!discount) return 0;
    
    if (promoCode === 'NEWUSER') {
      return Math.min(discount, amount);
    }
    
    return Math.round(amount * discount);
  }

  // Generate order summary
  static generateOrderSummary(
    items: CartItem[],
    contactInfo: any,
    shippingInfo: any,
    paymentInfo: any,
    totals: any
  ) {
    return {
      orderNumber: `LUUL-${Date.now()}`,
      timestamp: new Date().toISOString(),
      contact: contactInfo,
      shipping: shippingInfo,
      payment: paymentInfo,
      items: items.map(item => ({
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: item.qty,
        total: item.price * item.qty
      })),
      totals,
      status: 'pending',
      estimatedDelivery: this.calculateDeliveryDate(shippingInfo.shippingOption)
    };
  }

  // Calculate estimated delivery date
  static calculateDeliveryDate(shippingOption: any): string {
    const days = shippingOption?.days || '3-5 business days';
    const businessDays = parseInt(days.split('-')[0]);
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + businessDays);
    return deliveryDate.toISOString().split('T')[0];
  }

  // Validate complete checkout
  static validateCheckout(checkoutData: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Validate contact
    const contactValidation = this.validateContact(
      checkoutData.contact?.email || '',
      checkoutData.contact?.phone || ''
    );
    if (!contactValidation.isValid) {
      errors.push(...contactValidation.errors);
    }
    
    // Validate shipping
    const shippingValidation = this.validateShipping(
      checkoutData.shipping?.address || '',
      checkoutData.shipping?.city || '',
      checkoutData.shipping?.postalCode || '',
      checkoutData.shipping?.country || ''
    );
    if (!shippingValidation.isValid) {
      errors.push(...shippingValidation.errors);
    }
    
    // Validate payment
    const paymentValidation = this.validatePayment(
      checkoutData.payment?.method || '',
      checkoutData.payment?.data || {}
    );
    if (!paymentValidation.isValid) {
      errors.push(...paymentValidation.errors);
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
