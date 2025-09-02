import Header from "../components/navbar/Header";
import UseAnimationFrameCube from "../components/shapes/shape1";
import HeroSection from "../components/landing/HeroSection";
import CategorySection from "../components/landing/CategorySection";
import FeaturedProductsSection from "../components/landing/FeaturedProductsSection";
import PromoBannerSection from "../components/landing/PromoBannerSection";
import TestimonialsSection from "../components/landing/TestimonialsSection";
import CTASection from "../components/landing/CTASection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <main className="w-full mx-auto px-4 py-8">

        <Header />
        <HeroSection />
        <div className="w-full flex gap-8 justify-center items-center mb-8">
          <UseAnimationFrameCube size={100} animationConfig={{ initialRotate: 0 }} />
          <UseAnimationFrameCube size={120} animationConfig={{ initialRotate: 45, rotateSpeed: 8000, yAmount: 30 }} />
          <UseAnimationFrameCube size={80} animationConfig={{ initialRotate: 90, rotateSpeed: 5000, yAmount: 10 }} />
        </div>
        <CategorySection />
        <FeaturedProductsSection />
        <PromoBannerSection />
        <TestimonialsSection />
        <CTASection />
        <Footer />
      </main>

    </>
  );
}