import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import socketService from '../../services/socket';

// Listen for auth failures from interceptor
if (typeof window !== 'undefined') {
  window.addEventListener('auth-failed', () => {
    // This will be handled by the auth slice when needed
    console.log('Auth failed event received');
  });
}

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      // Token is stored in httpOnly cookie by backend (secure)
      // We don't store tokens in localStorage/sessionStorage (security risk)
      return data.user;
    } catch (error) {
      // Better error handling with more details
      const errorMessage = error.response?.data?.message 
        || error.response?.data?.errors?.join(', ')
        || error.message 
        || 'Registration failed';
      
      console.error('Registration error details:', {
        message: errorMessage,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
        baseURL: error.config?.baseURL
      });
      
      return rejectWithValue(errorMessage);
    }
  }
);

// Login user
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', credentials);
      // Token is stored in httpOnly cookie by backend (secure)
      // We don't store tokens in localStorage/sessionStorage (security risk)
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

// Get current user
export const getMe = createAsyncThunk(
  'auth/getMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me');
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user');
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/auth/logout');
      socketService.disconnect();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    error: null,
    hasCheckedAuth: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(register.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(register.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.hasCheckedAuth = true;
      socketService.connect(action.payload.id);
    });
    builder.addCase(register.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.hasCheckedAuth = true;
      socketService.connect(action.payload.id);
    });
    builder.addCase(login.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    // Get Me
    builder.addCase(getMe.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getMe.fulfilled, (state, action) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.hasCheckedAuth = true;
      socketService.connect(action.payload.id);
    });
    builder.addCase(getMe.rejected, (state) => {
      state.isLoading = false;
      // Clear auth state on getMe failure
      // This ensures user is logged out if cookies aren't being sent
      state.isAuthenticated = false;
      state.user = null;
      state.hasCheckedAuth = true; // Mark that we've checked, even if failed
    });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
      // Cookie is cleared by backend on logout
    });
  }
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;