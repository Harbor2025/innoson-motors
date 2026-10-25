import Image from "next/image";

export type ResponsiveSrcs = { mobile: string; tablet: string; desktop: string };

/**
 * Fills its (relative) parent with a different export of the same artwork per
 * breakpoint, matching the three Figma frames: mobile < md, tablet md..xl,
 * desktop >= xl. Hidden variants are display:none, so only one image loads.
 */
export default function ResponsiveImage({
  srcs,
  alt = "",
  className = "object-cover",
  priority = false,
}: {
  srcs: ResponsiveSrcs;
  alt?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src={srcs.mobile}
        alt={alt}
        fill
        sizes="100vw"
        priority={priority}
        className={`${className} md:hidden`}
      />
      <Image
        src={srcs.tablet}
        alt={alt}
        fill
        sizes="100vw"
        priority={priority}
        className={`${className} hidden md:block xl:hidden`}
      />
      <Image
        src={srcs.desktop}
        alt={alt}
        fill
        sizes="100vw"
        priority={priority}
        className={`${className} hidden xl:block`}
      />
    </>
  );
}
