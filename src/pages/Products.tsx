import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { IProduct, ISubcategory } from "@/lib/types";
import axios from "axios";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [allSubCategories, setAllSubCategories] = useState<ISubcategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalProducts: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: 12,
  });

  // Get current filter values from URL
  const currentFilters = useMemo(
    () => ({
      searchTerm: searchParams.get("search") || "",
      selectedCategory: searchParams.get("subcategory") || "",
      selectedMainCategory: searchParams.get("category") || "",
      sortBy: searchParams.get("sortBy") || "newest",
      priceRange: searchParams.get("priceRange") || "all",
      currentPage: parseInt(searchParams.get("page")) || 1,
    }),
    [searchParams]
  );

  // Fetch subcategories
  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/subcategories`
        );
        if (response.status === 200) {
          setAllSubCategories(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };
    fetchSubcategories();
  }, []);

  // Fetch products with filters - only triggered by URL changes
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (currentFilters.searchTerm)
        params.append("search", currentFilters.searchTerm);
      if (currentFilters.selectedCategory)
        params.append("subcategory", currentFilters.selectedCategory);
      if (currentFilters.selectedMainCategory)
        params.append("category", currentFilters.selectedMainCategory);
      if (currentFilters.sortBy && currentFilters.sortBy !== "newest")
        params.append("sortBy", currentFilters.sortBy);

      // Handle price range
      if (currentFilters.priceRange !== "all") {
        switch (currentFilters.priceRange) {
          case "under-500":
            params.append("maxPrice", "500");
            break;
          case "500-1000":
            params.append("minPrice", "500");
            params.append("maxPrice", "1000");
            break;
          case "over-1000":
            params.append("minPrice", "1000");
            break;
        }
      }

      params.append("page", currentFilters.currentPage.toString());
      params.append("limit", pagination.limit.toString());

      const response = await axios.get(
        `http://localhost:5000/api/v1/products/search?${params.toString()}`
      );

      if (response.status === 200) {
        setProducts(response.data.data.products);
        setPagination(response.data.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch products when URL changes (single useEffect for all filters)
  useEffect(() => {
    fetchProducts();
  }, [searchParams]); // Only watch searchParams changes

  // Helper function to update URL with new filter values
  const updateUrlFilters = (newFilters: Partial<typeof currentFilters>) => {
    const params = new URLSearchParams(searchParams);

    // Merge current filters with new ones
    const updatedFilters = { ...currentFilters, ...newFilters };

    // Always reset page to 1 when other filters change (except when only page is changing)
    if (Object.keys(newFilters).some((key) => key !== "currentPage")) {
      updatedFilters.currentPage = 1;
    }

    // Clear existing params
    params.forEach((_, key) => params.delete(key));

    // Set new params only if they have values different from defaults
    if (updatedFilters.searchTerm)
      params.set("search", updatedFilters.searchTerm);
    if (updatedFilters.selectedCategory)
      params.set("subcategory", updatedFilters.selectedCategory);
    if (updatedFilters.sortBy !== "newest")
      params.set("sortBy", updatedFilters.sortBy);
    if (updatedFilters.priceRange !== "all")
      params.set("priceRange", updatedFilters.priceRange);
    if (updatedFilters.currentPage > 1)
      params.set("page", updatedFilters.currentPage.toString());

    setSearchParams(params);
  };

  const getSalePercentage = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const handleCategoryChange = (category: string) => {
    updateUrlFilters({
      selectedCategory: category === "all" ? "" : category,
    });
  };

  const handleSortChange = (sort: string) => {
    updateUrlFilters({ sortBy: sort });
  };

  const handlePriceRangeChange = (range: string) => {
    updateUrlFilters({ priceRange: range });
  };

  const handleSearchChange = (search: string) => {
    updateUrlFilters({ searchTerm: search });
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams()); // Clear all URL params
  };

  const handlePageChange = (page: number) => {
    updateUrlFilters({ currentPage: page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const totalPages = pagination.totalPages;
    const current = pagination.currentPage;

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = current - 1; i <= current + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Our Collection
          </h1>
          <p className="text-lg text-gray-600">
            Discover furniture that transforms your space
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Products
              </label>
              <Input
                type="text"
                placeholder="Search by name..."
                value={currentFilters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Sub Categories */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Category
              </label>
              <Select
                value={currentFilters.selectedCategory || "all"}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {allSubCategories.map((item) => (
                    <SelectItem key={item._id} value={item.name}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <Select
                value={currentFilters.priceRange}
                onValueChange={handlePriceRangeChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-500">Under $500</SelectItem>
                  <SelectItem value="500-1000">$500 - $1,000</SelectItem>
                  <SelectItem value="over-1000">Over $1,000</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <Select
                value={currentFilters.sortBy}
                onValueChange={handleSortChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="name_asc">Name A-Z</SelectItem>
                  <SelectItem value="name_desc">Name Z-A</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating_desc">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Results Count & Clear Filters */}
            <div className="flex flex-col justify-end space-y-2">
              <p className="text-sm text-gray-600">
                Showing {products.length} of {pagination.totalProducts} products
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
            <p className="mt-2 text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Products Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <Link key={product._id} to={`/products/${product._id}`}>
                <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
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
                        {getSalePercentage(
                          product.previousPrice,
                          product.price
                        )}
                        % OFF
                      </div>
                    )}
                    {!product.stock && (
                      <div className="absolute top-4 right-4 bg-gray-500 text-white px-2 py-1 text-sm font-semibold rounded">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 flex-grow">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-amber-600">
                          Rs {product.price}
                        </span>
                        {product.previousPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            Rs {product.previousPrice}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={
                                i < Math.floor(product.ratingAverage || 0)
                                  ? "★"
                                  : "☆"
                              }
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-500 ml-2">
                          ({product.ratingCount || 0})
                        </span>
                      </div>
                      <span className="text-sm text-gray-500 capitalize">
                        {product.subcategory?.name || "N/A"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* No products found */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your filters to see more results.
            </p>
            <Button onClick={clearAllFilters}>Clear All Filters</Button>
          </div>
        )}

        {/* Pagination */}
        {!loading && products.length > 0 && pagination.totalPages > 1 && (
          <div className="mt-12 flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="flex items-center space-x-1"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous</span>
              </Button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {getPageNumbers().map((page, index) => (
                  <div key={index}>
                    {page === "..." ? (
                      <span className="px-3 py-2 text-gray-500">...</span>
                    ) : (
                      <Button
                        variant={
                          pagination.currentPage === page
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="min-w-[40px]"
                      >
                        {page}
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              {/* Next Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="flex items-center space-x-1"
              >
                <span>Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Pagination Info */}
            <p className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}(
              {pagination.totalProducts} total products)
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
