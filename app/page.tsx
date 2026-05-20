import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import MarqueeStrip from "@/components/MarqueeStrip";
import PainSection from "@/components/PainSection";
import VerifySection from "@/components/VerifySection";
import PhysicsCarousel from "@/components/PhysicsCarousel";
import ApeModeBanner from "@/components/ApeModeBanner";
import HowItWorks from "@/components/HowItWorks";
import FaqSection from "@/components/FaqSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black-pure flex flex-col font-sans selection:bg-white-pure selection:text-black-pure relative overflow-x-hidden">
      <Nav />
      <Hero />
      <MarqueeStrip />
      <PainSection />
      <VerifySection />
      <PhysicsCarousel />
      <HowItWorks />
      <ApeModeBanner />
      <FaqSection />
      <Footer />
    </main>
  );
}
