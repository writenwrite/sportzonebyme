import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../services/api';
import { mockProducts, mockCategories } from '../services/mockData';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  brand: string;
  rating: number;
  reviewCount: number;
  images: { url: string; alt?: string; isPrimary: boolean }[];
  category: { name: string; slug: string };
  variants: { id?: string; size?: string; color?: string; colorCode?: string; stock: number }[];
  tags: string[];
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  categories: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  categories: [],
  pagination: { page: 1, limit: 12, total: 0, pages: 0 },
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetch',
  async (params: Record<string, string> = {}, { rejectWithValue }) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const { data } = await api.get(`/products?${queryString}`);
      return data.data;
    } catch (error: any) {
      const category = params.category || '';
      const search = params.search || '';
      let filtered = mockProducts;
      if (category) {
        filtered = filtered.filter((p) => p.category.slug === category);
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(s) ||
            p.description.toLowerCase().includes(s) ||
            p.tags.some((t) => t.includes(s))
        );
      }
      return {
        products: filtered,
        pagination: { page: 1, limit: 12, total: filtered.length, pages: 1 },
      };
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/${slug}`);
      return data.data.product;
    } catch (error: any) {
      const product = mockProducts.find((p) => p.slug === slug);
      if (product) return product;
      return rejectWithValue('Product not found');
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/products/categories');
      return data.data.categories;
    } catch (error: any) {
      return mockCategories;
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProductBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
