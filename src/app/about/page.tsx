import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AboutHero from "@/components/about/AboutHero";
import StatsRow from "@/components/about/StatsRow";
import ImageBand from "@/components/about/ImageBand";
import StoryTwoColumn from "@/components/about/StoryTwoColumn";
import StoryWithImage from "@/components/about/StoryWithImage";

export const metadata: Metadata = {
  title: "About Us | Innoson Vehicle Manufacturing",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main>
        <AboutHero />
        <StatsRow />

        {/* Car rear photo: edge-to-edge on mobile, 50px gutters on desktop, no rounding */}
        <ImageBand
          src="/images/about-car-rear.png"
          alt="IVM Caris rear view"
          heightClassName="h-[254px] lg:h-[519px]"
          containerClassName="px-0 py-8 lg:px-[50px] lg:py-10"
        />

        <StoryTwoColumn />

        {/* "Why do we exist?" banner: edge-to-edge at every breakpoint */}
        <ImageBand
          src="/images/image.webp"
          alt="IVM Caris driving through a forest road"
          heightClassName="h-[407px] lg:h-[800px]"
          heading="Why do we exist?"
          body={'To eradicate "tokunbo" (foreign used) automobiles from Africa by promoting MADE IS NIGERIA'}
        />

        {/* Pickup photo: 20px gutters on mobile, edge-to-edge on desktop, rounded corners */}
        <ImageBand
          src="/images/image1.webp"
          alt="IVM pickup truck on a scenic road"
          heightClassName="h-[326px] lg:h-[642px]"
          containerClassName="px-5 py-8 lg:px-5 lg:py-10"
          rounded
        />

        <StoryWithImage />

        {/* "Driving video" banner: 20px gutters on mobile, edge-to-edge on desktop */}
        <ImageBand
          src="/images/b1e142294a01d68abac29ed61f48321618579322.jpg"
          alt="Red IVM hatchback in a showroom"
          heightClassName="h-[335px] lg:h-[800px]"
          containerClassName="px-5 py-8 lg:px-0 lg:py-0"
          eyebrow="DRIVING VIDEO"
          heading="Thoughtful details decorating the space"
        />
      </main>
      <Footer />
    </>
  );
}