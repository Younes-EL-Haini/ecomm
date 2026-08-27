// lib/constants.ts
export const SITE_CONFIG = {
  name: "Sable",
  description: "A considered collection of fashion and everyday essentials.",
  url: process.env.NODE_ENV === "development" 
    ? "http://localhost:3000" 
    : "https://ecomm-sandy-nine.vercel.app",
  ogImage: "/og-image.jpg", // Path relative to your 'public' folder
};