
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { products, categories } from "@/data/products";

const CategoriesSection = () => {
  const getCategoryImage = (categoryId: string) => {
    const categoryProduct = products.find(p => p.category === categoryId);
    return categoryProduct?.image || "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=200&h=200&fit=crop";
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
          <p className="text-lg text-gray-600">Find exactly what you're looking for</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.filter(cat => cat.id !== 'all').map((category) => (
            <Link key={category.id} to={`/products?category=${category.id}`}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-105 transition-transform">
                    <img 
                      src={getCategoryImage(category.id)} 
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
