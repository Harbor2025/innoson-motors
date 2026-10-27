import type { Metadata } from "next";
import RevampNav from "@/components/revamp/RevampNav";
import RevampFooter from "@/components/revamp/RevampFooter";
import FinancingHero from "@/components/financing/FinancingHero";
import FinancingFaq from "@/components/financing/FinancingFaq";
import {
  GoodToKnow,
  HotlinesBand,
  HowItWorks,
  PaymentPlans,
} from "@/components/financing/FinancingSections";

export const metadata: Metadata = {
  title: "Financing | Innoson Vehicle Manufacturing",
  description:
    "Drive now, pay over time. Own a brand-new IVM vehicle with IVM Auto Finance from Access Bank, with repayments over up to 36 months.",
};

export const revalidate = 60;

export default function FinancingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-[family-name:var(--font-ivm-inter)]">
      <RevampNav active="financing" variant="transparent" />
      <main className="flex-1">
        <FinancingHero />
        <PaymentPlans />
        <HowItWorks />
        <GoodToKnow />
        <FinancingFaq />
        <HotlinesBand />
      </main>
      <RevampFooter />
    </div>
  );
}
