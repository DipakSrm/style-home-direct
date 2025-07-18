
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { IProduct } from "@/lib/types";
import axios from "axios";

const TrendingProductSection = () => {
    const [TrendingProduct, setTrendingProduct] = useState<IProduct[]>([]);
  
  useEffect(() => {
    const fetchTrendingProduct = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_URI}products/search?isTrending=true`
        );
        if (response.status === 200) {
          setTrendingProduct(response.data.data.products);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      }
    };
    fetchTrendingProduct();
  }, []);

  const getSalePercentage = (previousPrice: number, currentPrice: number) => {
    return Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Trending Products
          </h2>
          <p className="text-lg text-gray-600">Our most popular pieces</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {TrendingProduct.map((product) => (
            <Link key={product._id} to={`/products/${product._id}`}>
              <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                <div className="relative overflow-hidden">
                  <img
                    src={
                      product.images[0] ||
                      "https://res.cloudinary.com/dgzf4h7hn/image/upload/v1750871162/istockphoto-1415799772-612x612_hfqlhv.jpg"
                    }
                    alt={product.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.previousPrice && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 text-sm font-semibold rounded">
                      {getSalePercentage(product.previousPrice, product.price)}%
                      OFF
                    </div>
                  )}
                </div>
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl font-bold text-amber-600">
                      Rs {product.price}
                    </span>
                    {product.previousPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        Rs {product.previousPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={i < Math.floor(product.ratingAverage) ? "★" : "☆"}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-2">
                      ({product.ratingCount})
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/products">
            <Button variant="outline" size="lg" className="px-8 py-3">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingProductSection;
