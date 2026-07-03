import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import toast from 'react-hot-toast';

export const createOrder = createAsyncThunk('orders/create', async (orderData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/orders', orderData);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create order');
  }
});

export const fetchOrders = createAsyncThunk('orders/fetch', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/orders', { params });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const fetchOrderById = createAsyncThunk('orders/fetchById', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/orders/${id}`);
    return data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/orders/${id}/cancel`);
    toast.success('Order cancelled successfully');
    return data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to cancel order');
    return rejectWithValue(err.response?.data?.message);
  }
});

export const createPaymentIntent = createAsyncThunk('orders/paymentIntent', async (orderId, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/payments/create-payment-intent', { orderId });
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message);
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    currentOrder: null,
    pagination: null,
    paymentClientSecret: null,
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentOrder: (state) => { state.currentOrder = null; state.paymentClientSecret = null; },
    clearError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.list = [action.payload, ...state.list];
      })
      .addCase(createOrder.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
        state.loading = false;
      })

      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.loading = false;
      })

      .addCase(cancelOrder.fulfilled, (state, action) => {
        const idx = state.list.findIndex(o => o._id === action.payload._id);
        if (idx >= 0) state.list[idx] = action.payload;
        if (state.currentOrder?._id === action.payload._id) state.currentOrder = action.payload;
      })

      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.paymentClientSecret = action.payload.clientSecret;
      });
  }
});

export const { clearCurrentOrder, clearError } = orderSlice.actions;
export default orderSlice.reducer;
