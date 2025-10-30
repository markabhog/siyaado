"use client";
import { useState } from "react";
import { useCartStore } from "@/lib/cartStore";
import { Button } from "@/app/components/ui";

export function AddToCart({
  productId,
  slug,
  title,
  price,
}: {
  productId: string;
  slug: string;
  title: string;
  price: number;
}) {
  const addItem = useCartStore((s) => s.addItem);
  const [adding, setAdding] = useState(false);
  return (
    <Button
      disabled={adding}
      className="w-full"
      onClick={() => {
        setAdding(true);
        addItem({ productId, slug, title, price }, 1);
        setTimeout(() => setAdding(false), 300);
      }}
    >
      {adding ? "Adding…" : "Add to cart"}
    </Button>
  );
}


