import React, { useEffect, useState } from 'react';

import { FlatList, View, ActivityIndicator } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { goBack, navigate } from '@/utils/NavigationUtils';

import Header from '@/components/Header/Header';
import CustomDrawer from '@/components/CustomDrawer/CustomDrawer';

import Routes from '@/navigations/Routes';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hooks';

import { categoriesThunk } from '@/redux/thunk/categoriesThunk';

import { Category } from '@/types';

import ItemCategories from '@/components/ListItems/ItemCategories/ItemCategories';

import styles from './styles';
import COLORS from '@/constants/Colors';

const Categories = () => {
  const dispatch = useAppDispatch();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const categories = useSelector(
    (state: RootState) => state.categories.categories,
  );

  const page = useSelector((state: RootState) => state.categories.page);

  const hasNextPage = useSelector(
    (state: RootState) => state.categories.hasNextPage,
  );

  const isLoading = useSelector(
    (state: RootState) => state.categories.isLoading,
  );

  // ==========================================
  // FIRST LOAD
  // ==========================================

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(
        categoriesThunk({
          language: 'English',
          page: 1,
          limit: 10,
        }),
      );
    }
  }, [dispatch, categories.length]);

  const handleLoadMore = async () => {
    if (isLoading || isLoadingMore || !hasNextPage) {
      return;
    }
    const nextPage = page + 1;
    console.log('LOADING CATEGORY PAGE:', nextPage);
    try {
      setIsLoadingMore(true);
      const startTime = Date.now();
      await dispatch(
        categoriesThunk({
          language: 'English',
          page: nextPage,
          limit: 10,
        }),
      ).unwrap();

      // Minimum 1.5 second loader
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(1500 - elapsedTime, 0);

      if (remainingTime > 0) {
        await new Promise((resolve: any) => setTimeout(resolve, remainingTime));
      }
    } catch (error) {
      console.log('LOAD MORE CATEGORIES ERROR:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };
  const closeDrawer = () => {
    setDrawerVisible(false);
  };
  const handleSearch = () => {
    navigate(Routes.EXPLORE);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Categories"
        icon="arrow-back-outline"
        onMenuPress={goBack}
        showNotification={false}
        rightIcon="search-outline"
        onRightPress={handleSearch}
      />

      <FlatList<Category>
        data={categories}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <ItemCategories item={item} fullWidth={true} />
          </View>
        )}
        contentContainerStyle={styles.categoryList}
        ItemSeparatorComponent={() => <View style={styles.categorySeparator} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={1}
        ListFooterComponent={
          isLoading && page > 1 ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
          ) : undefined
        }
      />

      <CustomDrawer visible={drawerVisible} onClose={closeDrawer} />
    </SafeAreaView>
  );
};

export default Categories;
