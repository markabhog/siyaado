"use client";
import React, { Fragment, useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

/*************************************************
 * Luul — Full Homepage (Single File)
 * - No cross-file imports (fixes missing ./LuulHome error)
 * - Local-image friendly via props
 *************************************************/

/******** Utils ********/
const cls = (...s: (string | false | undefined)[]) => s.filter(Boolean).join(" ");
const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/******** Icons ********/
const HeartIcon = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={p.className}>
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const BagIcon = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={p.className}>
    <path d="M6 7h12l-1 13H7L6 7z" />
    <path d="M9 7a3 3 0 1 1 6 0" />
  </svg>
);
const TruckIcon = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={p.className}>
    <path d="M3 7h11v8H3z" />
    <path d="M14 7h3l4 4v4h-7V7z" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);
const ChatIcon = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={p.className}>
    <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V6a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
  </svg>
);
const RotateIcon = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={p.className}>
    <path d="M21 12a9 9 0 1 1-3-6.7" />
    <path d="M21 3v6h-6" />
  </svg>
);
const CardIcon = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={p.className}>
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
    <path d="M7 15h2m2 0h2" />
  </svg>
);
const Badge = ({ value }: { value: number }) => (
  <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full grid place-items-center shadow">{value}</span>
);

/******** Header components removed - using layout.tsx components instead ********/

/******** Hero Carousel (dynamic banners) ********/
const HeroCarousel = ({ banners = [] }: { banners: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);

  if (!banners || banners.length === 0) {
    // Fallback to default image
    return (
      <section className="relative min-h-[60vh] lg:min-h-[70vh]">
        <div className="absolute inset-0">
          <img src="/assets/hero/watch.jpg" alt="Hero" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-900/50 to-blue-900/20" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-16 lg:py-24">
          <div className="max-w-2xl text-white">
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">THE NEW<br />STANDARD</h1>
            <p className="mt-4 text-blue-100 font-semibold uppercase tracking-wide">Under favorable smartwatches</p>
            <p className="mt-3 text-blue-100 font-medium">From <span className="text-4xl text-white">$749.99</span></p>
            <a href="#" className="inline-block mt-6 bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold shadow hover:bg-blue-50">Start Buying</a>
          </div>
        </div>
      </section>
    );
  }

  const currentBanner = banners[currentIndex];

  return (
    <section className="relative min-h-[60vh] lg:min-h-[70vh]">
      <div className="absolute inset-0">
        <img src={currentBanner.imageUrl} alt={currentBanner.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-900/50 to-blue-900/20" />
      </div>
      
      {/* Banner Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">{currentBanner.title}</h1>
          {currentBanner.subtitle && (
            <p className="mt-4 text-blue-100 font-semibold text-lg">{currentBanner.subtitle}</p>
          )}
          <a 
            href={currentBanner.ctaHref || '/'} 
            className="inline-block mt-6 bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold shadow hover:bg-blue-50"
          >
            {currentBanner.ctaText || 'Shop Now'}
          </a>
        </div>
      </div>

      {/* Navigation Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

/******** Features Bar ********/
const FeaturesBar = () => (
  <section className="w-full bg-white">
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="flex items-start gap-4 text-slate-800"><TruckIcon className="w-10 h-10 text-slate-600" /><div><div className="text-lg font-semibold">Free Delivery</div><div className="text-slate-500">from $50</div></div></div>
        <div className="flex items-start gap-4 text-slate-800"><ChatIcon className="w-10 h-10 text-slate-600" /><div><div className="text-lg font-semibold">99% Customer</div><div className="text-slate-500">Feedbacks</div></div></div>
        <div className="flex items-start gap-4 text-slate-800"><RotateIcon className="w-10 h-10 text-slate-600" /><div><div className="text-lg font-semibold">365 Days</div><div className="text-slate-500">for free return</div></div></div>
        <div className="flex items-start gap-4 text-slate-800"><CardIcon className="w-10 h-10 text-slate-600" /><div><div className="text-lg font-semibold">Payment</div><div className="text-slate-500">Secure System</div></div></div>
      </div>
    </div>
  </section>
);

/******** Deals (data via image array) ********/
interface ProductItem { id: string; brand: string; name: string; price: number; oldPrice?: number; discount?: number; img: string }
const makeProducts = (dbProducts: any[], imgs: string[]): ProductItem[] => {
  return dbProducts.slice(0, 8).map((product, i) => ({
    id: product.slug,
    brand: product.categories?.[0]?.name || "Luul",
    name: product.title,
    price: product.price / 100, // Convert from cents to dollars
    oldPrice: Math.round((product.price * 1.4) / 100), // 40% markup for old price
    discount: Math.round(((product.price * 1.4 - product.price) / (product.price * 1.4)) * 100),
    img: imgs[i % imgs.length] || "/assets/products/p" + (i + 1) + ".png"
  }));
};
const ProductCard = ({ item }: { item: ProductItem }) => (
  <Link href={`/product/${item.id}`} className="block">
    <div className="relative border border-slate-200 rounded-lg p-4 hover:shadow-md transition bg-white cursor-pointer">
      <img src={item.img} alt={item.name} className="w-28 h-28 object-contain mx-auto mt-6" />
      <div className="mt-3 text-[11px] text-slate-500">{item.brand}</div>
      <div className="text-sm font-semibold text-blue-600 leading-snug hover:underline">{item.name}</div>
      <div className="mt-2 text-slate-800"><span className="text-red-600 font-bold mr-2">${item.price.toFixed(2)}</span>{item.oldPrice ? <span className="text-slate-400 line-through text-sm">${item.oldPrice.toFixed(2)}</span> : null}</div>
    </div>
  </Link>
);
// Enhanced Special Offer Card with real banner data
const SpecialOfferCard = ({ banner }: { banner: any }) => {
  const [timeLeft, setTimeLeft] = useState<any>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [productData, setProductData] = useState<any>(null);
  const [soldCount, setSoldCount] = useState<number>(0);
  
  // Fetch product data from banner link
  useEffect(() => {
    if (!banner?.ctaHref) return;
    
    // Extract slug from href (e.g., /product/black-fashion-zapda)
    const slug = banner.ctaHref.replace('/product/', '');
    if (!slug) return;
    
    fetch(`/api/products?slug=${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.products && data.products.length > 0) {
          setProductData(data.products[0]);
        }
      })
      .catch(() => setProductData(null));
  }, [banner?.ctaHref]);
  
  // Fetch actual sold count
  useEffect(() => {
    if (!productData?.id) return;
    
    fetch(`/api/products/sold/${productData.id}`)
      .then(res => res.json())
      .then(data => setSoldCount(data.count || 0))
      .catch(() => setSoldCount(0));
  }, [productData?.id]);
  
  useEffect(() => {
    if (!banner?.endsAt) return;
    
    const calculateTimeLeft = () => {
      const endDate = new Date(banner.endsAt);
      const now = new Date();
      const difference = endDate.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };
    
    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [banner?.endsAt]);
  
  // Get prices - use product data and apply manual discount
  let currentPrice = '$350.00';
  let oldPrice = '$550.00';
  let discount = 'Save 36%';
  
  if (productData) {
    // Use product data as base prices
    const originalPrice = productData.price / 100;
    const comparePrice = productData.compareAtPrice ? productData.compareAtPrice / 100 : originalPrice;
    
    // Apply manual discount if specified
    if (banner?.discountPercent && banner.discountPercent > 0) {
      const discountAmount = (originalPrice * banner.discountPercent) / 100;
      currentPrice = `$${(originalPrice - discountAmount).toFixed(2)}`;
      oldPrice = `$${originalPrice.toFixed(2)}`;
      discount = `Save ${banner.discountPercent}%`;
    } else {
      // Use product's existing pricing
      currentPrice = `$${originalPrice.toFixed(2)}`;
      if (comparePrice > originalPrice) {
        oldPrice = `$${comparePrice.toFixed(2)}`;
        const discPercent = Math.round(((comparePrice - originalPrice) / comparePrice) * 100);
        discount = `Save ${discPercent}%`;
      }
    }
  } else {
    // Fallback to manual prices from subtitle if no product data
    const priceMatch = banner?.subtitle?.match(/\$[\d,.]+/g);
    if (priceMatch && priceMatch.length >= 2) {
      currentPrice = priceMatch[0];
      oldPrice = priceMatch[1];
    } else if (priceMatch && priceMatch.length === 1) {
      currentPrice = priceMatch[0];
    }
    
    // Try to get discount percentage from subtitle
    const discountMatch = banner?.subtitle?.match(/Save\s+(\d+)%/i);
    if (discountMatch) {
      discount = `Save ${discountMatch[1]}%`;
    } else if (currentPrice && oldPrice) {
      // Calculate discount from prices
      const curr = parseFloat(currentPrice.replace(/[$,]/g, ''));
      const old = parseFloat(oldPrice.replace(/[$,]/g, ''));
      if (old > curr) {
        const discPercent = Math.round(((old - curr) / old) * 100);
        discount = `Save ${discPercent}%`;
      }
    }
  }
  
  // Get real stock info
  const availableStock = productData?.stock || 30;
  // Use actual sold count from database (will be 0 if no products sold)
  const totalSold = soldCount;
  const soldPercentage = availableStock > 0 ? Math.floor((totalSold / availableStock) * 100) : 0;
  
  return (
    <Link href={banner?.ctaHref || '/'} className="block">
      <div className="border-2 border-blue-600 rounded-xl p-5 lg:p-6 shadow-sm h-fit hover:shadow-md transition">
        <div className="flex items-center justify-between">
          <div className="text-slate-700 font-semibold">Special<br />Offer</div>
          <span className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold w-14 h-14 text-center">{discount}</span>
        </div>
        <img src={banner?.imageUrl || '/assets/offer/controller.jpg'} alt={banner?.title || 'Special'} className="mx-auto my-6 w-64 h-48 object-contain" />
        <div className="block text-blue-700 font-semibold hover:underline text-sm text-center">{banner?.title || 'Special Product'}</div>
        <div className="mt-2 text-center"><span className="text-red-600 text-2xl font-bold mr-2">{currentPrice}</span><span className="text-slate-400 line-through">{oldPrice}</span></div>
        
        {/* Sales Progress */}
        <div className="mt-4 text-xs text-slate-600 flex justify-between">
          <span>Already Sold: <b>{totalSold}</b></span>
          <span>Available: <b>{availableStock}</b></span>
        </div>
        <div className="mt-2 h-2 rounded-full bg-slate-200">
          <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${soldPercentage}%` }} />
        </div>
        
        {banner?.endsAt && (
          <>
            <div className="mt-4 text-center text-sm text-slate-600">Hurry Up! Offer ends in</div>
            <div className="mt-2 grid grid-cols-4 gap-3 text-center">
              {['DAYS', 'HOURS', 'MINUTES', 'SECONDS'].map((unit, i) => (
                <div key={unit} className="rounded-md border px-2 py-2">
                  <div className="text-lg font-bold text-slate-800">{timeLeft[unit.toLowerCase()] || 0}</div>
                  <div className="text-[10px] uppercase text-slate-500">{unit}</div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Link>
  );
};
const DealsTabs = ({ 
  productImgs, 
  offerImg, 
  products, 
  featuredProducts, 
  onSaleProducts, 
  topRatedProducts,
  specialOfferBanner
}: { 
  productImgs: string[]; 
  offerImg: string; 
  products: any[];
  featuredProducts: any[];
  onSaleProducts: any[];
  topRatedProducts: any[];
  specialOfferBanner?: any;
}) => {
  const tabs = ['Featured', 'On Sale', 'Top Rated'] as const;
  const [active, setActive] = useState<typeof tabs[number]>('Featured');
  
  // Get the appropriate product list based on active tab
  const getProductList = () => {
    switch (active) {
      case 'Featured':
        return makeProducts(featuredProducts, productImgs);
      case 'On Sale':
        return makeProducts(onSaleProducts, productImgs);
      case 'Top Rated':
        return makeProducts(topRatedProducts, productImgs);
      default:
        return makeProducts(products, productImgs);
    }
  };
  
  const list = getProductList();
  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        {specialOfferBanner ? <SpecialOfferCard banner={specialOfferBanner} /> : <SpecialOfferCard banner={{ imageUrl: offerImg, title: 'Special Offer' }} />}
        <div>
          <div className="flex items-center gap-6 border-b border-slate-200 mb-5">
            {tabs.map(t => (
              <button key={t} onClick={() => setActive(t)} className={cls("relative pb-3 text-sm font-semibold", active === t && "text-blue-600", active !== t && "text-slate-600 hover:text-blue-600")}>{t}{active === t && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600" />}</button>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map((p: any, i: number) => (<ProductCard key={i} item={p} />))}
          </div>
        </div>
      </div>
    </section>
  );
};

/******** Category Banner Carousel ********/
const CategoryBannerCarousel = ({ banners }: { banners: any[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (banners.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [banners.length]);
  
  const banner = banners[currentIndex];
  
  return (
    <Link href={banner?.ctaHref || '#'} className="relative rounded-lg overflow-hidden border border-slate-200/60 group" aria-label={banner?.title || "Category promotion"}>
      <img src={banner?.imageUrl || '/assets/banners/default.jpg'} alt={banner?.title || 'Category banner'} className="w-full h-full object-cover min-h-[360px]" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-black/10 to-black/40" />
      <div className="absolute inset-0 p-6 flex flex-col justify-between">
        <div>
          <p className="text-white/90 text-2xl font-extrabold drop-shadow-sm leading-snug">{banner?.title || 'Special Offer'}</p>
          {banner?.subtitle && <p className="mt-3 text-white/90 text-sm font-semibold">{banner.subtitle}</p>}
        </div>
        <span className="self-start mt-4 inline-flex items-center gap-2 bg-white/90 text-blue-700 font-semibold px-4 py-2 rounded-full shadow group-hover:bg-white">
          {banner?.ctaText || 'Shop now'} <span className="grid place-items-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold">›</span>
        </span>
      </div>
      {banners.length > 1 && (
        <div className="absolute bottom-4 right-4 flex gap-2">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.preventDefault();
                setCurrentIndex(i);
              }}
              className={`w-2 h-2 rounded-full transition ${i === currentIndex ? 'bg-white' : 'bg-white/50'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </Link>
  );
};

/******** Smartphones & Tablets (banner + grid) ********/
const CategoryShowcase = ({ bannerImg, gridImgs, categoryData }: { bannerImg: string; gridImgs: string[]; categoryData: any[] }) => {
  const [categoryBanners, setCategoryBanners] = useState<any[]>([]);
  
  // Use dynamic categories or fallback
  const cats = categoryData.length > 0 ? 
    categoryData.map(cat => cat.name) : 
    ["Featured Phones", "Mobile Phones", "Unlocked Phone", "4G LTE Smartphone"];
  const [active, setActive] = useState(cats[0]);
  
  // Fetch banners for smartphones category
  useEffect(() => {
    fetch('/api/marketing/banners?key=smartphones&active=true')
      .then(res => res.json())
      .then(data => setCategoryBanners(data.banners || []))
      .catch(() => setCategoryBanners([]));
  }, []);
  
  // Get products for active category
  const getActiveCategoryProducts = () => {
    if (categoryData.length > 0) {
      const activeCategory = categoryData.find(cat => cat.name === active);
      if (activeCategory?.products) {
        return activeCategory.products.map((product: any) => ({
          id: product.slug,
          brand: product.categories?.[0]?.name || "Luul",
          name: product.title,
          price: product.price / 100,
          img: Array.isArray(product.images) ? (product.images as string[])[0] : "/assets/phones/a.png"
        }));
      }
    }
    return makeProducts([], gridImgs);
  };
  
  const items = getActiveCategoryProducts();
  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-800 border-b-2 border-blue-200 pb-2">Smartphones & Tablets</h2>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {categoryBanners.length > 0 ? (
            <CategoryBannerCarousel banners={categoryBanners} />
          ) : (
            <a href="#" className="relative rounded-lg overflow-hidden border border-slate-200/60 group" aria-label="New season smartphones promotion">
              <img src={bannerImg} alt="New season smartphones" className="w-full h-full object-cover min-h-[360px]" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-black/10 to-black/40" />
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div>
                  <p className="text-white/90 text-2xl font-extrabold drop-shadow-sm leading-snug">NEW SEASON<br />SMARTPHONES</p>
                  <p className="mt-3 text-white/90 text-sm font-semibold">LAST CALL FOR UP TO</p>
                  <p className="text-white text-3xl font-extrabold">$250 <span className="text-base align-super">OFF!</span></p>
                </div>
                <span className="self-start mt-4 inline-flex items-center gap-2 bg-white/90 text-blue-700 font-semibold px-4 py-2 rounded-full shadow group-hover:bg-white">Shop now <span className="grid place-items-center w-5 h-5 rounded-full bg-blue-600 text-white font-bold">›</span></span>
              </div>
            </a>
          )}
          <div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {items.slice(0, 8).map((p: any, i: number) => (<ProductCard key={`smartphone-${i}`} item={p} />))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/******** Book Carousel (images prop) ********/
const FancyArrow = ({ direction, onClick }: { direction: "left" | "right"; onClick: () => void }) => (
  <button onClick={onClick} aria-label={direction === "left" ? "Scroll Left" : "Scroll Right"} className={cls("absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg rounded-full hover:scale-110 transition-transform", direction === "left" ? "left-3" : "right-3")}>{direction === "left" ? "◀" : "▶"}</button>
);
const BookCarousel = ({ images, products }: { images: string[]; products: any[] }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: -1 | 1) => {
    const el = listRef.current; if (!el) return;
    const card = el.querySelector<HTMLDivElement>("[data-card]");
    const w = card ? card.getBoundingClientRect().width : 220;
    el.scrollBy({ left: dir * (w + 16) * 3, behavior: "smooth" });
  };
  return (
    <section className="bg-white py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-4"><h2 className="text-2xl font-bold text-slate-900">Best Sellers in Books</h2></div>
        <div className="relative">
          <FancyArrow direction="left" onClick={() => scroll(-1)} />
          <FancyArrow direction="right" onClick={() => scroll(1)} />
          <style>{`#booksScroller{scrollbar-width:none;overscroll-behavior-x:contain} #booksScroller::-webkit-scrollbar{display:none}`}</style>
          <div id="booksScroller" ref={listRef} className="overflow-x-hidden overflow-y-hidden snap-x snap-mandatory scroll-smooth">
            <div className="flex gap-6 pr-6">
              {(products.length > 0 ? 
                products.map((product, i) => ({
                  id: product.slug,
                  title: product.title,
                  price: product.price / 100,
                  img: Array.isArray(product.images) ? (product.images as string[])[0] : images[i % images.length]
                })) :
                images.map((src, i) => ({ id: `book-${i + 1}`, title: `Book ${i + 1}`, price: 29.99, img: src }))
              ).map((item: any, i: number) => (
                <Link key={i} data-card href={`/product/${item.id}`} className="snap-start shrink-0 w-[180px] sm:w-[200px] rounded-xl overflow-hidden bg-white shadow hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <img src={item.img} alt={item.title} className="w-full h-[260px] object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 text-sm mb-2 line-clamp-2">{item.title}</h3>
                    <div className="text-lg font-bold text-blue-600">${item.price.toFixed(2)}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/******** Laptop Deals (images prop) ********/
 type LaptopItem = { id?: string; brand: string; name: string; price: number; img: string; bullets?: string[] };
 const BRANDS = ["Apple", "Dell", "HP", "Lenovo"] as const;
 const NAMES = ["MacBook Pro 14", "XPS 13 Plus", "Spectre x360", "ThinkPad X1 Carbon"] as const;
 const PRICES = [1999, 1599, 1399, 1699] as const;
 const FEATURES: string[][] = [
  ["14.2\" Liquid Retina XDR", "M‑series performance", "Up to 18‑hour battery"],
  ["13.4\" OLED", "Intel Core i7", "1TB SSD"],
  ["14\" 2‑in‑1", "Intel Evo Platform", "Convertible"],
  ["14\" FHD+", "Carbon chassis", "Thunderbolt 4"],
 ];
 const buildLaptops = (imgs: string[]): LaptopItem[] => imgs.map((img, i) => ({ 
   id: `laptop-${BRANDS[i % 4].toLowerCase().replace(/\s+/g, '-')}-${i}`, 
   brand: BRANDS[i % 4], 
   name: NAMES[i % 4], 
   price: PRICES[i % 4], 
   img, 
   bullets: FEATURES[i % 4] || []
 }));
 const ArrowBtn: React.FC<{ side: "left" | "right"; onClick: () => void }> = ({ side, onClick }) => (
  <button onClick={onClick} aria-label={side === "left" ? "Scroll Left" : "Scroll Right"} className={cls("absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-blue-500 text-white shadow-lg hover:scale-110 transition-transform", side === "left" ? "left-0" : "right-0")}>{side === "left" ? "◀" : "▶"}</button>
 );
 const LaptopCard = ({ item }: { item: LaptopItem }) => (
  <Link href={`/product/${item.id}`} className="block">
    <div className="group">
      <div className="rounded-xl bg-white border border-slate-200/70 p-6 flex items-center justify-center min-h-[260px]"><img src={item.img} alt={item.name} className="h-44 object-contain group-hover:scale-105 transition-transform" /></div>
      <div className="mt-3 rounded-xl bg-slate-50 border border-slate-200/70 p-4">
        <div className="text-xs text-slate-500">{item.brand}</div>
        <div className="text-blue-700 font-semibold hover:underline">{item.name}</div>
        <ul className="mt-2 text-sm text-slate-600 space-y-1 list-disc list-inside">
          {(item.bullets || ["Premium quality", "Fast shipping", "1-year warranty"]).map(b => (<li key={b}>{b}</li>))}
        </ul>
        <div className="mt-3 flex items-center justify-between"><div className="text-slate-900 font-semibold">${item.price.toFixed(2)}</div><button className="w-9 h-9 rounded-full grid place-items-center border border-slate-300 text-slate-700 hover:bg-blue-600 hover:text-white transition" aria-label="Add to Cart">＋</button></div>
      </div>
    </div>
  </Link>
 );
 const LaptopDeals = ({ images, products, title = "Laptop Deals", subtitle = "Products loaded from your local folder" }: { images: string[]; products: any[]; title?: string; subtitle?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  // Use dynamic products or fallback to images
  const items = products.length > 0 ? 
    products.map((product, i) => ({
      id: product.slug,
      brand: product.categories?.[0]?.name || "Luul",
      name: product.title,
      price: product.price / 100,
      img: Array.isArray(product.images) ? (product.images as string[])[0] : images[i % images.length],
      bullets: product.bullets || product.highlights || ["Premium quality", "Fast shipping", "1-year warranty"]
    })) :
    buildLaptops(images);
  const scroll = (d: -1 | 1) => {
    const el = ref.current; if (!el) return;
    const card = el.querySelector<HTMLDivElement>("[data-laptop]");
    const w = card ? card.getBoundingClientRect().width : 320;
    el.scrollBy({ left: d * (w + 24), behavior: 'smooth' });
  };
  return (
    <section className="bg-white py-10">
      <style>{`#laptopsScroller{scrollbar-width:none} #laptopsScroller::-webkit-scrollbar{display:none}`}</style>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6"><div><h2 className="text-2xl font-bold text-slate-900">{title}</h2><p className="text-sm text-slate-500">{subtitle}</p></div><div className="hidden md:flex gap-2"><button onClick={() => scroll(-1)} className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow hover:bg-blue-50">◀</button><button onClick={() => scroll(1)} className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow hover:bg-blue-50">▶</button></div></div>
        {items.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-600">No images found. Pass image paths via the <code>images</code> prop.</div>
        ) : (
          <div className="relative">
            <ArrowBtn side="left" onClick={() => scroll(-1)} />
            <ArrowBtn side="right" onClick={() => scroll(1)} />
            <div id="laptopsScroller" ref={ref} className="overflow-x-auto">
              <div className="grid grid-flow-col auto-cols-[minmax(260px,1fr)] gap-6">
                {items.map((it, i) => (<div key={i} data-laptop className="min-w-[260px]"><LaptopCard item={it} /></div>))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
 };

/******** Sell on Luul Section ********/
const SellOnLuulSection = ({ imageUrl }: { imageUrl?: string }) => (
  <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-16 lg:py-20 overflow-hidden">
    {/* Background Pattern */}
    <div className="absolute inset-0 opacity-10">
      <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
    </div>
    
    <div className="relative max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Text Content */}
        <div className="text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-sm font-semibold text-white">Join 10,000+ Sellers</span>
          </div>
          
          {/* Heading */}
          <h2 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white mb-6 leading-tight">
            Start Selling on Siyaado Today
          </h2>
          <p className="text-lg lg:text-xl text-blue-100 mb-8 leading-relaxed">
            Join thousands of successful sellers. It's completely <span className="font-bold text-white">FREE</span> to start selling your products. Reach millions of customers and grow your business.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <Link 
              href="/reseller/register"
              className="group relative bg-white text-blue-600 px-8 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all duration-200 inline-flex items-center justify-center shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <span>Start Selling FREE</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link 
              href="/reseller"
              className="group border-2 border-white/50 text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-blue-600 hover:border-white transition-all duration-200 inline-flex items-center justify-center backdrop-blur-sm"
            >
              <span>Learn More</span>
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {/* Features */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base font-semibold text-white">No setup fees - Get started in minutes</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base font-semibold text-white">No monthly costs - Pay only when you sell</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base font-semibold text-white">Unlimited products - Sell as much as you want</span>
            </div>
          </div>
        </div>
        
        {/* Right Side - Image Banner */}
        <div className="relative lg:block">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            {/* Add your banner image here */}
            <img 
              src={imageUrl || "/assets/banners/seller-banner.jpg"} 
              alt="Sell on Siyaado" 
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback gradient if image not found
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.innerHTML = `
                    <div class="w-full h-[500px] bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                      <div class="text-center p-8">
                        <svg class="w-24 h-24 mx-auto text-white/50 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p class="text-white/70 text-sm">Banner Image: 1400 x 700px</p>
                      </div>
                    </div>
                  `;
                }
              }}
            />
          </div>
          
          {/* Floating Stats (Optional decorative elements) */}
          <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 hidden lg:block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">$2.5M+</p>
                <p className="text-sm text-slate-600">Monthly Sales</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

/******** Footer ********/
const Footer = () => (
  <footer className="bg-blue-900 text-blue-100 py-10 mt-10">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <h3 className="text-2xl font-bold text-white mb-2">Luul<span className="text-blue-400">.</span></h3>
        <p className="text-sm text-blue-200">Building the future of commerce — simple, powerful, and connected.</p>
        <p className="mt-3 text-sm">📞 +252 61 234 5678</p>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">Quick Links</h4>
        <ul className="space-y-2 text-sm text-blue-200">
          <li><a href="#" className="hover:text-blue-400">Home</a></li>
          <li><a href="#" className="hover:text-blue-400">Shop</a></li>
          <li><a href="#" className="hover:text-blue-400">Deals</a></li>
          <li><a href="#" className="hover:text-blue-400">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">Account</h4>
        <ul className="space-y-2 text-sm text-blue-200">
          <li><a href="#" className="hover:text-blue-400">Sign Up / Login</a></li>
          <li><a href="#" className="hover:text-blue-400">My Orders</a></li>
          <li><a href="#" className="hover:text-blue-400">Wishlist</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold text-white mb-3">Grow with Us</h4>
        <ul className="space-y-2 text-sm text-blue-200">
          <li><Link href="/reseller" className="hover:text-blue-400">Sell on Luul (FREE)</Link></li>
          <li><Link href="/reseller/register" className="hover:text-blue-400">Start Selling Today</Link></li>
          <li><a href="#" className="hover:text-blue-400">Partner with Luul</a></li>
        </ul>
        <div className="flex gap-3 mt-4">
          <a href="#" aria-label="Facebook" className="hover:text-blue-400">📘</a>
          <a href="#" aria-label="Instagram" className="hover:text-blue-400">📸</a>
          <a href="#" aria-label="Twitter" className="hover:text-blue-400">🐦</a>
        </div>
      </div>
    </div>
    <div className="text-center text-sm text-blue-300 mt-8 border-t border-blue-800 pt-4">© 2025 Luul. All rights reserved.</div>
  </footer>
);

/******** Top-level: Full Page ********/
export default function FullPage({
  homepageData
}: {
  homepageData: any;
}) {
  // Fetch banner data from API
  const [heroBanners, setHeroBanners] = useState<any[]>([]);
  const [specialOfferBanner, setSpecialOfferBanner] = useState<any>(null);
  const [sellerBanner, setSellerBanner] = useState<any>(null);
  
  useEffect(() => {
    // Fetch hero banners
    fetch('/api/marketing/banners?key=homepage-hero&active=true')
      .then(res => res.json())
      .then(data => setHeroBanners(data.banners || []))
      .catch(() => setHeroBanners([]));
    
    // Fetch special offer banner
    fetch('/api/marketing/banners?key=homepage-deals&active=true')
      .then(res => res.json())
      .then(data => {
        if (data.banners && data.banners.length > 0) {
          setSpecialOfferBanner(data.banners[0]);
        }
      })
      .catch(() => setSpecialOfferBanner(null));

    // Fetch seller section banner
    fetch('/api/marketing/banners?key=homepage-sellers&active=true')
      .then(res => res.json())
      .then(data => {
        if (data.banners && data.banners.length > 0) {
          setSellerBanner(data.banners[0]);
        }
      })
      .catch(() => setSellerBanner(null));
  }, []);

  // Extract data from homepageData with fallbacks
  const {
    featuredProducts = [],
    onSaleProducts = [],
    topRatedProducts = [],
    categoryShowcase = [],
    laptopDeals = [],
    bookCarousel = [],
    specialOffer = null,
    heroBanner = null,
    featuredImages = [],
    onSaleImages = [],
    topRatedImages = [],
    laptopImages = [],
    bookImages = []
  } = homepageData || {};

  // Default fallback images
  const heroImg = "/assets/hero/watch.jpg";
  const offerImg = specialOffer ? 
    (Array.isArray(specialOffer.images) ? (specialOffer.images as string[])[0] : "/assets/offer/controller.jpg") :
    "/assets/offer/controller.jpg";
  const phoneBanner = "/assets/phones/banner.jpg";
  
  // Use dynamic images or fallbacks
  const dealsImgs = featuredImages.length > 0 ? featuredImages : [
    "/assets/products/p1.png", "/assets/products/p2.png", "/assets/products/p3.png", "/assets/products/p4.png",
    "/assets/products/p5.png", "/assets/products/p6.png", "/assets/products/p7.png", "/assets/products/p8.png"
  ];
  
  const phoneImgs = categoryShowcase.length > 0 ? 
    categoryShowcase[0]?.products?.slice(0, 8).map((p: any) => 
      Array.isArray(p.images) ? (p.images as string[])[0] : "/assets/phones/a.png"
    ) || ["/assets/phones/a.png", "/assets/phones/b.png", "/assets/phones/c.png", "/assets/phones/d.png"] :
    ["/assets/phones/a.png", "/assets/phones/b.png", "/assets/phones/c.png", "/assets/phones/d.png"];
  
  const laptopImgs = laptopImages.length > 0 ? laptopImages : [
    "/assets/laptops/mbp.jpg", "/assets/laptops/xps.jpg", "/assets/laptops/spectre.jpg", "/assets/laptops/x1.jpg"
  ];
  
  const bookImgs = bookImages.length > 0 ? bookImages : [
    "/assets/books/1.jpg", "/assets/books/2.jpg", "/assets/books/3.jpg",
    "/assets/books/4.jpg", "/assets/books/5.jpg", "/assets/books/6.jpg"
  ];

  // Combine all products for the deals section
  const allProducts = [...featuredProducts, ...onSaleProducts, ...topRatedProducts];
  return (
    <div className="min-h-screen bg-white">
      <HeroCarousel banners={heroBanners} />
      <FeaturesBar />
      <DealsTabs 
        productImgs={dealsImgs!} 
        offerImg={offerImg!} 
        products={allProducts}
        featuredProducts={featuredProducts}
        onSaleProducts={onSaleProducts}
        topRatedProducts={topRatedProducts}
        specialOfferBanner={specialOfferBanner}
      />
      <CategoryShowcase 
        bannerImg={phoneBanner!} 
        gridImgs={phoneImgs!} 
        categoryData={categoryShowcase}
      />
      <LaptopDeals images={laptopImgs!} products={laptopDeals} />
      <BookCarousel images={bookImgs!} products={bookCarousel} />
      <SellOnLuulSection imageUrl={sellerBanner?.imageUrl} />
      <Footer />
    </div>
  );
}
