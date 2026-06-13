import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { addToCart } from '../features/cartSlice';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: { url: string }[];
    category: { name: string };
    rating: number;
    reviewCount: number;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await dispatch(addToCart({ productId: product.id }));
    toast.success('Added to cart');
  };

  return (
    <Link
      to={`/catalog/${product.slug}`}
      className="group block bg-dark-200 rounded-lg overflow-hidden hover:ring-2 hover:ring-gold-500 transition-all"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {discount > 0 && (
          <span className="absolute top-2 left-2 bg-gold-500 text-dark-300 text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        <button
          onClick={handleAddToCart}
          className="absolute bottom-2 right-2 p-2 bg-gold-500 text-dark-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gold-600"
        >
          <ShoppingBag size={16} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
          }}
          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 transition-colors"
        >
          <Heart size={16} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">{product.category.name}</p>
        <h3 className="font-medium text-white group-hover:text-gold-500 transition-colors mb-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-gold-500 font-bold">${product.price.toFixed(2)}</span>
          {product.comparePrice && (
            <span className="text-gray-500 text-sm line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 mt-2">
          <div className="flex text-gold-500 text-xs">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
            ))}
          </div>
          <span className="text-xs text-gray-400">({product.reviewCount})</span>
        </div>
      </div>
    </Link>
  );
}
