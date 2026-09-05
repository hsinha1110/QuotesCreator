import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {useRoute} from '@react-navigation/native';

import {useDispatch, useSelector} from 'react-redux';

import Ionicons from 'react-native-vector-icons/Ionicons';

import Header from '@/components/Header/Header';
import Tabs from '@/components/Tabs/Tabs';

import {navigate} from '@/utils/NavigationUtils';
import Routes from '@/navigations/Routes';

import {
  SubCategoriesRouteProp,
  SubCategory,
} from '@/types';

import styles from './styles';

import {
  AppDispatch,
  RootState,
} from '@/redux/store';

import {
  subCategoriesThunk,
} from '@/redux/thunk/subCategoriesThunk';

import EmptyState from '@/components/EmptyState/EmptyState';

import Quotes from '../Quotes/Quotes';

import COLORS from '@/constants/Colors';

import {
  getQuotesThunk,
} from '@/redux/thunk/getQuotesThunk';

type TabKey = 'SubCategories' | 'Quotes';

const SubCategories = () => {
  const dispatch = useDispatch<AppDispatch>();

  const route =
    useRoute<SubCategoriesRouteProp>();

  const {
    categoryId,
    categoryName,
  } = route.params;

  // ==================================================
  // LANGUAGE
  // ==================================================

  const language = useSelector(
    (state: RootState) =>
      state.language.language,
  );

  const isHindi = language === 'Hindi';

  // ==================================================
  // THEME
  // ==================================================

  const themeMode = useSelector(
    (state: RootState) =>
      state.theme.mode,
  );

  const isDark = themeMode === 'dark';

  // ==================================================
  // THEME COLORS
  // ==================================================

  const themeColors = {
    background: isDark
      ? '#121212'
      : COLORS.white,

    card: isDark
      ? '#1E1E1E'
      : COLORS.white,

    textPrimary: isDark
      ? '#FFFFFF'
      : '#171717',

    textSecondary: isDark
      ? '#BDBDBD'
      : '#777777',

    border: isDark
      ? '#303030'
      : '#EEEEEE',

    icon: isDark
      ? '#FFFFFF'
      : '#111111',

    emptyBackground: isDark
      ? '#1E1E1E'
      : COLORS.white,
  };

  // ==================================================
  // LOCALIZED TEXT
  // ==================================================

  const texts = useMemo(
    () => ({
      subCategories: isHindi
        ? 'उपश्रेणियाँ'
        : 'Subcategories',

      quotes: isHindi
        ? 'विचार'
        : 'Quotes',

      noSubcategories: isHindi
        ? 'कोई उपश्रेणी नहीं मिली!'
        : 'No Subcategories Found!',

      noSubcategoriesDescription: isHindi
        ? 'इस श्रेणी में अभी कोई उपश्रेणी उपलब्ध नहीं है।'
        : 'There are no subcategories available in this category yet.',

      quoteWord: isHindi
        ? 'विचार'
        : 'Quotes',
    }),
    [isHindi],
  );

  // ==================================================
  // LOCALIZED TABS
  // ==================================================

  const localizedTabs = useMemo(
    () => [
      {
        key: 'SubCategories',
        title: texts.subCategories,
      },
      {
        key: 'Quotes',
        title: texts.quotes,
      },
    ],
    [texts],
  );

  // ==================================================
  // ACTIVE TAB
  // ==================================================

  const [
    activeTab,
    setActiveTab,
  ] = useState<TabKey>(
    'SubCategories',
  );

  // ==================================================
  // SELECTED SUBCATEGORY
  // ==================================================

  const [
    selectedSubcategoryId,
    setSelectedSubcategoryId,
  ] = useState<string | null>(null);

  // ==================================================
  // SUBCATEGORY REDUX STATE
  // ==================================================

  const {
    subcategories,
    page: subcategoryPage,
    totalPages: subcategoryTotalPages,
    loading: subcategoriesLoading,
  } = useSelector(
    (state: RootState) =>
      state.subCategories,
  );

  // ==================================================
  // QUOTES REDUX STATE
  // ==================================================

  const {
    quotes,
    page: quotePage,
    totalPages: quoteTotalPages,
    loading: quotesLoading,
  } = useSelector(
    (state: RootState) =>
      state.quotes,
  );

  // ==================================================
  // LOAD MORE STATES
  // ==================================================

  const [
    loadingMoreSubcategories,
    setLoadingMoreSubcategories,
  ] = useState(false);

  const [
    loadingMoreQuotes,
    setLoadingMoreQuotes,
  ] = useState(false);

  // ==================================================
  // UNIQUE SUBCATEGORIES
  // ==================================================

  const uniqueSubcategories =
    useMemo(() => {
      const seen =
        new Set<string>();

      return subcategories.filter(
        item => {
          if (!item?._id) {
            return false;
          }

          // Backend displayLanguage check
          if (
            item.displayLanguage &&
            item.displayLanguage !== language
          ) {
            return false;
          }

          if (seen.has(item._id)) {
            return false;
          }

          seen.add(item._id);

          return true;
        },
      );
    }, [
      subcategories,
      language,
    ]);

  // ==================================================
  // UNIQUE QUOTES
  // ==================================================

  const uniqueQuotes =
    useMemo(() => {
      const seen =
        new Set<string>();

      return quotes.filter(
        item => {
          if (!item?._id) {
            return false;
          }

          if (
            item.displayLanguage &&
            item.displayLanguage !== language
          ) {
            return false;
          }

          if (seen.has(item._id)) {
            return false;
          }

          seen.add(item._id);

          return true;
        },
      );
    }, [
      quotes,
      language,
    ]);

  // ==================================================
  // DEBUG
  // ==================================================

  console.log(
    '======================================',
  );

  console.log(
    '🌐 SUBCATEGORIES CURRENT LANGUAGE:',
    language,
  );

  console.log(
    '🎨 CURRENT THEME:',
    themeMode,
  );

  console.log(
    '📁 CATEGORY ID:',
    categoryId,
  );

  console.log(
    '📂 SELECTED SUBCATEGORY:',
    selectedSubcategoryId,
  );

  console.log(
    '📊 SUBCATEGORIES COUNT:',
    uniqueSubcategories.length,
  );

  console.log(
    '💬 QUOTES COUNT:',
    uniqueQuotes.length,
  );

  console.log(
    '======================================',
  );

  // ==================================================
  // FETCH SUBCATEGORIES
  // ==================================================

  useEffect(() => {
    if (!categoryId) {
      return;
    }

    let cancelled = false;

    const fetchSubcategories =
      async () => {
        try {
          console.log(
            '🔥 FETCH SUBCATEGORIES',
          );

          console.log(
            '🌐 LANGUAGE:',
            language,
          );

          const response =
            await dispatch(
              subCategoriesThunk({
                categoryId,
                page: 1,
                limit: 10,
                language,
              }),
            ).unwrap();

          if (!cancelled) {
            console.log(
              '✅ SUBCATEGORY RESPONSE:',
              JSON.stringify(
                response,
                null,
                2,
              ),
            );
          }
        } catch (error) {
          if (!cancelled) {
            console.log(
              '❌ SUBCATEGORY ERROR:',
              error,
            );
          }
        }
      };

    fetchSubcategories();

    return () => {
      cancelled = true;
    };
  }, [
    categoryId,
    dispatch,
    language,
  ]);

  // ==================================================
  // RESET WHEN LANGUAGE CHANGES
  // ==================================================

  useEffect(() => {
    console.log(
      '🔄 LANGUAGE CHANGED:',
      language,
    );

    setSelectedSubcategoryId(
      null,
    );

    setActiveTab(
      'SubCategories',
    );

    setLoadingMoreSubcategories(
      false,
    );

    setLoadingMoreQuotes(
      false,
    );
  }, [language]);

  // ==================================================
  // LOAD MORE SUBCATEGORIES
  // ==================================================

  const loadMoreSubcategories =
    async () => {
      if (
        subcategoriesLoading ||
        loadingMoreSubcategories
      ) {
        return;
      }

      if (
        !subcategoryTotalPages ||
        subcategoryPage >=
          subcategoryTotalPages
      ) {
        return;
      }

      const nextPage =
        subcategoryPage + 1;

      console.log(
        '🔥 LOADING SUBCATEGORY PAGE:',
        nextPage,
      );

      try {
        setLoadingMoreSubcategories(
          true,
        );

        await dispatch(
          subCategoriesThunk({
            categoryId,
            page: nextPage,
            limit: 10,
            language,
          }),
        ).unwrap();
      } catch (error) {
        console.log(
          '❌ LOAD MORE SUBCATEGORIES ERROR:',
          error,
        );
      } finally {
        setLoadingMoreSubcategories(
          false,
        );
      }
    };

  // ==================================================
  // FETCH CATEGORY QUOTES
  // ==================================================

  const fetchCategoryQuotes =
    async () => {
      if (!categoryId) {
        return;
      }

      console.log(
        '🔥 FETCH CATEGORY QUOTES',
      );

      console.log(
        '🌐 QUOTE LANGUAGE:',
        language,
      );

      try {
        const response =
          await dispatch(
            getQuotesThunk({
              categoryId,
              page: 1,
              limit: 10,
              language,
            }),
          ).unwrap();

        console.log(
          '✅ CATEGORY QUOTES RESPONSE:',
          JSON.stringify(
            response,
            null,
            2,
          ),
        );
      } catch (error) {
        console.log(
          '❌ CATEGORY QUOTES ERROR:',
          error,
        );
      }
    };

  // ==================================================
  // LOAD MORE QUOTES
  // ==================================================

  const loadMoreQuotes =
    async () => {
      if (
        quotesLoading ||
        loadingMoreQuotes
      ) {
        return;
      }

      if (
        !quoteTotalPages ||
        quotePage >= quoteTotalPages
      ) {
        return;
      }

      const nextPage =
        quotePage + 1;

      console.log(
        '🔥 CALLING QUOTES API PAGE:',
        nextPage,
      );

      try {
        setLoadingMoreQuotes(
          true,
        );

        await dispatch(
          getQuotesThunk({
            categoryId,

            ...(selectedSubcategoryId
              ? {
                  subcategoryId:
                    selectedSubcategoryId,
                }
              : {}),

            page: nextPage,

            limit: 10,

            language,
          }),
        ).unwrap();
      } catch (error) {
        console.log(
          '❌ NEXT PAGE ERROR:',
          error,
        );
      } finally {
        setLoadingMoreQuotes(
          false,
        );
      }
    };

  // ==================================================
  // TAB PRESS
  // ==================================================

  const handleTabPress = (
    tabKey: string,
  ) => {
    console.log(
      '🔘 TAB PRESSED:',
      tabKey,
    );

    if (
      tabKey !== 'SubCategories' &&
      tabKey !== 'Quotes'
    ) {
      return;
    }

    const selectedTab =
      tabKey as TabKey;

    setActiveTab(
      selectedTab,
    );

    if (
      selectedTab === 'Quotes'
    ) {
      fetchCategoryQuotes();
    }
  };

  // ==================================================
  // SUBCATEGORY PRESS
  // ==================================================

  const handleSubCategoryPress =
    (item: SubCategory) => {
      if (!item?._id) {
        return;
      }

      console.log(
        '📂 SUBCATEGORY ID:',
        item._id,
      );

      console.log(
        '📂 SUBCATEGORY NAME:',
        item.displayName ||
          item.name,
      );

      console.log(
        '🌐 LANGUAGE:',
        language,
      );

      setSelectedSubcategoryId(
        item._id,
      );

      setActiveTab(
        'Quotes',
      );

      dispatch(
        getQuotesThunk({
          categoryId,
          subcategoryId:
            item._id,
          page: 1,
          limit: 10,
          language,
        }),
      )
        .unwrap()
        .then(
          (response: any) => {
            console.log(
              '✅ SUBCATEGORY QUOTES RESPONSE:',
              JSON.stringify(
                response,
                null,
                2,
              ),
            );
          },
        )
        .catch(
          (error: any) => {
            console.log(
              '❌ SUBCATEGORY QUOTES ERROR:',
              error,
            );
          },
        );
    };

  // ==================================================
  // SEARCH
  // ==================================================

  const handleSearch = () => {
    console.log(
      '🔍 SEARCH LANGUAGE:',
      language,
    );
  };

  // ==================================================
  // BACK
  // ==================================================

  const handleGoBack = () => {
    navigate(
      Routes.CATEGORIES,
    );
  };

  // ==================================================
  // SUBCATEGORY ITEM
  // ==================================================

  const renderSubCategory = ({
    item,
  }: {
    item: SubCategory;
  }) => {
    return (
      <Pressable
        onPress={() =>
          handleSubCategoryPress(
            item,
          )
        }
        style={[
          styles.subCategoryCard,
          {
            backgroundColor:
              themeColors.card,

            borderColor:
              themeColors.border,
          },
        ]}
        android_ripple={{
          color:
            themeColors.border,
        }}
      >
        <View
          style={
            styles.subCategoryContent
          }
        >
          <View
            style={
              styles.subCategoryTextContainer
            }
          >
            <Text
              style={[
                styles.subCategoryName,
                {
                  color:
                    themeColors.textPrimary,
                },
              ]}
              numberOfLines={1}
            >
              {item.displayName ||
                item.name}
            </Text>

            <Text
              style={[
                styles.subCategoryQuoteCount,
                {
                  color:
                    themeColors.textSecondary,
                },
              ]}
            >
              {item.quoteCount ?? 0} +{' '}
              {texts.quoteWord}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={22}
            color={themeColors.icon}
          />
        </View>
      </Pressable>
    );
  };

  // ==================================================
  // SUBCATEGORY FOOTER
  // ==================================================

  const renderSubcategoryFooter =
    () => {
      if (
        !loadingMoreSubcategories
      ) {
        return null;
      }

      return (
        <View
          style={
            styles.footerLoader
          }
        >
          <ActivityIndicator
            size="small"
            color={COLORS.accent}
          />
        </View>
      );
    };

  // ==================================================
  // QUOTE FOOTER
  // ==================================================

  const renderQuoteFooter =
    () => {
      if (!loadingMoreQuotes) {
        return null;
      }

      return (
        <View
          style={
            styles.footerLoader
          }
        >
          <ActivityIndicator
            size="small"
            color={COLORS.accent}
          />
        </View>
      );
    };

  // ==================================================
  // LOADING
  // ==================================================

  const renderLoading = () => {
    return (
      <View
        style={[
          styles.loadingContainer,
          {
            backgroundColor:
              themeColors.background,
          },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={COLORS.accent}
        />
      </View>
    );
  };

  // ==================================================
  // UI
  // ==================================================

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            themeColors.background,
        },
      ]}
    >
      {/* ==============================================
          HEADER
      ============================================== */}

      <Header
        title={categoryName}
        icon="chevron-back"
        onMenuPress={
          handleGoBack
        }
        showNotification={
          false
        }
        rightIcon="search"
        onRightPress={
          handleSearch
        }
      />

      {/* ==============================================
          TABS
      ============================================== */}

      <Tabs
        tabs={localizedTabs}
        activeTab={activeTab}
        onTabPress={
          handleTabPress
        }
      />

      {/* ==============================================
          SUBCATEGORIES TAB
      ============================================== */}

      {activeTab ===
        'SubCategories' && (
        <View
          style={[
            styles.flexContainer,
            {
              backgroundColor:
                themeColors.background,
            },
          ]}
        >
          {subcategoriesLoading &&
          subcategoryPage === 1 ? (
            renderLoading()
          ) : (
            <FlatList
              key={`subcategories-${language}`}
              data={
                uniqueSubcategories
              }
              keyExtractor={item =>
                item._id
              }
              renderItem={
                renderSubCategory
              }
              showsVerticalScrollIndicator={
                false
              }
              contentContainerStyle={[
                styles.listContainer,
                {
                  backgroundColor:
                    themeColors.background,
                },
              ]}
              onEndReached={
                loadMoreSubcategories
              }
              onEndReachedThreshold={
                0.5
              }
              ListFooterComponent={
                renderSubcategoryFooter
              }
              ListEmptyComponent={
                <View
                  style={[
                    styles.emptyContainer,
                    {
                      backgroundColor:
                        themeColors.emptyBackground,
                    },
                  ]}
                >
                  <EmptyState
                    icon="layers-outline"
                    title={
                      texts.noSubcategories
                    }
                    description={
                      texts.noSubcategoriesDescription
                    }
                  />
                </View>
              }
            />
          )}
        </View>
      )}

      {/* ==============================================
          QUOTES TAB
      ============================================== */}

      {activeTab === 'Quotes' && (
        <View
          style={[
            styles.flexContainer,
            {
              backgroundColor:
                themeColors.background,
            },
          ]}
        >
          <Quotes
            key={`quotes-${language}-${selectedSubcategoryId || 'category'}`}
            type="subcategory"
            categoryId={
              categoryId
            }
            subcategoryId={
              selectedSubcategoryId
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default SubCategories;