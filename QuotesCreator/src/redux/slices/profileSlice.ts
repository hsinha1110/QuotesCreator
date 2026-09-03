import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { getProfileThunk } from '../thunk/getProfileThunk';

export interface ProfileData {
  _id: string;
  name: string;
  email: string;
  profileImage: string | null;
  language: 'English' | 'Hindi';

  firebaseUid?: string | null;
  provider?: string;
  googleId?: string | null;
  facebookId?: string | null;

  createdAt?: string;
  updatedAt?: string;

  notificationSettings?: {
    dailyQuote: boolean;
    notificationTime: string;
    timezone: string;
  };
}

export interface ProfileState {
  user: ProfileData | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  user: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,

  reducers: {
    // ==========================================
    // CLEAR PROFILE
    // ==========================================

    clearProfile: state => {
      state.user = null;
      state.error = null;
    },

    // ==========================================
    // UPDATE PROFILE LOCALLY
    // ==========================================

    updateProfileLocal: (
      state,
      action: PayloadAction<Partial<ProfileData>>,
    ) => {
      if (state.user) {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      }
    },
  },

  extraReducers: builder => {
    builder

      // ==========================================
      // GET PROFILE - PENDING
      // ==========================================

      .addCase(getProfileThunk.pending, state => {
        state.isLoading = true;
        state.error = null;
      })

      // ==========================================
      // GET PROFILE - SUCCESS
      // ==========================================

      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.isLoading = false;

        state.user = action.payload?.user || null;

        state.error = null;

        console.log('✅ PROFILE SAVED IN REDUX:', state.user);
      })

      // ==========================================
      // GET PROFILE - ERROR
      // ==========================================

      .addCase(getProfileThunk.rejected, (state, action) => {
        state.isLoading = false;

        state.error = (action.payload as string) || 'Failed to fetch profile';
      });
  },
});

export const { clearProfile, updateProfileLocal } = profileSlice.actions;

export default profileSlice.reducer;
