import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { useRoute } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Header from '@/components/Header/Header';
import Tabs from '@/components/Tabs/Tabs';

import { navigate } from '@/utils/NavigationUtils';
import Routes from '@/navigations/Routes';

import { SubCategoriesRouteProp, SubCategory, Quote } from '@/types';

import { SubCategoriesTabs } from '@/constants/Data';

import styles from './styles';

import { AppDispatch, RootState } from '@/redux/store';

import { subCategoriesThunk } from '@/redux/thunk/subCategoriesThunk';

import { getQuotesAsyncThunk } from '@/redux/thunk/quotesThunk';
import EmptyState from '@/components/EmptyState/EmptyState';
import Quotes from '../Quotes/Quotes';
import IMAGES from '@/assets/images';
import COLORS from '@/constants/Colors';

const SubCategories = () => {
  const dispatch = useDispatch<AppDispatch>();

  const route = useRoute<SubCategoriesRouteProp>();

  const { categoryId, categoryName } = route.params;

  // ==================================================
  // TAB
  // ==================================================

  const [activeTab, setActiveTab] = useState('SubCategories');
  // ==================================================
  // SELECTED SUBCATEGORY
  // ==================================================

  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
    string | null
  >(null);

  // ==================================================
  // SUBCATEGORIES STATE
  // ==================================================

  const {
    subcategories,
    page: subcategoryPage,
    totalPages: subcategoryTotalPages,
    loading: subcategoriesLoading,
  } = useSelector((state: RootState) => state.subCategories);

  // ==================================================
  // QUOTES STATE
  // ==================================================

  const {
    quotes,
    page: quotePage,
    totalPages: quoteTotalPages,
    loading: quotesLoading,
  } = useSelector((state: RootState) => state.quotes);

  // ==================================================
  // LOAD MORE STATES
  // ==================================================

  const [loadingMoreSubcategories, setLoadingMoreSubcategories] =
    useState(false);

  const [loadingMoreQuotes, setLoadingMoreQuotes] = useState(false);

  // ==================================================
  // DEBUG
  // ==================================================

  console.log('CATEGORY ID:', categoryId);

  console.log('SUBCATEGORY PAGE:', subcategoryPage);

  console.log('SUBCATEGORY TOTAL PAGES:', subcategoryTotalPages);

  console.log('QUOTE PAGE:', quotePage);

  console.log('QUOTE TOTAL PAGES:', quoteTotalPages);

  console.log('TOTAL QUOTES IN REDUX:', quotes.length);

  console.log('SELECTED SUBCATEGORY:', selectedSubcategoryId);

  // ==================================================
  // FETCH SUBCATEGORIES PAGE 1
  // ==================================================

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    dispatch(
      subCategoriesThunk({
        categoryId,
        page: 1,
        limit: 10,
        language: 'English',
      }),
    );
  }, [categoryId, dispatch]);

  // ==================================================
  // LOAD MORE SUBCATEGORIES
  // ==================================================

  const loadMoreSubcategories = async () => {
    if (subcategoriesLoading || loadingMoreSubcategories) {
      return;
    }

    if (subcategoryPage >= subcategoryTotalPages) {
      return;
    }

    const nextPage = subcategoryPage + 1;

    console.log('LOADING SUBCATEGORY PAGE:', nextPage);

    try {
      setLoadingMoreSubcategories(true);

      await dispatch(
        subCategoriesThunk({
          categoryId,

          page: nextPage,

          limit: 10,

          language: 'English',
        }),
      ).unwrap();
    } catch (error) {
      console.log('LOAD MORE SUBCATEGORIES ERROR:', error);
    } finally {
      setLoadingMoreSubcategories(false);
    }
  };

  // ==================================================
  // FETCH CATEGORY QUOTES
  // ==================================================

  const fetchCategoryQuotes = async () => {
    if (!categoryId) {
      return;
    }

    // Category quotes = no subcategory
    setSelectedSubcategoryId(null);

    try {
      await dispatch(
        getQuotesAsyncThunk({
          categoryId,

          page: 1,

          limit: 10,

          language: 'English',
        }),
      ).unwrap();
    } catch (error) {
      console.log('CATEGORY QUOTES ERROR:', error);
    }
  };

  // ==================================================
  // LOAD MORE QUOTES
  // ==================================================

  const loadMoreQuotes = async () => {
    console.log('========== LOAD MORE QUOTES ==========');

    console.log('quotesLoading:', quotesLoading);

    console.log('loadingMoreQuotes:', loadingMoreQuotes);

    console.log('quotePage:', quotePage);

    console.log('quoteTotalPages:', quoteTotalPages);

    console.log('quotes.length:', quotes.length);

    console.log('selectedSubcategoryId:', selectedSubcategoryId);

    // ==========================================
    // ALREADY LOADING
    // ==========================================

    if (quotesLoading || loadingMoreQuotes) {
      console.log('RETURN: ALREADY LOADING');

      return;
    }

    // ==========================================
    // NO MORE PAGES
    // ==========================================

    if (quotePage >= quoteTotalPages) {
      console.log('RETURN: NO MORE QUOTE PAGES');

      return;
    }

    const nextPage = quotePage + 1;

    console.log('CALLING QUOTES API PAGE:', nextPage);

    try {
      setLoadingMoreQuotes(true);

      const result = await dispatch(
        getQuotesAsyncThunk({
          categoryId,

          ...(selectedSubcategoryId
            ? {
                subcategoryId: selectedSubcategoryId,
              }
            : {}),

          page: nextPage,

          limit: 10,

          language: 'English',
        }),
      ).unwrap();

      console.log('NEXT PAGE RESPONSE:', result);
    } catch (error) {
      console.log('NEXT PAGE ERROR:', error);
    } finally {
      setLoadingMoreQuotes(false);
    }
  };

  // ==================================================
  // TAB PRESS
  // ==================================================

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);

    if (tabKey === 'Quotes') {
      fetchCategoryQuotes();
    }
  };

  // ==================================================
  // SUBCATEGORY PRESS
  // ==================================================

  const handleSubCategoryPress = (item: SubCategory) => {
    console.log('SUBCATEGORY ID:', item._id);

    console.log('SUBCATEGORY NAME:', item.displayName || item.name);

    // Save subcategory
    setSelectedSubcategoryId(item._id);

    // Fetch page 1
    dispatch(
      getQuotesAsyncThunk({
        categoryId,

        subcategoryId: item._id,

        page: 1,

        limit: 10,

        language: 'English',
      }),
    );

    // Open Quotes tab
    setActiveTab('Quotes');
  };

  // ==================================================
  // SEARCH
  // ==================================================

  const handleSearch = () => {
    console.log('Search pressed');
  };

  // ==================================================
  // BACK
  // ==================================================

  const handleGoBack = () => {
    navigate(Routes.CATEGORIES);
  };

  // ==================================================
  // SUBCATEGORY ITEM
  // ==================================================

  const renderSubCategory = ({ item }: { item: SubCategory }) => {
    return (
      <Pressable
        onPress={() => handleSubCategoryPress(item)}
        style={styles.subCategoryCard}
      >
        <View style={styles.subCategoryContent}>
          <View style={styles.subCategoryTextContainer}>
            <Text style={styles.subCategoryName} numberOfLines={1}>
              {item.displayName || item.name}
            </Text>

            <Text style={styles.subCategoryQuoteCount}>
              {item.quoteCount ?? 0}+ Quotes
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={22} color="#111" />
        </View>
      </Pressable>
    );
  };

  const renderSubcategoryFooter = () => {
    if (!loadingMoreSubcategories) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  // ==================================================
  // INITIAL LOADING
  // ==================================================

  // ==========================================
  // INITIAL LOADING
  // ==========================================

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  };

  // ==========================================
  // BOTTOM PAGINATION LOADING
  // ==========================================

  const renderQuoteFooter = () => {
    if (!loadingMoreQuotes) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.accent} />
      </View>
    );
  };
  // ==================================================
  // UI
  // ==================================================

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}

      <Header
        title={categoryName}
        icon="chevron-back"
        onMenuPress={handleGoBack}
        showNotification={false}
        rightIcon="search"
        onRightPress={handleSearch}
      />

      {/* TABS */}

      <Tabs
        tabs={SubCategoriesTabs}
        activeTab={activeTab}
        onTabPress={handleTabPress}
      />

      {/* =================================================
          SUBCATEGORIES TAB
          ================================================= */}

      {activeTab === 'SubCategories' && (
        <View style={{ flex: 1 }}>
          {subcategoriesLoading && subcategoryPage === 1 ? (
            renderLoading()
          ) : (
            <FlatList
              data={subcategories}
              keyExtractor={item => item._id}
              renderItem={renderSubCategory}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContainer}
              onEndReached={loadMoreSubcategories}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderQuoteFooter}
              ListEmptyComponent={
                <EmptyState
                  icon="layers-outline"
                  title="No Subcategories Found!"
                  description={`There are no subcategories available
in this category yet.`}
                />
              }
            />
          )}
        </View>
      )}

      {/* =================================================
          QUOTES TAB
          ================================================= */}

      {activeTab === 'Quotes' && (
        <Quotes
          type="subcategory"
          categoryId={categoryId}
          subcategoryId={selectedSubcategoryId}
        />
      )}
    </SafeAreaView>
  );
};

export default SubCategories;
