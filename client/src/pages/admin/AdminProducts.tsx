import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  brand: string;
  isActive: boolean;
  images: { url: string }[];
  category: { name: string };
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    comparePrice: '',
    sku: '',
    brand: '',
    stock: '',
    categoryId: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products?limit=100');
      setProducts(data.data.products);
    } catch (error) {
      console.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      toast.success('Product deleted');
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: '',
      price: String(product.price),
      comparePrice: '',
      sku: '',
      brand: product.brand,
      stock: String(product.stock),
      categoryId: '',
    });
    setShowForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, {
          price: parseFloat(form.price),
          stock: parseInt(form.stock),
        });
        toast.success('Product updated');
      }
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to save product');
    }
  };

  if (loading) {
    return (
      <div className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-20 bg-dark-200 rounded-lg" />
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
          <h1 className="text-3xl font-bold">Manage Products</h1>
        </div>

        <div className="bg-dark-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-100">
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Product</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Category</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Price</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Stock</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="text-right p-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-dark-100 last:border-0">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">{product.category.name}</td>
                    <td className="p-4 font-bold text-gold-500">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`font-medium ${
                          product.stock < 10 ? 'text-red-500' : 'text-gray-300'
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          product.isActive
                            ? 'bg-green-500/20 text-green-500'
                            : 'bg-gray-500/20 text-gray-500'
                        }`}
                      >
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 hover:text-gold-500 transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-200 rounded-lg w-full max-w-md">
            <div className="p-4 border-b border-dark-100">
              <h3 className="text-lg font-bold">Edit Product</h3>
            </div>
            <form onSubmit={handleFormSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="flex-1 py-2 border border-dark-100 rounded-lg hover:bg-dark-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
