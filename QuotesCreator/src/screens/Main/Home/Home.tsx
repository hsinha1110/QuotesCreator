import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import {
  CompositeNavigationProp,
  DrawerActions,
  useNavigation,
} from '@react-navigation/native';

import moment from 'moment';

import { AppDispatch, RootState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hooks';

import { latestQuotesThunk } from '@/redux/thunk/latestThunk';
import { categoriesThunk } from '@/redux/thunk/categoriesThunk';
import { popularQuotesThunk } from '@/redux/thunk/popularThunk';
import { notificationHistoryByIdThunk } from '@/redux/thunk/notificationHistoryByIdThunk';

import { navigate } from '@/utils/NavigationUtils';

import { Quote, Category } from '@/types';

import Header from '@/components/Header/Header';
import CustomDrawer from '@/components/CustomDrawer/CustomDrawer';
import SectionHeader from '@/components/SectionHeader/SectionHeader';

import ItemLatestQuotes from '@/components/ListItems/ItemLatestQuotes/ItemLatestQuotes';
import ItemCategories from '@/components/ListItems/ItemCategories/ItemCategories';
import ItemPopular from '@/components/ListItems/ItemPopular/ItemPopular';

import IMAGES from '@/assets/images';
import Routes from '@/navigations/Routes';

import styles from './styles';

import QuoteActions from '@/components/QuotesActions/QuotesActions';
import { toggleFavourite } from '@/redux/slices/favouriteSlice';
import { BottomTabParamList, DrawerParamList } from '@/navigations/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';

const Home = () => {
  const dispatch = useAppDispatch<AppDispatch>();
  type HomeNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabParamList, Routes.HOME>,
    DrawerNavigationProp<DrawerParamList>
  >;
  const navigation = useNavigation<HomeNavigationProp>();
  const [drawerVisible, setDrawerVisible] = useState(false);

  // =====================================================
  // AUTH
  // =====================================================

  const userId = useSelector(
    (state: RootState) =>
      state.auth?.user?.id ||
      state.auth?.user?.id ||
      state.auth?.user?.id ||
      '',
  );

  // =====================================================
  // CATEGORIES
  // =====================================================

  const categories = useSelector(
    (state: RootState) => state.categories.categories || [],
  );

  // =====================================================
  // FAVOURITES
  // =====================================================

  const favourites = useSelector(
    (state: RootState) => state.favourites.favourites || [],
  );

  // =====================================================
  // LATEST
  // =====================================================

  const latest = useSelector(
    (state: RootState) => state.latestQuotes.quotes || [],
  );

  // =====================================================
  // POPULAR
  // =====================================================

  const popular = useSelector(
    (state: RootState) => state.popularQuotes.quotes || [],
  );

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications || [],
  );

  // =====================================================
  // LATEST DAILY QUOTE NOTIFICATION
  // =====================================================

  const dailyQuote = useMemo(() => {
    const dailyNotifications = notifications.filter(
      notification => notification.type === 'daily_quote',
    );

    if (!dailyNotifications.length) {
      return null;
    }

    // Latest notification
    return [...dailyNotifications].sort(
      (a, b) =>
        new Date(b.createdAt || 0).getTime() -
        new Date(a.createdAt || 0).getTime(),
    )[0];
  }, [notifications]);

  // =====================================================
  // UNREAD COUNT
  // =====================================================
  const unreadCount = notifications.filter(
    notification => !notification.isRead,
  ).length;

  // =====================================================
  // FETCH NOTIFICATION HISTORY
  // =====================================================

  useEffect(() => {
    if (!userId) {
      console.log('❌ HOME: USER ID NOT FOUND');

      return;
    }

    console.log('🔥 HOME: FETCHING NOTIFICATION HISTORY');

    console.log('👤 USER ID:', userId);

    dispatch(notificationHistoryByIdThunk(userId));
  }, [dispatch, userId]);

  // =====================================================
  // CATEGORIES API
  // =====================================================

  useEffect(() => {
    dispatch(
      categoriesThunk({
        language: 'English',
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch]);

  // =====================================================
  // LATEST API
  // =====================================================

  useEffect(() => {
    dispatch(
      latestQuotesThunk({
        language: 'English',
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch]);

  // =====================================================
  // POPULAR API
  // =====================================================

  useEffect(() => {
    dispatch(
      popularQuotesThunk({
        language: 'English',
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch]);

  // =====================================================
  // DAILY FAVORITE
  // =====================================================

  const isDailyFavorite = Boolean(
    dailyQuote?._id &&
      favourites.some(
        favourite =>
          favourite._id === dailyQuote._id ||
          favourite._id === dailyQuote.data?.quoteId,
      ),
  );

  // =====================================================
  // FAVORITE DAILY QUOTE
  // =====================================================

  const handleDailyFavorite = () => {
    if (!dailyQuote) {
      console.log('❌ DAILY QUOTE NOT FOUND');

      return;
    }

    const quoteId = dailyQuote.data?.quoteId || dailyQuote._id;

    const quoteText = dailyQuote.body || '';

    console.log(
      isDailyFavorite ? '💔 REMOVE DAILY FAVORITE:' : '❤️ ADD DAILY FAVORITE:',
      quoteId,
    );

    dispatch(
      toggleFavourite({
        _id: quoteId,

        text: quoteText,

        author: 'Unknown',
      }),
    );
  };

  // =====================================================
  // DAILY SHARE
  // =====================================================

  const handleDailyShare = () => {
    if (!dailyQuote) {
      console.log('❌ DAILY QUOTE NOT FOUND');

      return;
    }

    console.log(
      '📤 DAILY QUOTE SHARE:',
      dailyQuote.data?.quoteId || dailyQuote._id,
    );

    // Share functionality yahan add kar sakte ho
  };

  // =====================================================
  // DRAWER
  // =====================================================

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  // =====================================================
  // CATEGORIES
  // =====================================================

  const handleCategories = () => {
    navigate(Routes.CATEGORIES);
  };

  const handleSubCategories = (item: Category) => {
    console.log('CATEGORY ID:', item._id);

    console.log('CATEGORY NAME:', item.name);

    navigate(Routes.SUB_CATEGORIES, {
      categoryId: item._id,
      categoryName: item.name,
    });
  };

  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  const handleNotificationPress = () => {
    navigate(Routes.NOTIFICATIONS);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <SafeAreaView style={styles.container}>
      {/* =================================================
          HEADER
      ================================================= */}

      <Header
        title="QuotesCreator"
        onMenuPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        onNotificationPress={handleNotificationPress}
        notificationCount={unreadCount}
      />

      {/* =================================================
          CONTENT
      ================================================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* =================================================
            GREETING
        ================================================= */}

        <Text style={styles.title}>Good Morning! 👋</Text>

        <Text style={styles.subtitle}>Find inspiration for your day</Text>

        {/* =================================================
            DAILY QUOTE
        ================================================= */}

        {dailyQuote && dailyQuote.body ? (
          <>
            <SectionHeader title="DAILY QUOTES" />

            <View style={styles.notificationCard}>
              {/* -----------------------------------------
                  ICON
              ----------------------------------------- */}

              <Image source={IMAGES.QUOTES} style={styles.quoteIcon} />

              {/* -----------------------------------------
                  CONTENT
              ----------------------------------------- */}

              <View style={styles.quoteContent}>
                <Text style={styles.notificationTitle}>
                  {dailyQuote.title || "Today's Thought"}
                </Text>

                <Text style={styles.notificationBody}>{dailyQuote.body}</Text>
              </View>

              {/* -----------------------------------------
                  BOTTOM
              ----------------------------------------- */}

              <View style={styles.dailyBottomRow}>
                <Text style={styles.dailyDate}>
                  {dailyQuote.createdAt
                    ? moment(dailyQuote.createdAt).format(
                        'DD MMM YYYY • h:mm A',
                      )
                    : ''}
                </Text>

                <QuoteActions
                  isFavorite={isDailyFavorite}
                  onFavoritePress={handleDailyFavorite}
                  onSharePress={handleDailyShare}
                />
              </View>
            </View>
          </>
        ) : null}

        {/* =================================================
            CATEGORIES
        ================================================= */}

        <SectionHeader title="Categories" onViewAllPress={handleCategories} />

        <FlatList<Category>
          data={categories.slice(0, 8)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <ItemCategories
              item={item}
              onPress={() => handleSubCategories(item)}
            />
          )}
          contentContainerStyle={styles.categoryList}
          ItemSeparatorComponent={() => (
            <View style={styles.categorySeparator} />
          )}
        />

        {/* =================================================
            LATEST
        ================================================= */}

        <SectionHeader
          title="Latest"
          onViewAllPress={() => {
            navigation.navigate(Routes.LATEST, {
              title: 'Latest Quotes',
            });
          }}
        />
        <FlatList<Quote>
          data={latest.slice(0, 8)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({ item, index }) => (
            <ItemLatestQuotes
              item={item}
              onPress={() => {
                navigation.navigate(Routes.LATEST, {});
              }}
            />
          )}
          contentContainerStyle={styles.latestList}
          ItemSeparatorComponent={() => <View style={styles.latestSeparator} />}
        />
        {/* =================================================
            POPULAR
        ================================================= */}

        <SectionHeader
          title="Popular"
          onViewAllPress={() => {
            navigation.navigate(Routes.POPULAR, {
              title: 'Latest Quotes',
            });
          }}
        />
        <FlatList<Quote>
          data={popular.slice(0, 8)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({ item, index }) => (
            <ItemLatestQuotes
              item={item}
              onPress={() => {
                navigation.navigate(Routes.POPULAR, {});
              }}
            />
          )}
          contentContainerStyle={styles.popularList}
          ItemSeparatorComponent={() => (
            <View style={styles.popularSeparator} />
          )}
        />
      </ScrollView>

      {/* =================================================
          DRAWER
      ================================================= */}

      <CustomDrawer visible={drawerVisible} onClose={closeDrawer} />
    </SafeAreaView>
  );
};

export default Home;
