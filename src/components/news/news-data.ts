export interface Article {
  slug: string;
  readTime: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
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
    date: "20th June 2026",
    image: "/images/news-car.png",
  },
  {
    slug: "innoson-caris-production-milestone",
    readTime: "8 mins read",
    title: "IVM hits a new production milestone with the Caris line",
    excerpt: LOREM_SHORT,
    author: "Chidi Eze",
    date: "14th June 2026",
    image: "/images/news-car.png",
  },
  {
    slug: "made-in-nigeria-export-plans",
    readTime: "6 mins read",
    title: "Made in Nigeria: IVM's plans to export across West Africa",
    excerpt: LOREM_SHORT,
    author: "Amara Nwosu",
    date: "9th June 2026",
    image: "/images/news-car.png",
  },
  {
    slug: "ivm-service-centers-expansion",
    readTime: "5 mins read",
    title: "IVM opens three new service centers across the South-East",
    excerpt: LOREM_SHORT,
    author: "Tunde Bakare",
    date: "2nd June 2026",
    image: "/images/news-car.png",
  },
  {
    slug: "flexible-financing-access-bank",
    readTime: "7 mins read",
    title: "How IVM's partnership with Access Bank makes ownership easier",
    excerpt: LOREM_SHORT,
    author: "Nneka Okoli",
    date: "27th May 2026",
    image: "/images/news-car.png",
  },
  {
    slug: "innoson-fox-driving-experience",
    readTime: "10 mins read",
    title: "Behind the wheel: a first drive of the Innoson Fox",
    excerpt: LOREM_SHORT,
    author: "Chidi Eze",
    date: "19th May 2026",
    image: "/images/news-car.png",
  },
  {
    slug: "local-parts-manufacturing-update",
    readTime: "9 mins read",
    title: "Zero imported parts: an update on IVM's local supply chain",
    excerpt: LOREM_SHORT,
    author: "Amara Nwosu",
    date: "11th May 2026",
    image: "/images/news-car.png",
  },
  {
    slug: "ivm-motorcycle-legacy",
    readTime: "12 mins read",
    title: "From motorcycles to automobiles: revisiting IVM's founding story",
    excerpt: LOREM_SHORT,
    author: "Tunde Bakare",
    date: "3rd May 2026",
    image: "/images/news-car.png",
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string, count = 3): Article[] {
  const others = ARTICLES.filter((article) => article.slug !== slug);
  return others.slice(0, count);
}