// import type { NextConfig } from "next";

// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "https",
//         hostname: 'res.cloudinary.com',
//         pathname: '/**', // Allows all images from this host
//       },
//     ],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co', // The domain from your error log
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'dummyimage.com', // Keeping this one just in case
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;