import { configureStore } from '@reduxjs/toolkit';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';

import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from '@/redux/slices/authSlice';
import notificationReducer from '@/redux/slices/notificationsSlice';
import categoriesReducer from '@/redux/slices/categoriesSlice';
import latestQuotesReducer from '@/redux/slices/latestQuotesSlice';
import popularReducer from '@/redux/slices/popularSlice';
import deleteAccountReducer from '@/redux/slices/deleteAccountSlice';
import quotesReducer from '@/redux/slices/quotesSlice';
import subCategoriesReducer from '@/redux/slices/subCategories';
import favouritesReducer from '@/redux/slices/favouriteSlice';
import profileReducer from '@/redux/slices/profileSlice';
import recentReducer from '@/redux/slices/recentQuotesSlice';
import languageReducer from '@/redux/slices/languageSlice';

// =====================================================
// AUTH PERSIST
// =====================================================

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
  whitelist: ['token', 'user'],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// =====================================================
// LANGUAGE PERSIST
// =====================================================

const languagePersistConfig = {
  key: 'language',
  storage: AsyncStorage,
  whitelist: ['language'],
};

const persistedLanguageReducer = persistReducer(
  languagePersistConfig,
  languageReducer,
);

// =====================================================
// STORE
// =====================================================

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,

    notifications: notificationReducer,

    categories: categoriesReducer,

    latestQuotes: latestQuotesReducer,

    popularQuotes: popularReducer,

    deleteAccount: deleteAccountReducer,

    quotes: quotesReducer,

    subCategories: subCategoriesReducer,

    favourites: favouritesReducer,

    profile: profileReducer,

    recentQuotes: recentReducer,

    // IMPORTANT
    language: persistedLanguageReducer,
  },

  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
