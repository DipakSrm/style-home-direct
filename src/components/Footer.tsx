
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4">Furnish</h3>
            <p className="text-gray-400">Beautiful furniture for your dream home.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/products" className="hover:text-white">All Products</Link></li>
              <li><Link to="/products?category=seating" className="hover:text-white">Seating</Link></li>
              <li><Link to="/products?category=tables" className="hover:text-white">Tables</Link></li>
              <li><Link to="/products?category=storage" className="hover:text-white">Storage</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Contact Us</a></li>
              <li><a href="#" className="hover:text-white">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white">Returns</a></li>
              <li><a href="#" className="hover:text-white">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-gray-400">
              <li><Link to="/profile" className="hover:text-white">My Profile</Link></li>
              <li><Link to="/orders" className="hover:text-white">Order History</Link></li>
              <li><Link to="/cart" className="hover:text-white">Shopping Cart</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
          <p>&copy; 2024 Furnish. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
