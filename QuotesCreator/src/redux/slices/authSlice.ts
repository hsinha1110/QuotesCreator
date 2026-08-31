import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { loginAsyncThunk } from '@/redux/thunk/loginThunk';

type AuthUser = {
  id: string;
  name?: string;
  email?: string;
  profileImage?: string | null;
  language?: string;
  provider?: string;
  firebaseUid?: string;
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: AuthState = {
  token: null,
  user: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    // =====================================================
    // SET AUTH
    // =====================================================

    setAuth: (
      state,
      action: PayloadAction<{
        token: string;
        user: AuthUser;
      }>,
    ) => {
      console.log('🔐 SET AUTH USER:', action.payload.user);

      // IMPORTANT:
      // Completely replace old user
      state.token = action.payload.token;
      state.user = action.payload.user;

      state.isLoading = false;
      state.error = null;
    },

    // =====================================================
    // LOGOUT
    // =====================================================

    logout: state => {
      console.log('🔐 LOGOUT - CLEARING AUTH');

      state.token = null;
      state.user = null;
      state.isLoading = false;
      state.error = null;
    },
  },

  // =======================================================
  // NORMAL LOGIN
  // =======================================================

  extraReducers: builder => {
    builder

      .addCase(loginAsyncThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loginAsyncThunk.fulfilled, (state, action) => {
        console.log('🔐 NORMAL LOGIN USER:', action.payload?.user);

        state.isLoading = false;

        state.token = action.payload.token;

        // Completely replace previous user
        state.user = action.payload.user;

        state.error = null;
      })

      .addCase(loginAsyncThunk.rejected, (state, action) => {
        state.isLoading = false;

        state.error = (action.payload as string) || 'Login failed';
      });
  },
});

export const { setAuth, logout } = authSlice.actions;

export default authSlice.reducer;
