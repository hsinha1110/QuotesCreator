import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/redux/store';

import { getQuotesAsyncThunk } from '@/redux/thunk/quotesThunk';
import { latestQuotesThunk } from '@/redux/thunk/latestThunk';
import { popularQuotesThunk } from '@/redux/thunk/popularThunk';

import { Quote } from '@/types';

import EmptyState from '@/components/EmptyState/EmptyState';
import QuoteActions from '@/components/QuotesActions/QuotesActions';

import { toggleFavourite } from '@/redux/slices/favouriteSlice';

import IMAGES from '@/assets/images';
import Routes from '@/navigations/Routes';
import { DrawerParamList } from '@/navigations/types';

import styles from './styles';
import COLORS from '@/constants/Colors';

// =====================================================
// TYPES
// =====================================================

export type QuotesType = 'subcategory' | 'latest' | 'popular';

interface QuotesProps {
  type?: QuotesType;
  categoryId?: string;
  subcategoryId?: string | null;
}

// =====================================================
// NAVIGATION
// =====================================================

type QuotesNavigationProp = DrawerNavigationProp<DrawerParamList>;

// =====================================================
// COMPONENT
// =====================================================

const Quotes = ({
  type = 'subcategory',
  categoryId,
  subcategoryId,
}: QuotesProps) => {
  const navigation = useNavigation<QuotesNavigationProp>();

  const dispatch = useDispatch<AppDispatch>();

  const [loadingMore, setLoadingMore] = useState(false);

  // =====================================================
  // CATEGORY / SUBCATEGORY REDUX
  // =====================================================

  const {
    quotes: categoryQuotes,
    loading: categoryLoading,
    page: categoryPage,
    totalPages: categoryTotalPages,
  } = useSelector((state: RootState) => state.quotes);

  // =====================================================
  // LATEST REDUX
  // =====================================================

  const latest = useSelector(
    (state: RootState) => state.latestQuotes.quotes || [],
  );

  // =====================================================
  // POPULAR REDUX
  // =====================================================

  const popular = useSelector(
    (state: RootState) => state.popularQuotes.quotes || [],
  );

  // =====================================================
  // FAVOURITES
  // =====================================================

  const favourites = useSelector(
    (state: RootState) => state.favourites.favourites || [],
  );

  // =====================================================
  // CURRENT QUOTES
  // =====================================================

  const quotes: Quote[] =
    type === 'latest' ? latest : type === 'popular' ? popular : categoryQuotes;

  // =====================================================
  // TITLE
  // =====================================================

  const title =
    type === 'latest'
      ? 'Latest Quotes'
      : type === 'popular'
      ? 'Popular Quotes'
      : 'Quotes';

  // =====================================================
  // FIRST API CALL
  // =====================================================

  useEffect(() => {
    const fetchQuotes = async () => {
      try {
        // ==========================================
        // LATEST
        // ==========================================

        if (type === 'latest') {
          console.log('🔥 FETCH LATEST PAGE 1');

          await dispatch(
            latestQuotesThunk({
              language: 'English',
              page: 1,
              limit: 10,
            }),
          ).unwrap();

          return;
        }

        // ==========================================
        // POPULAR
        // ==========================================

        if (type === 'popular') {
          console.log('🔥 FETCH POPULAR PAGE 1');

          await dispatch(
            popularQuotesThunk({
              language: 'English',
              page: 1,
              limit: 10,
            }),
          ).unwrap();

          return;
        }

        // ==========================================
        // SUBCATEGORY / CATEGORY
        // ==========================================

        if (type === 'subcategory' && categoryId) {
          console.log('🔥 FETCH CATEGORY QUOTES PAGE 1');
          console.log('CATEGORY ID:', categoryId);
          console.log('SUBCATEGORY ID:', subcategoryId);

          await dispatch(
            getQuotesAsyncThunk({
              categoryId,

              ...(subcategoryId
                ? {
                    subcategoryId,
                  }
                : {}),

              page: 1,
              limit: 10,
              language: 'English',
            }),
          ).unwrap();

          return;
        }
      } catch (error) {
        console.log('❌ FETCH QUOTES ERROR:', error);
      }
    };

    fetchQuotes();
  }, [type, categoryId, subcategoryId, dispatch]);

  // =====================================================
  // QUOTE DETAILS
  // =====================================================

  const handleQuotesDetails = (item: Quote, index: number) => {
    console.log('📖 OPEN QUOTE:', item._id);

    navigation.navigate(Routes.QUOTES_DETAILS, {
      item,
      quotes,
      index,
    });
  };

  // =====================================================
  // LOAD MORE
  // =====================================================

  const loadMoreQuotes = async () => {
    if (loadingMore) {
      return;
    }

    // ==========================================
    // SUBCATEGORY / CATEGORY
    // ==========================================

    if (type === 'subcategory') {
      if (!categoryId) {
        return;
      }

      if (!categoryTotalPages || categoryPage >= categoryTotalPages) {
        console.log('❌ NO MORE CATEGORY QUOTES');
        return;
      }
    }

    try {
      setLoadingMore(true);

      // ==========================================
      // CATEGORY
      // ==========================================

      if (type === 'subcategory') {
        const nextPage = categoryPage + 1;

        console.log('🔥 CATEGORY NEXT PAGE:', nextPage);

        await dispatch(
          getQuotesAsyncThunk({
            categoryId: categoryId!,

            ...(subcategoryId
              ? {
                  subcategoryId,
                }
              : {}),

            page: nextPage,
            limit: 10,
            language: 'English',
          }),
        ).unwrap();

        return;
      }

      // ==========================================
      // LATEST
      // ==========================================

      if (type === 'latest') {
        const latestState = (await import('@/redux/store')).store.getState()
          .latestQuotes;

        const currentPage = latestState.page || 1;
        const totalPages = latestState.totalPages || 1;

        if (currentPage >= totalPages) {
          console.log('❌ NO MORE LATEST PAGES');
          return;
        }

        const nextPage = currentPage + 1;

        console.log('🔥 LATEST NEXT PAGE:', nextPage);

        await dispatch(
          latestQuotesThunk({
            language: 'English',
            page: nextPage,
            limit: 10,
          }),
        ).unwrap();

        return;
      }

      // ==========================================
      // POPULAR
      // ==========================================

      if (type === 'popular') {
        const popularState = (await import('@/redux/store')).store.getState()
          .popularQuotes;

        const currentPage = popularState.page || 1;
        const totalPages = popularState.totalPages || 1;

        if (currentPage >= totalPages) {
          console.log('❌ NO MORE POPULAR PAGES');
          return;
        }

        const nextPage = currentPage + 1;

        console.log('🔥 POPULAR NEXT PAGE:', nextPage);

        await dispatch(
          popularQuotesThunk({
            language: 'English',
            page: nextPage,
            limit: 10,
          }),
        ).unwrap();

        return;
      }
    } catch (error) {
      console.log('❌ LOAD MORE ERROR:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  // =====================================================
  // RENDER QUOTE
  // =====================================================

  const renderQuote = ({ item, index }: { item: Quote; index: number }) => {
    const isFavorite = favourites.some(favourite => favourite._id === item._id);

    const handleFavoritePress = () => {
      dispatch(
        toggleFavourite({
          _id: item._id,
          text: item.displayText || item.text,
          author: item.author || 'Unknown',
        }),
      );
    };

    const handleSharePress = () => {
      console.log('📤 SHARE QUOTE:', item._id);
    };

    return (
      <View style={styles.quoteCard}>
        <Pressable
          onPress={() => handleQuotesDetails(item, index)}
          style={styles.quotePressable}
        >
          <Image
            source={IMAGES.QUOTES}
            style={styles.quoteIcon}
            resizeMode="contain"
          />

          <Text style={styles.quoteText}>{item.displayText || item.text}</Text>

          <Text style={styles.author}>— {item.author || 'Unknown'}</Text>
        </Pressable>

        <View style={styles.quoteBottom}>
          <QuoteActions
            isFavorite={isFavorite}
            likes={item.likes ?? 0}
            showLikes={false}
            onFavoritePress={handleFavoritePress}
            onSharePress={handleSharePress}
          />
        </View>
      </View>
    );
  };

  // =====================================================
  // BOTTOM LOADER
  // =====================================================

  const renderFooter = () => {
    if (!loadingMore || quotes.length === 0) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  };

  // =====================================================
  // INITIAL LOADING
  // =====================================================

  if (
    type === 'subcategory' &&
    categoryLoading &&
    categoryPage === 1 &&
    quotes.length === 0
  ) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <View style={styles.container}>
      <FlatList
        data={quotes}
        keyExtractor={item => item._id}
        renderItem={renderQuote}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          quotes.length === 0 ? styles.emptyListContainer : styles.quoteList
        }
        ItemSeparatorComponent={() => <View style={styles.quoteSeparator} />}
        onEndReached={loadMoreQuotes}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyState
            icon="chatbubble-ellipses-outline"
            title={`No ${title} Found!`}
            description={`No quotes available right now.
Try another category or search.`}
          />
        }
      />
    </View>
  );
};

export default Quotes;
