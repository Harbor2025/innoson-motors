import Image from "next/image";

interface ImageBandProps {
  src: string;
  alt: string;
  /** Full height classes for this instance, e.g. "h-[254px] lg:h-[519px]" — passed in whole so Tailwind's static scanner can see them. */
  heightClassName: string;
  /** Full outer gutter classes for this instance, e.g. "px-5 lg:px-0" — each band has its own mobile/desktop inset pattern in the source design. */
  containerClassName?: string;
  rounded?: boolean;
  eyebrow?: string;
  heading?: string;
  body?: string;
}

export default function ImageBand({
  src,
  alt,
  heightClassName,
  containerClassName = "",
  rounded = false,
  eyebrow,
  heading,
  body,
}: ImageBandProps) {
  return (
    <section className={`w-full ${containerClassName}`}>
      <div className={`relative w-full overflow-hidden ${rounded ? "rounded-[6px]" : ""} ${heightClassName}`}>
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />

        {(heading || body) && (
          <div className=" absolute inset-0 flex flex-col justify-center gap-3 px-5 text-white lg:justify-start lg:gap-6 lg:px-[50px] lg:pt-[214px]">
            {eyebrow && <p className="text-[14px] lg:text-[17px]">{eyebrow}</p>}
            {heading && (
              <h2 className="max-w-[500px] text-[24px] font-extrabold uppercase leading-[1.2] lg:max-w-[700px] lg:text-[55px] lg:leading-[60px]">
                {heading}
              </h2>
            )}
            {body && (
              <p className="max-w-[350px] text-[16px] leading-[25px] lg:max-w-[493px] lg:text-[19px] lg:leading-[37px]">
                {body}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}