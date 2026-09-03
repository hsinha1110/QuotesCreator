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
        const response = action.payload;

        state.isLoading = false;

        if (response.page === 1) {
          state.quotes = response.quotes;
        } else {
          state.quotes.push(...response.quotes);
        }

        state.page = response.page;
        state.totalPages = response.totalPages;
        state.total = response.total;
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
