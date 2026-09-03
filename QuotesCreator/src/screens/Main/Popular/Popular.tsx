import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import Header from '@/components/Header/Header';

import { AppDispatch, RootState } from '@/redux/store';
import { popularQuotesThunk } from '@/redux/thunk/popularThunk';

import { DrawerParamList } from '@/navigations/types';
import Routes from '@/navigations/Routes';
import { Quote } from '@/types';

import COLORS from '@/constants/Colors';
import styles from './styles';
import ItemPopular from '@/components/ListItems/ItemPopular/ItemPopular';

type PopularNavigationProp = DrawerNavigationProp<DrawerParamList>;

const Popular = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigation = useNavigation<PopularNavigationProp>();

  const { quotes, isLoading, page, totalPages } = useSelector(
    (state: RootState) => state.popularQuotes,
  );

  // ==========================================
  // FETCH PAGE 1
  // ==========================================

  useEffect(() => {
    dispatch(
      popularQuotesThunk({
        language: 'English',
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch]);

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
    console.log('Search pressed');
  };

  // ==========================================
  // QUOTE PRESS
  // ==========================================

  const handleQuotePress = (item: Quote, index: number) => {
    navigation.navigate(Routes.QUOTES_DETAILS, {
      item,
      quotes,
      index,
    });
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

    const nextPage = page + 1;

    dispatch(
      popularQuotesThunk({
        language: 'English',
        page: nextPage,
        limit: 10,
      }),
    );
  };

  // ==========================================
  // FOOTER LOADER
  // ==========================================

  const renderFooter = () => {
    if (!isLoading || quotes.length === 0) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={COLORS.accent} />
      </View>
    );
  };

  // ==========================================
  // INITIAL LOADING
  // ==========================================

  if (isLoading && quotes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title="Popular"
          icon="chevron-back"
          onMenuPress={handleGoBack}
          showNotification={false}
          rightIcon="search"
          onRightPress={handleSearch}
        />

        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      </SafeAreaView>
    );
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Popular Quotes"
        icon="chevron-back"
        onMenuPress={handleGoBack}
        showNotification={false}
        rightIcon="search"
        onRightPress={handleSearch}
      />

      <FlatList
        data={quotes}
        keyExtractor={item => item._id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item, index }) => (
          <ItemPopular
            item={item}
            fullWidth
            onPress={() => handleQuotePress(item, index)}
          />
        )}
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />
    </SafeAreaView>
  );
};

export default Popular;
