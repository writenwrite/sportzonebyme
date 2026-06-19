import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
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
    stock?: number;
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
    e.stopPropagation();
    await dispatch(addToCart({ productId: product.id }));
    toast.success('Added to cart');
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
      className="group block bg-theme-card rounded-xl overflow-hidden hover:shadow-lg hover:shadow-gold-500/10 transition-all duration-300 border border-theme"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-theme-secondary">
        <img
          src={product.images[0]?.url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Discount badge */}
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            -{discount}%
          </span>
        )}
        
        {/* Stock badge */}
        {product.stock !== undefined && product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Only {product.stock} left
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-3 right-3 bg-gray-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
            Out of Stock
          </span>
        )}
        
        {/* Action buttons */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          <button
            onClick={handleAddToCart}
            className="flex-1 mr-2 py-2.5 bg-gold-500 text-dark-300 text-sm font-bold rounded-lg hover:bg-gold-600 transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} />
            Add to Cart
          </button>
          <button
            onClick={handleToggleWishlist}
            className={`p-2.5 rounded-lg transition-colors ${
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white/80 dark:bg-dark-300/80 text-gray-700 dark:text-white hover:bg-red-500 hover:text-white'
            }`}
          >
            <Heart size={16} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs text-gold-500 font-medium mb-1.5 uppercase tracking-wider">
          {product.category.name}
        </p>
        <h3 className="font-semibold text-theme-primary group-hover:text-gold-500 transition-colors mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg font-bold text-gold-500">${product.price.toFixed(2)}</span>
          {product.comparePrice && (
            <span className="text-sm text-theme-muted line-through">
              ${product.comparePrice.toFixed(2)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <StarRating rating={product.rating} count={product.reviewCount} size={14} />
        </div>
      </div>
    </Link>
  );
}
