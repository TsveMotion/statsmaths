import { Hero } from "@/components/landing/hero";
import { FeaturedProducts } from "@/components/landing/featured-products";
import { Testimonials } from "@/components/landing/testimonials";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Hero />
        <FeaturedProducts />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}
