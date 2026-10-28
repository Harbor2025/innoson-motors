import type { Metadata } from "next";
import { notFound } from "next/navigation";
import RevampNav from "@/components/revamp/RevampNav";
import RevampFooter from "@/components/revamp/RevampFooter";
import VehicleDetailPage from "@/components/vehicles/VehicleDetailPage";
import { getModelBySlugOrNotFound, getPublishedModels } from "@/server/models";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const res = await getPublishedModels({ limit: 200 });
    return res.docs.map((m) => ({ slug: m.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const doc = await getModelBySlugOrNotFound(slug);
    return {
      title: `${doc.name} | Innoson Vehicle Manufacturing`,
      description: doc.summary ?? doc.name + " - " + (doc.category?.name ?? "Nigeria-made vehicle"),
      openGraph: {
        title: doc.name,
        description: doc.summary ?? doc.name,
        images: doc.heroImage ? [doc.heroImage] : [],
      },
    };
  } catch {
    return {
      title: "Vehicle | Innoson Vehicle Manufacturing",
      description: "Innoson vehicle details.",
    };
  }
}

export default async function ModelDetailRoute({ params }: PageProps) {
  const { slug } = await params;
  let model;
  try {
    model = await getModelBySlugOrNotFound(slug);
  } catch {
    notFound();
  }
  return (
    <div className="flex min-h-screen flex-col bg-white font-[family-name:var(--font-ivm-inter)]">
      <RevampNav active="vehicles" variant="transparent" />
      <main className="flex-1">
        <VehicleDetailPage model={model} />
      </main>
      <RevampFooter />
    </div>
  );
}
