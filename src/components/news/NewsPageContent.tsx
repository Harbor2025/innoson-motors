"use client";

import { useState } from "react";
import Image from "next/image";
import BlogCard from "./BlogCard";
import { ARTICLES } from "./news-data";
import type { Article } from "./news-data";

// Figma: node 772:1127 — "News Blog" title, 3-column grid of cards, prev/next arrows (772:1128).
// The design has no search, featured card or excerpts, so those are gone.
// This section carries its own top padding (fixed header height + 40px); remove any
// padding-top your route page adds to <main>.
const PAGE_SIZE = 9;

export default function NewsPageContent({ initialArticles }: { initialArticles?: Article[] }) {
  const articles = initialArticles?.length ? initialArticles : ARTICLES;
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const visible = articles.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const go = (next: number) => {
    setPage(Math.min(Math.max(next, 0), pageCount - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="w-full pb-10 pt-[84px] lg:pb-20 lg:pt-[120px]">
      <div className="mx-auto w-full max-w-[1040px] px-5 lg:px-0">
        <h1 className="text-[24px] font-extrabold uppercase leading-[normal] text-[#000001] font-[Avenir,'Avenir_Next','Nunito_Sans',sans-serif] lg:text-[40px] lg:font-semibold lg:capitalize lg:font-[family-name:var(--font-inter)]">
          News Blog
        </h1>

        {visible.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-x-[17.5px] gap-y-10 sm:grid-cols-2 lg:mt-[45px] lg:grid-cols-3">
            {visible.map((article, i) => (
              <BlogCard key={article.slug} article={article} priority={page === 0 && i < 3} />
            ))}
          </div>
        ) : (
          <p className="mt-16 text-[16px] text-[#888] font-[family-name:var(--font-inter)]">
            No articles yet.
          </p>
        )}

        {pageCount > 1 && (
          <nav aria-label="Pagination" className="mt-10 flex items-center justify-end gap-4 lg:mt-14">
            <button
              type="button"
              aria-label="Previous page"
              disabled={page === 0}
              onClick={() => go(page - 1)}
              className="relative size-10 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Image src="/icons/news-nav-prev.svg" alt="" fill unoptimized />
            </button>
            <button
              type="button"
              aria-label="Next page"
              disabled={page === pageCount - 1}
              onClick={() => go(page + 1)}
              className="relative size-10 -scale-x-100 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Image src="/icons/news-nav-next.svg" alt="" fill unoptimized />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}
