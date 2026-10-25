import BlogCard from "./BlogCard";
import type { Article } from "./news-data";

/**
 * Figma: "Section – More Stories". Three cards on desktop; a horizontal,
 * edge-to-edge scroller on tablet and mobile.
 */
export default function MoreStories({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-5 pb-14 pl-6 pt-4 md:pb-20 md:pl-6 md:pt-4 xl:gap-8 xl:px-8 xl:pb-28 xl:pt-12">
      <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px] xl:text-[48px]">
        More stories
      </h2>

      <div className="flex w-full gap-4 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden xl:grid xl:grid-cols-3 xl:gap-8 xl:overflow-visible xl:pb-0">
        {articles.map((article) => (
          <div
            key={article.slug}
            className="w-[280px] shrink-0 md:w-[320px] xl:w-auto xl:shrink"
          >
            <BlogCard article={article} />
          </div>
        ))}
      </div>
    </section>
  );
}
