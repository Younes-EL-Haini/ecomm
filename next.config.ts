import type { NextConfig } from "next";

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Allows all images from this host
      },
    ],
  },
};

export default nextConfig;
