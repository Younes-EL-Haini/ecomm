import React from "react";
import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

const HeroSection = () => {
  return (
    <section className="flex items-center justify-between p-12 bg-gray-50 min-h-[50vh]">
      {/* Left Side */}
      <div className="w-1/2">
        <HeroContent />
      </div>

      {/* Right Side */}
      <div className="w-1/2">
        <HeroImage />
      </div>
    </section>
  );
};

export default HeroSection;
