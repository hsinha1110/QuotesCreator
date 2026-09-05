import React, {useEffect} from 'react';

import {
  ActivityIndicator,
  FlatList,
  Text,
  View,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import type {AppDispatch, RootState} from '@/redux/store';

import {Quote} from '@/types';

import {latestQuotesThunk} from '@/redux/thunk/latestThunk';

import {DrawerParamList} from '@/navigations/types';

import {DrawerNavigationProp} from '@react-navigation/drawer';

import Routes from '@/navigations/Routes';

import createStyles from './styles';

import {THEME_COLORS} from '@/constants/Colors';

import Header from '@/components/Header/Header';

import {navigate} from '@/utils/NavigationUtils';

import {SafeAreaView} from 'react-native-safe-area-context';

import ItemLatestQuotes from '@/components/ListItems/ItemLatestQuotes/ItemLatestQuotes';

type LatestNavigationProp =
  DrawerNavigationProp<DrawerParamList>;

const Latest = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigation =
    useNavigation<LatestNavigationProp>();

  // =========================
  // THEME
  // =========================

  const themeMode = useSelector(
    (state: RootState) => state.theme.mode,
  );

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  // =========================
  // LATEST STATE
  // =========================

  const {
    quotes,
    isLoading,
    page,
    totalPages,
  } = useSelector(
    (state: RootState) => state.latestQuotes,
  );

  // =========================
  // SELECTED LANGUAGE
  // =========================

  const language = useSelector(
    (state: RootState) => state.language.language,
  );

  console.log(
    '🌐 LATEST LANGUAGE:',
    language,
  );

  // =========================
  // FETCH LATEST QUOTES
  // =========================

  useEffect(() => {
    console.log(
      '🔥 FETCH LATEST QUOTES',
    );

    console.log(
      '🌐 LANGUAGE:',
      language,
    );

    dispatch(
      latestQuotesThunk({
        language,
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch, language]);

  // =========================
  // BACK
  // =========================

  const handleGoBack = () => {
    navigate(Routes.CATEGORIES);
  };

  // =========================
  // SEARCH
  // =========================

  const handleSearch = () => {
    console.log(
      '🔍 SEARCH LATEST',
    );
  };

  // =========================
  // QUOTE DETAILS
  // =========================

  const handleQuotePress = (
    item: Quote,
    index: number,
  ) => {
    navigation.navigate(
      Routes.QUOTES_DETAILS,
      {
        item,
        quotes,
        index,
      },
    );
  };

  // =========================
  // LOAD MORE
  // =========================

  const handleLoadMore = () => {
    if (isLoading) {
      return;
    }

    if (!quotes.length) {
      return;
    }

    if (page >= totalPages) {
      return;
    }

    const nextPage = page + 1;

    console.log(
      '📄 LOAD MORE LATEST',
    );

    console.log(
      '🌐 LANGUAGE:',
      language,
    );

    console.log(
      '📄 PAGE:',
      nextPage,
    );

    dispatch(
      latestQuotesThunk({
        language,
        page: nextPage,
        limit: 10,
      }),
    );
  };

  // =========================
  // FOOTER LOADER
  // =========================

  const renderFooter = () => {
    if (
      !isLoading ||
      quotes.length === 0
    ) {
      return null;
    }

    return (
      <View
        style={styles.footerLoader}>
        <ActivityIndicator
          size="large"
          color={colors.accent}
        />
      </View>
    );
  };

  // =========================
  // HEADER
  // =========================

  const headerTitle =
    language === 'Hindi'
      ? 'नवीनतम'
      : 'Latest';

  // =========================
  // FIRST LOADING
  // =========================

  if (
    isLoading &&
    quotes.length === 0
  ) {
    return (
      <SafeAreaView
        style={styles.container}>
        <Header
          title={headerTitle}
          icon="chevron-back"
          onMenuPress={handleGoBack}
          showNotification={false}
          rightIcon="search"
          onRightPress={handleSearch}
        />

        <View
          style={
            styles.loadingContainer
          }>
          <ActivityIndicator
            size="large"
            color={colors.accent}
          />
        </View>
      </SafeAreaView>
    );
  }

  // =========================
  // EMPTY
  // =========================

  if (
    !isLoading &&
    quotes.length === 0
  ) {
    return (
      <SafeAreaView
        style={styles.container}>
        <Header
          title={headerTitle}
          icon="chevron-back"
          onMenuPress={handleGoBack}
          showNotification={false}
          rightIcon="search"
          onRightPress={handleSearch}
        />

        <View
          style={
            styles.emptyContainer
          }>
          <Text
            style={styles.emptyText}>
            {language === 'Hindi'
              ? 'कोई नवीनतम कोट्स नहीं मिले'
              : 'No latest quotes found'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <SafeAreaView
      style={styles.container}>
      
      {/* HEADER */}

      <Header
        title={headerTitle}
        icon="chevron-back"
        onMenuPress={handleGoBack}
        showNotification={false}
        rightIcon="search"
        onRightPress={handleSearch}
      />

      {/* LIST */}

      <FlatList
        key={language}
        data={quotes}
        keyExtractor={item =>
          item._id
        }
        renderItem={({
          item,
          index,
        }) => (
          <ItemLatestQuotes
            item={item}
            fullWidth
            onPress={() =>
              handleQuotePress(
                item,
                index,
              )
            }
          />
        )}
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.latestList
        }
        onEndReached={
          handleLoadMore
        }
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          renderFooter
        }
      />
    </SafeAreaView>
  );
};

export default Latest;