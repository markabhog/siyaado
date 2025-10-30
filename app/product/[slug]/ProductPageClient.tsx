"use client";
import React, { useMemo, useState, useRef } from 'react';
import Link from "next/link";
import Image from "next/image";
import { AddToCart } from "./AddToCart";
import { WishlistButton } from "./WishlistButton";
import { Breadcrumbs } from "@/app/components/Breadcrumbs";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cartStore";

const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(' ');

/******************** UI PRIMITIVES ********************/
const Stars = ({ value, size = 18 }: { value: number; size?: number }) => {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" className={cls(i < full ? 'fill-yellow-400 stroke-yellow-400' : i === full && half ? 'fill-yellow-300 stroke-yellow-400' : 'fill-none stroke-yellow-400')}>
          <path strokeWidth="1.5" d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

const ReviewCard = ({ name, rating, date, text, images = [] }: { 
  name: string; 
  rating: number; 
  date: string; 
  text: string; 
  images?: string[] 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition"
  >
    <div className="flex items-center justify-between mb-2">
      <div className="font-semibold text-slate-800">{name}</div>
      <Stars value={rating} />
    </div>
    <div className="text-xs text-slate-400 mb-2">{date}</div>
    <p className="text-slate-700 text-sm leading-relaxed">{text}</p>
    {images.length > 0 && (
      <div className="mt-3 flex gap-2">
        {images.map((src, i) => (
          <img key={i} src={src} alt="review" className="w-14 h-14 rounded-lg object-cover" />
        ))}
      </div>
    )}
  </motion.div>
);

const QuantityStepper = ({ value, onChange }: { value: number; onChange: (value: number) => void }) => (
  <div className="inline-flex items-center gap-2 bg-slate-100 rounded-full px-2">
    <button 
      onClick={() => onChange(Math.max(1, value - 1))} 
      className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center"
    >
      −
    </button>
    <span className="px-2 font-semibold min-w-[2rem] text-center">{value}</span>
    <button 
      onClick={() => onChange(value + 1)} 
      className="w-8 h-8 rounded-full hover:bg-slate-200 flex items-center justify-center"
    >
      +
    </button>
  </div>
);

const TrustBadges = ({ badges }: { badges?: Array<{ icon: string; text: string; color: string }> }) => {
  const defaultBadges = [
    { icon: '✓', text: 'Free Delivery', color: 'green' },
    { icon: '✓', text: '7-Day Returns', color: 'blue' },
    { icon: '✓', text: '1-Year Warranty', color: 'purple' },
    { icon: '✓', text: 'Secure Payment', color: 'orange' }
  ];

  const displayBadges = badges && badges.length > 0 ? badges : defaultBadges;

  const colorClasses: Record<string, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    pink: 'bg-pink-500',
    red: 'bg-red-500',
  };

  return (
    <div className="grid grid-cols-2 gap-3 mt-4">
      {displayBadges.map((badge, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
          <div className={cls('w-5 h-5 rounded-full flex items-center justify-center text-white text-xs', colorClasses[badge.color] || 'bg-slate-500')}>
            {badge.icon}
          </div>
          <span>{badge.text}</span>
        </div>
      ))}
    </div>
  );
};

const ProductTabs = ({ 
  description, 
  specifications, 
  reviews 
}: { 
  description: string; 
  specifications: Record<string, string>; 
  reviews: any[] 
}) => {
  const [activeTab, setActiveTab] = useState('description');
  
  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${reviews.length})` },
  ];

  return (
    <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
      <div className="flex border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cls(
              "flex-1 px-6 py-4 text-sm font-medium transition-colors",
              activeTab === tab.id 
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50" 
                : "text-slate-600 hover:text-blue-600"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="p-6">
        {activeTab === 'description' && (
          <div className="prose max-w-none">
            <p className="text-slate-700 leading-relaxed">{description}</p>
          </div>
        )}
        
        {activeTab === 'specifications' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {Object.entries(specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between gap-6">
                <div className="text-slate-500 w-40 font-medium">{key}</div>
                <div className="flex-1 text-slate-800">{value}</div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'reviews' && (
          <div className="grid sm:grid-cols-2 gap-6">
            {reviews.map((review, i) => (
              <ReviewCard key={i} {...review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FrequentlyBoughtTogether = ({ 
  product, 
  qty, 
  bundle, 
  setBundle, 
  bundleTotal 
}: {
  product: any;
  qty: number;
  bundle: any[];
  setBundle: (bundle: any[]) => void;
  bundleTotal: number;
}) => (
  <div className="bg-white rounded-3xl p-6 shadow-sm">
    <h3 className="text-xl font-bold text-slate-900 mb-4">Frequently Bought Together</h3>
    <div className="space-y-4">
      {/* Main item summary */}
      <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
        <img src={product.images[0]} alt="main" className="w-14 h-14 rounded-xl object-contain bg-white" />
        <div className="text-sm text-slate-700 flex-1 line-clamp-2">{product.title}</div>
        <div className="font-semibold text-blue-600">${(product.price * qty).toFixed(2)}</div>
      </div>
      
      <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      
      {bundle.map((item, i) => (
        <label key={item.id} className="flex items-center gap-4 cursor-pointer p-2 rounded-lg hover:bg-slate-50">
          <input 
            type="checkbox" 
            checked={item.checked} 
            onChange={() => setBundle(bundle.map(it => 
              it.id === item.id ? { ...it, checked: !it.checked } : it
            ))} 
            className="accent-blue-600 w-4 h-4"
          />
          <img src={item.img} alt={item.title} className="w-12 h-12 rounded-lg object-cover bg-slate-100" />
          <div className="text-sm text-slate-700 flex-1">{item.title}</div>
          <div className="font-semibold text-slate-900">${item.price.toFixed(2)}</div>
        </label>
      ))}
    </div>
    
    <div className="mt-6 p-4 bg-blue-50 rounded-xl">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-slate-500">Bundle total</div>
          <div className="text-2xl font-extrabold text-slate-900">${bundleTotal.toFixed(2)}</div>
          <div className="text-xs text-green-600 font-medium">Save ${((product.price * qty) + bundle.reduce((sum, x) => sum + (x.checked ? x.price : 0), 0) - bundleTotal).toFixed(2)} with bundle</div>
        </div>
        <button className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition">
          Add All to Cart
        </button>
      </div>
    </div>
  </div>
);

const SimilarProducts = ({ products }: { products: any[] }) => {
  const simRef = useRef<HTMLDivElement>(null);
  
  const scrollSim = (dir: -1 | 1) => {
    const el = simRef.current; 
    if (!el) return;
    const card = el.querySelector('[data-card]') as HTMLElement;
    const w = card ? card.getBoundingClientRect().width : 240;
    el.scrollBy({ left: dir * (w + 16) * 3, behavior: 'smooth' });
  };

  return (
    <section className="mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900">Similar Products</h2>
        <div className="hidden md:flex gap-2">
          <button 
            onClick={() => scrollSim(-1)} 
            className="w-10 h-10 rounded-full bg-white shadow ring-1 ring-slate-200 hover:bg-blue-50 flex items-center justify-center"
          >
            ◀
          </button>
          <button 
            onClick={() => scrollSim(1)} 
            className="w-10 h-10 rounded-full bg-white shadow ring-1 ring-slate-200 hover:bg-blue-50 flex items-center justify-center"
          >
            ▶
          </button>
        </div>
      </div>
      
      <div 
        ref={simRef} 
        className="overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex gap-5 pr-5">
          {products.map((product, i) => (
            <Link 
              data-card 
              key={i} 
              href={`/product/${product.slug}`}
              className="shrink-0 w-[240px] bg-white rounded-2xl shadow-sm hover:shadow-md transition p-4 group"
            >
              <div className="rounded-xl bg-slate-50 grid place-items-center h-40 group-hover:bg-slate-100 transition">
                <img 
                  src={product.images[0]} 
                  alt={product.title} 
                  className="h-32 object-contain" 
                />
              </div>
              <div className="mt-3 text-sm font-semibold text-slate-800 line-clamp-2">
                {product.title}
              </div>
              <div className="mt-1 flex items-center justify-between">
                <div className="text-blue-700 font-bold">${(product.price / 100).toFixed(2)}</div>
                <Stars value={product.rating || 4.0} size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export function ProductPageClient({ 
  product, 
  images, 
  breadcrumbItems, 
  fbt, 
  related 
}: {
  product: any;
  images: string[];
  breadcrumbItems: Array<{ href?: string; label: string }>;
  fbt: any[];
  related: any[];
}) {
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);
  const [bundle, setBundle] = useState(fbt);
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  
  const bundleTotal = useMemo(() => 
    bundle.reduce((sum, x) => sum + (x.checked ? x.price : 0), product.price * qty), 
    [bundle, qty, product.price]
  );

  const discount = Math.round(((product.mrp - product.price) / product.mrp) * 100);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen py-8 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <Breadcrumbs items={breadcrumbItems} />
        
        {/* Top Section: Gallery + Buy Box */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Gallery */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 shadow-sm">
            <div className="rounded-2xl bg-slate-50 grid place-items-center min-h-[420px]">
              {images[active] ? (
                <Image
                  src={images[active]}
                  alt={product.title}
                  width={500}
                  height={400}
                  className="max-h-[380px] object-contain"
                  priority
                />
              ) : (
                <div className="text-slate-400">No image available</div>
              )}
            </div>
            {images.length > 1 && (
              <div className="mt-3 flex gap-3 overflow-x-auto">
                {images.map((src, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActive(i)} 
                    className={cls(
                      'rounded-xl p-1 bg-white shadow-sm hover:shadow transition', 
                      active === i && 'ring-2 ring-blue-500'
                    )}
                  > 
                    <Image 
                      src={src} 
                      alt={`thumb-${i}`} 
                      width={80}
                      height={80}
                      className="w-20 h-20 object-contain rounded-lg" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Buy Box */}
          <aside className="lg:col-span-5 bg-white rounded-3xl p-6 shadow-sm">
            {/* Product Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {product.tags.slice(0, 3).map((tag: string, i: number) => (
                  <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
                {product.isNew && (
                  <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    NEW
                  </span>
                )}
                {product.onSale && (
                  <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    ON SALE
                  </span>
                )}
                {product.featured && (
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    FEATURED
                  </span>
                )}
              </div>
            )}
            
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-snug">{product.title}</h1>
            
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center gap-2">
                <Stars value={product.rating} />
                <span className="text-sm text-slate-600">
                  {product.rating} • {product.reviewsCount.toLocaleString()} ratings
                </span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-end gap-3">
                <div className="text-3xl font-bold text-slate-900">${(product.price / 100).toFixed(2)}</div>
                {product.mrp > product.price && (
                  <>
                    <div className="text-slate-400 line-through">${(product.mrp / 100).toFixed(2)}</div>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Inclusive of taxes {product.freeShipping && '• Free delivery'}
              </div>
              
              {/* Stock Status */}
              <div className="mt-2">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-700 font-medium">
                      In Stock {product.lowStock && `(Only ${product.stock} left!)`}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm text-red-700 font-medium">Out of Stock</span>
                  </div>
                )}
                {product.estimatedDelivery && product.stock > 0 && (
                  <div className="text-xs text-slate-600 mt-1">
                    🚚 Estimated Delivery: {product.estimatedDelivery}
                  </div>
                )}
              </div>
            </div>

            <ul className="mt-4 space-y-1 text-slate-700 text-sm">
              {product.highlights.map((highlight: string) => (
                <li key={highlight} className="flex gap-2">
                  <span className="text-green-500">•</span>
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex items-center gap-4">
              <QuantityStepper value={qty} onChange={setQty} />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                onClick={() => { 
                  if (product.stock > 0) {
                    addItem({ productId: product.id, slug: product.slug, title: product.title, price: product.price }, qty); 
                    router.push('/checkout'); 
                  }
                }}
                disabled={product.stock === 0}
                className={cls(
                  "rounded-lg py-3 text-sm font-semibold shadow-sm transition-all duration-200",
                  product.stock > 0 
                    ? "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-md active:scale-95 cursor-pointer"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                )}
              >
                {product.stock > 0 ? 'Buy Now' : 'Out of Stock'}
              </button>
              <button
                onClick={() => {
                  if (product.stock > 0) {
                    addItem({ productId: product.id, slug: product.slug, title: product.title, price: product.price }, qty);
                    window.dispatchEvent(new CustomEvent('openCart'));
                  }
                }}
                disabled={product.stock === 0}
                className={cls(
                  "rounded-lg py-3 text-sm font-semibold border transition-all duration-200",
                  product.stock > 0
                    ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 active:scale-95 cursor-pointer"
                    : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                )}
              >
                Add to Cart
              </button>
            </div>

            <TrustBadges badges={product.trustBadges} />
            
            <div className="mt-5 text-xs text-slate-500">
              Seller: <span className="font-semibold text-slate-700">Luul Official</span> • 
              7‑day Replacement • 1‑Year Warranty
            </div>
          </aside>
        </section>

        {/* Category-Specific Features (if available) */}
        {product.categoryFeatures && product.categoryFeatures.length > 0 && (
          <section className="mt-10">
            <div className="bg-white rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Why Buy This Product?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {product.categoryFeatures.map((feature: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mb-3">
                      <span className="text-white text-xl">✓</span>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Specifications & Bundle */}
        <section className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <ProductTabs 
              description={product.description}
              specifications={product.specifications}
              reviews={product.reviews}
            />
          </div>

          <div className="lg:col-span-5">
            {bundle && bundle.length > 0 ? (
              <FrequentlyBoughtTogether 
                product={product}
                qty={qty}
                bundle={bundle}
                setBundle={setBundle}
                bundleTotal={bundleTotal}
              />
            ) : (
              <div className="bg-white rounded-3xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Product Highlights</h3>
                <ul className="space-y-3">
                  {product.highlights.map((highlight: string, i: number) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span className="text-slate-700 text-sm">{highlight}</span>
                    </li>
                  ))}
                </ul>
                {product.lowStock && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-sm text-red-700 font-medium">⚠️ Only {product.stock} left in stock!</p>
                  </div>
                )}
                {product.isNew && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-700 font-medium">🆕 New Arrival!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Similar Products */}
        <SimilarProducts products={related} />
      </div>

      {/* Mobile Sticky Add to Cart Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 z-50">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="text-lg font-bold text-slate-900">${(product.price / 100).toFixed(2)}</div>
            <div className="text-sm text-slate-500">In Stock • Free Shipping</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-slate-300 rounded-lg">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100"
              >
                −
              </button>
              <span className="w-8 h-8 flex items-center justify-center text-sm font-medium">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-slate-100"
              >
                +
              </button>
            </div>
            <AddToCart 
              productId={product.id}
              slug={product.slug}
              title={product.title}
              price={product.price}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
