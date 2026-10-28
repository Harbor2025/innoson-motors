import type { Metadata } from "next";
import RevampNav from "@/components/revamp/RevampNav";
import RevampFooter from "@/components/revamp/RevampFooter";
import CareersHero from "@/components/careers/CareersHero";
import WhyIvm from "@/components/careers/WhyIvm";
import OpenRoles from "@/components/careers/OpenRoles";
import CvBand from "@/components/careers/CvBand";

export const metadata: Metadata = {
  title: "Careers | Innoson Vehicle Manufacturing",
  description:
    "Join the 8,000 people building brand-new vehicles in Nnewi and supporting customers across Nigeria. Explore open roles at Innoson Vehicle Manufacturing.",
};

export const revalidate = 60;

export default function CareersPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-[family-name:var(--font-ivm-inter)]">
      <RevampNav active="careers" variant="transparent" />
      <main className="flex-1">
        <CareersHero />
        <WhyIvm />
        <OpenRoles />
        <CvBand />
      </main>
      <RevampFooter />
    </div>
  );
}
