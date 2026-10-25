/** Editorial categories shown as pills on the news page (Figma "Category filters"). */
export const NEWS_CATEGORIES = ["Company", "Products", "Partnerships", "Awards"] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

/**
 * Blog posts are tagged rather than categorised in the CMS, so map their tags
 * onto the four newsroom categories used by the design.
 */
const CATEGORY_KEYWORDS: Record<NewsCategory, string[]> = {
  Company: ["company", "manufacturing", "supply", "export", "service", "career", "plant"],
  Products: ["product", "vehicle", "model", "ev", "electric", "driving", "launch", "review"],
  Partnerships: ["partnership", "financing", "finance", "bank"],
  Awards: ["award", "recognition"],
};

export function normaliseNewsCategory(tags: (string | null | undefined)[] = []): NewsCategory {
  for (const tag of tags) {
    const value = tag?.trim().toLowerCase();
    if (!value) continue;

    const match = NEWS_CATEGORIES.find((category) =>
      CATEGORY_KEYWORDS[category].some(
        (keyword) => value === keyword || value.includes(keyword),
      ),
    );
    if (match) return match;
  }
  return "Company";
}

export interface Article {
  slug: string;
  readTime: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: NewsCategory;
  /** Article body, one string per paragraph. Optional: the detail page shows placeholder copy without it. */
  body?: string[];
}

const LOREM_SHORT =
  "Lorem ipsum dolor sit amet consectetur. Integer cursus eu aliquam cras nunc. Malesuada eu ultrices venenatis viverra nam integer in feugiat. Ipsum viverra id quam id leo sed. Malesuada eu ultrices venenatis viverra nam integer in feugiat. Ipsum viverra id......";

export const ARTICLES: Article[] = [
  {
    slug: "all-you-need-to-know-about-the-innoson-evm-vehicles",
    readTime: "15 mins read",
    title: "All you need to know about the innoson EVM vehicles",
    excerpt: LOREM_SHORT,
    author: "Nneka Okoli",
    date: "20 Jun 2026",
    image: "/images/news-car.png",
    category: "Products",
  },
  {
    slug: "innoson-caris-production-milestone",
    readTime: "8 mins read",
    title: "IVM hits a new production milestone with the Caris line",
    excerpt: LOREM_SHORT,
    author: "Chidi Eze",
    date: "14 Jun 2026",
    image: "/images/news-car.png",
    category: "Products",
  },
  {
    slug: "made-in-nigeria-export-plans",
    readTime: "6 mins read",
    title: "Made in Nigeria: IVM's plans to export across West Africa",
    excerpt: LOREM_SHORT,
    author: "Amara Nwosu",
    date: "9 Jun 2026",
    image: "/images/news-car.png",
    category: "Company",
  },
  {
    slug: "ivm-service-centers-expansion",
    readTime: "5 mins read",
    title: "IVM opens three new service centers across the South-East",
    excerpt: LOREM_SHORT,
    author: "Tunde Bakare",
    date: "2 Jun 2026",
    image: "/images/news-car.png",
    category: "Company",
  },
  {
    slug: "flexible-financing-access-bank",
    readTime: "7 mins read",
    title: "How IVM's partnership with Access Bank makes ownership easier",
    excerpt: LOREM_SHORT,
    author: "Nneka Okoli",
    date: "27 May 2026",
    image: "/images/news-car.png",
    category: "Partnerships",
  },
  {
    slug: "innoson-fox-driving-experience",
    readTime: "10 mins read",
    title: "Behind the wheel: a first drive of the Innoson Fox",
    excerpt: LOREM_SHORT,
    author: "Chidi Eze",
    date: "19 May 2026",
    image: "/images/news-car.png",
    category: "Products",
  },
  {
    slug: "local-parts-manufacturing-update",
    readTime: "9 mins read",
    title: "Zero imported parts: an update on IVM's local supply chain",
    excerpt: LOREM_SHORT,
    author: "Amara Nwosu",
    date: "11 May 2026",
    image: "/images/news-car.png",
    category: "Company",
  },
  {
    slug: "ivm-manufacturer-of-the-year-award",
    readTime: "4 mins read",
    title: "IVM named Manufacturer of the Year at the Nigerian Auto Awards",
    excerpt: LOREM_SHORT,
    author: "Tunde Bakare",
    date: "3 May 2026",
    image: "/images/news-car.png",
    category: "Awards",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string, count = 3): Article[] {
  const others = ARTICLES.filter((article) => article.slug !== slug);
  return others.slice(0, count);
}