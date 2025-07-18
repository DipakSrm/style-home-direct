import { Link, useLocation, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";
import AuthModal from "./AuthModal";
import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { IProduct } from "@/lib/types";

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useCart();
  const { state: authState, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<IProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Debounced search function
  const debounceSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (query: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (query.trim().length > 1) {
            fetchSearchSuggestions(query);
          } else {
            setSearchSuggestions([]);
          }
        }, 300);
      };
    })(),
    []
  );

  // Fetch search suggestions from database
  const fetchSearchSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSearchSuggestions([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `${
          process.env.NEXT_PUBLIC_URI
        }products/search?search=${encodeURIComponent(query)}&limit=12`
      );

      if (response.status === 200) {
        setSearchSuggestions(response.data.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
      setSearchSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    debounceSearch(value);
  };

  // Handle search submission
  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setCommandOpen(false);
      setSearchQuery("");
      setSearchSuggestions([]);
    }
  };

  // Handle product selection from suggestions
  const handleProductSelect = (productId: string) => {
    navigate(`/products/${productId}`);
    setSearchOpen(false);
    setCommandOpen(false);
    setSearchQuery("");
    setSearchSuggestions([]);
  };

  // Close search when clicking outside or pressing escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setCommandOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Desktop Search Component
  // Desktop Search Component
  const DesktopSearch = () => {
    const inputRef = useRef<HTMLInputElement>(null); // Ref for explicit focus control

    // Focus the input when search opens
    useEffect(() => {
      if (searchOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [searchOpen]);

    // Simplified debouncing without useCallback
    let debounceTimeout: NodeJS.Timeout | null = null;
    const handleSearchChange = (value: string) => {
      setSearchQuery(value);

      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }

      if (value.trim().length > 1) {
        debounceTimeout = setTimeout(() => {
          fetchSearchSuggestions(value);
        }, 300);
      } else {
        setSearchSuggestions([]);
      }
    };

    return (
      <div className="hidden md:flex items-center">
        {!searchOpen ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
        ) : (
          <div className="flex items-center space-x-2">
            <Popover open={commandOpen} onOpenChange={setCommandOpen}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <form onSubmit={handleSearchSubmit}>
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="w-64 pr-10"
                    />
                    <Button
                      type="submit"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0" align="start">
                <Command>
                  <CommandList>
                    {isSearching ? (
                      <div className="p-4 text-center text-sm text-gray-500">
                        Searching...
                      </div>
                    ) : searchSuggestions.length > 0 ? (
                      <CommandGroup heading="Products">
                        {searchSuggestions.map((product) => (
                          <CommandItem
                            key={product._id}
                            onSelect={() => handleProductSelect(product._id)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <img
                                src={
                                  product.images[0] ||
                                  "https://res.cloudinary.com/dgzf4h7hn/image/upload/v1750871162/istockphoto-1415799772-612x612_hfqlhv.jpg"
                                }
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {product.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ${product.price}
                                </p>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : searchQuery.trim().length > 1 ? (
                      <CommandEmpty>
                        <div className="p-4 text-center">
                          <p className="text-sm text-gray-500 mb-2">
                            No products found
                          </p>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSearchSubmit}
                          >
                            Search for "{searchQuery}"
                          </Button>
                        </div>
                      </CommandEmpty>
                    ) : null}
                    {searchQuery.trim().length > 1 && (
                      <div className="border-t p-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleSearchSubmit}
                          className="w-full justify-start"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Search for "{searchQuery}"
                        </Button>
                      </div>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
                setSearchSuggestions([]);
                setCommandOpen(false);
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };
  // Mobile Search Component
  const MobileSearch = () => (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
        <Search className="h-5 w-5" />
      </Button>

      {/* Mobile Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Search Products</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearchOpen(false);
                setSearchQuery("");
                setSearchSuggestions([]);
              }}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-4">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="pr-10"
                  autoFocus
                />
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isSearching ? (
              <div className="p-4 text-center text-gray-500">Searching...</div>
            ) : searchSuggestions.length > 0 ? (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Products
                </h3>
                <div className="space-y-3">
                  {searchSuggestions.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductSelect(product._id)}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <img
                        src={
                          product.images[0] ||
                          "https://res.cloudinary.com/dgzf4h7hn/image/upload/v1750871162/istockphoto-1415799772-612x612_hfqlhv.jpg"
                        }
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${product.price}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : searchQuery.trim().length > 1 ? (
              <div className="p-4 text-center">
                <p className="text-gray-500 mb-4">No products found</p>
                <Button onClick={handleSearchSubmit}>
                  Search for "{searchQuery}"
                </Button>
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                Start typing to search for products
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-amber-800">
              Sharma Furnitures
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`hover:text-amber-600 transition-colors ${
                  isActive("/") ? "text-amber-600 font-medium" : "text-gray-700"
                }`}
              >
                Home
              </Link>
              <Link
                to="/products"
                className={`hover:text-amber-600 transition-colors ${
                  isActive("/products")
                    ? "text-amber-600 font-medium"
                    : "text-gray-700"
                }`}
              >
                Products
              </Link>
            </div>

            {/* Right side icons */}
            <div className="flex items-center space-x-4">
              {/* Desktop Search */}
              <DesktopSearch />

              {/* Mobile Search */}
              <MobileSearch />

              {/* User Menu */}
              {authState.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/orders">Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAuthModalOpen(true)}
                >
                  <User className="h-5 w-5" />
                </Button>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative">
                <Button variant="ghost" size="icon">
                  <ShoppingCart className="h-5 w-5" />
                  {state.items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {state.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}
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
                  className={`px-3 py-2 hover:text-amber-600 transition-colors ${
                    isActive("/")
                      ? "text-amber-600 font-medium"
                      : "text-gray-700"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  to="/products"
                  className={`px-3 py-2 hover:text-amber-600 transition-colors ${
                    isActive("/products")
                      ? "text-amber-600 font-medium"
                      : "text-gray-700"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Products
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Navigation;
