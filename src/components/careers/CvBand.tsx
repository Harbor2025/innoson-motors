import FinButton from "@/components/financing/FinButton";
import { CV_MAILTO } from "./careers-data";

/** Figma: "Section – CV" — centred CTA band for speculative applications. */
export default function CvBand() {
  return (
    <section id="cv" className="scroll-mt-14 px-4 py-16 md:px-6 md:py-22 xl:px-24 xl:py-28">
      <div className="flex flex-col items-center gap-3 rounded-[16px] bg-ivm-n50 px-6 py-10 xl:px-6 xl:py-16">
        <h2 className="text-center text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px] xl:text-[48px]">
          Don’t see your role?
        </h2>
        <p className="text-center text-[14px] leading-[1.4] text-ivm-n600 md:text-[16px]">
          Send us your CV and we’ll keep you in mind for future openings. Lorem ipsum dolor sit amet,
          consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.
        </p>
        <FinButton
          href={CV_MAILTO}
          label="Send us your CV"
          variant="primary"
          className="mt-[2px] w-full xl:w-[220px]"
        />
      </div>
    </section>
  );
}
