import { Quote } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavouriteState {
  favourites: Quote[];
  loading: boolean;
  error: string | null;
}

const initialState: FavouriteState = {
  favourites: [],
  loading: false,
  error: null,
};

const FavouriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    toggleFavourite: (state, action) => {
      const exists = state.favourites.find(
        item => item._id === action.payload._id,
      );
      if (exists) {
        state.favourites = state.favourites.filter(
          item => item._id !== action.payload._id,
        );
      } else {
        state.favourites.push(action.payload);
      }
    },
    clearFavourites: state => {
      state.favourites = [];
    },
  },
});
export const { toggleFavourite, clearFavourites } = FavouriteSlice.actions;

export default FavouriteSlice.reducer;
