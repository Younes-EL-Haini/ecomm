"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import HeroSkeleton from "./HeroSkeleton";
import { useSession } from "next-auth/react";
import Image from "next/image";

const slides = [
  {
    id: 1,
    title: "EXPLORE THE NEW",
    subtitle: "Premium quality. Timeless design. Our latest drop is now live.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=2070",
  },
  {
    id: 2,
    title: "ELEVATE YOUR STYLE",
    subtitle: "Built for durability and engineered for peak comfort.",
    image:
      "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?q=80&w=2012",
  },
  {
    id: 3,
    title: "DEFINED BY CRAFT",
    subtitle: "Minimalist aesthetics paired with exceptional materials.",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=2050",
  },
];

export default function ProfessionalHero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 py-6">
      <div className="relative h-[75vh] md:h-[70vh] w-full overflow-hidden rounded-[2.5rem] bg-zinc-950 border border-slate-800">
        {/* BACKGROUND SLIDER */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={slides[index].image}
                alt="Hero banner"
                fill
                priority={index === 0}
                className="object-cover object-center"
                sizes="(max-width: 1400px) 100vw, 1400px"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent z-10" />
        </div>

        {/* TEXT LAYER */}
        <div className="relative z-20 h-full flex items-center justify-start p-8 md:p-16 lg:p-24">
          <div className="max-w-xl text-left">
            <motion.h1
              key={`title-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.08] mb-6 text-white"
            >
              {slides[index].title}
            </motion.h1>

            <motion.p
              key={`sub-${index}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-zinc-300 text-base sm:text-lg mb-8 max-w-sm"
            >
              {slides[index].subtitle}
            </motion.p>

            <Button className="bg-white text-zinc-900 hover:bg-zinc-200 rounded-full px-8 py-6 text-base font-semibold transition-all hover:scale-105">
              Shop Now
            </Button>
          </div>
        </div>

        {/* SLIDE INDICATORS */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-500 ${
                index === i
                  ? "w-8 bg-white"
                  : "w-2 bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
