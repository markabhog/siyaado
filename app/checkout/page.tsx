"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/lib/cartStore";
import { CartLogic } from "@/lib/cart-logic";
import { CheckoutLogic } from "@/lib/checkout-logic";
import { Button } from "@/app/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AuthStep } from "./AuthStep";
import { ShoppingCart, Package, CreditCard, CheckCircle } from "lucide-react";

// Step components will be added inline

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  
  const [currentStep, setCurrentStep] = useState(0); // 0 = Auth, 1 = Shipping, 2 = Payment
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
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

  // Check if user is already logged in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      handleAuthenticated(session.user);
    }
  }, [status, session]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && !orderId) {
      router.push('/cart');
    }
  }, [items.length, router, orderId]);

  const handleAuthenticated = (user: any) => {
    setIsAuthenticated(true);
    setUserData(user);
    setCheckoutData(prev => ({
      ...prev,
      contact: {
        email: user.email || prev.contact.email,
        phone: user.phone || prev.contact.phone
      },
      shipping: {
        ...prev.shipping,
        fullName: user.name || prev.shipping.fullName
      }
    }));
    setCurrentStep(1); // Move to shipping step
  };

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
    
    if (currentStep === 1) {
      // Validate shipping info
      validation = CheckoutLogic.validateShipping(
        checkoutData.shipping.address,
        checkoutData.shipping.city,
        checkoutData.shipping.postalCode,
        checkoutData.shipping.country
      );
    }
    
    if (validation && validation.isValid) {
      setCurrentStep(prev => prev + 1);
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
    // Final validation
    const paymentValidation = CheckoutLogic.validatePayment(
      checkoutData.payment.method,
      checkoutData.payment.data
    );
    
    if (!paymentValidation.isValid) {
      setErrors(paymentValidation.errors);
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

  // Order success screen
  if (orderId) {
    return (
      <div className="min-h-screen bg-slate-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-lg p-8 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Order Placed Successfully!</h1>
            <p className="text-slate-600 mb-6">Thank you for your purchase</p>
            <div className="bg-slate-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-slate-600">Order Number</p>
              <p className="text-2xl font-bold text-slate-900">{orderId}</p>
            </div>
            <div className="space-y-3">
              <Link href={`/orders/${orderId}`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  View Order Details
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full bg-slate-100 hover:bg-slate-200 text-slate-900">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Progress Indicator */}
        {isAuthenticated && (
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4">
              {[
                { id: 1, label: 'Shipping', icon: Package },
                { id: 2, label: 'Payment', icon: CreditCard }
              ].map((step, index) => (
                <React.Fragment key={step.id}>
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      currentStep >= step.id ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      <step.icon className="w-5 h-5" />
                    </div>
                    <span className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < 1 && (
                    <div className={`w-24 h-1 rounded ${
                      currentStep > step.id ? 'bg-blue-600' : 'bg-slate-200'
                    }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* Auth Step - Full Width Centered */}
        {currentStep === 0 && !isAuthenticated && (
          <div className="max-w-2xl mx-auto">
            <AuthStep
              key="auth"
              onAuthenticated={handleAuthenticated}
              initialEmail={checkoutData.contact.email}
              initialPhone={checkoutData.contact.phone}
            />
          </div>
        )}

        {/* Other Steps - Grid Layout */}
        {(currentStep > 0 || isAuthenticated) && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">

              {/* Step 1: Shipping */}
              {currentStep === 1 && isAuthenticated && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                  <p className="text-slate-600 mb-4">Authenticated as: {userData?.email}</p>
                  <div className="space-y-4">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={checkoutData.shipping.fullName}
                      onChange={(e) => handleDataChange('shipping', 'fullName', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={checkoutData.shipping.address}
                      onChange={(e) => handleDataChange('shipping', 'address', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={checkoutData.shipping.city}
                      onChange={(e) => handleDataChange('shipping', 'city', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Postal Code"
                      value={checkoutData.shipping.postalCode}
                      onChange={(e) => handleDataChange('shipping', 'postalCode', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg"
                    />
                    {errors.length > 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                        {errors.map((error, i) => <div key={i}>• {error}</div>)}
                      </div>
                    )}
                    <Button onClick={handleNext} className="w-full bg-blue-600 text-white py-3">
                      Continue to Payment
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {currentStep === 2 && isAuthenticated && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6"
                >
                  <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-4">
                    <select
                      value={checkoutData.payment.method}
                      onChange={(e) => handleDataChange('payment', 'method', e.target.value)}
                      className="w-full px-4 py-3 border rounded-lg"
                    >
                      <option value="">Select Payment Method</option>
                      <option value="cash_on_delivery">Cash on Delivery</option>
                      <option value="mobile_money">Mobile Money</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                    {errors.length > 0 && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                        {errors.map((error, i) => <div key={i}>• {error}</div>)}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <Button onClick={handleBack} className="flex-1 bg-slate-200 text-slate-900">
                        Back
                      </Button>
                      <Button 
                        onClick={handlePlaceOrder} 
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 text-white py-3"
                      >
                        {isSubmitting ? 'Processing...' : 'Place Order'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sticky top-4">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h3>
                
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3">
                      <div className="w-16 h-16 bg-slate-100 rounded-lg flex-shrink-0"></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-900 truncate">{item.title}</p>
                        <p className="text-xs text-slate-600">Qty: {item.qty}</p>
                        <p className="text-sm font-semibold text-slate-900">
                          ${(item.price * item.qty / 100).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-medium">${(totals.subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-medium">${(totals.shipping / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax</span>
                    <span className="font-medium">${(totals.tax / 100).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-slate-200 pt-2 flex justify-between">
                    <span className="font-semibold text-slate-900">Total</span>
                    <span className="font-bold text-lg text-blue-600">${(totals.total / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

