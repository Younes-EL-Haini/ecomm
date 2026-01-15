"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct } from "@/lib/actions/product";
import { useState } from "react";
import { toast } from "sonner"; // Import toast from sonner

export function DeleteProductButton({
  id,
  productName,
}: {
  id: string;
  productName: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // 1. Toast with a "Loading" state or custom confirmation
    toast.warning(`Are you sure you want to delete ${productName}?`, {
      action: {
        label: "Delete",
        onClick: async () => {
          setIsDeleting(true);
          const promise = deleteProduct(id);

          // 2. Use toast.promise for a high-end feel
          toast.promise(promise, {
            loading: `Deleting ${productName}...`,
            success: (result) => {
              if (!result.success) throw new Error(result.error);
              return `${productName} has been removed.`;
            },
            error: (err) => err.message || "Failed to delete.",
            finally: () => setIsDeleting(false),
          });
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => console.log("Delete cancelled"),
      },
    });
  };

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={isDeleting}
      onClick={handleDelete}
      className="h-8 w-8 md:h-9 md:w-9 rounded-full text-red-500 hover:bg-red-50 disabled:opacity-50"
    >
      <Trash2 size={15} className={isDeleting ? "animate-spin" : ""} />
    </Button>
  );
}
