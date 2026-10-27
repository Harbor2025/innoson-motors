import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import SimpleFooter from "@/components/layout/SimpleFooter";
import AboutHero from "@/components/about/AboutHero";
import AboutStats from "@/components/about/AboutStats";
import ChairmanSection from "@/components/about/ChairmanSection";
import Milestones from "@/components/about/Milestones";
import {
  AboutCta,
  OurStory,
  Pillars,
  WhyWeExist,
} from "@/components/about/AboutSections";

export const metadata: Metadata = {
  title: "About Us | Innoson Vehicle Manufacturing",
  description:
    "Innoson Vehicle Manufacturing - Nigeria's first privately owned indigenous automobile manufacturer, building brand-new vehicles in Nnewi since 2007.",
};

export const revalidate = 60;

export default function AboutPage() {
  return (
    <>
      {/* Header floats over the hero and turns solid once the hero scrolls away */}
      <Header active="about" overlay />
      <main className="bg-white font-[family-name:var(--font-ivm-inter)]">
        <AboutHero />
        <AboutStats />
        <ChairmanSection />
        <OurStory />
        <WhyWeExist />
        <Pillars />
        <Milestones />
        <AboutCta />
      </main>
      <SimpleFooter />
    </>
  );
}
