import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Truck, Check } from 'lucide-react';
import { useAppDispatch } from '../hooks/useAppDispatch';
import { useAppSelector } from '../hooks/useAppSelector';
import { fetchCart, clearCart } from '../features/cartSlice';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function Checkout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { items, total } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [shippingRates, setShippingRates] = useState<any[]>([]);
  const [selectedShipping, setSelectedShipping] = useState('');
  const [loading, setLoading] = useState(false);

  const [shippingAddress, setShippingAddress] = useState({
    label: 'Home',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const fetchRates = async () => {
    try {
      const { data } = await api.post('/shipping/rates', {
        toZip: shippingAddress.postalCode,
        toCountry: shippingAddress.country,
        weight: 2,
      });
      setShippingRates(data.data.rates);
      if (data.data.rates.length > 0) {
        setSelectedShipping(data.data.rates[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch shipping rates');
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchRates();
    setStep(2);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const selectedRate = shippingRates.find((r) => r.id === selectedShipping);
      const { data } = await api.post('/orders', {
        shippingAddress,
        shippingService: selectedRate?.service,
        shippingCost: parseFloat(selectedRate?.rate || '0'),
      });

      dispatch(clearCart());
      toast.success('Order placed successfully!');
      navigate(`/orders/${data.data.order.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingRates.find((r) => r.id === selectedShipping)?.rate || 0;
  const tax = subtotal * 0.1;
  const orderTotal = subtotal + parseFloat(shippingCost) + tax;

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {[
            { num: 1, label: 'Shipping', icon: Truck },
            { num: 2, label: 'Payment', icon: CreditCard },
            { num: 3, label: 'Confirm', icon: Check },
          ].map(({ num, label, icon: Icon }) => (
            <div key={num} className="flex items-center">
              <div
                className={`flex items-center gap-2 ${
                  step >= num ? 'text-gold-500' : 'text-gray-500'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= num ? 'bg-gold-500 text-dark-300' : 'bg-dark-200'
                  }`}
                >
                  <Icon size={16} />
                </div>
                <span className="hidden sm:inline">{label}</span>
              </div>
              {num < 3 && (
                <div
                  className={`w-12 sm:w-24 h-1 mx-2 ${
                    step > num ? 'bg-gold-500' : 'bg-dark-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 1 && (
              <form onSubmit={handleAddressSubmit} className="space-y-6">
                <div className="bg-dark-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Shipping Address</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm mb-2">Street Address</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.street}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, street: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">City</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.city}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, city: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">State</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.state}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, state: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Postal Code</label>
                      <input
                        type="text"
                        required
                        value={shippingAddress.postalCode}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-2">Phone</label>
                      <input
                        type="tel"
                        value={shippingAddress.phone}
                        onChange={(e) =>
                          setShippingAddress({ ...shippingAddress, phone: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
                      />
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors"
                >
                  Continue to Shipping
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="bg-dark-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Select Shipping</h2>
                  {shippingRates.length > 0 ? (
                    <div className="space-y-3">
                      {shippingRates.map((rate) => (
                        <label
                          key={rate.id}
                          className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer ${
                            selectedShipping === rate.id
                              ? 'border-gold-500 bg-gold-500/10'
                              : 'border-dark-100 hover:border-dark-100'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="shipping"
                              checked={selectedShipping === rate.id}
                              onChange={() => setSelectedShipping(rate.id)}
                              className="accent-gold-500"
                            />
                            <div>
                              <p className="font-medium">{rate.carrier}</p>
                              <p className="text-sm text-gray-400">
                                {rate.service} • {rate.deliveryDays} days
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-gold-500">${rate.rate}</span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400">Loading shipping rates...</p>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 border border-dark-100 rounded-lg hover:bg-dark-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!selectedShipping}
                    className="flex-1 py-3 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-dark-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Order Review</h2>

                  {/* Items */}
                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.product.images[0]?.url}
                          alt={item.product.name}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-400">
                            Qty: {item.quantity}
                            {item.variant && ` • ${item.variant.size}`}
                          </p>
                        </div>
                        <span className="font-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Address */}
                  <div className="border-t border-dark-100 pt-4 mb-4">
                    <p className="text-sm text-gray-400 mb-1">Ship to:</p>
                    <p>{shippingAddress.street}</p>
                    <p>
                      {shippingAddress.city}, {shippingAddress.state}{' '}
                      {shippingAddress.postalCode}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 border border-dark-100 rounded-lg hover:bg-dark-200 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={loading}
                    className="flex-1 py-3 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-dark-200 rounded-lg p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-4">Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal ({items.length} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>${parseFloat(shippingCost).toFixed(2)}</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
