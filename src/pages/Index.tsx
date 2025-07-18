
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import CategoriesSection from "@/components/CategoriesSection";
import FeaturedProductsSection from "@/components/FeaturedProductsSection";
import Footer from "@/components/Footer";

const Index = () => {
   
  return (
    <div className="min-h-screen bg-gray-50">
         
      <Navigation />
      <HeroSection />
      <CategoriesSection />
      <FeaturedProductsSection />
      <Footer />
    </div>
  );
};

export default Index;
