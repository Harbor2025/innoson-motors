import Header from "@/components/layout/Header";
import FooterServer from "@/components/layout/FooterServer";
import Hero from "@/components/home/Hero";
import VideoBanner from "@/components/home/VideoBanner";
import HottestDealCard from "@/components/home/HottestDealCard";
import SpecialOfferCard from "@/components/home/SpecialOfferCard";
import CarModelShowcase from "@/components/home/CarModelShowcase";
import NewestModels from "@/components/home/NewestModels";
import PaymentBanner from "@/components/home/PaymentBanner";
import { getFeaturedModels } from "@/server/models";
import { modelsAsVehicleCards } from "@/lib/adapters";

export const revalidate = 60;

export default async function HomePage() {
  let featured;
  try {
    const models = await getFeaturedModels(6);
    featured = modelsAsVehicleCards(models);
  } catch {
    featured = undefined;
  }
  return (
    <>
      {/* Header floats over the hero (mobile: transparent until you scroll; desktop: white bar over the hero) */}
      <Header overlay />
      <main>
        <Hero />
        <VideoBanner />
        {/* Mobile/tablet show Hottest Deal; desktop (lg+) shows the Special Offer banner */}
        <HottestDealCard />
        <SpecialOfferCard />
        <CarModelShowcase initialVehicles={featured} />
        <NewestModels />
        <PaymentBanner />
      </main>
      <div className="mt-20">
        <FooterServer />
      </div>
    </>
  );
}
