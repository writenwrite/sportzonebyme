import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, Users, DollarSign, ArrowRight } from 'lucide-react';
import api from '../../services/api';

interface DashboardStats {
  products: number;
  orders: number;
  users: number;
  revenue: number;
  recentOrders: {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: string;
    user: { name: string };
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

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products count
        const productsRes = await api.get('/products?limit=1');
        const ordersRes = await api.get('/orders?limit=5');

        setStats({
          products: productsRes.data.data.pagination.total,
          orders: ordersRes.data.data.pagination.total,
          users: 0,
          revenue: ordersRes.data.data.orders.reduce(
            (sum: number, o: any) => sum + o.total,
            0
          ),
          recentOrders: ordersRes.data.data.orders,
        });
      } catch (error) {
        console.error('Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-dark-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statCards = [
    { label: 'Products', value: stats?.products || 0, icon: Package, color: 'text-blue-500' },
    { label: 'Orders', value: stats?.orders || 0, icon: ShoppingCart, color: 'text-green-500' },
    { label: 'Revenue', value: `$${(stats?.revenue || 0).toFixed(2)}`, icon: DollarSign, color: 'text-gold-500' },
  ];

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex gap-3">
            <Link
              to="/admin/products"
              className="px-4 py-2 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors flex items-center gap-2"
            >
              Manage Products <ArrowRight size={16} />
            </Link>
            <Link
              to="/admin/orders"
              className="px-4 py-2 border border-gold-500 text-gold-500 rounded-lg hover:bg-gold-500/10 transition-colors flex items-center gap-2"
            >
              Manage Orders <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-dark-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-dark-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Recent Orders</h2>
            <Link to="/admin/orders" className="text-gold-500 text-sm hover:text-gold-600">
              View All
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentOrders?.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-dark-300 rounded-lg"
              >
                <div>
                  <p className="font-medium">#{order.orderNumber}</p>
                  <p className="text-sm text-gray-400">{order.user.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      statusColors[order.status] || 'bg-gray-500/20 text-gray-500'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
