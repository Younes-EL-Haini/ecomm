"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { archiveProduct, restoreProduct } from "@/lib/products";
import { useState } from "react";
import { toast } from "sonner";

export function DeleteProductButton({
  id,
  productName,
}: {
  id: string;
  productName: string;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    setIsProcessing(true);

    const result = await archiveProduct(id);

    if (result.success) {
      toast.success(`${productName} moved to trash`, {
        description: "You can restore it within the next few seconds.",
        duration: 5000, // Show for 5 seconds
        action: {
          label: "Undo",
          onClick: async () => {
            const restoreResult = await restoreProduct(id);
            if (restoreResult.success) {
              toast.success(`${productName} restored!`);
            }
          },
        },
      });
    } else {
      toast.error("Could not delete product");
    }

    setIsProcessing(false);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={isProcessing}
      onClick={handleDelete}
      className="h-8 w-8 md:h-9 md:w-9 rounded-full text-red-500 hover:bg-red-50"
    >
      <Trash2 size={15} className={isProcessing ? "animate-spin" : ""} />
    </Button>
  );
}
