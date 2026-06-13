import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';
import { mockProducts } from '../services/mockData';

interface CartItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: { url: string }[];
  };
  variant?: {
    id: string;
    size: string;
    color: string;
  };
  quantity: number;
  price: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  loading: boolean;
  error: string | null;
}

const loadCartFromStorage = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('sportzone_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  localStorage.setItem('sportzone_cart', JSON.stringify(items));
};

const calculateTotal = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};

const initialState: CartState = {
  items: loadCartFromStorage(),
  total: calculateTotal(loadCartFromStorage()),
  loading: false,
  error: null,
};

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/cart');
    return data.data.cart;
  } catch (error: any) {
    const items = loadCartFromStorage();
    return { items, total: calculateTotal(items) };
  }
});

export const addToCart = createAsyncThunk(
  'cart/add',
  async (item: { productId: string; variantId?: string; quantity?: number }, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.post('/cart', item);
      return data.data.cart;
    } catch (error: any) {
      const state = getState() as { cart: CartState };
      const existingItems = state.cart.items;
      const product = mockProducts.find((p) => p.id === item.productId);
      if (!product) return rejectWithValue('Product not found');

      const existingItem = existingItems.find(
        (i) => i.product.id === item.productId && i.variant?.id === item.variantId
      );

      let newItems: CartItem[];
      if (existingItem) {
        newItems = existingItems.map((i) =>
          i.id === existingItem.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      } else {
        const newCartItem: CartItem = {
          id: `cart-${Date.now()}`,
          product: {
            id: product.id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            images: product.images,
          },
          variant: item.variantId
            ? product.variants.find((v) => v.id === item.variantId)
              ? { id: item.variantId, size: product.variants.find((v) => v.id === item.variantId)?.size || '', color: product.variants.find((v) => v.id === item.variantId)?.color || '' }
              : undefined
            : undefined,
          quantity: item.quantity || 1,
          price: product.price,
        };
        newItems = [...existingItems, newCartItem];
      }

      saveCartToStorage(newItems);
      return { items: newItems, total: calculateTotal(newItems) };
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/update',
  async ({ itemId, quantity }: { itemId: string; quantity: number }, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.put(`/cart/${itemId}`, { quantity });
      return data.data.cart;
    } catch (error: any) {
      const state = getState() as { cart: CartState };
      const newItems = state.cart.items
        .map((i) => (i.id === itemId ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0);
      saveCartToStorage(newItems);
      return { items: newItems, total: calculateTotal(newItems) };
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (itemId: string, { getState, rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/cart/${itemId}`);
      return data.data.cart;
    } catch (error: any) {
      const state = getState() as { cart: CartState };
      const newItems = state.cart.items.filter((i) => i.id !== itemId);
      saveCartToStorage(newItems);
      return { items: newItems, total: calculateTotal(newItems) };
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      localStorage.removeItem('sportzone_cart');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.total = action.payload.total;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
