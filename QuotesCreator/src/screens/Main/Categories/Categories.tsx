import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, FlatList, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';

import {goBack, navigate} from '@/utils/NavigationUtils';
import {RootState} from '@/redux/store';
import {useAppDispatch} from '@/redux/hooks';
import {categoriesThunk} from '@/redux/thunk/categoriesThunk';

import {Category} from '@/types';

import ItemCategories from '@/components/ListItems/ItemCategories/ItemCategories';
import Header from '@/components/Header/Header';
import CustomDrawer from '@/components/CustomDrawer/CustomDrawer';

import Routes from '@/navigations/Routes';

import {THEME_COLORS} from '@/constants/Colors';

import createStyles from './styles';

const Categories = () => {
  const dispatch = useAppDispatch();

  // =====================================================
  // STATE
  // =====================================================

  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  const loadingRef = useRef(false);

  // =====================================================
  // CATEGORIES
  // =====================================================

  const {categories, page, hasNextPage, isLoading} = useSelector(
    (state: RootState) => state.categories,
  );

  // =====================================================
  // LANGUAGE
  // =====================================================

  const language = useSelector(
    (state: RootState) => state.language.language,
  );

  // =====================================================
  // THEME
  // =====================================================

  const themeMode = useSelector(
    (state: RootState) => state.theme.mode,
  );

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  // =====================================================
  // LOAD CATEGORIES BASED ON LANGUAGE
  // =====================================================

  useEffect(() => {
    console.log('🌐 SELECTED LANGUAGE:', language);

    loadingRef.current = false;

    dispatch(
      categoriesThunk({
        language,
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch, language]);

  // =====================================================
  // LOAD MORE
  // =====================================================

  const handleLoadMore = async () => {
    if (
      loadingRef.current ||
      isLoading ||
      isLoadingMore ||
      !hasNextPage
    ) {
      return;
    }

    const nextPage = page + 1;

    console.log('📄 CALLING CATEGORY PAGE:', nextPage);
    console.log('🌐 LANGUAGE:', language);

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

      console.log('✅ PAGE RESPONSE:', response);
    } catch (error) {
      console.log('❌ LOAD MORE CATEGORIES ERROR:', error);
    } finally {
      loadingRef.current = false;
      setIsLoadingMore(false);

      console.log('✅ LOAD MORE FINISHED');
    }
  };

  // =====================================================
  // SUBCATEGORIES
  // =====================================================

  const handleSubCategories = (category: Category) => {
    console.log('SELECTED CATEGORY:', category);
    console.log('🌐 LANGUAGE:', language);

    navigate(Routes.SUB_CATEGORIES, {
      categoryId: category._id,
      categoryName: category.displayName,
      language,
    });
  };

  // =====================================================
  // DRAWER
  // =====================================================

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const handleSearch = () => {
    navigate(Routes.EXPLORE);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={language === 'Hindi' ? 'श्रेणियाँ' : 'Categories'}
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
        renderItem={({item}) => (
          <View style={styles.categoryItem}>
            <ItemCategories
              item={item}
              fullWidth={true}
              onPress={() => handleSubCategories(item)}
            />
          </View>
        )}
        contentContainerStyle={styles.categoryList}
        ItemSeparatorComponent={() => (
          <View style={styles.categorySeparator} />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator
                size="large"
                color={colors.accent}
              />
            </View>
          ) : (
            <View style={styles.footerSpace} />
          )
        }
      />

      <CustomDrawer
        visible={drawerVisible}
        onClose={closeDrawer}
      />
    </SafeAreaView>
  );
};

export default Categories;