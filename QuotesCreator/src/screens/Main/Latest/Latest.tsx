import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import type { AppDispatch, RootState } from '@/redux/store';

import { Quote } from '@/types';
import { latestQuotesThunk } from '@/redux/thunk/latestThunk';
import { DrawerParamList } from '@/navigations/types';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Routes from '@/navigations/Routes';
import styles from './styles';
import COLORS from '@/constants/Colors';
import Header from '@/components/Header/Header';
import { navigate } from '@/utils/NavigationUtils';
import { SafeAreaView } from 'react-native-safe-area-context';
import ItemLatestQuotes from '@/components/ListItems/ItemLatestQuotes/ItemLatestQuotes';
type LatestNavigationProp = DrawerNavigationProp<DrawerParamList>;
const Latest = () => {
  const dispatch = useDispatch<AppDispatch>();

  const navigation = useNavigation<LatestNavigationProp>();
  const { quotes, isLoading, page, totalPages } = useSelector(
    (state: RootState) => state.latestQuotes,
  );

  // =========================
  // FIRST API CALL
  // =========================

  useEffect(() => {
    dispatch(
      latestQuotesThunk({
        language: 'English',
        page: 1,
        limit: 10,
      }),
    );
  }, [dispatch]);

  // =========================
  // LOAD MORE
  // =========================

  // =========================
  // QUOTE DETAILS
  // =========================

  const handleGoBack = () => {
    navigate(Routes.CATEGORIES);
  };

  const handleSearch = () => {};
  const handleQuotePress = (item: Quote, index: number) => {
    navigation.navigate(Routes.QUOTES_DETAILS, {
      item,
      quotes,
      index,
    });
  };
  // =========================
  // RENDER ITEM
  // =========================
  const handleLoadMore = () => {
    if (isLoading) {
      return;
    }

    if (page >= totalPages) {
      return;
    }

    const nextPage = page + 1;

    dispatch(
      latestQuotesThunk({
        language: 'English',
        page: nextPage,
        limit: 10,
      }),
    );
  };
  const renderItem = ({ item, index }: { item: Quote; index: number }) => {
    return (
      <Pressable
        onPress={() => handleQuotePress(item, index)}
        style={{
          marginHorizontal: 16,
          marginBottom: 14,
          padding: 20,
          borderRadius: 18,
          backgroundColor: '#FFFFFF',

          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3,
          },
          shadowOpacity: 0.08,
          shadowRadius: 8,

          elevation: 3,
        }}
      >
        {/* QUOTE ICON */}

        <Text
          style={{
            fontSize: 38,
            fontWeight: '700',
            color: '#6C35D9',
            lineHeight: 38,
          }}
        >
          “
        </Text>

        {/* TEXT */}

        <Text
          style={{
            fontSize: 17,
            lineHeight: 26,
            fontWeight: '600',
            color: '#222',
            marginTop: 4,
          }}
        >
          {item.text}
        </Text>

        {/* AUTHOR */}

        <Text
          style={{
            fontSize: 14,
            color: '#666',
            marginTop: 12,
          }}
        >
          — {item.author || 'Unknown'}
        </Text>

        {/* ACTIONS */}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 16,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              color: '#666',
            }}
          >
            ♡ {item.likes || 0}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: '#666',
            }}
          >
            ↗ Share
          </Text>
        </View>
      </Pressable>
    );
  };

  // =========================
  // FOOTER
  // =========================

  const renderFooter = () => {
    if (!isLoading || quotes.length === 0) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  };

  // =========================
  // EMPTY
  // =========================

  if (!isLoading && quotes.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>No latest quotes found</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}

      <Header
        title={'Latest'}
        icon="chevron-back"
        onMenuPress={handleGoBack}
        showNotification={false}
        rightIcon="search"
        onRightPress={handleSearch}
      />

      {/* LIST */}

      <FlatList
        data={quotes}
        keyExtractor={item => item._id}
        renderItem={({ item, index }) => (
          <ItemLatestQuotes
            item={item}
            fullWidth
            onPress={() => handleQuotePress(item, index)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.latestList}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
      />

      {/* FIRST LOADING */}

      {isLoading && quotes.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Latest;
