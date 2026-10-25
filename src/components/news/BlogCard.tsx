import Image from "next/image";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa6";
import type { Article } from "./news-data";

/**
 * Figma: "Revamp/News Card" — 260px image, category/date meta, 20px title,
 * two-line summary and a "Read More" link (16px medium, IVM blue).
 */
export default function BlogCard({
  article,
  priority = false,
}: {
  article: Article;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className="group flex flex-col items-start gap-[14px] pt-[6px]"
    >
      <div className="relative h-[260px] w-full overflow-hidden bg-ivm-n50">
        <Image
          src={article.image}
          alt=""
          fill
          priority={priority}
          sizes="(min-width: 1280px) 437px, (min-width: 768px) 348px, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[12px] font-semibold uppercase leading-[15px] tracking-[0.12em] text-ivm-blue">
          {article.category}
        </span>
        <span aria-hidden="true" className="text-[14px] leading-[1.4] text-ivm-n500">
          ·
        </span>
        <span className="text-[14px] leading-[1.4] text-ivm-n600">{article.date}</span>
      </div>

      <h2 className="text-[20px] font-semibold leading-[1.3] text-ivm-n900 transition-colors group-hover:text-ivm-blue md:leading-[1.4]">
        {article.title}
      </h2>

      <p className="line-clamp-2 text-[14px] leading-[1.4] text-ivm-n600">
        {article.excerpt}
      </p>

      <span className="inline-flex items-center gap-1 text-[16px] font-medium leading-[1.4] text-ivm-blue">
        Read More
        <FaArrowRight
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
