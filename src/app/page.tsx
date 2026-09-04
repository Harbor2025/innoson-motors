import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import BoldExperience from "@/components/home/BoldExperience";
import EvCollectionBanner from "@/components/home/EvCollectionBanner";
import CarModelShowcase from "@/components/home/CarModelShowcase";
import PaymentBanner from "@/components/home/PaymentBanner";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <BoldExperience />
        <EvCollectionBanner />
        <CarModelShowcase />
        <PaymentBanner />
      </main>
      <Footer />
    </>
  );
}