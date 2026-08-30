import { createSlice } from '@reduxjs/toolkit';
import { LatestQuoteState } from '@/types';
import { latestQuotesThunk } from '../thunk/latestThunk';

const initialState: LatestQuoteState = {
  quotes: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
  isLoading: false,
  error: null,
};

const latestQuoteSlice = createSlice({
  name: 'latestQuote',
  initialState,
  reducers: {
    clearLatestQuotes: state => {
      state.quotes = [];
      state.page = 1;
      state.total = 0;
      state.totalPages = 0;
      state.hasNextPage = false;
      state.hasPreviousPage = false;
      state.error = null;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(latestQuotesThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(latestQuotesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quotes = action.payload.quotes || [];
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
        state.total = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.hasNextPage = action.payload.hasNextPage || false;
        state.hasPreviousPage = action.payload.hasPreviousPage || false;
      })

      .addCase(latestQuotesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to fetch latest quotes';
      });
  },
});

export const { clearLatestQuotes } = latestQuoteSlice.actions;

export default latestQuoteSlice.reducer;
