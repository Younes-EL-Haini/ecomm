import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: "images.unsplash.com", // The domain from your error log
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com', // Keeping this one just in case
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Allows all images from this host
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;