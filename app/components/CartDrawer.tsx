"use client";
import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";
import { CartLogic } from "@/lib/cart-logic";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(' ');

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const items = useCartStore((s) => s.items);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  
  const summary = CartLogic.getCartSummary(items);

  const handleUpdateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeItem(productId);
      toast.success('Item removed from cart');
    } else {
      updateQty(productId, qty);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900">
                Cart ({summary.itemCount})
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    🛒
                  </div>
                  <p className="text-slate-600">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.productId}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20, scale: 0.95 }}
                      className="flex gap-3 p-3 bg-slate-50 rounded-lg"
                    >
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src="/assets/products/p1.png"
                          alt={item.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <Link 
                          href={`/product/${item.slug}`}
                          onClick={onClose}
                          className="block"
                        >
                          <h3 className="font-medium text-slate-900 hover:text-blue-600 transition-colors line-clamp-2 text-sm">
                            {item.title}
                          </h3>
                        </Link>
                        <div className="mt-1 text-sm text-blue-600 font-semibold">
                          ${(item.price / 100).toFixed(2)}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center border border-slate-300 rounded">
                          <button
                            onClick={() => handleUpdateQty(item.productId, item.qty - 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs"
                          >
                            −
                          </button>
                          <span className="w-8 h-6 flex items-center justify-center text-xs font-medium border-x border-slate-300">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item.productId, item.qty + 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-slate-100 text-xs"
                          >
                            +
                          </button>
                        </div>
                        
                        <div className="text-xs font-semibold text-slate-900">
                          ${((item.price * item.qty) / 100).toFixed(2)}
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors text-xs"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-slate-200 p-4 bg-white">
                {/* Summary */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>${(summary.subtotal / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span className={summary.hasFreeShipping ? 'text-green-600' : ''}>
                      {summary.hasFreeShipping ? 'FREE' : `$${(summary.shipping / 100).toFixed(2)}`}
                    </span>
                  </div>
                  <div className="border-t border-slate-200 pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${(summary.total / 100).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Free Shipping Progress */}
                {!summary.hasFreeShipping && (
                  <div className="mb-4 p-2 bg-blue-50 rounded-lg">
                    <div className="text-xs text-blue-800">
                      Add ${(summary.freeShippingRemaining / 100).toFixed(2)} more for free shipping!
                    </div>
                    <div className="mt-1 w-full bg-blue-200 rounded-full h-1">
                      <div 
                        className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, ((summary.subtotal / summary.freeShippingThreshold) * 100))}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Link 
                    href="/cart"
                    onClick={onClose}
                    className="block w-full py-2 px-4 text-center border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
                  >
                    View Cart
                  </Link>
                  <Link 
                    href="/checkout"
                    onClick={onClose}
                    className="block w-full py-2 px-4 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};