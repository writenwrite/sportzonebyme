import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchCart, updateCartItem, removeFromCart } from '../features/cartSlice';

export default function Cart() {
  const dispatch = useAppDispatch();
  const { items, total, loading } = useAppSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

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

  if (items.length === 0) {
    return (
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center py-16">
          <ShoppingBag className="w-16 h-16 text-gray-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-gray-400 mb-6">
            Looks like you haven't added any items yet.
          </p>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors"
          >
            <ArrowLeft size={20} />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 100 ? 0 : 9.99;
  const tax = subtotal * 0.1;
  const orderTotal = subtotal + shipping + tax;

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-dark-200 rounded-lg p-4 flex gap-4"
              >
                <Link
                  to={`/catalog/${item.product.slug || item.product.id}`}
                  className="w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden"
                >
                  <img
                    src={item.product.images[0]?.url}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </Link>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <Link
                        to={`/catalog/${item.product.slug || item.product.id}`}
                        className="font-medium hover:text-gold-500 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      {item.variant && (
                        <p className="text-sm text-gray-400">
                          {item.variant.size && `Size: ${item.variant.size}`}
                          {item.variant.size && item.variant.color && ' | '}
                          {item.variant.color && `Color: ${item.variant.color}`}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => dispatch(removeFromCart(item.id))}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          dispatch(
                            updateCartItem({
                              itemId: item.id,
                              quantity: item.quantity - 1,
                            })
                          )
                        }
                        className="w-8 h-8 rounded border border-dark-100 flex items-center justify-center hover:bg-dark-300"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          dispatch(
                            updateCartItem({
                              itemId: item.id,
                              quantity: item.quantity + 1,
                            })
                          )
                        }
                        className="w-8 h-8 rounded border border-dark-100 flex items-center justify-center hover:bg-dark-300"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="font-bold text-gold-500">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-200 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-dark-100 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-gold-500">${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              {shipping > 0 && (
                <p className="text-xs text-gray-400 mb-4">
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}

              <Link
                to="/checkout"
                className="block w-full py-3 bg-gold-500 text-dark-300 font-bold rounded-lg text-center hover:bg-gold-600 transition-colors"
              >
                Proceed to Checkout
              </Link>

              <Link
                to="/catalog"
                className="block w-full py-3 text-center text-gold-500 hover:text-gold-600 mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
