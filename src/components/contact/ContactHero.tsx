import Image from "next/image";

/**
 * Figma: "Section – Header" (eyebrow, 56px headline, subtitle) followed by the
 * "Banner" fleet photo (1376 × 460, 12px radius on desktop). Plays a short
 * page-load rise; the banner settles in from a slight zoom.
 */
export default function ContactHero() {
  return (
    <section aria-labelledby="contact-title">
      <div className="flex flex-col items-center gap-3 px-4 pb-8 pt-14 text-center md:gap-[14px] md:pb-12 md:pt-20 xl:pt-24">
        <p
          className="ivm-rise text-[12px] font-semibold uppercase leading-[15px] tracking-[1.44px] text-ivm-blue"
          style={{ "--ivm-y": "12px", "--ivm-dur": "0.6s" } as React.CSSProperties}
        >
          Contact
        </p>
        <h1
          id="contact-title"
          className="ivm-rise text-[32px] font-semibold leading-[1.2] text-ivm-n900 md:text-[48px] xl:text-[56px] xl:leading-[1.1]"
          style={
            {
              "--ivm-y": "16px",
              "--ivm-delay": "0.07s",
              "--ivm-dur": "0.7s",
            } as React.CSSProperties
          }
        >
          We’re here to help
        </h1>
        <p
          className="ivm-rise max-w-[821px] text-[16px] leading-[1.4] text-ivm-n600 md:text-[20px]"
          style={
            {
              "--ivm-y": "16px",
              "--ivm-delay": "0.14s",
              "--ivm-dur": "0.7s",
            } as React.CSSProperties
          }
        >
          Questions about a vehicle, a quote or a service visit? Talk to the team that builds them.
        </p>
      </div>

      <div className="px-4 md:px-6 xl:px-8">
        <div className="ivm-fade relative h-[220px] overflow-clip rounded-[12px] bg-ivm-n50 md:h-[340px] xl:h-[460px]">
          <Image
            src="/images/contact-hero.webp"
            alt="IVM fleet vehicles in the factory yard"
            fill
            priority
            sizes="(min-width: 1440px) 1376px, 100vw"
            className="object-cover"
            style={{ "--ivm-delay": "0.15s", "--ivm-dur": "0.8s" } as React.CSSProperties}
          />
        </div>
      </div>
    </section>
  );
}
