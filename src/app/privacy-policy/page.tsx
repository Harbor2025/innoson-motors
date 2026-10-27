import type { Metadata } from "next";
import RevampFooter from "@/components/revamp/RevampFooter";
import RevampNav from "@/components/revamp/RevampNav";
import LegalPage from "@/components/legal/LegalPage";

export const metadata: Metadata = {
  title: "Privacy & Legal | Innoson Vehicle Manufacturing",
  description:
    "IVM privacy policy, terms of use and cookie policy — how Innoson Vehicle Manufacturing collects, uses and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-[family-name:var(--font-ivm-inter)]">
      <RevampNav />
      <main className="flex-1">
        <LegalPage />
      </main>
      <RevampFooter />
    </div>
  );
}
