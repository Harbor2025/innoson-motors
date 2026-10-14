import Container from "../layout/Container";
import PausableVideo from "./PausableVideo";

// Figma: text block 837:322 (515 wide) + video 840:359 (730x320, pause control at 840:340)
export default function ChairmanMessage({
  videoSrc = "/videos/home-showcase.mp4",
}: {
  videoSrc?: string;
}) {
  return (
    <section className="mt-2 lg:mt-[85px]">
      <Container className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-10">
        <div className="flex flex-col gap-3 lg:w-[515px] lg:gap-6 lg:pt-[33px]">
          <h2 className="text-[24px] font-extrabold uppercase leading-[normal] text-black font-[Avenir,'Avenir_Next','Nunito_Sans',sans-serif] lg:text-[40px] lg:font-semibold lg:capitalize lg:font-[family-name:var(--font-inter)]">
            A Message from Our Chairman
          </h2>
          <p className="text-[14px] leading-[normal] text-[#878383] font-[Avenir,'Avenir_Next','Nunito_Sans',sans-serif] lg:text-[20px] lg:font-[family-name:var(--font-roboto)]">
            Discover IVM’s journey, key achievements and commitment to delivering lasting value.
          </p>
        </div>

        <PausableVideo
          videoSrc={videoSrc}
          poster="/images/about/chairman-poster.png"
          posterClassName="object-cover object-[50%_10%]"
          className="h-[220px] w-full md:h-[320px] lg:w-[730px] lg:shrink-0"
          buttonClassName="bottom-5 left-5 size-10 lg:bottom-[66px] lg:left-[33px]"
        />
      </Container>
    </section>
  );
}
