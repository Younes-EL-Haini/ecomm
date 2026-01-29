"use client";

import { deleteAddress, setDefaultAddress } from "@/lib/users";
import { useTransition } from "react";
import { Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddressActions({
  id,
  isDefault,
}: {
  id: string;
  isDefault: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  // 1. CONFIRMATION DELETE LOGIC
  const confirmDelete = () => {
    // Use toast.success instead of toast to trigger the green theme
    toast.success("Confirm Deletion", {
      description: "Are you sure you want to remove this address?",
      duration: Infinity, // Keeps it open until they act
      action: {
        label: "Delete",
        onClick: () => {
          startTransition(async () => {
            try {
              await deleteAddress(id);
              toast.success("Address removed successfully");
            } catch (error) {
              toast.error("Could not delete address");
            }
          });
        },
      },
      actionButtonStyle: {
        backgroundColor: "#000000", // Black button
        borderRadius: "5px", // Sharp corners (Not rounded)
        color: "#ffffff", // White text
      },
      cancel: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  };

  // 2. SET DEFAULT LOGIC
  const handleSetDefault = () => {
    startTransition(async () => {
      try {
        await setDefaultAddress(id);
        toast.success("Default address updated", {
          description: "This address will be used for future checkouts.",
        });
      } catch (error) {
        toast.error("Failed to update default address");
      }
    });
  };

  return (
    <div className="flex gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
      {isPending ? (
        <div className="p-2">
          <Loader2 className="animate-spin text-zinc-400" size={16} />
        </div>
      ) : (
        <>
          {!isDefault && (
            <button
              onClick={handleSetDefault}
              className="p-2 hover:bg-green-50 rounded-full transition-colors group/btn cursor-pointer"
              title="Set as Default"
            >
              <CheckCircle2
                size={18}
                className="text-zinc-400 group-hover/btn:text-green-600 transition-colors"
              />
            </button>
          )}
          <button
            onClick={confirmDelete}
            className="p-2 hover:bg-red-50 rounded-full transition-colors group/btn cursor-pointer"
            title="Delete Address"
          >
            <Trash2
              size={18}
              className="text-zinc-400 group-hover/btn:text-red-600 transition-colors"
            />
          </button>
        </>
      )}
    </div>
  );
}
