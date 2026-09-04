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

import IMAGES from '@/assets/images';
import Routes from '@/navigations/Routes';

import styles from './styles';

import QuoteActions from '@/components/QuotesActions/QuotesActions';
import { toggleFavourite } from '@/redux/slices/favouriteSlice';
import { BottomTabParamList, DrawerParamList } from '@/navigations/types';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import ItemPopular from '@/components/ListItems/ItemPopular/ItemPopular';

const Home = () => {
  const dispatch = useAppDispatch<AppDispatch>();

  type HomeNavigationProp = CompositeNavigationProp<
    BottomTabNavigationProp<BottomTabParamList, Routes.HOME>,
    DrawerNavigationProp<DrawerParamList>
  >;

  const navigation = useNavigation<HomeNavigationProp>();

  const [drawerVisible, setDrawerVisible] = useState(false);

  // =====================================================
  // LANGUAGE
  // =====================================================

  const language = useSelector((state: RootState) => state.language.language);

  const isHindi = language === 'Hindi';

  // =====================================================
  // AUTH
  // =====================================================

  const userId = useSelector((state: RootState) => state.auth?.user?.id || '');

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
  // LOCALIZED TEXT
  // =====================================================

  const homeText = {
    greeting: isHindi ? 'सुप्रभात! 👋' : 'Good Morning! 👋',

    subtitle: isHindi
      ? 'अपने दिन के लिए प्रेरणा पाएं'
      : 'Find inspiration for your day',

    dailyQuotes: isHindi ? 'दैनिक विचार' : 'DAILY QUOTES',

    todaysThought: isHindi ? 'आज का विचार' : "Today's Thought",

    categories: isHindi ? 'श्रेणियाँ' : 'Categories',

    latest: isHindi ? 'नवीनतम' : 'Latest',

    popular: isHindi ? 'लोकप्रिय' : 'Popular',

    latestQuotes: isHindi ? 'नवीनतम विचार' : 'Latest Quotes',

    popularQuotes: isHindi ? 'लोकप्रिय विचार' : 'Popular Quotes',
  };

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
    console.log('🌐 HOME CATEGORY LANGUAGE:', language);

    dispatch(
      categoriesThunk({
        language,
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch, language]);

  // =====================================================
  // LATEST API
  // =====================================================

  useEffect(() => {
    console.log('🌐 HOME LATEST LANGUAGE:', language);

    dispatch(
      latestQuotesThunk({
        language,
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch, language]);

  // =====================================================
  // POPULAR API
  // =====================================================

  useEffect(() => {
    console.log('🌐 HOME POPULAR LANGUAGE:', language);

    dispatch(
      popularQuotesThunk({
        language,
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch, language]);

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

    // Share functionality
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

      // Agar backend localized displayName bhej raha hai
      // to wahi navigation mein use karo
      categoryName: item.displayName || item.name,
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

        <Text style={styles.title}>{homeText.greeting}</Text>

        <Text style={styles.subtitle}>{homeText.subtitle}</Text>

        {/* =================================================
            DAILY QUOTE
        ================================================= */}

        {dailyQuote && dailyQuote.body ? (
          <>
            <SectionHeader title={homeText.dailyQuotes} />

            <View style={styles.notificationCard}>
              <Image source={IMAGES.QUOTES} style={styles.quoteIcon} />

              <View style={styles.quoteContent}>
                <Text style={styles.notificationTitle}>
                  {dailyQuote.title || homeText.todaysThought}
                </Text>

                <Text style={styles.notificationBody}>{dailyQuote.body}</Text>
              </View>

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

        <SectionHeader
          title={homeText.categories}
          onViewAllPress={handleCategories}
        />

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
          title={homeText.latest}
          onViewAllPress={() => {
            navigation.navigate(Routes.LATEST, {
              title: homeText.latestQuotes,
            });
          }}
        />

        <FlatList<Quote>
          data={latest.slice(0, 8)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
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
          title={homeText.popular}
          onViewAllPress={() => {
            navigation.navigate(Routes.POPULAR, {
              title: homeText.popularQuotes,
            });
          }}
        />

        <FlatList<Quote>
          data={popular.slice(0, 8)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({ item }) => (
            <ItemPopular
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
