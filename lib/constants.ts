// lib/constants.ts
export const SITE_CONFIG = {
  name: "Your Store Name",
  description: "Premium Fashion & Accessories",
  url: process.env.NODE_ENV === "development" 
    ? "http://localhost:3000" 
    : "https://yourstore.com",
  ogImage: "/og-image.jpg", // Path relative to your 'public' folder
};