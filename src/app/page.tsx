import Header from "@/components/layout/Header";
import SimpleFooter from "@/components/layout/SimpleFooter";
import Hero from "@/components/home/Hero";
import SpecialOfferCard from "@/components/home/SpecialOfferCard";
import CarModelShowcase from "@/components/home/CarModelShowcase";
import VideoBanner from "@/components/home/VideoBanner";
import MadeInNigeria from "@/components/home/MadeInNigeria";
import NewestModels from "@/components/home/NewestModels";
import PaymentBanner from "@/components/home/PaymentBanner";
import IvmApp from "@/components/home/IvmApp";
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
      {/* Header floats over the hero (transparent until you scroll) */}
      <Header overlay />
      <main className="font-[family-name:var(--font-inter)]">
        <Hero />
        <SpecialOfferCard />
        <CarModelShowcase initialVehicles={featured} />
        <VideoBanner />
        <MadeInNigeria />
        <NewestModels />
        <PaymentBanner />
        <IvmApp />
      </main>
      <SimpleFooter />
    </>
  );
}