import { Navbar } from "@/components/layout/Navbar";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Footer } from "@/components/layout/Footer";
import { ProductDetailClient } from "@/components/product/ProductDetailClient";
import { PRODUCTS } from "@/data/mock";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      images: [product.thumbnail],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = PRODUCTS.find((p) => p.slug === slug);
  if (!product) notFound();

  const relatedProducts = PRODUCTS.filter(
    (p) => p.category.id === product.category.id && p.id !== product.id
  ).slice(0, 4);

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen" style={{ background: "#FDFAF5" }}>
        <ProductDetailClient product={product} relatedProducts={relatedProducts} />
      </main>
      <Footer />
    </>
  );
}
