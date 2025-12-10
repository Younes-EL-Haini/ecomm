// components/HeroImage.js

import Image from "next/image";

const HeroImage = () => {
  return (
    <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-2xl">
      <Image
        src="/images/hero-product.jpg" // Replace with your actual image path
        alt="Featured Product Image"
        layout="fill"
        objectFit="cover"
        priority // Loads this image first since it's above the fold
      />
    </div>
  );
};

export default HeroImage;
