import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import NewsPageContent from "@/components/news/NewsPageContent";

export const metadata: Metadata = {
  title: "News | Innoson Vehicle Manufacturing",
};

export default function NewsPage() {
  return (
    <>
      <Header active="news" />
      <main>
        <NewsPageContent />
      </main>
      <Footer />
    </>
  );
}