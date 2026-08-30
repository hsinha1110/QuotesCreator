import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { loginAsyncThunk } from '@/redux/thunk/loginThunk';

type AuthState = {
  token: string | null;
  user: any;
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
    setAuth: (
      state,
      action: PayloadAction<{
        token: string;
        user: any;
      }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },

    logout: state => {
      state.token = null;
      state.user = null;
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder

      .addCase(loginAsyncThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loginAsyncThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
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
