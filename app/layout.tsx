import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { BottomNav } from "@/app/components/navigation/BottomNav";
import { Header } from "@/app/components/layout/Header";
import HeaderNav from "@/app/components/layout/HeaderNav";
import { Providers } from "@/app/providers";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "@/app/components/ErrorBoundary";

const inter = Inter({ variable: "--font-sans", subsets: ["latin"] });
const manrope = Manrope({ variable: "--font-alt", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Luul — Minimal E‑Commerce",
  description: "Luul: fast, category-first shopping.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${manrope.variable} antialiased`}
      >
        <Providers>
          <Toaster position="top-right" />
          <ErrorBoundary>
            <Suspense fallback={null}>
              <Header />
            </Suspense>
            <HeaderNav />
            <div className="pb-16">{children}</div>
          </ErrorBoundary>
        </Providers>
        <BottomNav />
      </body>
    </html>
  );
}
