import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, Check, XCircle } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface OrderDetail {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  subtotal: number;
  shippingCost: number;
  tax: number;
  trackingNumber?: string;
  shippingService?: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  items: {
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
  createdAt: string;
}

const statusSteps = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${id}`);
        setOrder(data.data.order);
      } catch (error) {
        console.error('Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  if (loading || !order) {
    return (
      <div className="pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-dark-200 rounded w-1/3" />
            <div className="h-64 bg-dark-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const currentStep = statusSteps.indexOf(order.status);

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.put(`/orders/${order.id}/cancel`);
      setOrder({ ...order, status: 'CANCELLED' });
      toast.success('Order cancelled');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const canCancel = ['PENDING', 'PAID'].includes(order.status);

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-600 mb-6"
        >
          <ArrowLeft size={16} />
          Back to Orders
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Order #{order.orderNumber}</h1>
            <p className="text-gray-400">
              Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {canCancel && (
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                <XCircle size={16} />
                Cancel Order
              </button>
            )}
            <span className="px-4 py-2 bg-gold-500/20 text-gold-500 rounded-full font-medium">
              {order.status}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-dark-200 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            {statusSteps.map((step, index) => (
              <div key={step} className="flex-1 flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      index <= currentStep
                        ? 'bg-gold-500 text-dark-300'
                        : 'bg-dark-300 text-gray-500'
                    }`}
                  >
                    {index < currentStep ? (
                      <Check size={16} />
                    ) : (
                      <span className="text-xs">{index + 1}</span>
                    )}
                  </div>
                  <span className="text-xs mt-2 text-gray-400">{step}</span>
                </div>
                {index < statusSteps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      index < currentStep ? 'bg-gold-500' : 'bg-dark-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Items */}
          <div className="bg-dark-200 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-dark-100 mt-4 pt-4 space-y-2">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Shipping</span>
                <span>${order.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-dark-100">
                <span>Total</span>
                <span className="text-gold-500">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="bg-dark-200 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                {order.shippingAddress.postalCode}
              </p>
            </div>

            {order.trackingNumber && (
              <div className="bg-dark-200 rounded-lg p-6">
                <h2 className="text-lg font-bold mb-4">Tracking</h2>
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-gold-500" />
                  <span>{order.shippingService}</span>
                </div>
                <p className="mt-2 text-gray-400">{order.trackingNumber}</p>
              </div>
            )}

            <div className="bg-dark-200 rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Payment</h2>
              <div className="flex justify-between">
                <span>Status</span>
                <span
                  className={
                    order.paymentStatus === 'COMPLETED'
                      ? 'text-green-500'
                      : 'text-yellow-500'
                  }
                >
                  {order.paymentStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
