"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, Zap } from "lucide-react"; // Zap icon for "Buy Now"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCartStore } from "@/cartStore";

interface Props {
  productId: string;
  variantId: string | null;
  disabled: boolean;
}

export default function AddToCartActions({
  productId,
  variantId,
  disabled,
}: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const router = useRouter();
  const increment = useCartStore((state) => state.increment);

  const handleAction = async (isBuyNow = false) => {
    if (isBuyNow) {
      // 1. Just go to checkout with params, DON'T call the cart API
      const params = new URLSearchParams({
        productId,
        variantId: variantId || "",
        quantity: quantity.toString(),
        direct: "true",
      });
      router.push(`/checkout?${params.toString()}`);
      return;
    }

    // 2. Normal "Add to Cart" logic
    setIsAdding(true);
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, quantity }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.isNewRow) increment();
        toast.success("Added to cart");
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to update cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-4 pt-4">
      {/* TOP ROW: QUANTITY & ADD TO CART */}
      <div className="flex items-center gap-3">
        {/* QUANTITY SELECTOR */}
        <div className="flex items-center border border-zinc-200 rounded-full bg-zinc-50 px-2 py-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-white transition-colors"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={disabled || quantity <= 1 || isAdding}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-sm font-semibold text-zinc-900">
            {quantity}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-white transition-colors"
            onClick={() => setQuantity(quantity + 1)}
            disabled={disabled || isAdding}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* PRIMARY ADD TO CART */}
        <Button
          className="flex-1 rounded-full bg-zinc-900 h-12 hover:bg-zinc-800 text-white font-medium transition-transform active:scale-95"
          disabled={disabled || isAdding}
          onClick={() => handleAction(false)}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          {isAdding ? "Working..." : "Add to Cart"}
        </Button>
      </div>

      {/* SECONDARY BUY NOW (Direct to Checkout) */}
      <Button
        variant="outline"
        className="w-full rounded-full h-12 border-zinc-900 text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all font-semibold"
        disabled={disabled || isAdding}
        onClick={() => handleAction(true)}
      >
        <Zap className="mr-2 h-4 w-4 fill-current" />
        Buy it now
      </Button>
    </div>
  );
}
