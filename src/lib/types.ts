export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

export interface IAddress {
  _id: string;
  userId: string;
  addressLine: string;
  city: string;
  postalCode: string;
  state: string;
  createdAt: string;
}

export interface ICartItem {
  productId: IProduct;
  quantity: number;
}

export interface ICart {
  _id: string;
  userId: string;
  items: ICartItem[];
  updatedAt: string;
  total:number
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  ref_image:string;
  count: number; // Number of products in this category
}

export interface ISubcategory {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
}


export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  features: string[];
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  materials: string[];
  categoryId: ICategory;
  subcategoryId?: ISubcategory;
  price: number;
  previousPrice?: number;
  stock: number;
  images: string[];
  tags: string[];
  isFeatured: boolean;
  isTrending: boolean;
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
  subcategory?: ISubcategory;
}

export interface IOrderItem {
  productId: IProduct;
  quantity: number;
}

export interface IShippingAddress {
  name: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  country: string;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface IOrder {
  _id: string;
  userId: string;
  items: IOrderItem[];
  status: OrderStatus;
  totalAmount: number;
  shippingAddress: IShippingAddress;
  paymentMethod: string;
  placedAt: string;
  paymentStatus: "pending" | "completed" | "failed";
  deliveredAt?: string;
}

export interface IRating {
  _id: string;
  userId: string;
  productId: string;
  rating: number;
  createdAt: string;
}

export interface IReview {
  _id: string;
  userId: string;
  productId: string;
  title: string;
  comment: string;
  createdAt: string;
}

export interface INotification {
  _id: string;
  userId?: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ISearchLog {
  _id: string;
  userId?: string;
  query: string;
  filtersApplied?: Record<string, unknown>;
  createdAt: string;
}
