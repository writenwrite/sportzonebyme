import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import api from '../services/api';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-500',
  PAID: 'bg-blue-500/20 text-blue-500',
  PROCESSING: 'bg-purple-500/20 text-purple-500',
  SHIPPED: 'bg-green-500/20 text-green-500',
  DELIVERED: 'bg-green-500/20 text-green-500',
  CANCELLED: 'bg-red-500/20 text-red-500',
};

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders');
        setOrders(data.data.orders);
      } catch (error) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

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
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No orders yet</h2>
            <p className="text-gray-400 mb-6">Start shopping to see your orders here.</p>
            <Link
              to="/catalog"
              className="inline-block px-6 py-3 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors"
            >
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-dark-200 rounded-lg p-6 hover:ring-2 hover:ring-gold-500 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-400">Order #{order.orderNumber}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusColors[order.status] || 'bg-gray-500/20 text-gray-500'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex gap-2 mb-4">
                  {order.items.slice(0, 4).map((item, index) => (
                    <img
                      key={index}
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                  ))}
                  {order.items.length > 4 && (
                    <div className="w-16 h-16 rounded bg-dark-300 flex items-center justify-center text-sm">
                      +{order.items.length - 4}
                    </div>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </span>
                  <span className="font-bold text-gold-500">
                    ${order.total.toFixed(2)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
