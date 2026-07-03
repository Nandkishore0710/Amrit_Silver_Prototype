import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const fetchProducts = createAsyncThunk('products/fetch', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
  }
});

export const fetchFeatured = createAsyncThunk('products/featured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/featured');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchBestSellers = createAsyncThunk('products/bestSellers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/best-sellers');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchNewArrivals = createAsyncThunk('products/newArrivals', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/new-arrivals');
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const productSlice = createSlice({
  name: 'products',
  initialState: {
    list: [],
    featured: [],
    bestSellers: [],
    newArrivals: [],
    pagination: null,
    loading: false,
    error: null,
    filters: { category: '', sort: '', minPrice: '', maxPrice: '', search: '', page: 1 }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload, page: 1 };
    },
    setPage: (state, action) => { state.filters.page = action.payload; },
    resetFilters: (state) => {
      state.filters = { category: '', sort: '', minPrice: '', maxPrice: '', search: '', page: 1 };
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchFeatured.fulfilled, (state, action) => { state.featured = action.payload; })
      .addCase(fetchBestSellers.fulfilled, (state, action) => { state.bestSellers = action.payload; })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => { state.newArrivals = action.payload; });
  }
});

export const { setFilters, setPage, resetFilters } = productSlice.actions;
export default productSlice.reducer;
