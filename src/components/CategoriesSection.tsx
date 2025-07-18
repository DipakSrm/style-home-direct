
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { products, categories } from "@/data/products";
import { ICategory } from "@/lib/types";
import { useEffect, useState } from "react";
import axios from "axios";

const CategoriesSection = () => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URI}/categories`
        );
        if (response.status === 200) {
          setCategories(response.data.data);
          // Assuming categories is a state variable, you can set it here
          // setCategories(fetchedCategories);
          // For now, we will just log it
        }
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Home Collections</h2>
          <p className="text-lg text-gray-600">Find exactly what you're looking for</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link key={category._id} to={`/products?category=${category.name}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-105 transition-transform">
                    <img 
                      src={category.ref_image} 
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{category.count} items</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
