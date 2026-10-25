import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import Logo from "@/components/layout/Logo";
import type { Article } from "./news-data";

/**
 * Figma: "Section – Featured" — full-bleed story that switches to a two-column
 * layout at xl (800 × 500 image + copy), then stacks on tablet and mobile.
 */
export default function FeaturedStory({ article }: { article: Article }) {
  const href = `/news/${article.slug}`;

  return (
    <section
      aria-label="Featured story"
      className="mx-auto w-full max-w-[1440px] px-6 pt-4 md:px-6 md:pt-4 xl:flex xl:items-center xl:gap-12 xl:px-8 xl:pt-6"
    >
      <Link
        href={href}
        aria-label={article.title}
        className="ivm-fade group relative block aspect-[342/210] w-full shrink-0 overflow-hidden bg-ivm-n50 md:aspect-[9/5] xl:aspect-[8/5] xl:w-[800px]"
        style={{ "--ivm-delay": "0.1s", "--ivm-dur": "0.8s" } as React.CSSProperties}
      >
        <Image
          src={article.image}
          alt=""
          fill
          priority
          sizes="(min-width: 1280px) 800px, (min-width: 768px) 720px, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </Link>

      <div
        className="ivm-rise mt-3.5 flex flex-col items-start gap-3.5 xl:mt-0 xl:flex-1 xl:gap-4"
        style={
          {
            "--ivm-y": "16px",
            "--ivm-delay": "0.2s",
            "--ivm-dur": "0.7s",
          } as React.CSSProperties
        }
      >
        <div className="flex items-center gap-2">
          <p className="text-[12px] font-semibold uppercase leading-[15px] tracking-[0.12em] text-ivm-blue">
            Featured · {article.category}
          </p>
          <span aria-hidden="true" className="text-[14px] leading-[1.4] text-ivm-n500">
            ·
          </span>
          <p className="text-[14px] leading-[1.4] text-ivm-n600">{article.date}</p>
        </div>

        <Link href={href} className="group/title block self-stretch">
          <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 transition-colors group-hover/title:text-ivm-blue xl:text-[32px]">
            {article.title}
          </h2>
        </Link>

        <p className="text-[14px] leading-[1.4] text-ivm-n600 xl:text-[16px]">
          {article.excerpt}
        </p>

        <div className="hidden items-center gap-2.5 xl:flex">
          <Logo className="h-[22px] w-9" />
          <p className="text-[14px] leading-[1.4] text-ivm-n900">IVM Newsroom</p>
        </div>

        <Link
          href={href}
          className="group/read inline-flex items-center gap-1 text-[16px] font-medium leading-[1.4] text-ivm-blue"
        >
          Read More
          <FaArrowRight
            aria-hidden="true"
            className="transition-transform duration-300 group-hover/read:translate-x-1"
          />
        </Link>
      </div>
    </section>
  );
}
