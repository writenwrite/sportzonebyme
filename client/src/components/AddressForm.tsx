import { useState } from 'react';
import { X } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

interface AddressFormProps {
  address?: Address | null;
  onClose: () => void;
  onSave: (address: Address) => void;
}

export default function AddressForm({ address, onClose, onSave }: AddressFormProps) {
  const [form, setForm] = useState({
    label: address?.label || 'Home',
    street: address?.street || '',
    city: address?.city || '',
    state: address?.state || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'US',
    phone: address?.phone || '',
    isDefault: address?.isDefault || false,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (address?.id) {
        const { data } = await api.put(`/users/addresses/${address.id}`, form);
        toast.success('Address updated');
        onSave(data.data.address);
      } else {
        const { data } = await api.post('/users/addresses', form);
        toast.success('Address added');
        onSave(data.data.address);
      }
    } catch (error) {
      toast.error('Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!address?.id) return;
    try {
      await api.delete(`/users/addresses/${address.id}`);
      toast.success('Address deleted');
      onSave(null as any);
    } catch (error) {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-200 rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-dark-100">
          <h3 className="text-lg font-bold">
            {address ? 'Edit Address' : 'Add Address'}
          </h3>
          <button onClick={onClose} className="p-1 hover:text-gold-500">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-sm mb-2">Label</label>
            <select
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
            >
              <option value="Home">Home</option>
              <option value="Office">Office</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-2">Street Address</label>
            <input
              type="text"
              required
              value={form.street}
              onChange={(e) => setForm({ ...form, street: e.target.value })}
              className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">City</label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">State</label>
              <input
                type="text"
                required
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Postal Code</label>
              <input
                type="text"
                required
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="accent-gold-500"
            />
            <span className="text-sm">Set as default address</span>
          </label>

          <div className="flex gap-3 pt-2">
            {address?.id && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-red-500 border border-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
              >
                Delete
              </button>
            )}
            <div className="flex-1 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 border border-dark-100 rounded-lg hover:bg-dark-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
