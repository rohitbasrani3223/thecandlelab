
import { Navbar } from "@/components/layout/Navbar";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoriesSection } from "@/components/home/CategoriesSection";
import { AtelierSection } from "@/components/home/AtelierSection";
import { CollectionsSection } from "@/components/home/CollectionsSection";
import { FeaturedProductsSection } from "@/components/home/FeaturedProductsSection";
import { BestSellersSection } from "@/components/home/BestSellersSection";
import { NewArrivalsSection } from "@/components/home/NewArrivalsSection";
import { InstagramGallerySection } from "@/components/home/InstagramGallerySection";
import { ReviewsSection } from "@/components/home/ReviewsSection";
import { FAQSection } from "@/components/home/FAQSection";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <>

      <Navbar />
      <main>
        <HeroBanner />
        <AtelierSection />
        <CategoriesSection />
        <CollectionsSection />
        <FeaturedProductsSection />
        <BestSellersSection />
        <NewArrivalsSection />
        <ReviewsSection />
        <InstagramGallerySection />
        <FAQSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
}
