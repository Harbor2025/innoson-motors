import type { Metadata } from "next";
import RevampNav from "@/components/revamp/RevampNav";
import RevampFooter from "@/components/revamp/RevampFooter";
import RevampWhatsAppFloat from "@/components/revamp/RevampWhatsAppFloat";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import ContactShowrooms from "@/components/contact/ContactShowrooms";
import SocialRow from "@/components/contact/SocialRow";
import { getContactInfo, listDealerships } from "@/server/globals";
import type { ContactInfoDTO, DealershipDTO } from "@/types/dto";

export const metadata: Metadata = {
  title: "Contact Us | Innoson Vehicle Manufacturing",
  description:
    "Contact Innoson Motors sales, service, financing and showrooms across Nigeria.",
};

export const revalidate = 60;

export default async function ContactPage() {
  let info: ContactInfoDTO | undefined;
  let dealerships: DealershipDTO[];
  try {
    [info, dealerships] = await Promise.all([getContactInfo(), listDealerships()]);
  } catch {
    info = undefined;
    dealerships = [];
  }

  const whatsapp = info?.socialLinks.find(
    (s) => s.platform.toLowerCase() === "whatsapp",
  )?.url;

  return (
    <div className="flex min-h-screen flex-col bg-white font-[family-name:var(--font-ivm-inter)]">
      <RevampNav active="contact" />
      <main className="flex-1">
        <ContactHero />

        <section
          aria-labelledby="get-in-touch-title"
          className="px-4 pt-12 md:px-6 md:pt-16 xl:px-24 xl:pt-24"
        >
          <div className="flex flex-col gap-10 xl:flex-row xl:items-start xl:gap-16">
            <ContactInfo contactInfo={info} className="xl:flex-1" />
            <ContactForm />
          </div>
        </section>

        <ContactShowrooms contactInfo={info} dealerships={dealerships} />
        <SocialRow socialLinks={info?.socialLinks} />
      </main>
      <RevampFooter />
      {whatsapp && <RevampWhatsAppFloat href={whatsapp} />}
    </div>
  );
}
