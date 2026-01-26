"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

const slides = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=2012",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=2050",
  },
];

export default function ProfessionalHero() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  if (!mounted)
    return <div className="h-[60vh] w-full bg-slate-100 animate-pulse" />;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-6">
      <div className="relative h-[75vh] md:h-[70vh] w-full overflow-hidden rounded-[2.5rem] bg-gray-100 border border-slate-200">
        {/* TEXT LAYER */}
        <div className="absolute inset-0 z-20 flex items-center justify-center md:justify-start p-6 md:pr-18 lg:p-24">
          <div className="max-w-xl text-center md:text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mb-6 text-zinc-900">
              EXPLORE <br className="hidden md:block" /> THE NEW
            </h1>

            <p className="text-slate-600 text-base sm:text-lg mb-8 max-w-sm mx-auto md:mx-0">
              Premium quality. Timeless design.
              <br className="hidden sm:block" />
              Our latest drop is now live.
            </p>

            <Button className="bg-[#0071e3] hover:bg-[#0077ed] rounded-full px-8 py-6 text-md font-medium transition-all hover:scale-105">
              Shop Now
            </Button>
          </div>
        </div>

        {/* IMAGE SLIDER */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              className="
                absolute inset-0 
                flex items-end justify-center
                md:items-end md:justify-end
                p-6 md:pl-20 lg:pr-32
              "
            >
              <img
                src={slides[index].image}
                alt="Product"
                className="
                  w-[80%] sm:w-[65%] md:w-[55%] lg:w-[45%]
                  max-w-[520px]
                  h-[260px] sm:h-80 md:h-[380px]
                  object-contain drop-shadow-2xl
                "
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* DOTS */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === i ? "w-10 bg-black" : "w-4 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
