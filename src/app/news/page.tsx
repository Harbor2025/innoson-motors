import type { Metadata } from "next";
import RevampNav from "@/components/revamp/RevampNav";
import RevampFooter from "@/components/revamp/RevampFooter";
import NewsPageContent from "@/components/news/NewsPageContent";
import { getPublishedPosts } from "@/server/blog";
import { postsAsArticles } from "@/lib/adapters";

export const metadata: Metadata = {
  title: "News | Innoson Vehicle Manufacturing",
  description: "IVM news, manufacturing updates, financing news and driving reviews.",
};

export const revalidate = 60;

export default async function NewsPage() {
  let initial;
  try {
    const res = await getPublishedPosts({ limit: 20 });
    initial = postsAsArticles(res.docs);
  } catch {
    initial = undefined;
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-[family-name:var(--font-ivm-inter)]">
      <RevampNav active="news" />
      <main className="flex-1">
        <NewsPageContent initialArticles={initial} />
      </main>
      <RevampFooter />
    </div>
  );
}
