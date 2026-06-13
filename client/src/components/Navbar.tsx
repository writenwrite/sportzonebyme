import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, LogOut, Heart } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { logout } from '../features/authSlice';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAppSelector((state) => state.auth);
  const { items } = useAppSelector((state) => state.cart);
  const { productIds } = useAppSelector((state) => state.wishlist);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gradient-gold">SPORTZONE</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/catalog"
              className="text-gray-300 hover:text-gold-500 transition-colors"
            >
              Shop
            </Link>
            <Link
              to="/catalog?category=running"
              className="text-gray-300 hover:text-gold-500 transition-colors"
            >
              Running
            </Link>
            <Link
              to="/catalog?category=clothing"
              className="text-gray-300 hover:text-gold-500 transition-colors"
            >
              Clothing
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-300 hover:text-gold-500 transition-colors"
            >
              <Search size={20} />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="p-2 text-gray-300 hover:text-gold-500 transition-colors relative"
            >
              <Heart size={20} />
              {productIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-dark-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {productIds.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 text-gray-300 hover:text-gold-500 transition-colors relative"
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gold-500 text-dark-300 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative group">
                <button className="p-2 text-gray-300 hover:text-gold-500 transition-colors">
                  <User size={20} />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-dark-100 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="p-3 border-b border-dark-200">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-400">{user.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm hover:bg-dark-200"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    className="block px-4 py-2 text-sm hover:bg-dark-200"
                  >
                    Orders
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm hover:bg-dark-200"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-dark-200"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-gray-300 hover:text-gold-500 transition-colors"
              >
                <User size={20} />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 text-gray-300"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {searchOpen && (
          <div className="py-4">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 px-4 py-2 bg-dark-200 rounded-lg border border-dark-100 focus:outline-none focus:border-gold-500"
                autoFocus
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gold-500 text-dark-300 rounded-lg hover:bg-gold-600 transition-colors"
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-dark-200">
            <Link
              to="/catalog"
              className="block py-2 text-gray-300 hover:text-gold-500"
              onClick={() => setIsOpen(false)}
            >
              Shop
            </Link>
            <Link
              to="/catalog?category=running"
              className="block py-2 text-gray-300 hover:text-gold-500"
              onClick={() => setIsOpen(false)}
            >
              Running
            </Link>
            <Link
              to="/catalog?category=clothing"
              className="block py-2 text-gray-300 hover:text-gold-500"
              onClick={() => setIsOpen(false)}
            >
              Clothing
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
