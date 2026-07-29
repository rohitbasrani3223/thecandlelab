import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { ShopClient } from "@/components/shop/ShopClient";
import { CATEGORIES } from "@/data/mock";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  return {
    title: category ? `${category.name} Candles` : "Category",
    description: category?.description,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) notFound();

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen" style={{ background: "#FDFAF5" }}>
        <ShopClient presetCategory={category.id} categoryName={category.name} />
      </main>
      <Footer />
    </>
  );
}
