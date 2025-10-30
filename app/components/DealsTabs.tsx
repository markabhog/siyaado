"use client";
import { useState } from "react";
import Link from "next/link";

interface ProductItem {
  id: string;
  brand: string;
  name: string;
  price: number;
  oldPrice?: number;
  discount?: number; // percent
  img: string;
  category: 'featured' | 'sale' | 'rated';
}

const sampleImg = (q: string) =>
  `https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=600&auto=format&fit=crop&sat=-20&blend=ffffff&blend-mode=screen`;

const productsFeatured: ProductItem[] = [
  { id: "1", brand: "Bulgari", name: "Faztex Product Sample", price: 110, oldPrice: 199, discount: 45, img: sampleImg("tablet"), category: 'featured' },
  { id: "2", brand: "Christian Dior", name: "Finity Product Sample", price: 95, oldPrice: 120, discount: 21, img: sampleImg("printer"), category: 'featured' },
  { id: "3", brand: "Dolce & Gabbana", name: "Fixair Product Sample", price: 210, img: sampleImg("ipad"), category: 'featured' },
  { id: "4", brand: "Donna Karan", name: "Freecod Product Sample", price: 450, img: sampleImg("laptop"), category: 'featured' },
  { id: "5", brand: "Armani", name: "Freshkix Product Sample", price: 120, oldPrice: 150, discount: 20, img: sampleImg("phone"), category: 'featured' },
  { id: "6", brand: "Bulgari", name: "Georgeous White Bag", price: 150, img: sampleImg("phone2"), category: 'featured' },
  { id: "7", brand: "Donna Karan", name: "Georgeous White Dresses", price: 350, img: sampleImg("oneplus"), category: 'featured' },
  { id: "8", brand: "Dolce & Gabbana", name: "Gold Diamond Chain", price: 399, img: sampleImg("watch"), category: 'featured' },
];

const productsOnSale: ProductItem[] = [
  { id: "9", brand: "Nike", name: "Air Max 270", price: 120, oldPrice: 180, discount: 33, img: sampleImg("sneakers"), category: 'sale' },
  { id: "10", brand: "Adidas", name: "Ultraboost 22", price: 160, oldPrice: 220, discount: 27, img: sampleImg("running"), category: 'sale' },
  { id: "11", brand: "Apple", name: "iPhone 14 Pro", price: 999, oldPrice: 1299, discount: 23, img: sampleImg("iphone"), category: 'sale' },
  { id: "12", brand: "Samsung", name: "Galaxy S23", price: 799, oldPrice: 999, discount: 20, img: sampleImg("galaxy"), category: 'sale' },
  { id: "13", brand: "Sony", name: "WH-1000XM5", price: 299, oldPrice: 399, discount: 25, img: sampleImg("headphones"), category: 'sale' },
  { id: "14", brand: "Canon", name: "EOS R5", price: 2499, oldPrice: 3499, discount: 29, img: sampleImg("camera"), category: 'sale' },
  { id: "15", brand: "MacBook", name: "Pro 16-inch", price: 1999, oldPrice: 2499, discount: 20, img: sampleImg("macbook"), category: 'sale' },
  { id: "16", brand: "Dyson", name: "V15 Detect", price: 649, oldPrice: 799, discount: 19, img: sampleImg("vacuum"), category: 'sale' },
];

const productsTopRated: ProductItem[] = [
  { id: "17", brand: "Tesla", name: "Model 3", price: 39999, img: sampleImg("tesla"), category: 'rated' },
  { id: "18", brand: "Rolex", name: "Submariner", price: 8500, img: sampleImg("rolex"), category: 'rated' },
  { id: "19", brand: "Louis Vuitton", name: "Neverfull MM", price: 2100, img: sampleImg("lv-bag"), category: 'rated' },
  { id: "20", brand: "Hermès", name: "Birkin 30", price: 12000, img: sampleImg("birkin"), category: 'rated' },
  { id: "21", brand: "Chanel", name: "Classic Flap", price: 8500, img: sampleImg("chanel"), category: 'rated' },
  { id: "22", brand: "Gucci", name: "GG Marmont", price: 2200, img: sampleImg("gucci"), category: 'rated' },
  { id: "23", brand: "Prada", name: "Nylon Backpack", price: 1200, img: sampleImg("prada"), category: 'rated' },
  { id: "24", brand: "Bottega", name: "Veneta Intrecciato", price: 3200, img: sampleImg("bottega"), category: 'rated' },
];

const SpecialOfferCard: React.FC = () => (
  <div className="border-2 border-blue-600 rounded-xl p-5 lg:p-6 shadow-sm h-fit">
    <div className="flex items-center justify-between">
      <div className="text-slate-700 font-semibold">Special<br/>Offer</div>
      <span className="inline-flex items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold w-14 h-14">Save<br/>36%</span>
    </div>
    <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=900&auto=format&fit=crop" alt="Game controller" className="mx-auto my-6 w-64 h-48 object-contain" />
    <a className="block text-blue-700 font-semibold hover:underline text-sm text-center">Black Fashion Zapda</a>
    <div className="mt-2 text-center">
      <span className="text-red-600 text-2xl font-bold mr-2">$350.00</span>
      <span className="text-slate-400 line-through">$550.00</span>
    </div>
    <div className="mt-4 text-xs text-slate-600 flex justify-between">
      <span>Already Sold: <b>6</b></span>
      <span>Available: <b>30</b></span>
    </div>
    <div className="mt-2 h-2 rounded-full bg-slate-200">
      <div className="h-2 bg-blue-600 rounded-full w-1/5" />
    </div>
    <div className="mt-4 text-center text-sm text-slate-600">Hurry Up! Offer ends in</div>
    <div className="mt-2 grid grid-cols-4 gap-3 text-center">
      {[{l:'DAYS',v:69},{l:'HOURS',v:23},{l:'MINUTES',v:44},{l:'SECONDS',v:48}].map((x)=> (
        <div key={x.l} className="rounded-md border px-2 py-2">
          <div className="text-lg font-bold text-slate-800">{x.v}</div>
          <div className="text-[10px] uppercase text-slate-500">{x.l}</div>
        </div>
      ))}
    </div>
  </div>
);

const ProductCard: React.FC<{ item: ProductItem }> = ({ item }) => (
  <Link href={`/product/${item.id}`} className="block">
    <div className="relative border border-slate-200 rounded-lg p-4 hover:shadow-md transition bg-white cursor-pointer">
      {item.discount ? (
        <span className="absolute left-3 top-3 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">{item.discount}%</span>
      ) : null}
      <img src={item.img} alt={item.name} className="w-28 h-28 object-contain mx-auto mt-6" />
      <div className="mt-3 text-[11px] text-slate-500">{item.brand}</div>
      <div className="text-sm font-semibold text-blue-600 leading-snug hover:underline">{item.name}</div>
      <div className="mt-2 text-slate-800">
        <span className="text-red-600 font-bold mr-2">${item.price.toFixed(2)}</span>
        {item.oldPrice ? <span className="text-slate-400 line-through text-sm">${item.oldPrice.toFixed(2)}</span> : null}
      </div>
    </div>
  </Link>
);

export function DealsTabs() {
  const tabs = ["Featured", "On Sale", "Top Rated"] as const;
  const [active, setActive] = useState<typeof tabs[number]>("Featured");
  
  const getProducts = () => {
    switch (active) {
      case "Featured":
        return productsFeatured;
      case "On Sale":
        return productsOnSale;
      case "Top Rated":
        return productsTopRated;
      default:
        return productsFeatured;
    }
  };

  const list = getProducts();

  return (
    <section className="bg-white py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-6">
        <SpecialOfferCard />
        <div>
          {/* tabs */}
          <div className="flex items-center gap-6 border-b border-slate-200 mb-5">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setActive(t)}
                className={`relative pb-3 text-sm font-semibold ${active===t? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                {t}
                {active===t && <span className="absolute -bottom-px left-0 right-0 h-0.5 bg-blue-600" />}
              </button>
            ))}
          </div>
          {/* grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {list.map((p) => <ProductCard key={p.id} item={p} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

