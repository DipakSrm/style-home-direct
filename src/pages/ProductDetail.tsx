import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { IProduct } from "@/lib/types";

const ProductDetail = () => {
  const { id } = useParams();
  const { dispatch } = useCart();
  const { toast } = useToast();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  // Fetch product details
  useEffect(() => {
    if (!id) {
      toast({
        title: "Error",
        description: "Invalid product ID.",
        variant: "destructive",
      });
      return;
    }

    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URI}/products/${id}`
        );
        if (response.status === 200) {
          setProduct(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        toast({
          title: "Error",
          description:
            "Failed to load product details. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchProductDetails();
  }, [id, toast]);

  // Fetch related products
  const fetchRelatedProductDetails = async () => {
    if (!product || !product.subcategoryId?.name) return;

    setIsLoadingRelated(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URI}/products/search?subcategory=${encodeURIComponent(
          product.subcategoryId.name
        )}&excludeId=${id}`
      );
      if (response.status === 200) {
        // Adjust based on actual API response structure
        const relatedProducts =
          response.data.data.products || response.data.data.product || [];
        setRelatedProducts(relatedProducts.filter((p:IProduct) => p._id !== id));
        console.log(
          "Related products fetched successfully:",
          relatedProducts,
          response
        );
      }
    } catch (error) {
      console.error("Error fetching related products:", error);
      toast({
        title: "Error",
        description: "Failed to load related products. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRelated(false);
    }
  };

  // Fetch related products when product changes
  useEffect(() => {
    fetchRelatedProductDetails();
  }, [product]);

  const getSalePercentage = (previousPrice: number, currentPrice: number) => {
    return Math.round(((previousPrice - currentPrice) / previousPrice) * 100);
  };

  const addToCart = () => {
    if (!product) return;

    for (let i = 0; i < quantity; i++) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          productId: product,
        },
      });
    }

    toast({
      title: "Added to cart!",
      description: `${quantity} ${product.name}${
        quantity > 1 ? "s" : ""
      } added to your cart.`,
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Product Not Found
          </h1>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-700">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link to="/products" className="hover:text-gray-700">
              Products
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 capitalize">
              {product.subcategoryId?.name || "N/A"}
            </span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <div className="mb-4">
              <img
                src={
                  product.images[selectedImage] ||
                  "https://res.cloudinary.com/dgzf4h7hn/image/upload/v1750871162/istockphoto-1415799772-612x612_hfqlhv.jpg"
                }
                alt={product.name}
                className="w-full h-96 lg:h-[500px] object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="flex space-x-4 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-amber-600"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < Math.floor(product.ratingAverage) ? "★" : "☆"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  ({product.ratingCount} reviews)
                </span>
              </div>
              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-amber-600">
                  Rs {product.price.toFixed(2)}
                </span>
                {product.previousPrice && (
                  <span className="text-2xl text-gray-500 line-through">
                    Rs {product.previousPrice.toFixed(2)}
                  </span>
                )}
                {product.previousPrice && (
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-semibold">
                    {getSalePercentage(product.previousPrice, product.price)}%
                    OFF
                  </span>
                )}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-gray-700 text-lg leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.stock ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity and Add to Cart */}
            {product.stock && (
              <div className="mb-8">
                <div className="flex items-center space-x-4 mb-4">
                  <label className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-x">{quantity}</span>
                    <button
                      onClick={() => {
                        if (quantity === product.stock) return;
                        else setQuantity(quantity + 1);
                      }}
                      className="px-3 py-1 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>
                <Button
                  onClick={addToCart}
                  size="lg"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3"
                  disabled={!product.stock}
                >
                  Add to Cart - Rs {(product.price * quantity).toFixed(2)}
                </Button>
              </div>
            )}

            {/* Product Details */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Product Details</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Dimensions
                    </h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Width: {product.dimensions?.width || "N/A"}</p>
                      <p>Height: {product.dimensions?.height || "N/A"}</p>
                      <p>Length: {product.dimensions?.length || "N/A"}</p>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Materials
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {product.materials?.map((material, index) => (
                        <li key={index}>• {material}</li>
                      )) || <li>No materials specified</li>}
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Features</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {product.features?.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      )) || <li>No features specified</li>}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {isLoadingRelated ? (
          <div className="mt-16 text-center">
            <p className="text-gray-600">Loading related products...</p>
          </div>
        ) : relatedProducts.length > 0 ? (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/products/${relatedProduct._id}`}
                >
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="relative overflow-hidden">
                      <img
                        src={
                          relatedProduct.images[0] ||
                          "https://res.cloudinary.com/dgzf4h7hn/image/upload/v1750871162/istockphoto-1415799772-612x612_hfqlhv.jpg"
                        }
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {relatedProduct.name}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-amber-600">
                          Rs {relatedProduct.price.toFixed(2)}
                        </span>
                        {relatedProduct.previousPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            Rs {relatedProduct.previousPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ProductDetail;
