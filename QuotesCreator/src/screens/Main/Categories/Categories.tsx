import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { goBack, navigate } from '@/utils/NavigationUtils';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hooks';
import { categoriesThunk } from '@/redux/thunk/categoriesThunk';
import { Category } from '@/types';
import ItemCategories from '@/components/ListItems/ItemCategories/ItemCategories';
import styles from './styles';
import COLORS from '@/constants/Colors';
import Header from '@/components/Header/Header';
import CustomDrawer from '@/components/CustomDrawer/CustomDrawer';

import Routes from '@/navigations/Routes';
const Categories = () => {
  const dispatch = useAppDispatch();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const loadingRef = useRef(false);
  const { categories, page, hasNextPage, isLoading, language } = useSelector(
    (state: RootState) => state.categories,
  );

  useEffect(() => {
    if (categories.length === 0) {
      console.log('LOADING FIRST PAGE');
      dispatch(
        categoriesThunk({
          language,
          page: 1,
          limit: 10,
        }),
      );
    }
  }, [dispatch, categories.length, language]);

  const handleLoadMore = async () => {
    if (loadingRef.current || isLoading || !hasNextPage) {
      return;
    }
    const nextPage = page + 1;
    console.log('CALLING CATEGORY PAGE:', nextPage);

    try {
      loadingRef.current = true;
      setIsLoadingMore(true);

      const response = await dispatch(
        categoriesThunk({
          language,
          page: nextPage,
          limit: 10,
        }),
      ).unwrap();

      console.log('PAGE RESPONSE:', response);
    } catch (error) {
      console.log('LOAD MORE CATEGORIES ERROR:', error);
    } finally {
      loadingRef.current = false;
      setIsLoadingMore(false);

      console.log('LOAD MORE FINISHED');
    }
  };
  const handleSubCategories = (category: Category) => {
    console.log('SELECTED CATEGORY:', category);

    navigate(Routes.SUB_CATEGORIES, {
      categoryId: category._id,
      categoryName: category.displayName,
    });
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
        icon="chevron-back"
        onMenuPress={goBack}
        showNotification={false}
        rightIcon="search"
        onRightPress={handleSearch}
      />

      <FlatList<Category>
        data={categories}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item._id}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <ItemCategories
              item={item}
              fullWidth={true}
              onPress={() => handleSubCategories(item)}
            />
          </View>
        )}
        contentContainerStyle={styles.categoryList}
        ItemSeparatorComponent={() => <View style={styles.categorySeparator} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator size="large" color={COLORS.accent} />
            </View>
          ) : (
            <View
              style={{
                height: 30,
              }}
            />
          )
        }
      />

      <CustomDrawer visible={drawerVisible} onClose={closeDrawer} />
    </SafeAreaView>
  );
};

export default Categories;
