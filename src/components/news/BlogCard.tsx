import Image from "next/image";
import Link from "next/link";
import type { Article } from "./news-data";

// Figma: node 772:1131 (card ≈335 wide: 207px image, 20px gap, title, date)
export default function BlogCard({ article, priority = false }: { article: Article; priority?: boolean }) {
  return (
    <Link href={`/news/${article.slug}`} className="group flex flex-col gap-5">
      <div className="relative h-[207px] w-full overflow-hidden rounded-[4px] bg-[#ebebeb]">
        <Image
          src={article.image}
          alt={article.title}
          fill
          priority={priority}
          sizes="(min-width: 1040px) 335px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-[20px] font-semibold leading-[normal] tracking-[0.4px] text-black font-[family-name:var(--font-google-sans)]">
          {article.title}
        </h2>
        <p className="text-[16px] leading-[normal] tracking-[0.32px] text-[#888] font-[family-name:var(--font-inter)]">
          {article.date}
        </p>
      </div>
    </Link>
  );
}
