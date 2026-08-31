import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { DrawerActions, useNavigation } from '@react-navigation/native';

import moment from 'moment';

import { AppDispatch, RootState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hooks';

import { dailyNotificationsThunk } from '@/redux/thunk/dailyNotificationsThunk';
import { latestQuotesThunk } from '@/redux/thunk/latestThunk';
import { categoriesThunk } from '@/redux/thunk/categoriesThunk';
import { popularQuotesThunk } from '@/redux/thunk/popularThunk';

import { navigate } from '@/utils/NavigationUtils';

import { Quote, Category, DailyQuote } from '@/types';

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

const Home = () => {
  const dispatch = useAppDispatch<AppDispatch>();
  const navigation = useNavigation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const categories = useSelector(
    (state: RootState) => state.categories.categories || [],
  );
  const favourites = useSelector(
    (state: RootState) => state.favourites.favourites || [],
  );
  const latest = useSelector(
    (state: RootState) => state.latestQuotes.quotes || [],
  );

  const popular = useSelector(
    (state: RootState) => state.popularQuotes.quotes || [],
  );

  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications || [],
  );

  const [dailyQuote, setDailyQuote] = useState<DailyQuote | null>(null);
  const isDailyFavorite = Boolean(
    dailyQuote?._id &&
      favourites.some(favourite => favourite._id === dailyQuote._id),
  );
  const unreadCount = notifications.filter(
    notification => !notification.isRead,
  ).length;
  const handleDailyFavorite = () => {
    if (!dailyQuote?._id) {
      console.log('DAILY QUOTE ID NOT FOUND');
      return;
    }

    console.log(
      isDailyFavorite ? '💔 REMOVE DAILY FAVORITE:' : '❤️ ADD DAILY FAVORITE:',
      dailyQuote._id,
    );

    dispatch(
      toggleFavourite({
        _id: dailyQuote._id,
        text: dailyQuote.text,
        author: dailyQuote.author,
      }),
    );
  };
  useEffect(() => {
    const fetchDailyQuote = async () => {
      try {
        console.log('FETCHING DAILY QUOTE: English');

        const response = await dispatch(
          dailyNotificationsThunk('English'),
        ).unwrap();

        console.log('DAILY QUOTE RESPONSE:', response);

        if (response?.success && response?.quote) {
          console.log('DAILY QUOTE:', response.quote);

          setDailyQuote(response.quote);
        } else {
          console.log('DAILY QUOTE NOT FOUND');

          setDailyQuote(null);
        }
      } catch (error) {
        console.log('DAILY QUOTE ERROR:', error);

        setDailyQuote(null);
      }
    };

    fetchDailyQuote();
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      categoriesThunk({
        language: 'English',
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      latestQuotesThunk({
        language: 'English',
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      popularQuotesThunk({
        language: 'English',
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch]);

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

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

  const handleNotificationPress = () => {
    navigate(Routes.NOTIFICATIONS);
  };

  const handleDailyShare = () => {
    if (!dailyQuote?._id) {
      return;
    }

    console.log('DAILY QUOTE SHARE:', dailyQuote._id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="QuotesCreator"
        onMenuPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        onNotificationPress={handleNotificationPress}
        notificationCount={unreadCount}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Good Morning! 👋</Text>

        <Text style={styles.subtitle}>Find inspiration for your day</Text>

        {dailyQuote && (
          <>
            <SectionHeader title="DAILY QUOTES" />

            <View style={styles.notificationCard}>
              <Image source={IMAGES.QUOTES} style={styles.quoteIcon} />

              <View style={styles.quoteContent}>
                <Text style={styles.notificationTitle}>{dailyQuote.title}</Text>

                <Text style={styles.notificationBody}>{dailyQuote.text}</Text>
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
        )}

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

        <SectionHeader title="Latest" onViewAllPress={() => {}} />

        <FlatList<Quote>
          data={latest.slice(0, 8)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <ItemLatestQuotes item={item} />}
          contentContainerStyle={styles.latestList}
          ItemSeparatorComponent={() => <View style={styles.latestSeparator} />}
        />

        <SectionHeader title="Popular" onViewAllPress={() => {}} />

        <FlatList<Quote>
          data={popular.slice(0, 8)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <ItemPopular item={item} />}
          contentContainerStyle={styles.popularList}
          ItemSeparatorComponent={() => (
            <View style={styles.popularSeparator} />
          )}
        />
      </ScrollView>

      <CustomDrawer visible={drawerVisible} onClose={closeDrawer} />
    </SafeAreaView>
  );
};

export default Home;
