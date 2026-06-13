import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag, Heart, Truck, Shield, RotateCcw, Star } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchProductBySlug } from '../features/productSlice';
import { addToCart } from '../features/cartSlice';
import { toggleWishlist } from '../features/wishlistSlice';
import ReviewForm from '../components/ReviewForm';
import ReviewList from '../components/ReviewList';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useAppDispatch();
  const { currentProduct: product, loading } = useAppSelector(
    (state) => state.products
  );

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const { productIds } = useAppSelector((state) => state.wishlist);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
  }, [dispatch, slug]);

  useEffect(() => {
    if (product) {
      const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
      const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];
      if (sizes.length > 0) setSelectedSize(sizes[0]);
      if (colors.length > 0) setSelectedColor(colors[0]);
    }
  }, [product]);

  if (loading || !product) {
    return (
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 animate-pulse">
            <div className="aspect-square bg-dark-200 rounded-lg" />
            <div className="space-y-4">
              <div className="h-8 bg-dark-200 rounded w-1/3" />
              <div className="h-8 bg-dark-200 rounded w-1/2" />
              <div className="h-4 bg-dark-200 rounded w-full" />
              <div className="h-4 bg-dark-200 rounded w-2/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const sizes = [...new Set(product.variants.map((v) => v.size).filter(Boolean))];
  const colors = [...new Set(product.variants.map((v) => v.color).filter(Boolean))];

  const selectedVariant = product.variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const handleAddToCart = async () => {
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    await dispatch(
      addToCart({
        productId: product.id,
        variantId: selectedVariant?.id,
        quantity,
      })
    );
    toast.success('Added to cart');
  };

  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  const isWishlisted = productIds.includes(product.id);

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }
    await dispatch(toggleWishlist(product.id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
  };

  const handleReviewSuccess = () => {
    toast.success('Review submitted!');
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
  };

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? 'border-gold-500'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || product.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <p className="text-gray-400 mb-2">{product.brand}</p>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex text-gold-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                  />
                ))}
              </div>
              <span className="text-gray-400">
                ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-gold-500">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.comparePrice.toFixed(2)}
                  </span>
                  <span className="px-2 py-1 bg-green-500/20 text-green-500 text-sm rounded">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            <p className="text-gray-300 mb-6">{product.description}</p>

            {/* Colors */}
            {colors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">
                  Color: <span className="text-gold-500">{selectedColor}</span>
                </h3>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-lg border ${
                        selectedColor === color
                          ? 'border-gold-500 bg-gold-500/10'
                          : 'border-dark-100 hover:border-dark-100'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">
                    Size: <span className="text-gold-500">{selectedSize}</span>
                  </h3>
                  <button className="text-sm text-gold-500 hover:text-gold-600">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const variant = product.variants.find(
                      (v) => v.size === size && v.color === selectedColor
                    );
                    const inStock = variant && variant.stock > 0;

                    return (
                      <button
                        key={size}
                        onClick={() => inStock && setSelectedSize(size)}
                        disabled={!inStock}
                        className={`px-4 py-2 rounded-lg border ${
                          selectedSize === size
                            ? 'border-gold-500 bg-gold-500/10'
                            : inStock
                            ? 'border-dark-100 hover:border-dark-100'
                            : 'border-dark-100 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-lg border border-dark-100 flex items-center justify-center hover:bg-dark-200"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-lg border border-dark-100 flex items-center justify-center hover:bg-dark-200"
                >
                  +
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag size={20} />
                Add to Cart
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-4 border-2 rounded-lg transition-colors ${
                  isWishlisted
                    ? 'border-red-500 text-red-500 bg-red-500/10'
                    : 'border-dark-100 hover:border-gold-500 hover:text-gold-500'
                }`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-dark-100">
              <div className="text-center">
                <Truck className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400">2 Year Warranty</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 text-gold-500 mx-auto mb-2" />
                <p className="text-xs text-gray-400">30 Day Returns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Review Form */}
            <div className="md:col-span-1">
              {user ? (
                <ReviewForm productId={product.id} onSuccess={handleReviewSuccess} />
              ) : (
                <div className="bg-dark-200 rounded-lg p-6 text-center">
                  <p className="text-gray-400 mb-4">Login to write a review</p>
                  <a
                    href="/login"
                    className="inline-block px-6 py-2 bg-gold-500 text-dark-300 rounded-lg font-bold hover:bg-gold-600"
                  >
                    Login
                  </a>
                </div>
              )}
            </div>

            {/* Review List */}
            <div className="md:col-span-2">
              <ReviewList productId={product.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
