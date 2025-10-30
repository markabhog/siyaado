"use client";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type HeroItem = { title: string; imageSrc: string; href: string };

export default function CategoryHero({
  title,
  subtitle,
  ctaText = "Shop now",
  ctaHref = "/shop",
  items,
  bannerKey,
}: {
  title: string;
  subtitle: string;
  ctaText?: string;
  ctaHref?: string;
  items: HeroItem[];
  bannerKey?: string;
}) {
  // Optional background banner, loaded by key
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  useState(() => {
    if (!bannerKey) return;
    fetch(`/api/marketing/banners?key=${encodeURIComponent(bannerKey)}&active=true`)
      .then((r) => r.json())
      .then((data) => {
        const b = data?.banners?.[0];
        if (b?.imageUrl) setBannerUrl(b.imageUrl);
      })
      .catch(() => {});
  });
  const slides = useMemo(() => {
    const chunks: HeroItem[][] = [];
    for (let i = 0; i < items.length; i += 3) chunks.push(items.slice(i, i + 3));
    return chunks.length ? chunks : [[]];
  }, [items]);
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <section className="bg-white relative overflow-hidden">
      {bannerUrl && (
        <div className="absolute inset-0 -z-10">
          <Image src={bannerUrl} alt="category banner" fill className="object-cover opacity-10" />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            {title}
          </h1>
          <p className="mt-4 text-slate-600 text-lg">{subtitle}</p>
          <Link
            href={ctaHref}
            className="inline-block mt-6 bg-slate-900 text-white px-6 py-3 rounded-full font-semibold hover:bg-slate-800"
          >
            {ctaText}
          </Link>
        </div>

        <div className="relative">
          <div className="flex justify-center gap-12">
            {slides[index].map((item) => (
              <Link key={item.title} href={item.href} className="group">
                <div className="relative h-48 w-64 mx-auto">
                  <Image
                    src={item.imageSrc}
                    alt={item.title}
                    fill
                    className="object-contain drop-shadow-sm"
                  />
                </div>
                <div className="mt-4 text-center text-2xl font-bold text-slate-900 group-hover:text-blue-600">
                  {item.title}
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            {slides.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full ${
                  index === i ? "bg-slate-900" : "bg-slate-300"
                }`}
              />)
            )}
          </div>

          <div className="absolute -left-2 -bottom-2 flex gap-3">
            <button
              aria-label="Previous"
              onClick={prev}
              className="h-10 w-10 grid place-items-center rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50"
            >
              ‹
            </button>
            <button
              aria-label="Next"
              onClick={next}
              className="h-10 w-10 grid place-items-center rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}


