import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchWishlist, toggleWishlist } from '../features/wishlistSlice';
import { addToCart } from '../features/cartSlice';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state) => state.wishlist);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleRemove = async (productId: string) => {
    setRemoving(productId);
    await dispatch(toggleWishlist(productId));
    toast.success('Removed from wishlist');
    setRemoving(null);
  };

  const handleAddToCart = async (productId: string) => {
    await dispatch(addToCart({ productId }));
    toast.success('Added to cart');
  };

  if (loading) {
    return (
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-dark-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-6">Save items you love for later.</p>
            <Link
              to="/catalog"
              className="inline-block px-6 py-3 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors"
            >
              Discover Products
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-dark-200 rounded-lg p-4 flex gap-4 items-center"
              >
                <Link to={`/catalog/${item.product.slug}`}>
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/catalog/${item.product.slug}`}
                    className="font-bold hover:text-gold-500 transition-colors"
                  >
                    {item.product.name}
                  </Link>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="flex text-gold-500 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <span key={i}>
                          {i < Math.floor(item.product.rating) ? '★' : '☆'}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      ({item.product.reviewCount})
                    </span>
                  </div>
                  <p className="text-gold-500 font-bold mt-1">
                    ${item.product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddToCart(item.product.id)}
                    className="p-3 bg-gold-500 text-dark-300 rounded-lg hover:bg-gold-600 transition-colors"
                    title="Add to cart"
                  >
                    <ShoppingBag size={18} />
                  </button>
                  <button
                    onClick={() => handleRemove(item.product.id)}
                    disabled={removing === item.product.id}
                    className="p-3 border border-dark-100 rounded-lg hover:border-red-500 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Remove from wishlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
