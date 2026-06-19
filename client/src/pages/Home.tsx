import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, Headphones, RotateCcw } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchProducts } from '../features/productSlice';
import ProductCard from '../components/ProductCard';

const features = [
  { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
  { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
  { icon: Headphones, title: '24/7 Support', desc: 'AI assistant ready' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '30-day policy' },
];

export default function Home() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ limit: '8' }));
  }, [dispatch]);

  return (
    <div className="bg-theme-primary text-theme-primary transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-dark-400 via-dark-300 to-dark-400 dark:from-dark-500 dark:via-dark-400 dark:to-dark-500" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1920)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">UNLEASH YOUR</span>
            <br />
            <span className="text-gradient-gold">POTENTIAL</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Premium sports fashion powered by AI. Get personalized recommendations
            and find your perfect fit.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/catalog"
              className="px-8 py-4 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors flex items-center justify-center gap-2"
            >
              Shop Now <ArrowRight size={20} />
            </Link>
            <Link
              to="/catalog?category=running"
              className="px-8 py-4 border-2 border-gold-500 text-gold-500 font-bold rounded-lg hover:bg-gold-500 hover:text-dark-300 transition-colors"
            >
              Explore Running
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 border-b border-theme transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-4">
              <feature.icon className="w-8 h-8 text-gold-500 mx-auto mb-3" />
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-theme-muted">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link
              to="/catalog"
              className="text-gold-500 hover:text-gold-600 flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* AI CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-gradient-to-r from-theme-secondary to-theme-tertiary rounded-2xl p-8 md:p-12 relative overflow-hidden border border-theme transition-colors duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-2xl">
              <span className="text-gold-500 font-semibold mb-2 block">
                AI-POWERED SHOPPING
              </span>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Your Personal Style Advisor
              </h2>
              <p className="text-theme-secondary mb-6">
                Our AI assistant helps you find the perfect outfit, answers your questions
                about sizing and shipping, and provides personalized recommendations.
              </p>
              <button className="px-6 py-3 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors">
                Chat with AI Assistant
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
