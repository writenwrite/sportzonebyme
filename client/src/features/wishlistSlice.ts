import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';

interface WishlistItem {
  id: string;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    images: { url: string }[];
    rating: number;
    reviewCount: number;
  };
  createdAt: string;
}

interface WishlistState {
  items: WishlistItem[];
  productIds: string[];
  loading: boolean;
  error: string | null;
}

const initialState: WishlistState = {
  items: [],
  productIds: [],
  loading: false,
  error: null,
};

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users/wishlist');
      return data.data.wishlist;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggle',
  async (productId: string, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/users/wishlist/${productId}`);
      return { productId, message: data.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
      state.productIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.productIds = action.payload.map((item: WishlistItem) => item.product.id);
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { productId } = action.meta.arg;
        const isAdding = action.payload.message === 'Added to wishlist';
        if (isAdding) {
          state.productIds.push(productId);
        } else {
          state.productIds = state.productIds.filter((id) => id !== productId);
          state.items = state.items.filter((item) => item.product.id !== productId);
        }
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
