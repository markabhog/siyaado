import Link from "next/link";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[60vh] lg:min-h-[70vh]">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1920&auto=format&fit=crop"
          alt="Modern smartwatch close-up"
          fill
          priority
          className="object-cover"
        />
        {/* Blue gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-900/50 to-blue-900/20" />
      </div>

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <div className="max-w-2xl text-white">
          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">
            THE NEW<br />STANDARD
          </h1>
          <p className="mt-4 text-blue-100 font-semibold uppercase tracking-wide">
            Under favorable smartwatches
          </p>
          <p className="mt-3 text-blue-100 font-medium">
            From <span className="text-4xl text-white">$749.99</span>
          </p>
          <Link
            href="/shop"
            className="inline-block mt-6 bg-white text-blue-700 px-8 py-3 rounded-xl font-semibold shadow hover:bg-blue-50"
          >
            Start Buying
          </Link>
        </div>
      </div>
    </section>
  );
}
