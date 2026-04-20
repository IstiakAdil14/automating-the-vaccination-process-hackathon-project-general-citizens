import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { vaccinationNews } from "@/lib/mock-data";
import NewsDetailClient from "./NewsDetailClient";

export function generateStaticParams() {
  return vaccinationNews.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = vaccinationNews.find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found" };
  return {
    title: `${article.title} | VaxCare News`,
    description: article.excerpt,
    openGraph: { images: [article.image] },
  };
}

export default async function NewsDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = vaccinationNews.find((a) => a.slug === slug);
  if (!article) notFound();

  const related = vaccinationNews
    .filter((a) => a.slug !== slug && a.category === article.category)
    .slice(0, 3);

  return <NewsDetailClient article={article} related={related} />;
}
