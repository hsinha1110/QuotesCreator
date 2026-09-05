import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Quote, QuotesState } from '@/types';
import { getQuotesThunk } from '../thunk/getQuotesThunk';

const initialState: QuotesState = {
  quotes: [],

  page: 1,

  limit: 10,

  total: 0,

  totalPages: 0,

  hasNextPage: false,

  hasPreviousPage: false,

  language: 'English',

  loading: false,

  error: null,
};

const quotesSlice = createSlice({
  name: 'quotes',

  initialState,

  reducers: {
    clearQuotes: state => {
      state.quotes = [];

      state.page = 1;

      state.limit = 10;

      state.total = 0;

      state.totalPages = 0;

      state.hasNextPage = false;

      state.hasPreviousPage = false;

      state.error = null;
    },
  },

  extraReducers: builder => {
    // ==========================================
    // PENDING
    // ==========================================

    builder.addCase(getQuotesThunk.pending, state => {
      state.loading = true;
      state.error = null;
    });

    // ==========================================
    // SUCCESS
    // ==========================================

    builder.addCase(
      getQuotesThunk.fulfilled,
      (
        state,
        action: PayloadAction<{
          success: boolean;
          page: number;
          limit: number;
          total: number;
          totalPages: number;
          hasNextPage: boolean;
          hasPreviousPage: boolean;
          language: 'English' | 'Hindi';
          quotes: Quote[];
        }>,
      ) => {
        state.loading = false;

        const newQuotes = action.payload.quotes || [];

        // ========================================
        // PAGE 1
        // ========================================

        if (action.payload.page === 1) {
          state.quotes = newQuotes;
        } else {
          const existingIds = new Set(state.quotes.map(item => item._id));

          const uniqueQuotes = newQuotes.filter(
            item => !existingIds.has(item._id),
          );

          state.quotes = [...state.quotes, ...uniqueQuotes];
        }

        state.page = action.payload.page;
        state.limit = action.payload.limit;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;

        state.hasNextPage = action.payload.hasNextPage;

        state.hasPreviousPage = action.payload.hasPreviousPage;

        state.language = action.payload.language;
      },
    );

    // ==========================================
    // ERROR
    // ==========================================

    builder.addCase(getQuotesThunk.rejected, (state, action) => {
      state.loading = false;

      state.error =
        (action.payload as string) ||
        action.error.message ||
        'Failed to fetch quotes';
    });
  },
});

export const { clearQuotes } = quotesSlice.actions;

export default quotesSlice.reducer;
