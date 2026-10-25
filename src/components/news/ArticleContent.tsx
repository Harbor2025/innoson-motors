import Image from "next/image";
import Link from "next/link";
import type { Article } from "./news-data";

// Figma: node 772:954 - Back link, title, date, 1040x586 image, one long body of text.
// The design drops author, share icons, sub-headings and "other stories", so they're gone.
// Pass real copy through `article.body` (one string per paragraph).
const PLACEHOLDER =
  "Lorem ipsum dolor sit amet consectetur. Nullam dui purus semper aliquam lorem. Hendrerit lorem donec et bibendum feugiat. Enim viverra enim duis aliquam diam fringilla amet libero pretium. Duis amet quam fringilla quam pharetra imperdiet velit facilisis magna. Egestas amet a magna convallis. In adipiscing rhoncus cursus ac ultrices dictumst felis. Arcu leo ut lectus maecenas morbi nibh. Commodo aliquet gravida montes nunc justo feugiat enim quis porttitor.";

export default function ArticleContent({ article }: { article: Article }) {
  const paragraphs = article.body?.length ? article.body : [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];

  return (
    <article className="w-full pb-10 pt-[84px] lg:pb-20 lg:pt-[120px]">
      <div className="mx-auto w-full max-w-[1040px] px-5 lg:px-0">
        <Link
          href="/news"
          className="flex w-fit items-center gap-[7px] text-[20px] font-semibold leading-[normal] tracking-[0.4px] text-[#524e4e] font-[family-name:var(--font-google-sans)]"
        >
          <Image src="/icons/arrow-left-bold.svg" alt="" width={16} height={16} />
          Back
        </Link>

        <h1 className="mt-6 text-[20px] font-bold leading-[normal] tracking-[0.4px] text-black font-[family-name:var(--font-google-sans)]">
          {article.title}
        </h1>
        <p className="mt-5 text-[14px] leading-[normal] tracking-[0.28px] text-[#888] font-[family-name:var(--font-inter)]">
          {article.date}
        </p>

        <div className="relative mt-10 h-[220px] w-full overflow-hidden bg-[#ebebeb] md:h-[400px] lg:h-[586px]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="(min-width: 1040px) 1040px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="mt-10 flex flex-col gap-6 text-justify text-[14px] leading-[normal] tracking-[0.28px] text-[#888] font-[family-name:var(--font-inter)] lg:text-[16px] lg:tracking-[0.32px]">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}
