import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Container from "@/components/layout/Container";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactForm from "@/components/contact/ContactForm";
import SocialRow from "@/components/contact/SocialRow";

export const metadata: Metadata = {
  title: "Contact Us | Innoson Vehicle Manufacturing",
};

export default function ContactPage() {
  return (
    <>
      <Header active="contact" />
      <main>
        <ContactHero />

        <section className="w-full pb-12 lg:pb-16">
          <Container>
            <div className="flex flex-col-reverse gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-0 lg:rounded-[9px] lg:bg-[#f6f7f9] lg:p-[30px]">
              <ContactInfo />
              <ContactForm />
            </div>
          </Container>
        </section>

        <SocialRow />
      </main>
      <Footer />
    </>
  );
}