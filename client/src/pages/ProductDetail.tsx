import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingBag, Heart, Truck, Shield, RotateCcw, Star, Minus, Plus, Check } from 'lucide-react';
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
            <div className="aspect-square bg-dark-200 rounded-xl" />
            <div className="space-y-4">
              <div className="h-4 bg-dark-200 rounded w-1/4" />
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

  const currentStock = selectedVariant?.stock || product.stock || 0;
  const inStock = currentStock > 0;

  const handleAddToCart = async () => {
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    if (!inStock) {
      toast.error('Product is out of stock');
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
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-dark-200">
              <img
                src={product.images[selectedImage]?.url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-gold-500 ring-2 ring-gold-500/30'
                      : 'border-dark-100 hover:border-dark-100/50'
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
            {/* Category & Brand */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-sm text-gold-500 font-medium uppercase tracking-wider">
                {product.category?.name}
              </span>
              {product.brand && (
                <>
                  <span className="text-dark-100">|</span>
                  <span className="text-sm text-gray-400">{product.brand}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <div className="flex text-gold-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      fill={i < Math.floor(product.rating) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="text-white font-medium ml-1">{product.rating.toFixed(1)}</span>
              </div>
              <span className="text-gray-400">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-dark-300 rounded-xl">
              <span className="text-3xl font-bold text-gold-500">
                ${product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    ${product.comparePrice.toFixed(2)}
                  </span>
                  <span className="px-3 py-1 bg-green-500/20 text-green-500 text-sm font-bold rounded-full">
                    Save {discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>

            {/* Stock Status */}
            <div className="mb-6">
              {inStock ? (
                <div className="flex items-center gap-2 text-green-500">
                  <Check size={18} />
                  <span className="font-medium">In Stock ({currentStock} available)</span>
                </div>
              ) : (
                <div className="text-red-500 font-medium">Out of Stock</div>
              )}
            </div>

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
                      className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-all ${
                        selectedColor === color
                          ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                          : 'border-dark-100 hover:border-dark-100/50 text-gray-300'
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
                  <button className="text-sm text-gold-500 hover:text-gold-600 underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => {
                    const variant = product.variants.find(
                      (v) => v.size === size && v.color === selectedColor
                    );
                    const sizeStock = variant?.stock || 0;
                    const sizeInStock = sizeStock > 0;

                    return (
                      <button
                        key={size}
                        onClick={() => sizeInStock && setSelectedSize(size)}
                        disabled={!sizeInStock}
                        className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-all ${
                          selectedSize === size
                            ? 'border-gold-500 bg-gold-500/10 text-gold-500'
                            : sizeInStock
                            ? 'border-dark-100 hover:border-dark-100/50 text-gray-300'
                            : 'border-dark-100 opacity-40 cursor-not-allowed text-gray-500'
                        }`}
                      >
                        {size}
                        {!sizeInStock && <span className="ml-1 text-xs">(Out)</span>}
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
                  disabled={quantity <= 1}
                  className="w-10 h-10 rounded-lg border-2 border-dark-100 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                  disabled={quantity >= currentStock}
                  className="w-10 h-10 rounded-lg border-2 border-dark-100 flex items-center justify-center hover:border-gold-500 hover:text-gold-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!inStock}
                className="flex-1 py-4 bg-gold-500 text-dark-300 font-bold rounded-xl hover:bg-gold-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag size={20} />
                {inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={handleToggleWishlist}
                className={`p-4 border-2 rounded-xl transition-all ${
                  isWishlisted
                    ? 'border-red-500 text-red-500 bg-red-500/10'
                    : 'border-dark-100 hover:border-gold-500 hover:text-gold-500'
                }`}
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 p-4 bg-dark-300 rounded-xl">
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
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-8">Customer Reviews</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Review Form */}
            <div className="md:col-span-1">
              {user ? (
                <ReviewForm productId={product.id} onSuccess={handleReviewSuccess} />
              ) : (
                <div className="bg-dark-200 rounded-xl p-6 text-center">
                  <p className="text-gray-400 mb-4">Login to write a review</p>
                  <a
                    href="/login"
                    className="inline-block px-6 py-2.5 bg-gold-500 text-dark-300 rounded-lg font-bold hover:bg-gold-600 transition-colors"
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
