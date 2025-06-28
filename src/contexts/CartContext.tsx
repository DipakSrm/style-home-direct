import { IProduct } from "@/lib/types";
import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { toast } from "sonner";

export interface ICartItem {
  productId: IProduct;
  quantity: number;
}

interface CartState {
  _id: string;
  items: ICartItem[];
  updatedAt: string;
  total: number;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<ICartItem, "quantity"> }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number;stock:number } }
  | { type: "CLEAR_CART" };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

// Initialize state from localStorage
const getInitialCartState = (): CartState => {
  try {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      if (
        parsedCart &&
        Array.isArray(parsedCart.items) &&
        typeof parsedCart.total === "number" &&
        typeof parsedCart._id === "string" &&
        typeof parsedCart.updatedAt === "string"
      ) {
        return parsedCart;
      }
    }
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
  }
  return { _id: "", items: [], updatedAt: "", total: 0 };
};


const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItem = state.items.find(
        (item) => item.productId._id === action.payload.productId._id
      );
      let newItems;

      if (existingItem) {
        newItems = state.items.map((item) =>
          item.productId._id === action.payload.productId._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [...state.items, { ...action.payload, quantity: 1 }];
      }

      const total = newItems.reduce(
        (sum, item) => sum + (item.productId.price || 0) * item.quantity,
        0
      );
      return { ...state, items: newItems, total };
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter(
        (item) => item.productId._id !== action.payload
      );
      const total = newItems.reduce(
        (sum, item) => sum + (item.productId.price || 0) * item.quantity,
        0
      );
      return { ...state, items: newItems, total };
    }

    case "UPDATE_QUANTITY": {
      if(action.payload.quantity>action.payload.stock){
        toast.warning("Quantity exceeds available stock");
        return state; // Do not update if quantity exceeds stock
      }
      const newItems = state.items
        .map((item) =>
          item.productId._id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0);

      const total = newItems.reduce(
        (sum, item) => sum + (item.productId.price || 0) * item.quantity,
        0
      );
      return { ...state, items: newItems, total };
    }

    case "CLEAR_CART":
      return { _id: "",  items: [], updatedAt: "", total: 0 };

    default:
      return state;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(cartReducer, getInitialCartState());

  // Save state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(state));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
