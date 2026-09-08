import Image from "next/image";
import Link from "next/link";
import type { Article } from "./news-data";
import { getRelatedArticles } from "./news-data";
import Container from "../layout/Container";
import BlogCard from "./BlogCard";
import { ArrowLeft } from "lucide-react";
import { FacebookIcon, LinkedInIcon, WhatsAppIcon } from "./ShareIcons";

const PARAGRAPH =
  "Lorem ipsum dolor sit amet consectetur. Enim maecenas mauris vel porta feugiat diam sollicitudin lacus. Neque adipiscing maecenas pellentesque vulputate morbi viverra. Viverra pellentesque faucibus scelerisque nulla id leo sit sit tortor. Nisl in convallis a ornare sed diam fermentum. Sit id aenean pellentesque sed vitae sit at ridiculus vel. Sed semper sit eu luctus scelerisque massa sed curabitur. Nec purus amet amet odio diam ac. Erat elit turpis dui id. Viverra diam sed sit id lorem massa ornare velit.";

const AUTHOR_BIO = "Automotive content writer at IVM, covering local manufacturing and new model launches.";

export default function ArticleContent({ article }: { article: Article }) {
  const related = getRelatedArticles(article.slug, 3);

  return (
    <article className="font-[family-name:var(--font-google-sans)] w-full">
      <div className="w-full border-b border-[#e4e4e4] py-4">
        <Container>
          <Link href="/news" className="flex w-fit items-center gap-2 text-[16px] text-[#1e1e1e]">
            <ArrowLeft className="size-6" />
            Go Back
          </Link>
        </Container>
      </div>

      <Container className="py-10 lg:py-16">
        <div className="flex flex-col gap-6 lg:items-center lg:text-center">
          <p className="text-[16px] font-black tracking-[0.02em] text-[#005eb8] lg:text-[20px]">
            {article.readTime}
          </p>
          <h1 className="max-w-[865px] text-[28px] font-black leading-[normal] text-black lg:text-[48px] lg:leading-[58px]">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 lg:gap-5">
            <div className="flex items-center gap-2 lg:gap-4">
              <span className="inline-block size-[32px] shrink-0 overflow-hidden rounded-full bg-[#d9d9d9] lg:size-[48px]">
                <Image
                  src="/images/avatar-nneka.png"
                  alt=""
                  width={48}
                  height={48}
                  className="size-full object-cover"
                />
              </span>
              <span className="whitespace-nowrap text-[14px] text-black lg:text-[20px]">{article.author}</span>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
              <span className="size-[6px] shrink-0 rounded-full bg-[#524e4e]" />
              <span className="whitespace-nowrap text-[14px] text-black lg:text-[20px]">{article.date}</span>
            </div>
          </div>
        </div>

        <div className="relative mt-10 h-[309px] w-full overflow-hidden rounded-[4px] bg-[#ebebeb] lg:mt-16 lg:h-[718px]">
          <Image src={article.image} alt={article.title} fill sizes="100vw" className="object-cover" />
        </div>

        <div className="mt-10 flex flex-col gap-6 text-[16px] leading-[27px] text-[#1e1e1e] lg:mt-16 lg:gap-8 lg:text-[20px]">
          <p>{PARAGRAPH}</p>
          <p>{PARAGRAPH}</p>

          <h2 className="text-[20px] font-black leading-[normal] text-black lg:text-[40px] lg:leading-[62px]">
            Meet the IVM Electric Family
          </h2>

          <p>{PARAGRAPH}</p>

          <div className="relative h-[220px] w-full overflow-hidden rounded-[4px] bg-[#ebebeb] lg:h-[640px]">
            <Image src={article.image} alt="" fill sizes="100vw" className="object-cover" />
          </div>

          <p>{PARAGRAPH}</p>

          <div className="relative h-[220px] w-full overflow-hidden rounded-[4px] bg-[#ebebeb] lg:h-[640px]">
            <Image src={article.image} alt="" fill sizes="100vw" className="object-cover" />
          </div>

          <p>{PARAGRAPH}</p>
        </div>

        <div className="mt-10 flex flex-col gap-6 lg:mt-16 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-[16px] font-black text-black lg:text-[18px]">{article.author}</p>
            <p className="text-[14px] text-[#524e4e] lg:text-[16px]">{AUTHOR_BIO}</p>
          </div>

          <div className="flex items-center gap-4">
            <p className="text-[16px] text-black">Share this News :</p>
            <div className="flex items-center gap-3">
              <FacebookIcon className="size-6" />
              <LinkedInIcon className="size-6" />
              <WhatsAppIcon className="size-6" />
            </div>
          </div>
        </div>

        <div className="mt-10 h-px w-full bg-[#767676] lg:mt-16" />

        <p className="mt-10 max-w-[1340px] text-[16px] leading-[normal] text-[#1e1e1e] lg:mt-16 lg:text-[20px]">
          For more information on our electric vehicles contact our sales team. The future is
          electric—choose Innoson and drive with the power of innovation.
        </p>

        {related.length > 0 && (
          <div className="mt-16 lg:mt-24">
            <h2 className="text-[24px] font-black leading-[normal] text-black lg:text-[40px]">
              Check out other stories
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:mt-12 lg:grid-cols-3">
              {related.map((item) => (
                <BlogCard key={item.slug} article={item} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </article>
  );
}