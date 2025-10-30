"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type WishlistState = {
  productIds: string[];
  items: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      productIds: [],
      get items() {
        return get().productIds;
      },
      toggle: (id) =>
        set((s) => ({
          productIds: s.productIds.includes(id)
            ? s.productIds.filter((x) => x !== id)
            : [...s.productIds, id],
        })),
      has: (id) => get().productIds.includes(id),
    }),
    { name: "eco-wishlist" }
  )
);


