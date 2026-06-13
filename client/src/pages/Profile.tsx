import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAppSelector } from '../hooks/useAppSelector';
import api from '../services/api';
import toast from 'react-hot-toast';
import AddressForm from '../components/AddressForm';

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

export default function Profile() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    setName(user.name);
    setPhone(user.phone || '');
    fetchAddresses();
  }, [user, navigate]);

  const fetchAddresses = async () => {
    try {
      const { data } = await api.get('/users/addresses');
      setAddresses(data.data.addresses);
    } catch (error) {
      console.error('Failed to fetch addresses');
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/users/profile', { name, phone });
      toast.success('Profile updated!');
      setEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleAddressSave = (address: Address | null) => {
    if (address === null) {
      // Address was deleted
      setAddresses((prev) => prev.filter((a) => a.id !== editingAddress?.id));
    } else {
      const exists = addresses.find((a) => a.id === address.id);
      if (exists) {
        setAddresses((prev) => prev.map((a) => (a.id === address.id ? address : a)));
      } else {
        setAddresses((prev) => [...prev, address]);
      }
    }
    setShowAddressForm(false);
    setEditingAddress(null);
  };

  if (!user) return null;

  return (
    <div className="pt-20 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>

        <div className="bg-dark-200 rounded-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gold-500 flex items-center justify-center text-dark-300 text-2xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-gray-400">{user.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Name</label>
              {editing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
                />
              ) : (
                <p className="p-2 bg-dark-300 rounded-lg">{user.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm mb-2">Email</label>
              <p className="p-2 bg-dark-300 rounded-lg text-gray-400">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm mb-2">Phone</label>
              {editing ? (
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2 bg-dark-300 border border-dark-100 rounded-lg focus:outline-none focus:border-gold-500"
                />
              ) : (
                <p className="p-2 bg-dark-300 rounded-lg">{user.phone || 'Not set'}</p>
              )}
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-gold-500 text-dark-300 font-bold rounded-lg hover:bg-gold-600 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-6 py-2 border border-dark-100 rounded-lg hover:bg-dark-300 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="px-6 py-2 border border-gold-500 text-gold-500 rounded-lg hover:bg-gold-500/10 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Addresses</h3>
            <button
              onClick={() => {
                setEditingAddress(null);
                setShowAddressForm(true);
              }}
              className="flex items-center gap-2 px-4 py-2 text-gold-500 border border-gold-500 rounded-lg hover:bg-gold-500/10 transition-colors"
            >
              <Plus size={16} />
              Add Address
            </button>
          </div>

          {addresses.length === 0 ? (
            <div className="bg-dark-200 rounded-lg p-8 text-center">
              <MapPin className="w-12 h-12 text-gray-500 mx-auto mb-3" />
              <p className="text-gray-400">No addresses saved yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((address) => (
                <div
                  key={address.id}
                  className={`bg-dark-200 rounded-lg p-4 flex items-start justify-between ${
                    address.isDefault ? 'ring-2 ring-gold-500' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{address.label}</span>
                      {address.isDefault && (
                        <span className="px-2 py-0.5 bg-gold-500/20 text-gold-500 text-xs rounded">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300">{address.street}</p>
                    <p className="text-gray-400 text-sm">
                      {address.city}, {address.state} {address.postalCode}
                    </p>
                    {address.phone && (
                      <p className="text-gray-400 text-sm">{address.phone}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingAddress(address);
                        setShowAddressForm(true);
                      }}
                      className="p-2 hover:text-gold-500 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showAddressForm && (
        <AddressForm
          address={editingAddress}
          onClose={() => {
            setShowAddressForm(false);
            setEditingAddress(null);
          }}
          onSave={handleAddressSave}
        />
      )}
    </div>
  );
}
