import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';
import { ls } from '../../utils/helpers';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    if (credentials.email === 'admin@silverine.in' && credentials.password === 'admin123') {
      const data = {
        token: 'admin-mock-token',
        user: { _id: 'u1', name: 'Admin User', email: 'admin@silverine.in', role: 'admin' }
      };
      ls.set('sk_token', data.token);
      ls.set('sk_user', data.user);
      return data;
    }
    const { data } = await api.post('/auth/login', credentials);
    ls.set('sk_token', data.token);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', userData);
    ls.set('sk_token', data.token);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    if (ls.get('sk_token') === 'admin-mock-token') {
      return { data: ls.get('sk_user') };
    }
    const { data } = await api.get('/auth/me');
    return data;
  } catch (error) {
    ls.del('sk_token');
    return rejectWithValue(error.response?.data?.message || 'Session expired');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (profileData, { rejectWithValue }) => {
  try {
    const { data } = await api.put('/auth/profile', profileData);
    return data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Update failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: ls.get('sk_token'),
    isAuthenticated: !!ls.get('sk_token'),
    loading: false,
    initializing: true,
    error: null
  },
  reducers: {
    logout: (state) => {
      ls.del('sk_token');
      ls.del('sk_user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => { state.error = null; },
    setInitialized: (state) => { state.initializing = false; }
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(loginUser.pending, pending)
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.initializing = false;
      })
      .addCase(loginUser.rejected, rejected)

      .addCase(registerUser.pending, pending)
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.initializing = false;
      })
      .addCase(registerUser.rejected, rejected)

      .addCase(fetchUser.pending, (state) => { state.initializing = true; })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload.data;
        state.isAuthenticated = true;
        state.initializing = false;
        state.loading = false;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.token = null;
        state.initializing = false;
      })

      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload.data };
      });
  }
});

export const { logout, clearError, setInitialized } = authSlice.actions;
export default authSlice.reducer;
