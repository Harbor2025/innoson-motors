import Image from "next/image";
import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import Logo from "@/components/layout/Logo";
import ShareIcons from "./ShareIcons";
import type { Article } from "./news-data";

const PLACEHOLDER =
  "Lorem ipsum dolor sit amet consectetur. Nullam dui purus semper aliquam lorem. Hendrerit lorem donec et bibendum feugiat. Enim viverra enim duis aliquam diam fringilla amet libero pretium. Duis amet quam fringilla quam pharetra imperdiet velit facilisis magna. Egestas amet a magna convallis. In adipiscing rhoncus cursus ac ultrices dictumst felis. Arcu leo ut lectus maecenas morbi nibh. Commodo aliquet gravida montes nunc justo feugiat enim quis porttitor.";

const BODY_CLASSES = [
  "flex flex-col gap-3.5 text-[14px] leading-[1.4] text-ivm-n900 md:gap-5 md:text-[16px]",
  "[&_h2]:text-[20px] [&_h2]:font-semibold [&_h2]:leading-[1.3] md:[&_h2]:text-[24px] md:[&_h2]:leading-[1.2]",
  "[&_h3]:text-[20px] [&_h3]:font-semibold [&_h3]:leading-[1.3] md:[&_h3]:text-[24px] md:[&_h3]:leading-[1.2]",
  "[&_p]:m-0 [&_a]:text-ivm-blue [&_a]:underline [&_strong]:font-bold",
  "[&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:m-0",
  "[&_img]:h-auto [&_img]:w-full [&_picture]:block",
  "[&_blockquote]:border-l-2 [&_blockquote]:border-ivm-n200 [&_blockquote]:pl-4 [&_blockquote]:text-ivm-n600",
  "[&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:border-ivm-n200 [&_td]:px-4 [&_td]:py-3 [&_th]:border [&_th]:border-ivm-n200 [&_th]:bg-ivm-n50 [&_th]:px-4 [&_th]:py-3 [&_th]:text-left [&_th]:text-[14px] [&_th]:font-semibold [&_th]:text-ivm-n600",
].join(" ");

type Props = {
  article: Article;
  content?: unknown;
};

/**
 * Figma: "Desktop / Tablet / Mobile – News Article".
 * Back bar, article header, hero image, rich-text body, share row, CTA band.
 */
export default function ArticleContent({ article, content }: Props) {
  const paragraphs = article.body?.length ? article.body : [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER];
  const readTime = article.readTime.replace(/\bmins\b/i, "min");
  const isElectricStory = /electric|\bevm?\b|ex01|ex02|\blink\b/i.test(article.title);
  const ctaHeading = isElectricStory
    ? "Drive electric, made in Nigeria"
    : "Ready to experience IVM?";
  const hasContent =
    content != null && typeof content === "object" && Object.keys(content as object).length > 0;

  return (
    <article>
      <div className="w-full bg-ivm-n50">
        <div className="flex h-11 items-center pl-6 xl:h-12 xl:pl-12">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-[14px] font-semibold leading-[1.4] text-ivm-n900"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M11.25 3.75 6 9l5.25 5.25"
                stroke="#1E1E1E"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to News
          </Link>
        </div>
      </div>

      <header className="flex flex-col items-start gap-4 px-6 pb-12 pt-8 text-left md:gap-[14px] md:px-6 md:pb-8 md:pt-12 xl:items-center xl:px-8 xl:pb-10 xl:pt-16 xl:text-center">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[12px] font-semibold uppercase leading-[15px] tracking-[0.12em] text-ivm-blue">
            {article.category}
          </span>
          <span aria-hidden="true" className="text-[14px] leading-[1.4] text-ivm-n500">
            ·
          </span>
          <span className="text-[14px] leading-[1.4] text-ivm-n600">{article.date}</span>
          <span aria-hidden="true" className="text-[14px] leading-[1.4] text-ivm-n500">
            ·
          </span>
          <span className="text-[14px] leading-[1.4] text-ivm-n600">{readTime}</span>
        </div>

        <h1 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px] xl:max-w-[900px] xl:text-[40px]">
          {article.title}
        </h1>

        <div className="flex items-center gap-2.5">
          <Logo className="h-6 w-10" />
          <span className="text-[14px] leading-[1.4] text-ivm-n900">IVM Newsroom</span>
        </div>
      </header>

      <div className="px-6 md:px-6 xl:px-8">
        <div className="ivm-fade relative mx-auto h-[229px] w-full max-w-[1376px] overflow-hidden bg-ivm-n50 md:h-[420px] xl:h-[640px]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="(min-width: 1440px) 1376px, (min-width: 768px) 720px, 100vw"
            className="object-cover"
            style={{ "--ivm-delay": "0.1s", "--ivm-dur": "0.8s" } as React.CSSProperties}
          />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[720px] px-6 pb-10 pt-6 md:pb-14 md:pt-8 xl:px-0 xl:pb-16 xl:pt-12">
        {hasContent ? (
          <RichText data={content as never} className={BODY_CLASSES} />
        ) : (
          <div className={BODY_CLASSES}>
            {paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}

        <div className="mt-3.5 flex flex-col items-start gap-3 border-y border-ivm-n200 py-5 md:mt-5 xl:flex-row xl:items-center xl:py-6">
          <p className="text-[16px] font-medium leading-[1.4] text-ivm-n900">Share this story</p>
          <div className="xl:ml-auto">
            <ShareIcons title={article.title} />
          </div>
        </div>

        <section className="mt-3.5 flex flex-col items-center gap-3 rounded-[12px] bg-ivm-n50 px-5 py-8 text-center md:mt-5 xl:px-8 xl:py-10">
          <h2 className="text-[20px] font-semibold leading-[1.3] text-ivm-n900 md:text-[24px] md:leading-[1.2]">
            {ctaHeading}
          </h2>
          <div className="flex w-full flex-col gap-2.5 pt-0 md:flex-row md:justify-center md:gap-3 xl:max-w-[412px] xl:pt-2">
            <Link
              href="/vehicles"
              className="flex h-11 w-full items-center justify-center rounded-[4px] bg-ivm-blue px-4 text-[14px] font-semibold leading-[1.4] text-white transition-opacity hover:opacity-90 md:flex-1 xl:w-[200px] xl:flex-none"
            >
              Order Now
            </Link>
            <Link
              href="/book-a-test-drive"
              className="flex h-11 w-full items-center justify-center rounded-[4px] border border-ivm-n200 bg-white px-4 text-[14px] font-semibold leading-[1.4] text-ivm-n900 transition-colors hover:bg-ivm-n50 md:flex-1 xl:w-[200px] xl:flex-none"
            >
              Book a Test Drive
            </Link>
          </div>
        </section>
      </div>
    </article>
  );
}
