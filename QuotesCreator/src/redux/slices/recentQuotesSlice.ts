// redux/slice/recentQuotesSlice.ts

import { createSlice } from '@reduxjs/toolkit';
import { getRecentQuotesThunk } from '../thunk/getRecentQuotesThunk';
import { RecentQuotesState } from '@/types';

const initialState: RecentQuotesState = {
  quotes: [],
  isLoading: false,
  error: null,
};

const recentQuotesSlice = createSlice({
  name: 'recentQuotes',
  initialState,
  reducers: {
    clearRecentQuotes: state => {
      state.quotes = [];
    },

    removeRecentQuoteLocal: (state, action) => {
      state.quotes = state.quotes.filter(quote => quote._id !== action.payload);
    },
  },

  extraReducers: builder => {
    builder
      .addCase(getRecentQuotesThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(getRecentQuotesThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        state.quotes = action.payload?.recentQuotes || [];

        console.log(
          '🔥 REDUX RECENT QUOTES:',
          JSON.stringify(state.quotes, null, 2),
        );
      })

      .addCase(getRecentQuotesThunk.rejected, (state, action) => {
        state.isLoading = false;

        state.error =
          (action.payload as string) || 'Failed to fetch recent quotes';
      });
  },
});

export const { clearRecentQuotes, removeRecentQuoteLocal } =
  recentQuotesSlice.actions;

export default recentQuotesSlice.reducer;
