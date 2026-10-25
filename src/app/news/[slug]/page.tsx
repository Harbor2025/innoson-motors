import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RevampNav from "@/components/revamp/RevampNav";
import RevampFooter from "@/components/revamp/RevampFooter";
import RevampWhatsAppFloat from "@/components/revamp/RevampWhatsAppFloat";
import ArticleContent from "@/components/news/ArticleContent";
import MoreStories from "@/components/news/MoreStories";
import { getPostBySlug, getPublishedPosts } from "@/server/blog";
import { postsAsArticles } from "@/lib/adapters";
import { getArticleBySlug, getRelatedArticles } from "@/components/news/news-data";
import type { Article } from "@/components/news/news-data";
import { getWhatsAppUrl } from "@/lib/whatsapp";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const res = await getPublishedPosts({ limit: 200 });
    return res.docs.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const doc = await getPostBySlug(slug);
    if (doc) {
      return {
        title: `${doc.title} | Innoson Vehicle Manufacturing`,
        description: doc.excerpt ?? doc.title,
        openGraph: {
          title: doc.title,
          description: doc.excerpt ?? doc.title,
          images: doc.coverImage ? [doc.coverImage.url] : [],
        },
      };
    }
  } catch {
    // DB unavailable – fall through to the static sample article.
  }

  const article = getArticleBySlug(slug);
  return {
    title: article
      ? `${article.title} | Innoson Vehicle Manufacturing`
      : "News | Innoson Vehicle Manufacturing",
    description:
      article?.excerpt ?? "IVM news, manufacturing updates, financing news and driving reviews.",
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;

  let article: Article | null = null;
  let content: unknown;

  try {
    const post = await getPostBySlug(slug);
    if (post) {
      article = postsAsArticles([post])[0] ?? null;
      content = post.content;
    }
  } catch {
    // DB unavailable – the design sample article below is used instead.
  }

  if (!article) {
    article = getArticleBySlug(slug) ?? null;
  }
  if (!article) notFound();

  let related: Article[] = [];
  try {
    const res = await getPublishedPosts({ limit: 6 });
    related = postsAsArticles(res.docs)
      .filter((item) => item.slug !== slug)
      .slice(0, 3);
  } catch {
    related = [];
  }
  if (related.length === 0) {
    related = getRelatedArticles(slug, 3);
  }

  const whatsapp = await getWhatsAppUrl();

  return (
    <div className="flex min-h-screen flex-col bg-white font-[family-name:var(--font-ivm-inter)]">
      <RevampNav active="news" />
      <main className="flex-1">
        <ArticleContent article={article} content={content} />
        <MoreStories articles={related} />
      </main>
      <RevampFooter />
      {whatsapp && <RevampWhatsAppFloat href={whatsapp} />}
    </div>
  );
}
