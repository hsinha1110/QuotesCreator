import React, { useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Header from '@/components/Header/Header';
import { goBack } from '@/utils/NavigationUtils';
import styles from './styles';
import Routes from '@/navigations/Routes';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/redux/store';
import { getRecentQuotesThunk } from '@/redux/thunk/getRecentQuotesThunk';
import QuoteActions from '@/components/QuotesActions/QuotesActions';
import IMAGES from '@/assets/images';
import { deleteQuoteThunk } from '@/redux/thunk/deleteQuoteThunk';
import { toggleFavourite } from '@/redux/slices/favouriteSlice';

const CreateQuotes = ({ navigation }: any) => {
  // ==========================================
  // WRITE YOUR OWN
  // ==========================================
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector((state: RootState) => state.auth.token);
  const favourites = useSelector(
    (state: RootState) => state.favourites.favourites || [],
  );
  const { quotes: recentQuotes, isLoading } = useSelector(
    (state: RootState) => state.recentQuotes,
  );

  useFocusEffect(
    useCallback(() => {
      if (!token) return;

      dispatch(getRecentQuotesThunk());
    }, [dispatch, token]),
  );
  const handleWriteOwn = () => {
    navigation.navigate(Routes.CREATE_OWN);
  };

  // ==========================================
  // USE A QUOTE
  // ==========================================

  const handleUseQuote = () => {
    navigation.navigate('UseAQuote');
  };

  // ==========================================
  // RECENT QUOTE ITEM
  // ==========================================
  const renderRecentQuote = ({ item }: any) => {
    const handleQuotePress = () => {
      navigation.navigate(Routes.QUOTES_DETAILS, {
        item,
        quotes: recentQuotes,
        index: recentQuotes.findIndex((quote: any) => quote._id === item._id),
      });
    };

    const handleFavoritePress = () => {
      dispatch(
        toggleFavourite({
          _id: item._id,
          text: item.text,
          author: item.author || 'Unknown',
        }),
      );
    };

    const handleSharePress = () => {
      console.log('Share:', item._id);
    };

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.recentCard}
        onPress={handleQuotePress}
      >
        <Image source={IMAGES.QUOTES} style={styles.quoteIcon} />
        <View style={styles.recentContent}>
          <Text style={styles.recentText} numberOfLines={3}>
            {item.text}
          </Text>

          <Text style={styles.author}>— {item.author || 'Unknown'}</Text>
        </View>

        <View style={styles.recentActions}>
          <QuoteActions
            isFavorite={favourites.some(
              favourite => favourite._id === item._id,
            )}
            likes={item.likes ?? 0}
            showLikes={false}
            showDelete={true}
            onFavoritePress={handleFavoritePress}
            onSharePress={handleSharePress}
            onDeletePress={() => handleDeletePress(item)}
          />
        </View>
      </TouchableOpacity>
    );
  };
  const handleDeletePress = (item: any) => {
    Alert.alert('Delete Quote', 'Are you sure you want to delete this quote?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(deleteQuoteThunk(item._id)).unwrap();

            console.log('QUOTE DELETED SUCCESSFULLY:', item._id);
          } catch (error) {
            console.log('DELETE QUOTE ERROR:', error);

            Alert.alert(
              'Error',
              typeof error === 'string' ? error : 'Failed to delete quote',
            );
          }
        },
      },
    ]);
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* ========================================
          HEADER
      ======================================== */}

      <Header
        title=""
        icon="close"
        onMenuPress={goBack}
        showNotification={false}
      />

      <FlatList
        data={recentQuotes}
        keyExtractor={item => item.text}
        renderItem={renderRecentQuote}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          recentQuotes.length === 0 && styles.emptyContainer,
        ]}
        ListHeaderComponent={
          <>
            {/* ==================================
                TITLE
            ================================== */}

            <View style={styles.titleContainer}>
              <Text style={styles.title}>Create Quote</Text>

              <Text style={styles.subtitle}>
                Create your own inspiring quote{'\n'}
                and share positivity with the world.
              </Text>
            </View>

            {/* ==================================
                WRITE YOUR OWN
            ================================== */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.optionCard}
              onPress={handleWriteOwn}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.featherIcon}>✎</Text>
              </View>

              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Write Your Own</Text>

                <Text style={styles.optionDescription}>
                  Write your own quote{'\n'}
                  from scratch and{'\n'}
                  make it beautiful.
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            {/* ==================================
                USE A QUOTE
            ================================== */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.optionCard}
              onPress={handleUseQuote}
            >
              <View style={[styles.iconCircle, styles.heartCircle]}>
                <Text style={styles.bigHeart}>♥</Text>
              </View>

              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>Use a Quote</Text>

                <Text style={styles.optionDescription}>
                  Choose from our{'\n'}
                  collection of quotes{'\n'}
                  and customize it.
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            {/* ==================================
                RECENT HEADER
            ================================== */}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Quotes</Text>

              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No recent quotes yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default CreateQuotes;
