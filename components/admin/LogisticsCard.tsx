import { ArrowUpRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface LogisticsCardProps {
  pendingCount: number;
}

export function LogisticsCard({ pendingCount }: LogisticsCardProps) {
  return (
    <div className="bg-zinc-900 rounded-[2.5rem] p-8 text-white flex flex-col justify-between min-h-[280px] shadow-2xl shadow-zinc-200">
      <div>
        <div className="flex justify-between items-start">
          <div className="p-3 bg-zinc-800 rounded-2xl text-zinc-400">
            <Truck size={24} />
          </div>
          <ArrowUpRight className="text-zinc-600 w-5 h-5" />
        </div>

        <div className="mt-6">
          <h3 className="text-2xl font-bold text-white tracking-tight">
            Logistics & Fulfillment
          </h3>
          <p className="text-zinc-400 text-sm mt-3 leading-relaxed">
            {pendingCount > 0
              ? `Action required: ${pendingCount} paid orders are currently awaiting processing and shipment.`
              : "All systems clear. There are no pending orders requiring immediate fulfillment at this time."}
          </p>
        </div>
      </div>

      <Button
        asChild
        className="bg-white text-black rounded-2xl py-7 font-bold hover:bg-zinc-200 transition-all mt-8 group"
      >
        <Link
          href="/admin/orders?status=PAID"
          className="flex items-center justify-center gap-2"
        >
          Manage Logistics
          <ArrowUpRight
            size={18}
            className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
          />
        </Link>
      </Button>
    </div>
  );
}
