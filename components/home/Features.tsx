import { Truck, ShieldCheck, Zap, RefreshCw } from "lucide-react";

const features = [
  {
    icon: <Truck className="w-6 h-6" />,
    title: "Free Shipping",
    desc: "On all orders over $150",
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Secure Payment",
    desc: "100% protected checkout",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Fast Delivery",
    desc: "Door to door in 3-5 days",
  },
  {
    icon: <RefreshCw className="w-6 h-6" />,
    title: "Easy Returns",
    desc: "30-day return policy",
  },
];

export default function Features() {
  return (
    <div className="py-20 bg-zinc-50/50">
      {" "}
      {/* Very light gray section background */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-8 bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2"
            >
              <div className="mb-5 text-blue-600 bg-blue-50 p-4 rounded-2xl">
                {f.icon}
              </div>
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-900">
                {f.title}
              </h3>
              <p className="text-[10px] font-medium text-zinc-400 mt-2 uppercase tracking-wider">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
