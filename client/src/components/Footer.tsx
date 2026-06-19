import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-theme-card border-t border-theme transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-gradient-gold mb-4">SPORTZONE</h3>
            <p className="text-theme-muted text-sm">
              Premium sports fashion with AI-powered shopping assistance.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="text-theme-muted hover:text-gold-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-theme-muted hover:text-gold-500 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-theme-muted hover:text-gold-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-theme-muted hover:text-gold-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-semibold mb-4">Shop</h4>
            <ul className="space-y-2 text-sm text-theme-muted">
              <li>
                <Link to="/catalog" className="hover:text-gold-500 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=running" className="hover:text-gold-500 transition-colors">
                  Running
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=clothing" className="hover:text-gold-500 transition-colors">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=accessories" className="hover:text-gold-500 transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="font-semibold mb-4">Help</h4>
            <ul className="space-y-2 text-sm text-theme-muted">
              <li>
                <a href="#" className="hover:text-gold-500 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-500 transition-colors">
                  Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-500 transition-colors">
                  Returns
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gold-500 transition-colors">
                  Size Guide
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-theme-muted text-sm mb-4">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 bg-theme-input rounded-l-lg border border-theme focus:outline-none focus:border-gold-500 text-sm transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gold-500 text-dark-300 font-semibold rounded-r-lg hover:bg-gold-600 transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-theme mt-8 pt-8 text-center text-sm text-theme-muted">
          <p>&copy; {new Date().getFullYear()} SportZone. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
