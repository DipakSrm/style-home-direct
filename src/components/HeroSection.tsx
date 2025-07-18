
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CarouselContent, CarouselItem } from "@/components/ui/carousel";
import AutoplayCarousel from "./AutoplayCarousel";
import { useEffect, useState } from "react";
import axios from "axios";
import { IProduct } from "@/lib/types";

const HeroSection = () => {
  const [featuredProducts, setFeaturedProducts] = useState<IProduct[]>([]);
  useEffect(()=>{
    const fetchFeaturedProducts = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/search?isFeatured=true`
        );
        if(response.status ===200){
setFeaturedProducts(response.data.data.products);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }}
    fetchFeaturedProducts();
  },[])

  const getSalePercentage = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <section className="relative bg-gradient-to-br from-amber-50 to-orange-100 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Beautiful Furniture for Your
              <span className="text-amber-600"> Dream Home</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover our curated collection of modern, sustainable, and
              beautifully crafted furniture pieces.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/products">
                <Button
                  size="lg"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3"
                >
                  Shop Collection
                </Button>
              </Link>
              
            </div>
          </div>
          <div className="relative">
            <AutoplayCarousel className="w-full max-w-lg mx-auto">
              <CarouselContent>
                {featuredProducts.map((product) => (
                  <CarouselItem key={product._id}>
                    <Link to={`/products/${product._id}`}>
                      <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                        <div className="relative overflow-hidden rounded-lg">
                          <img
                            src={
                              product.images[0] ||
                              "https://res.cloudinary.com/dgzf4h7hn/image/upload/v1750871162/istockphoto-1415799772-612x612_hfqlhv.jpg"
                            }
                            alt={product.name}
                            className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          {product.previousPrice && (
                            <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-sm font-semibold rounded">
                              {getSalePercentage(
                                product.previousPrice,
                                product.price
                              )}
                              % OFF
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white">
                            <h3 className="font-semibold text-lg mb-2">
                              {product.name}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-xl font-bold">
                                Rs {product.price}
                              </span>
                              {product.previousPrice && (
                                <span className="text-sm line-through opacity-75">
                                  Rs {product.previousPrice}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </AutoplayCarousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
