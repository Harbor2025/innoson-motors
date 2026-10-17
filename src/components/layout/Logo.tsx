/**
 * IVM logo. The Figma LOGO layer is a crop of a wider sprite PNG
 * (image is 286.54% wide / 101.62% tall, anchored top-left) so we reproduce
 * the same crop here. Pass the rendered size through `className`
 * e.g. "h-[35px] w-[59px] lg:h-[66px] lg:w-[111px]".
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`relative md:block hidden  shrink-0 overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/home/logo.png"
        alt=""
        className="pointer-events-none absolute left-0 top-[-0.81%] h-[101.62%] w-[286.54%] max-w-none"
      />
    </span>
  );
}
