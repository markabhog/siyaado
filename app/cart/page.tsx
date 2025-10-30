"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";
import { CartLogic } from "@/lib/cart-logic";
import { Button } from "@/app/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(' ');

// Cart Item Component
const CartItem = ({ item, onUpdateQty, onRemove }: { 
  item: any; 
  onUpdateQty: (productId: string, qty: number) => void; 
  onRemove: (productId: string) => void; 
}) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(item.productId);
      toast.success(`${item.title} removed from cart`);
    }, 300);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`bg-white rounded-xl shadow-sm border border-slate-200 p-4 transition-all duration-300 ${
        isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-md'
      }`}
    >
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src="/assets/products/p1.png" // In real app, use item.image
            alt={item.title}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <Link href={`/product/${item.slug}`} className="block">
            <h3 className="font-semibold text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
              {item.title}
            </h3>
          </Link>
          <div className="mt-1 text-sm text-slate-500">SKU: {item.productId}</div>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-lg font-bold text-blue-600">${(item.price / 100).toFixed(2)}</span>
            <span className="text-sm text-slate-500">each</span>
          </div>
        </div>

        {/* Quantity Controls */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center border border-slate-300 rounded-lg">
            <button
              onClick={() => onUpdateQty(item.productId, item.qty - 1)}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
              disabled={item.qty <= 1}
            >
              −
            </button>
            <span className="w-12 h-8 flex items-center justify-center text-sm font-medium border-x border-slate-300">
              {item.qty}
            </span>
            <button
              onClick={() => onUpdateQty(item.productId, item.qty + 1)}
              className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
            >
              +
            </button>
          </div>
          
          <div className="text-right">
            <div className="text-sm font-semibold text-slate-900">
              ${((item.price * item.qty) / 100).toFixed(2)}
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Remove item"
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
};

// Cart Summary Component
const CartSummary = ({ items, location, promoCode, onPromoChange }: {
  items: any[];
  location: string;
  promoCode?: string;
  onPromoChange: (code: string) => void;
}) => {
  const [promoInput, setPromoInput] = useState(promoCode || '');
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const summary = CartLogic.getCartSummary(items, location, promoCode);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    
    setIsApplyingPromo(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onPromoChange(promoInput.trim());
    setIsApplyingPromo(false);
    
    if (summary.discount.amount > 0) {
      toast.success(`Promo code applied! ${summary.discount.description}`);
    } else {
      toast.error('Invalid promo code');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Order Summary</h3>
      
      {/* Promo Code */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-slate-700 mb-2">Promo Code</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={promoInput}
            onChange={(e) => setPromoInput(e.target.value)}
            placeholder="Enter promo code"
            className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={handleApplyPromo}
            disabled={isApplyingPromo || !promoInput.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isApplyingPromo ? 'Applying...' : 'Apply'}
          </button>
        </div>
        {summary.discount.amount > 0 && (
          <div className="mt-2 text-sm text-green-600">
            ✓ {summary.discount.description}
          </div>
        )}
      </div>

      {/* Summary Details */}
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span>Subtotal ({summary.itemCount} items)</span>
          <span>${(summary.subtotal / 100).toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Shipping</span>
          <span className={summary.hasFreeShipping ? 'text-green-600' : ''}>
            {summary.hasFreeShipping ? 'FREE' : `$${(summary.shipping / 100).toFixed(2)}`}
          </span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span>Tax</span>
          <span>${(summary.tax / 100).toFixed(2)}</span>
        </div>
        
        {summary.discount.amount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Discount</span>
            <span>-${(summary.discount.amount / 100).toFixed(2)}</span>
          </div>
        )}
        
        <div className="border-t border-slate-200 pt-3">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${(summary.total / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Free Shipping Progress */}
      {!summary.hasFreeShipping && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-blue-800">
            Add ${(summary.freeShippingRemaining / 100).toFixed(2)} more for free shipping!
          </div>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, ((summary.subtotal / summary.freeShippingThreshold) * 100))}%` }}
            />
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <Link href="/checkout" className="block mt-6">
        <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl">
          Proceed to Checkout
        </Button>
      </Link>
    </div>
  );
};

// Recommended Products Component
const RecommendedProducts = ({ items }: { items: any[] }) => {
  const recommendations = CartLogic.getRecommendedProducts(items);
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">You might also like</h3>
      <div className="grid grid-cols-2 gap-3">
        {recommendations.map((product, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="w-12 h-12 bg-slate-100 rounded-lg flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-900 line-clamp-1">{product}</div>
              <div className="text-xs text-slate-500">$12.99</div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              Add
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const [location, setLocation] = useState('Somalia');
  const [promoCode, setPromoCode] = useState<string>();

  const summary = CartLogic.getCartSummary(items, location, promoCode);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
          <p className="text-slate-600 mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              🛒
            </div>
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Your cart is empty</h2>
            <p className="text-slate-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold">
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map((item) => (
                    <CartItem
                      key={item.productId}
                      item={item}
                      onUpdateQty={updateQty}
                      onRemove={removeItem}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Recommended Products */}
              <div className="mt-8">
                <RecommendedProducts items={items} />
              </div>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <CartSummary
                items={items}
                location={location}
                promoCode={promoCode}
                onPromoChange={setPromoCode}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


