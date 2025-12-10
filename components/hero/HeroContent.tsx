// components/HeroContent.js

import Link from "next/link";
import { Button } from "../ui/button";

const HeroContent = () => {
  const sharedButtonClasses =
    "border-blue-600 px-8 py-6 text-xl cursor-pointer";

  return (
    <div className="max-w-xl pr-10">
      {/* Welcome Text */}
      <p className="text-xl text-blue-600 font-semibold mb-2">
        Welcome to Our Shop!
      </p>

      {/* Main Header */}
      <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-4">
        Find Your Next <span className="text-blue-600">Favorite Thing</span>
      </h1>

      {/* Descriptive Text */}
      <p className="text-lg text-gray-600 mb-8">
        Explore our curated collection of high-quality products, from essentials
        to unique finds. Start shopping now and discover the difference.
      </p>

      {/* Buttons */}
      <div className="flex space-x-4">
        <Link href="/products">
          {/* Use the Button component inside Link */}
          <Button
            variant="outline" // This gives you the solid primary color (usually indigo or blue)
            className={`${sharedButtonClasses} text-white hover:bg-blue-400 bg-blue-600`}
            size="lg"
          >
            Browse Products
          </Button>
        </Link>
        <Link href="/about">
          <Button
            variant="outline" // This gives you the solid primary color (usually indigo or blue)
            className={`${sharedButtonClasses} text-blue-600 hover:bg-blue-200`}
            size="lg"
          >
            About Us
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroContent;
