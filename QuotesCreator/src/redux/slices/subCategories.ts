import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { subCategoriesThunk } from '@/redux/thunk/subCategoriesThunk';
import { SubCategoriesState, SubCategory } from '@/types';

const initialState: SubCategoriesState = {
  subcategories: [],

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

const subCategoriesSlice = createSlice({
  name: 'subCategories',

  initialState,

  reducers: {
    clearSubCategories: state => {
      state.subcategories = [];

      state.page = 1;

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

    builder.addCase(subCategoriesThunk.pending, state => {
      state.loading = true;
      state.error = null;
    });

    // ==========================================
    // SUCCESS
    // ==========================================
    builder.addCase(subCategoriesThunk.fulfilled, (state, action) => {
      state.loading = false;

      const newItems = action.payload.subcategories || [];

      // ==========================================
      // PAGE 1
      // ==========================================

      if (action.payload.page === 1) {
        state.subcategories = newItems;
      }

      // ==========================================
      // NEXT PAGES
      // ==========================================
      else {
        const existingIds = new Set(state.subcategories.map(item => item._id));

        const uniqueItems = newItems.filter(
          (item: any) => !existingIds.has(item._id),
        );

        state.subcategories = [...state.subcategories, ...uniqueItems];
      }

      // ==========================================
      // PAGINATION
      // ==========================================

      state.page = action.payload.page;

      state.limit = action.payload.limit;

      state.total = action.payload.total;

      state.totalPages = action.payload.totalPages;

      state.hasNextPage = action.payload.hasNextPage;

      state.hasPreviousPage = action.payload.hasPreviousPage;

      state.language = action.payload.language;

      state.error = null;
    });

    // ==========================================
    // ERROR
    // ==========================================

    builder.addCase(subCategoriesThunk.rejected, (state, action) => {
      state.loading = false;

      state.error =
        (action.payload as string) ||
        action.error.message ||
        'Failed to fetch subcategories';
    });
  },
});

export const { clearSubCategories } = subCategoriesSlice.actions;

export default subCategoriesSlice.reducer;
