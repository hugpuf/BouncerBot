import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DataPipeline } from "@/components/landing/DataPipeline";
import { Features } from "@/components/landing/Features";
import { WhoItsFor } from "@/components/landing/WhoItsFor";
import { SocialProof } from "@/components/landing/SocialProof";
import { PricingSection } from "@/components/landing/PricingSection";
import { Footer } from "@/components/landing/Footer";
import brickTile from "@/assets/brick-tile.png";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      {/* Sunset gradient behind the brick wall */}
      <div className="fixed inset-0 z-0 pointer-events-none sunset-sky" />
      {/* Pixel brick wall overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none pixel-brick-wall"
        style={{ "--brick-bg": `url(${brickTile})` } as React.CSSProperties}
      />

      <div className="relative z-10">
        <Navbar />
        <main className="pt-16">
          <HeroSection />
          <HowItWorks />
          <DataPipeline />
          <Features />
          <WhoItsFor />
          <SocialProof />
          <PricingSection />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Index;
