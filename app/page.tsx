"use client";

import Hero from "@/components/hero/Hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Example product type
interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
}

const featuredProducts: Product[] = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: "$99",
    image: "/products/headphones.jpg",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: "$149",
    image: "/products/smartwatch.jpg",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: "$79",
    image: "/products/speaker.jpg",
  },
];

const MainPage = () => {
  return (
    <div>
      <Hero />
    </div>
  );
};

export default MainPage;
