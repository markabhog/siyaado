"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export function ProductCard({
  slug,
  title,
  price,
  image,
  discount,
  rating,
  reviewCount,
  stock,
  onBuyNow,
  onAddToCart,
}: {
  slug: string;
  title: string;
  price: number;
  image?: string | null;
  discount?: number;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  onBuyNow?: () => void;
  onAddToCart?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const discountedPrice = discount ? price * (1 - discount / 100) : price;

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      className="group relative rounded-2xl border border-slate-200/60 bg-white p-3 shadow-sm transition-shadow hover:shadow-md"
    >
      <Link href={`/product/${slug}`} className="block cursor-pointer">
        <div className="relative mb-2 aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              priority={false}
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-neutral-100 to-neutral-200" />
          )}
          {discount ? (
            <div className="absolute left-2 top-2 rounded-full bg-blue-600/90 px-2 py-0.5 text-xs font-bold text-white shadow">
              -{discount}%
            </div>
          ) : null}
        </div>
        <div className="truncate text-sm font-medium text-slate-900" title={title}>
          {title}
        </div>
        {typeof rating === 'number' && (
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-slate-300'}`}
                >
                  <path d="M11.48 3.499a.562.562 0 011.04 0l2.074 5.034a.563.563 0 00.475.347l5.404.442c.499.041.701.663.321.988l-4.117 3.527a.563.563 0 00-.182.557l1.257 5.273a.562.562 0 01-.84.61l-4.646-2.76a.563.563 0 00-.586 0l-4.646 2.76a.562.562 0 01-.84-.61l1.257-5.273a.563.563 0 00-.182-.557L3.206 10.31a.563.563 0 01.321-.988l5.404-.442a.563.563 0 00.475-.347l2.074-5.034z" />
                </svg>
              ))}
            </div>
            {typeof reviewCount === 'number' && (
              <span className="text-xs text-slate-600">({reviewCount})</span>
            )}
          </div>
        )}
        <div className="mt-1 flex items-center justify-between gap-2">
          {discount ? (
            <>
              <span className="text-base font-bold text-slate-900">${(discountedPrice / 100).toFixed(2)}</span>
              <span className="text-xs text-neutral-500 line-through">${(price / 100).toFixed(2)}</span>
            </>
          ) : (
            <span className="text-base font-bold text-slate-900">${(price / 100).toFixed(2)}</span>
          )}
          {typeof stock === 'number' && (
            <span className="text-xs text-slate-500">{stock > 0 ? `${stock} left` : 'Out of stock'}</span>
          )}
        </div>
      </Link>
      {(onBuyNow || onAddToCart) && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button
            onClick={(e) => {
              e.preventDefault();
              onBuyNow && onBuyNow();
            }}
            className="rounded-lg bg-blue-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer"
          >
            Options
          </button>
          {onAddToCart && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onAddToCart();
                setAdded(true);
                try {
                  if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('eco:cart-open'));
                  }
                } catch {}
                setTimeout(() => setAdded(false), 1200);
              }}
              className={`rounded-lg border py-2 text-sm font-semibold cursor-pointer ${
                added
                  ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                  : 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
              }`}
            >
              {added ? (
                <span className="inline-flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                    <path fillRule="evenodd" d="M10.28 15.53a.75.75 0 01-1.06 0l-3-3a.75.75 0 111.06-1.06l2.47 2.47 5.72-5.72a.75.75 0 111.06 1.06l-6.25 6.25z" clipRule="evenodd" />
                  </svg>
                  Added
                </span>
              ) : (
                'Add to Cart'
              )}
            </button>
          )}
        </div>
      )}
      {added && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          className="pointer-events-none absolute right-3 top-3 rounded-full bg-green-600/90 px-2 py-0.5 text-xs font-semibold text-white shadow"
        >
          Added to cart
        </motion.div>
      )}
    </motion.div>
  );
}
