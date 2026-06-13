import { Link } from 'react-router-dom';
import { Heart, ShoppingBag } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { addToCart } from '../features/cartSlice';
import { toggleWishlist } from '../features/wishlistSlice';
import { useAppSelector as useAuthSelector } from '../hooks/useAppSelector';
import StarRating from './StarRating';
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
  const { productIds } = useAppSelector((state) => state.wishlist);
  const { user } = useAuthSelector((state) => state.auth);
  const isWishlisted = productIds.includes(product.id);
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    await dispatch(addToCart({ productId: product.id }));
    toast.success('Added to cart');
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    await dispatch(toggleWishlist(product.id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
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
          onClick={handleToggleWishlist}
          className={`absolute top-2 right-2 p-2 transition-colors ${
            isWishlisted ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
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
          <StarRating rating={product.rating} count={product.reviewCount} size={14} />
        </div>
      </div>
    </Link>
  );
}
