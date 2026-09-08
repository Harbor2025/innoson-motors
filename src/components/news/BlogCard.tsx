import Image from "next/image";
import Link from "next/link";
import type { Article } from "./news-data";

interface BlogCardProps {
  article: Article;
  featured?: boolean;
}

export default function BlogCard({ article, featured = false }: BlogCardProps) {
  return (
    <Link
      href={`/news/${article.slug}`}
      className={`font-[family-name:var(--font-google-sans)] flex flex-col gap-5 ${
        featured ? "lg:flex-row lg:items-center lg:gap-5" : ""
      }`}
    >
      <div
        className={`relative w-full shrink-0 overflow-hidden rounded-[4px] bg-[#ebebeb] ${
          featured ? "h-[220px] lg:h-[508px] lg:w-[773px]" : "h-[220px] lg:h-[338px]"
        }`}
      >
        <Image
          src={article.image}
          alt={article.title}
          fill
          sizes={featured ? "(min-width: 1024px) 773px, 100vw" : "(min-width: 1024px) 433px, 100vw"}
          className="object-cover"
        />
      </div>

      <div className={`flex flex-col gap-6 ${featured ? "lg:w-[547px] lg:gap-10" : ""}`}>
        <div className="flex flex-col gap-3">
          <p
            className={`font-black text-[#005eb8] tracking-[0.02em] ${
              featured ? "text-[16px] lg:text-[20px]" : "text-[16px]"
            }`}
          >
            {article.readTime}
          </p>
          <p
            className={`font-black tracking-[0.02em] text-black ${
              featured ? "text-[20px] leading-[normal] lg:text-[40px] lg:leading-[58px]" : "text-[20px] leading-[normal] lg:text-[24px]"
            }`}
          >
            {article.title}
          </p>
          <p
            className={`tracking-[0.02em] text-[#524e4e] ${
              featured ? "text-[14px] leading-[normal] lg:text-[20px]" : "text-[14px] leading-[normal] lg:text-[16px]"
            }`}
          >
            {article.excerpt} <span className="font-black text-[#005eb8]">Read More</span>
          </p>
        </div>

        <div className="flex items-center gap-3 lg:gap-5">
          <div className="flex items-center gap-2 lg:gap-4">
            <span
              className={`inline-block shrink-0 overflow-hidden rounded-full bg-[#d9d9d9] ${
                featured ? "size-[32px] lg:size-[48px]" : "size-[24px] lg:size-[32px]"
              }`}
            >
              <Image
                src="/images/avatar-nneka.png"
                alt=""
                width={48}
                height={48}
                className="size-full object-cover"
              />
            </span>
            <span
              className={`whitespace-nowrap tracking-[0.02em] text-black ${
                featured ? "text-[14px] lg:text-[20px]" : "text-[14px] lg:text-[16px]"
              }`}
            >
              {article.author}
            </span>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <span className="size-[6px] shrink-0 rounded-full bg-[#524e4e]" />
            <span
              className={`whitespace-nowrap tracking-[0.02em] text-black ${
                featured ? "text-[14px] lg:text-[20px]" : "text-[14px] lg:text-[16px]"
              }`}
            >
              {article.date}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}