import { createSlice } from '@reduxjs/toolkit';

import { deleteAccountThunk } from '@/redux/thunk/deleteAccountThunk';
import { DeleteAccountState } from '@/types';

const initialState: DeleteAccountState = {
  isLoading: false,
  success: false,
  error: null,
  message: null,
};

const deleteAccountSlice = createSlice({
  name: 'deleteAccount',

  initialState,

  reducers: {
    resetDeleteAccount: state => {
      state.isLoading = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },

  extraReducers: builder => {
    builder

      // ==========================================
      // PENDING
      // ==========================================

      .addCase(deleteAccountThunk.pending, state => {
        state.isLoading = true;
        state.success = false;
        state.error = null;
        state.message = null;
      })

      // ==========================================
      // SUCCESS
      // ==========================================

      .addCase(deleteAccountThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        state.success = action.payload?.success ?? true;

        state.message =
          action.payload?.message ?? 'Account deleted successfully';

        state.error = null;
      })

      // ==========================================
      // ERROR
      // ==========================================

      .addCase(deleteAccountThunk.rejected, (state, action) => {
        state.isLoading = false;

        state.success = false;

        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : action.error.message ?? 'Failed to delete account';

        state.message = null;
      });
  },
});

export const { resetDeleteAccount } = deleteAccountSlice.actions;

export default deleteAccountSlice.reducer;
