"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import { CartLogic } from "@/lib/cart-logic";
import { CheckoutLogic } from "@/lib/checkout-logic";
import { Button, Input } from "@/app/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

// Enhanced Checkout Components
const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  const steps = [
    { id: 1, label: "Contact", icon: "👤" },
    { id: 2, label: "Shipping", icon: "🚚" },
    { id: 3, label: "Payment", icon: "💳" },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex items-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full font-semibold text-sm transition-all duration-300 ${
                  currentStep >= step.id 
                    ? "bg-blue-600 text-white shadow-lg" 
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {currentStep > step.id ? "✓" : step.icon}
              </div>
              <div className="ml-3 hidden sm:block">
                <div className={`text-sm font-medium ${currentStep >= step.id ? "text-slate-900" : "text-slate-500"}`}>
                  {step.label}
                </div>
                <div className="text-xs text-slate-400">Step {step.id}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`mx-4 h-1 flex-1 rounded-full transition-all duration-300 ${
                currentStep > step.id ? "bg-blue-600" : "bg-slate-200"
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ContactStep = ({ 
  data, 
  onChange, 
  onNext, 
  errors 
}: { 
  data: any; 
  onChange: (field: string, value: string) => void; 
  onNext: () => void; 
  errors: string[] 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-lg">👤</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Contact Information</h2>
          <p className="text-sm text-slate-600">We'll use this to contact you about your order</p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800">
            {errors.map((error, index) => (
              <div key={index}>• {error}</div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
          <input
            type="email"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="+252 61 123 4567"
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="newsletter"
            className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="newsletter" className="text-sm text-slate-600">
            Subscribe to our newsletter for updates and special offers
          </label>
        </div>

        <Button
          onClick={onNext}
          disabled={!data.email || !data.phone}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
        >
          Continue to Shipping
        </Button>
      </div>
    </motion.div>
  );
};

const ShippingStep = ({ 
  data, 
  onChange, 
  onNext, 
  onBack, 
  errors 
}: { 
  data: any; 
  onChange: (field: string, value: any) => void; 
  onNext: () => void; 
  onBack: () => void; 
  errors: string[] 
}) => {
  const shippingOptions = CheckoutLogic.getShippingOptions(data.country);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-lg">🚚</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Shipping Information</h2>
          <p className="text-sm text-slate-600">Where should we deliver your order?</p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800">
            {errors.map((error, index) => (
              <div key={index}>• {error}</div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => onChange('fullName', e.target.value)}
              placeholder="Your full name"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Country *</label>
            <select
              value={data.country}
              onChange={(e) => onChange('country', e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Country</option>
              <option value="Somalia">Somalia</option>
              <option value="Kenya">Kenya</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="International">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Address *</label>
          <textarea
            value={data.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="Street address, building, apartment number"
            rows={3}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
            <input
              type="text"
              value={data.city}
              onChange={(e) => onChange('city', e.target.value)}
              placeholder="City"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Postal Code *</label>
            <input
              type="text"
              value={data.postalCode}
              onChange={(e) => onChange('postalCode', e.target.value)}
              placeholder="Postal code"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Shipping Options */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Shipping Method *</label>
          <div className="space-y-3">
            {shippingOptions.map((option) => (
              <div
                key={option.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  data.shippingOption?.id === option.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => onChange('shippingOption', option)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-900">{option.name}</div>
                    <div className="text-sm text-slate-600">{option.description}</div>
                    <div className="text-xs text-slate-500">{option.days}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-slate-900">
                      ${(option.price / 100).toFixed(2)}
                    </div>
                    {option.tracking && (
                      <div className="text-xs text-green-600">✓ Tracking included</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!data.fullName || !data.address || !data.city || !data.postalCode || !data.shippingOption}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Continue to Payment
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

const PaymentStep = ({ 
  data, 
  onChange, 
  onNext, 
  onBack, 
  errors,
  totals 
}: { 
  data: any; 
  onChange: (field: string, value: any) => void; 
  onNext: () => void; 
  onBack: () => void; 
  errors: string[];
  totals: any;
}) => {
  const paymentMethods = CheckoutLogic.getPaymentMethods();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 text-lg">💳</span>
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Payment Method</h2>
          <p className="text-sm text-slate-600">Choose how you'd like to pay</p>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="text-sm text-red-800">
            {errors.map((error, index) => (
              <div key={index}>• {error}</div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Payment Methods */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-3">Select Payment Method *</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  data.method === method.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                onClick={() => onChange('method', method.id)}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{method.icon}</div>
                  <div className="flex-1">
                    <div className="font-medium text-slate-900">{method.name}</div>
                    <div className="text-sm text-slate-600">{method.description}</div>
                    <div className="text-xs text-slate-500">
                      {method.processingTime} • {method.fees} fee
                    </div>
                  </div>
                  {method.popular && (
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Popular
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Details */}
        {data.method && (
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="text-sm font-medium text-slate-900 mb-3">Payment Instructions</div>
            <div className="text-sm text-slate-600 space-y-2">
              {paymentMethods.find(m => m.id === data.method)?.instructions}
            </div>
            
            {/* Payment-specific fields */}
            {data.method === 'mobile_money' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Mobile Money Number</label>
                <input
                  type="tel"
                  value={data.paymentData?.phoneNumber || ''}
                  onChange={(e) => onChange('paymentData', { ...data.paymentData, phoneNumber: e.target.value })}
                  placeholder="+252 61 123 4567"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
            
            {data.method === 'bank_transfer' && (
              <div className="mt-4 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Bank Name</label>
                  <input
                    type="text"
                    value={data.paymentData?.bankName || ''}
                    onChange={(e) => onChange('paymentData', { ...data.paymentData, bankName: e.target.value })}
                    placeholder="Bank name"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Account Number</label>
                  <input
                    type="text"
                    value={data.paymentData?.accountNumber || ''}
                    onChange={(e) => onChange('paymentData', { ...data.paymentData, accountNumber: e.target.value })}
                    placeholder="Account number"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Order Summary */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <div className="text-sm font-medium text-slate-900 mb-3">Order Summary</div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal ({totals.breakdown?.items} items)</span>
              <span>${(totals.subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${(totals.shipping / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${(totals.tax / 100).toFixed(2)}</span>
            </div>
            {totals.paymentFees > 0 && (
              <div className="flex justify-between">
                <span>Payment Fees</span>
                <span>${(totals.paymentFees / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-slate-200 pt-2">
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>${(totals.total / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={onNext}
            disabled={!data.method}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Place Order
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  
  const [currentStep, setCurrentStep] = useState(0); // 0 = Auth, 1 = Contact, 2 = Shipping, 3 = Payment
  const [checkoutData, setCheckoutData] = useState({
    contact: { email: '', phone: '' },
    shipping: { 
      fullName: '', 
      address: '', 
      city: '', 
      postalCode: '', 
      country: 'Somalia',
      shippingOption: null 
    },
    payment: { method: '', data: {} }
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  const handleDataChange = (step: string, field: string, value: any) => {
    setCheckoutData(prev => ({
      ...prev,
      [step]: {
        ...prev[step as keyof typeof prev],
        [field]: value
      }
    }));
    setErrors([]);
  };

  const handleNext = () => {
    let validation;
    
    // Validate only the current step
    if (currentStep === 1) {
      // Validate contact info
      validation = CheckoutLogic.validateContact(
        checkoutData.contact.email,
        checkoutData.contact.phone
      );
    } else if (currentStep === 2) {
      // Validate shipping info
      validation = CheckoutLogic.validateShipping(
        checkoutData.shipping.address,
        checkoutData.shipping.city,
        checkoutData.shipping.postalCode,
        checkoutData.shipping.country
      );
    }
    
    if (validation && validation.isValid) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
      setErrors([]);
    } else if (validation) {
      setErrors(validation.errors);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setErrors([]);
  };

  const handlePlaceOrder = async () => {
    // Final validation before placing order
    const validation = CheckoutLogic.validateCheckout(checkoutData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      toast.error('Please fix the errors before placing your order');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: checkoutData.contact,
          shipping: checkoutData.shipping,
          payment: checkoutData.payment,
          items
        })
      });
      
      if (!res.ok) throw new Error('Failed to create order');
      
      const data = await res.json();
      setOrderId(data.orderId);
      clear();
      toast.success('Order placed successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const totals = CheckoutLogic.calculateOrderTotal(
    items,
    checkoutData.shipping.shippingOption,
    checkoutData.payment.method
  );

  if (items.length === 0) {
    return null; // Will redirect
  }

  if (orderId) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-2xl">✓</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Order Placed!</h1>
          <p className="text-slate-600 mb-4">
            Your order has been successfully placed and is being processed.
          </p>
          <div className="bg-slate-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-slate-600">Order ID</div>
            <div className="font-mono font-semibold text-slate-900">{orderId}</div>
          </div>
          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                Continue Shopping
              </Button>
            </Link>
            <Link href="/orders">
              <Button variant="outline" className="w-full">
                View Orders
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Checkout</h1>
          <p className="text-slate-600 mt-2">Complete your order in a few simple steps</p>
        </div>

        <ProgressBar currentStep={currentStep} totalSteps={3} />

        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <ContactStep
              data={checkoutData.contact}
              onChange={(field, value) => handleDataChange('contact', field, value)}
              onNext={handleNext}
              errors={errors}
            />
          )}
          
          {currentStep === 2 && (
            <ShippingStep
              data={checkoutData.shipping}
              onChange={(field, value) => handleDataChange('shipping', field, value)}
              onNext={handleNext}
              onBack={handleBack}
              errors={errors}
            />
          )}
          
          {currentStep === 3 && (
            <PaymentStep
              data={checkoutData.payment}
              onChange={(field, value) => handleDataChange('payment', field, value)}
              onNext={handlePlaceOrder}
              onBack={handleBack}
              errors={errors}
              totals={totals}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
