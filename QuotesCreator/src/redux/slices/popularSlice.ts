import { createSlice } from '@reduxjs/toolkit';
import { PopularQuoteState } from '@/types';
import { popularQuotesThunk } from '../thunk/popularThunk';

const initialState: PopularQuoteState = {
  quotes: [],
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasNextPage: false,
  hasPreviousPage: false,
  language: 'English',
  isLoading: false,
  error: null,
};

const popularQuoteSlice = createSlice({
  name: 'popularQuote',

  initialState,

  reducers: {
    clearPopularQuotes: state => {
      state.quotes = [];
      state.page = 1;
      state.total = 0;
      state.totalPages = 0;
      state.hasNextPage = false;
      state.hasPreviousPage = false;
      state.error = null;
    },

    setPopularLanguage: (
      state,
      action: {
        payload: 'English' | 'Hindi';
      },
    ) => {
      state.language = action.payload;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(popularQuotesThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(popularQuotesThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        state.quotes = action.payload.quotes || [];

        state.page = action.payload.page || 1;

        state.limit = action.payload.limit || 10;

        state.total = action.payload.total || 0;

        state.totalPages = action.payload.totalPages || 0;

        state.hasNextPage = action.payload.hasNextPage || false;

        state.hasPreviousPage = action.payload.hasPreviousPage || false;

        state.language = action.payload.language || 'English';
      })

      .addCase(popularQuotesThunk.rejected, (state, action) => {
        state.isLoading = false;

        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to fetch popular quotes';
      });
  },
});

export const { clearPopularQuotes, setPopularLanguage } =
  popularQuoteSlice.actions;

export default popularQuoteSlice.reducer;
