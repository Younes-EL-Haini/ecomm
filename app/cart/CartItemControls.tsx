"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  itemId: string;
  initialQuantity: number;
}

export default function CartItemControls({ itemId, initialQuantity }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    try {
      const res = await fetch(`/api/cart/${itemId}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Item removed");
        router.refresh();
      }
    } finally {
      setLoading(false);
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
