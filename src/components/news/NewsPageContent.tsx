"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BlogCard from "./BlogCard";
import FeaturedStory from "./FeaturedStory";
import { ARTICLES, NEWS_CATEGORIES, type Article } from "./news-data";

const FILTERS = ["All", ...NEWS_CATEGORIES] as const;
type Filter = (typeof FILTERS)[number];

/**
 * Figma: "Desktop / Tablet / Mobile – News".
 * Page header with search + category pills, a featured story, the latest grid
 * and the secondary CTA below it. Search and filters run client-side because
 * the listing is already fetched in one pass (max 20 posts).
 */
export default function NewsPageContent({ initialArticles }: { initialArticles?: Article[] }) {
  const articles = initialArticles?.length ? initialArticles : ARTICLES;
  const [query, setQuery] = useState("");
  const [active, setActive] = useState<Filter>("All");

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return articles.filter((article) => {
      if (active !== "All" && article.category !== active) return false;
      if (!term) return true;
      return (
        article.title.toLowerCase().includes(term) ||
        article.excerpt.toLowerCase().includes(term)
      );
    });
  }, [active, articles, query]);

  const [featured, ...latest] = filtered;

  return (
    <>
      <section className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-3 px-6 pb-8 pt-12 text-center md:px-6 md:pt-[72px] xl:gap-4 xl:px-8 xl:pb-12 xl:pt-24">
        <p
          className="ivm-rise text-[12px] mt-5 font-semibold uppercase leading-[15px] tracking-[0.12em] text-ivm-blue"
          style={{ "--ivm-y": "12px", "--ivm-dur": "0.6s" } as React.CSSProperties}
        >
          Newsroom
        </p>

        <h1
          className="ivm-rise text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[40px] xl:text-[56px] xl:leading-[1.1]"
          style={
            {
              "--ivm-y": "16px",
              "--ivm-delay": "0.07s",
              "--ivm-dur": "0.7s",
            } as React.CSSProperties
          }
        >
          <span className="md:hidden">News &amp; Stories</span>
          <span className="hidden md:inline xl:hidden">News &amp; stories</span>
          <span className="hidden xl:inline">News &amp; stories from IVM</span>
        </h1>

        <p
          className="ivm-rise text-[14px] leading-[1.4] text-ivm-n600 md:text-[16px]"
          style={
            {
              "--ivm-y": "16px",
              "--ivm-delay": "0.14s",
              "--ivm-dur": "0.7s",
            } as React.CSSProperties
          }
        >
          Launches, partnerships and life at the Nnewi plant.
        </p>

        <div
          role="search"
          className="ivm-rise mt-1 flex h-12 w-full items-center gap-2.5 rounded-[8px] border border-ivm-n200 bg-ivm-n50 pl-4 transition-colors focus-within:border-ivm-blue xl:mt-3 xl:max-w-[480px]"
          style={
            {
              "--ivm-y": "16px",
              "--ivm-delay": "0.21s",
              "--ivm-dur": "0.7s",
            } as React.CSSProperties
          }
        >
          <Image src="/icons/icon-search.svg" alt="" width={18} height={18} className="shrink-0" />
          <label htmlFor="news-search" className="sr-only">
            Search news
          </label>
          <input
            id="news-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search news"
            className="h-full min-w-0 flex-1 bg-transparent pr-3 text-[16px] leading-[1.4] text-ivm-n900 outline-none placeholder:text-ivm-n500"
          />
        </div>

        <div
          role="group"
          aria-label="Filter stories by category"
          className="ivm-rise flex w-full items-start justify-start gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:justify-center xl:pt-2"
          style={
            {
              "--ivm-y": "16px",
              "--ivm-delay": "0.28s",
              "--ivm-dur": "0.7s",
            } as React.CSSProperties
          }
        >
          {FILTERS.map((filter) => {
            const isActive = filter === active;
            return (
              <button
                key={filter}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(filter)}
                className={`shrink-0 rounded-full px-4 py-[9px] text-[14px] font-semibold leading-[1.4] transition-colors xl:px-[18px] ${
                  isActive
                    ? "bg-ivm-n900 text-white"
                    : "bg-ivm-n50 text-ivm-n900 hover:bg-ivm-n100"
                }`}
              >
                {filter}
              </button>
            );
          })}
        </div>

        <p className="sr-only" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? "story" : "stories"} found
        </p>
      </section>

      {featured && <FeaturedStory article={featured} />}

      <section className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-6 px-6 pb-16 pt-14 md:px-6 md:pb-24 md:pt-[72px] xl:gap-8 xl:px-8 xl:pb-28 xl:pt-24">
        <h2 className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px] xl:text-[48px]">
          Latest stories
        </h2>

        {latest.length > 0 ? (
          <div className="grid w-full grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2 xl:grid-cols-3 xl:gap-x-8 xl:gap-y-14">
            {latest.map((article, i) => (
              <BlogCard key={article.slug} article={article} priority={i < 2} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="w-full py-16 text-center">
            <p className="text-[16px] leading-[1.4] text-ivm-n600">
              No stories found. Try another search or category.
            </p>
          </div>
        ) : null}

        <div className="flex w-full justify-center">
          <Link
            href="/book-a-test-drive"
            className="flex h-11 w-full items-center justify-center rounded-[4px] border border-ivm-n200 bg-white text-[14px] font-semibold leading-[1.4] text-ivm-n900 transition-colors hover:bg-ivm-n50 xl:w-[220px]"
          >
            Book a Test Drive
          </Link>
        </div>
      </section>
    </>
  );
}
