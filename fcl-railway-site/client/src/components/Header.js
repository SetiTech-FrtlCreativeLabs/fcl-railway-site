import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { Menu, X, ShoppingCart, User, Search } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FCL</span>
            </div>
            <span className="text-xl font-bold gradient-text">Frtl Creative Labs</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/initiatives" className="text-gray-700 hover:text-blue-600 transition-colors">
              Tech Initiatives
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-blue-600 transition-colors">
              Marketplace
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-blue-600 transition-colors">
                  <User className="w-5 h-5" />
                  <span className="hidden sm:block">{user.displayName || user.email}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/account"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    My Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary btn-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/initiatives"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Tech Initiatives
              </Link>
              <Link
                to="/products"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </Link>
              <Link
                to="/about"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-4 border-t">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const query = e.target.value;
                    if (query.trim()) {
                      navigate(`/products?search=${encodeURIComponent(query)}`);
                      setIsSearchOpen(false);
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
