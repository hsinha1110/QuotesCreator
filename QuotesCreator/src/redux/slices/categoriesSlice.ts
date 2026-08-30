import { createSlice } from '@reduxjs/toolkit';
import { Category } from '@/types';
import { categoriesThunk } from '../thunk/categoriesThunk';

interface CategoriesState {
  categories: Category[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  language: 'English' | 'Hindi';
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
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

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearCategories: state => {
      state.categories = [];
      state.page = 1;
      state.limit = 10;
      state.total = 0;
      state.totalPages = 0;
      state.hasNextPage = false;
      state.hasPreviousPage = false;
      state.error = null;
    },
    setCategoriesLanguage: (
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
      .addCase(categoriesThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(categoriesThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        const response = action.payload;
        const newCategories = response?.categories || [];
        const currentPage = response?.page || 1;
        if (currentPage === 1) {
          state.categories = newCategories;
        }
        else {
          state.categories = [...state.categories, ...newCategories];
        }
        state.page = currentPage;
        state.limit = response?.limit || 10;
        state.total = response?.total || 0;
        state.totalPages = response?.totalPages || 0;
        state.hasNextPage = response?.hasNextPage ?? false;
        state.hasPreviousPage = response?.hasPreviousPage ?? false;
        state.language = response?.language || 'English';
      })
      .addCase(categoriesThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.payload as string) ||
          action.error.message ||
          'Failed to fetch categories';
      });
  },
});

export const { clearCategories, setCategoriesLanguage } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;
