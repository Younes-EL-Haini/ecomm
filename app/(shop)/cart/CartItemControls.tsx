"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useCartStore } from "@/cartStore";

interface Props {
  itemId: string;
  initialQuantity: number;
  productId: string; // Add this
  variantId?: string; // Add this
}

export default function CartItemControls({
  itemId,
  initialQuantity,
  productId,
  variantId,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const decrement = useCartStore((state) => state.decrement);
  const increment = useCartStore((state) => state.increment);
  const count = useCartStore((state) => state.count);

  const updateQuantity = async (newQty: number) => {
    if (newQty < 1) return;
    setLoading(true);
    try {
      await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity: newQty }),
      });
      router.refresh(); // Updates the Server Component (CartPage)
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async () => {
    // Capture data for Undo before the item is deleted
    const itemData = { productId, variantId, quantity: initialQuantity };

    toast.promise(
      fetch(`/api/cart/${itemId}`, { method: "DELETE" }).then((res) => {
        if (!res.ok) throw new Error();
        return res;
      }),
      {
        loading: "Removing item...",
        // 1. The function takes the response as 'data'
        // 2. We return the main title string
        success: (data) => {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }, // Fires from roughly where the toast is
            colors: ["#ff0000", "#000000", "#ffffff"], // Match your store colors (Red/Black)
          });
          if (count > 0) decrement();
          router.refresh();
          return "Item removed from cart";
        },
        error: "Could not remove item",
        // 3. We use the 'description' and 'action' inside the options object
        description: "Changed your mind?",
        action: {
          label: "Undo",
          onClick: () => undoDelete(itemData),
        },
      }
    );
  };

  const undoDelete = async (data: any) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast.success("Item restored!");
        increment();
        router.refresh();
      }
    } catch (error) {
      toast.error("Failed to restore item");
    }
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border rounded-lg bg-background">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none border-r"
          onClick={() => updateQuantity(initialQuantity - 1)}
          disabled={loading || initialQuantity <= 1}
        >
          <Minus className="h-4 w-4" />
        </Button>

        <span className="w-10 text-center text-sm font-medium">
          {initialQuantity}
        </span>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-none border-l"
          onClick={() => updateQuantity(initialQuantity + 1)}
          disabled={loading}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={removeItem}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
