import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hooks';
import { dailyNotificationsThunk } from '@/redux/thunk/dailyNotificationsThunk';
import { latestQuotesThunk } from '@/redux/thunk/latestThunk';
import { categoriesThunk } from '@/redux/thunk/categoriesThunk';
import { popularQuotesThunk } from '@/redux/thunk/popularThunk';
import { navigate } from '@/utils/NavigationUtils';
import { Quote, Category } from '@/types';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import Header from '@/components/Header/Header';
import CustomDrawer from '@/components/CustomDrawer/CustomDrawer';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import ItemLatestQuotes from '@/components/ListItems/ItemLatestQuotes/ItemLatestQuotes';
import ItemCategories from '@/components/ListItems/ItemCategories/ItemCategories';
import ItemPopular from '@/components/ListItems/ItemPopular/ItemPopular';
import QuoteActions from '@/components/QuotesActions/QuotesActions';
import IMAGES from '@/assets/images';
import styles from './styles';
import Routes from '@/navigations/Routes';
import moment from 'moment';
const Home = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const userId = useSelector((state: RootState) => state.auth.user?.id);
  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );
  const latest = useSelector((state: RootState) => state.latestQuotes.quotes);
  const popular = useSelector((state: RootState) => state.popularQuotes.quotes);
  const notifications = useSelector(
    (state: RootState) => state.notifications.notifications || [],
  );

  const dailyQuote = notifications?.[0];
  const unreadCount = notifications.filter(
    notification => !notification.isRead,
  ).length;
  
  useEffect(() => {
    if (!userId) {
      console.log('USER ID NOT FOUND');
      return;
    }
    console.log('FETCHING DAILY NOTIFICATIONS:', userId);
    dispatch(dailyNotificationsThunk(userId))
      .unwrap()
      .then(response => {
        console.log('DAILY NOTIFICATIONS RESPONSE:', response);
      })
      .catch(error => {
        console.log('DAILY NOTIFICATIONS ERROR:', error);
      });
  }, [userId, dispatch]);

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

  useEffect(() => {
    if (!userId) {
      console.log('USER ID NOT FOUND');
      return;
    }

    dispatch(dailyNotificationsThunk(userId));
  }, [userId, dispatch]);

  const openDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const handleCategories = () => {
    console.log('Categories handle');
    navigate(Routes.CATEGORIES);
  };
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="QuotesCreator"
        onMenuPress={() => {
          navigation.dispatch(DrawerActions.openDrawer());
        }}
        onNotificationPress={() => navigate(Routes.NOTIFICATIONS)}
        notificationCount={unreadCount}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Good Morning! 👋</Text>
        <Text style={styles.subtitle}>Find inspiration for your day</Text>
        <Text style={styles.notificationLabel}>DAILY QUOTE</Text>

        {dailyQuote && (
          <View style={styles.notificationCard}>
            <Image source={IMAGES.QUOTES} style={styles.quoteIcon} />
            <View style={styles.quoteContent}>
              <Text style={styles.notificationTitle}>{dailyQuote.title}</Text>
              <Text style={styles.notificationBody}>{dailyQuote.body}</Text>
            </View>
            <View style={styles.dailyBottomRow}>
              <Text style={styles.dailyDate}>
                {dailyQuote.createdAt
                  ? moment(dailyQuote.createdAt).format('DD MMM YYYY • h:mm A')
                  : ''}
              </Text>

              <QuoteActions
                isFavorite={false}
                onFavoritePress={() => {
                  console.log('Favorite daily quote');
                }}
                onSharePress={() => {
                  console.log('Share daily quote');
                }}
              />
            </View>
          </View>
        )}
        <SectionHeader title="Categories" onViewAllPress={handleCategories} />
        <FlatList<Category>
          data={categories.slice(0, 8)}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          renderItem={({ item }) => <ItemCategories item={item} />}
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
