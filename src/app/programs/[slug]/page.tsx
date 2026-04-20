import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { vaccinationPrograms } from "@/lib/mock-data";
import ProgramDetailClient from "./ProgramDetailClient";

// ── Static params for all known slugs ────────────────────────────────────────
export function generateStaticParams() {
  return vaccinationPrograms.map((p) => ({ slug: p.slug }));
}

// ── SEO metadata ──────────────────────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const program = vaccinationPrograms.find((p) => p.slug === slug);
  if (!program) return { title: "Program Not Found" };
  return {
    title: `${program.title} | VaxCare`,
    description: program.description,
    openGraph: { images: [program.image] },
  };
}

// ── Page (Server Component) ───────────────────────────────────────────────────
export default async function ProgramDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const program = vaccinationPrograms.find((p) => p.slug === slug);
  if (!program) notFound();

  return <ProgramDetailClient program={program} />;
}
