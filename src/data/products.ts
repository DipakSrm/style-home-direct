
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  images: string[];
  description: string;
  features: string[];
  dimensions: {
    width: string;
    height: string;
    depth: string;
  };
  materials: string[];
  inStock: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Modern Velvet Sofa",
    price: 1299,
    originalPrice: 1599,
    category: "seating",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop"
    ],
    description: "Luxurious velvet sofa with deep seating and modern silhouette. Perfect centerpiece for any contemporary living room.",
    features: ["Deep seating", "Velvet upholstery", "Solid wood frame", "Easy assembly"],
    dimensions: {
      width: "84 inches",
      height: "32 inches",
      depth: "36 inches"
    },
    materials: ["Velvet fabric", "Solid oak frame", "High-density foam"],
    inStock: true,
    rating: 4.8,
    reviews: 127
  },
  {
    id: "2",
    name: "Scandinavian Dining Table",
    price: 899,
    category: "dining",
    image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&h=600&fit=crop"
    ],
    description: "Clean-lined dining table crafted from sustainable oak with a natural finish. Seats up to 6 people comfortably.",
    features: ["Sustainable oak wood", "Natural finish", "Seats 6", "Easy care surface"],
    dimensions: {
      width: "72 inches",
      height: "30 inches",
      depth: "36 inches"
    },
    materials: ["Sustainable oak wood", "Natural wood stain"],
    inStock: true,
    rating: 4.7,
    reviews: 89
  },
  {
    id: "3",
    name: "Minimalist Bookshelf",
    price: 449,
    category: "storage",
    image: "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600&fit=crop"
    ],
    description: "Sleek bookshelf with clean lines and ample storage. Perfect for displaying books, plants, and decorative objects.",
    features: ["5 adjustable shelves", "Wall-mount ready", "Clean minimal design", "Easy assembly"],
    dimensions: {
      width: "32 inches",
      height: "72 inches",
      depth: "12 inches"
    },
    materials: ["Engineered wood", "Metal brackets"],
    inStock: true,
    rating: 4.6,
    reviews: 56
  },
  {
    id: "4",
    name: "Ergonomic Office Chair",
    price: 599,
    originalPrice: 749,
    category: "seating",
    image: "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1541558869434-2840d308329a?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&h=600&fit=crop"
    ],
    description: "Premium ergonomic office chair with lumbar support and breathable mesh back. Designed for all-day comfort.",
    features: ["Ergonomic design", "Lumbar support", "Breathable mesh", "Height adjustable"],
    dimensions: {
      width: "26 inches",
      height: "40-44 inches",
      depth: "26 inches"
    },
    materials: ["Mesh fabric", "Aluminum base", "High-density foam"],
    inStock: true,
    rating: 4.9,
    reviews: 203
  },
  {
    id: "5",
    name: "Rustic Coffee Table",
    price: 329,
    category: "tables",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&h=600&fit=crop"
    ],
    description: "Handcrafted coffee table with rustic charm and modern functionality. Features a spacious tabletop and lower shelf.",
    features: ["Reclaimed wood", "Lower shelf storage", "Handcrafted", "Rustic finish"],
    dimensions: {
      width: "48 inches",
      height: "18 inches",
      depth: "24 inches"
    },
    materials: ["Reclaimed pine wood", "Steel hairpin legs"],
    inStock: false,
    rating: 4.5,
    reviews: 74
  },
  {
    id: "6",
    name: "Platform Bed Frame",
    price: 799,
    category: "bedroom",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&h=600&fit=crop"
    ],
    description: "Low-profile platform bed with built-in nightstands. Clean, contemporary design that maximizes bedroom space.",
    features: ["Built-in nightstands", "Low profile", "No box spring needed", "Contemporary design"],
    dimensions: {
      width: "64 inches",
      height: "12 inches",
      depth: "84 inches"
    },
    materials: ["Solid wood", "Wood veneer"],
    inStock: true,
    rating: 4.7,
    reviews: 145
  }
];

export const categories = [
  { id: "all", name: "All Products", count: products.length },
  { id: "seating", name: "Seating", count: products.filter(p => p.category === "seating").length },
  { id: "tables", name: "Tables", count: products.filter(p => p.category === "tables").length },
  { id: "storage", name: "Storage", count: products.filter(p => p.category === "storage").length },
  { id: "bedroom", name: "Bedroom", count: products.filter(p => p.category === "bedroom").length },
  { id: "dining", name: "Dining", count: products.filter(p => p.category === "dining").length }
];
