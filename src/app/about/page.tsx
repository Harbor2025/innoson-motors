import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import FooterServer from "@/components/layout/FooterServer";
import AboutHero from "@/components/about/AboutHero";
import StatsRow from "@/components/about/StatsRow";
import ChairmanMessage from "@/components/about/ChairmanMessage";
import MadeInNigeria from "@/components/about/MadeInNigeria";
import FactoryVideo from "@/components/about/FactoryVideo";
import ImpactSection from "@/components/about/ImpactSection";
import LifeAtIvm from "@/components/about/LifeAtIvm";
import ImageBand from "@/components/about/ImageBand";
import WhatsAppWidget from "@/components/about/WhatsAppWidget";
import { getAboutPage, getContactInfo } from "@/server/globals";

export const metadata: Metadata = {
  title: "About Us | Innoson Vehicle Manufacturing",
  description:
    "Innoson Vehicle Manufacturing — Nigeria's first privately owned indigenous automobile manufacturer.",
};

export const revalidate = 60;

export default async function AboutPage() {
  let about;
  try {
    about = await getAboutPage();
  } catch {
    about = undefined;
  }

  // WhatsApp link for the floating widget comes from the CMS social links
  let whatsapp: string | undefined;
  try {
    const info = await getContactInfo();
    whatsapp = info.socialLinks.find((s) => s.platform.toLowerCase() === "whatsapp")?.url;
  } catch {
    whatsapp = undefined;
  }

  return (
    <>
      {/* Header floats over the hero (transparent on mobile until you scroll) */}
      <Header active="about" overlay />
      <main>
        <AboutHero />
        <StatsRow stats={about?.stats} />
        <ChairmanMessage />
        <MadeInNigeria />
        <FactoryVideo />
        <ImpactSection />
        <LifeAtIvm />
        <div className="mt-10 lg:mt-20">
          <ImageBand
            src="/images/about/life-banner.png"
            alt="IVM vehicles lined up at the factory"
            heightClassName="h-[260px] md:h-[450px] lg:h-[675px]"
          />
        </div>
      </main>
      {/* Footer sits flush against the last image in the design */}
      <FooterServer />
      {whatsapp && <WhatsAppWidget href={whatsapp} />}
    </>
  );
}
