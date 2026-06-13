import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  createdAt: string;
  user: { name: string; email: string };
  items: { name: string; quantity: number; price: number }[];
  shippingAddress: any;
  trackingNumber?: string;
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-500',
  PAID: 'bg-blue-500/20 text-blue-500',
  PROCESSING: 'bg-purple-500/20 text-purple-500',
  SHIPPED: 'bg-green-500/20 text-green-500',
  DELIVERED: 'bg-green-500/20 text-green-500',
  CANCELLED: 'bg-red-500/20 text-red-500',
};

const statusOptions = ['PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [trackingInput, setTrackingInput] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get('/orders/admin/all?limit=100');
      setOrders(data.data.orders);
    } catch (error) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      await api.put(`/orders/${orderId}/status`, {
        status,
        trackingNumber: trackingInput[orderId] || undefined,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      toast.success('Order status updated');
    } catch (error) {
      toast.error('Failed to update order');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-dark-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/admin" className="p-2 hover:text-gold-500">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-3xl font-bold">Manage Orders</h1>
        </div>

        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-dark-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <Package className="text-gold-500" size={20} />
                    <span className="font-bold">#{order.orderNumber}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        statusColors[order.status] || 'bg-gray-500/20 text-gray-500'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {order.user.name} • {new Date(order.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-lg font-bold text-gold-500">
                  ${order.total.toFixed(2)}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {order.items.map((item, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-dark-300 rounded text-sm text-gray-300"
                  >
                    {item.name} x{item.quantity}
                  </span>
                ))}
              </div>

              {/* Status Update */}
              <div className="flex items-end gap-3 pt-4 border-t border-dark-100">
                <div className="flex-1">
                  <label className="block text-xs text-gray-400 mb-1">Update Status</label>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded text-sm focus:outline-none focus:border-gold-500 disabled:opacity-50"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                {(order.status === 'SHIPPED' || order.status === 'PROCESSING') && (
                  <div className="flex-1">
                    <label className="block text-xs text-gray-400 mb-1">Tracking Number</label>
                    <input
                      type="text"
                      placeholder="Enter tracking number"
                      value={trackingInput[order.id] || order.trackingNumber || ''}
                      onChange={(e) =>
                        setTrackingInput((prev) => ({ ...prev, [order.id]: e.target.value }))
                      }
                      className="w-full px-3 py-2 bg-dark-300 border border-dark-100 rounded text-sm focus:outline-none focus:border-gold-500"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
