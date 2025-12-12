import HeroContent from "./HeroContent";
import HeroImage from "./HeroImage";

const HeroSection = () => {
  return (
    <section className="flex flex-col items-center justify-center p-6 md:flex-row md:justify-between bg-gray-50 min-h-[60vh] gap-6">
      {/* Text comes first on mobile */}
      <div className="w-full md:w-1/2 order-1">
        <HeroContent />
      </div>

      {/* Image below text on mobile */}
      <div className="w-full md:w-1/2 order-2">
        <HeroImage />
      </div>
    </section>
  );
};

export default HeroSection;
