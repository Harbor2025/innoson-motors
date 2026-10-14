import PausableVideo from "./PausableVideo";

// Figma: node 773:1425 (1444x974, pause control 840:337 at left 50 / bottom 56)
export default function FactoryVideo({
  videoSrc = "/videos/home-showcase.mp4",
}: {
  videoSrc?: string;
}) {
  return (
    <section className="mt-10 w-full lg:mt-20">
      <PausableVideo
        videoSrc={videoSrc}
        poster="/images/about/factory-poster.png"
        className="h-[320px] w-full md:h-[600px] lg:h-[974px]"
        buttonClassName="bottom-5 left-5 size-10 lg:bottom-14 lg:left-[50px]"
      />
    </section>
  );
}
