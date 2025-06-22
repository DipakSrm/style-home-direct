
import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User, Search, Menu } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navigation = () => {
  const location = useLocation();
  const { state } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-amber-800">
            Furnish
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`hover:text-amber-600 transition-colors ${isActive('/') ? 'text-amber-600 font-medium' : 'text-gray-700'}`}
            >
              Home
            </Link>
            <Link 
              to="/products" 
              className={`hover:text-amber-600 transition-colors ${isActive('/products') ? 'text-amber-600 font-medium' : 'text-gray-700'}`}
            >
              Products
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {state.items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {state.items.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Link 
                to="/" 
                className={`px-3 py-2 hover:text-amber-600 transition-colors ${isActive('/') ? 'text-amber-600 font-medium' : 'text-gray-700'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/products" 
                className={`px-3 py-2 hover:text-amber-600 transition-colors ${isActive('/products') ? 'text-amber-600 font-medium' : 'text-gray-700'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
