"use client";
import { useWishlist } from "@/lib/wishlistStore";

export function WishlistButton({ productId }: { productId: string }) {
  const has = useWishlist((s) => s.has)(productId);
  const toggle = useWishlist((s) => s.toggle);
  return (
    <button
      onClick={() => toggle(productId)}
      className={`rounded-md border px-3 py-2 text-sm ${has ? "bg-black text-white" : "bg-white"}`}
    >
      {has ? "Wishlisted" : "Add to wishlist"}
    </button>
  );
}


