import React, {useEffect, useMemo} from 'react';

import {
  ActivityIndicator,
  FlatList,
  View,
} from 'react-native';

import {SafeAreaView} from 'react-native-safe-area-context';

import {useDispatch, useSelector} from 'react-redux';

import {useNavigation} from '@react-navigation/native';

import {DrawerNavigationProp} from '@react-navigation/drawer';

import Header from '@/components/Header/Header';

import {AppDispatch, RootState} from '@/redux/store';

import {popularQuotesThunk} from '@/redux/thunk/popularThunk';

import {DrawerParamList} from '@/navigations/types';

import Routes from '@/navigations/Routes';

import {Quote} from '@/types';

import {
  THEME_COLORS,
} from '@/constants/Colors';

import createStyles from './styles';

import ItemPopular from '@/components/ListItems/ItemPopular/ItemPopular';

type PopularNavigationProp =
  DrawerNavigationProp<DrawerParamList>;

type LocalizedQuote = Quote & {
  displayLanguage?: string;
  displayText?: string;
};

const Popular = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigation =
    useNavigation<PopularNavigationProp>();

  // ==========================================
  // THEME
  // ==========================================

  const themeMode = useSelector(
    (state: RootState) => state.theme.mode,
  );

  const colors =
    THEME_COLORS[themeMode];

  const styles =
    createStyles(colors);

  // ==========================================
  // LANGUAGE
  // ==========================================

  const language = useSelector(
    (state: RootState) =>
      state.language.language,
  );

  const isHindi =
    language === 'Hindi';

  // ==========================================
  // POPULAR STATE
  // ==========================================

  const {
    quotes,
    isLoading,
    page,
    totalPages,
  } = useSelector(
    (state: RootState) =>
      state.popularQuotes,
  );

  // ==========================================
  // LOCALIZED TEXT
  // ==========================================

  const screenTitle = isHindi
    ? 'लोकप्रिय विचार'
    : 'Popular Quotes';

  // ==========================================
  // REMOVE DUPLICATE QUOTES
  // ==========================================

  const uniqueQuotes = useMemo(() => {
    const seen = new Set<string>();

    return quotes.filter(item => {
      if (!item?._id) {
        return false;
      }

      if (seen.has(item._id)) {
        return false;
      }

      seen.add(item._id);

      return true;
    });
  }, [quotes]);

  // ==========================================
  // ONLY CURRENT LANGUAGE
  // ==========================================

  const displayQuotes = useMemo(() => {
    const localizedQuotes =
      (
        uniqueQuotes as LocalizedQuote[]
      ).filter(
        item =>
          !item.displayLanguage ||
          item.displayLanguage ===
            language,
      );

    return localizedQuotes;
  }, [
    uniqueQuotes,
    language,
  ]);

  // ==========================================
  // FETCH PAGE 1
  // ==========================================

  useEffect(() => {
    console.log(
      '🌐 POPULAR SCREEN LANGUAGE:',
      language,
    );

    dispatch(
      popularQuotesThunk({
        language,
        page: 1,
        limit: 10,
      }),
    );
  }, [
    dispatch,
    language,
  ]);

  // ==========================================
  // BACK
  // ==========================================

  const handleGoBack = () => {
    navigation.goBack();
  };

  // ==========================================
  // SEARCH
  // ==========================================

  const handleSearch = () => {
    console.log(
      '🔍 POPULAR SEARCH:',
      language,
    );
  };

  // ==========================================
  // QUOTE PRESS
  // ==========================================

  const handleQuotePress = (
    item: Quote,
    index: number,
  ) => {
    navigation.navigate(
      Routes.QUOTES_DETAILS,
      {
        item,
        quotes: displayQuotes,
        index,
      },
    );
  };

  // ==========================================
  // LOAD MORE
  // ==========================================

  const handleLoadMore = () => {
    if (isLoading) {
      return;
    }

    if (page >= totalPages) {
      return;
    }

    const nextPage =
      page + 1;

    console.log(
      '📄 POPULAR NEXT PAGE:',
      nextPage,
    );

    console.log(
      '🌐 POPULAR LANGUAGE:',
      language,
    );

    dispatch(
      popularQuotesThunk({
        language,
        page: nextPage,
        limit: 10,
      }),
    );
  };

  // ==========================================
  // FOOTER LOADER
  // ==========================================

  const renderFooter = () => {
    if (
      !isLoading ||
      displayQuotes.length === 0
    ) {
      return null;
    }

    return (
      <View
        style={
          styles.footerLoader
        }>
        <ActivityIndicator
          size="small"
          color={colors.accent}
        />
      </View>
    );
  };

  // ==========================================
  // INITIAL LOADING
  // ==========================================

  if (
    isLoading &&
    displayQuotes.length === 0
  ) {
    return (
      <SafeAreaView
        style={styles.container}>
        <Header
          title={screenTitle}
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

  // ==========================================
  // UI
  // ==========================================

  return (
    <SafeAreaView
      style={styles.container}>
      <Header
        title={screenTitle}
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

      <FlatList<LocalizedQuote>
        data={displayQuotes}
        key={language}
        keyExtractor={item =>
          item._id
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.listContainer
        }
        renderItem={({
          item,
          index,
        }) => (
          <ItemPopular
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
        ItemSeparatorComponent={() => (
          <View
            style={
              styles.listSeparator
            }
          />
        )}
        onEndReached={
          handleLoadMore
        }
        onEndReachedThreshold={
          0.5
        }
        ListFooterComponent={
          renderFooter
        }
      />
    </SafeAreaView>
  );
};

export default Popular;