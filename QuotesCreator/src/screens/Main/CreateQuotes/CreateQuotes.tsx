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

import { useFocusEffect } from '@react-navigation/native';

import { useDispatch, useSelector } from 'react-redux';

import Header from '@/components/Header/Header';

import { goBack } from '@/utils/NavigationUtils';

import styles from './styles';

import Routes from '@/navigations/Routes';

import { AppDispatch, RootState } from '@/redux/store';

import { getRecentQuotesThunk } from '@/redux/thunk/getRecentQuotesThunk';

import { deleteQuoteThunk } from '@/redux/thunk/deleteQuoteThunk';

import QuoteActions from '@/components/QuotesActions/QuotesActions';

import IMAGES from '@/assets/images';

import { toggleFavourite } from '@/redux/slices/favouriteSlice';

import { translations } from '@/language';

const CreateQuotes = ({ navigation }: any) => {
  const dispatch = useDispatch<AppDispatch>();

  // ==========================================
  // AUTH
  // ==========================================

  const token = useSelector((state: RootState) => state.auth.token);

  // ==========================================
  // APP LANGUAGE
  // ==========================================

  const language = useSelector((state: RootState) => state.language.language);

  // ==========================================
  // TRANSLATIONS
  // ==========================================

  const t = translations[language].CREATE_QUOTE;

  // ==========================================
  // FAVOURITES
  // ==========================================

  const favourites = useSelector(
    (state: RootState) => state.favourites.favourites || [],
  );

  // ==========================================
  // RECENT QUOTES
  // ==========================================

  const recentQuotes = useSelector(
    (state: RootState) => state.recentQuotes.quotes || [],
  );

  // ==========================================
  // GET RECENT QUOTES
  // ==========================================

  useFocusEffect(
    useCallback(() => {
      if (!token) {
        console.log('❌ Token missing');
        return;
      }

      const fetchRecentQuotes = async () => {
        try {
          console.log('🕘 FETCHING RECENT QUOTES');

          console.log('🌐 APP LANGUAGE:', language);

          const response = await dispatch(
            getRecentQuotesThunk(language),
          ).unwrap();

          console.log(
            '🔥 RECENT QUOTES RESPONSE:',
            JSON.stringify(response, null, 2),
          );
        } catch (error) {
          console.log('❌ GET RECENT QUOTES ERROR:', error);
        }
      };

      fetchRecentQuotes();
    }, [dispatch, token, language]),
  );

  // ==========================================
  // WRITE YOUR OWN
  // ==========================================

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
  // DELETE QUOTE
  // ==========================================

  const handleDeletePress = (item: any) => {
    Alert.alert(t.DELETE_QUOTE, t.DELETE_CONFIRMATION, [
      {
        text: t.CANCEL,
        style: 'cancel',
      },
      {
        text: t.DELETE,
        style: 'destructive',

        onPress: async () => {
          try {
            console.log('🗑️ DELETING QUOTE:', item._id);

            await dispatch(deleteQuoteThunk(item._id)).unwrap();

            console.log('✅ QUOTE DELETED:', item._id);

            // Refresh using CURRENT app language
            await dispatch(getRecentQuotesThunk(language)).unwrap();
          } catch (error) {
            console.log('❌ DELETE QUOTE ERROR:', error);

            Alert.alert(
              t.ERROR,
              typeof error === 'string' ? error : t.DELETE_FAILED,
            );
          }
        },
      },
    ]);
  };

  // ==========================================
  // RECENT QUOTE ITEM
  // ==========================================

  const renderRecentQuote = ({ item }: { item: any }) => {
    // ========================================
    // LOCALIZED QUOTE
    // ========================================

    const quoteText = item.displayText || item.text || '';

    const author = item.author || t.UNKNOWN;

    // ========================================
    // QUOTE PRESS
    // ========================================

    const handleQuotePress = () => {
      const index = recentQuotes.findIndex(
        (quote: any) => quote._id === item._id,
      );

      navigation.navigate(Routes.QUOTES_DETAILS, {
        item,
        quotes: recentQuotes,
        index,
      });
    };

    // ========================================
    // FAVOURITE
    // ========================================

    const handleFavoritePress = () => {
      dispatch(
        toggleFavourite({
          _id: item._id,

          // Save currently displayed language
          text: quoteText,

          author,
        }),
      );
    };

    // ========================================
    // SHARE
    // ========================================

    const handleSharePress = () => {
      console.log('📤 SHARE QUOTE:', item._id);
    };

    // ========================================
    // UI
    // ========================================

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.recentCard}
        onPress={handleQuotePress}
      >
        <Image source={IMAGES.QUOTES} style={styles.quoteIcon} />

        <View style={styles.recentContent}>
          <Text style={styles.recentText} numberOfLines={3}>
            {quoteText}
          </Text>

          <Text style={styles.author}>— {author}</Text>
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

  // ==========================================
  // UI
  // ==========================================

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title=""
        icon="close"
        onMenuPress={goBack}
        showNotification={false}
      />

      <FlatList
        data={recentQuotes}
        keyExtractor={item => item._id.toString()}
        renderItem={renderRecentQuote}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,

          recentQuotes.length === 0 && styles.emptyContainer,
        ]}
        ListHeaderComponent={
          <>
            {/* TITLE */}

            <View style={styles.titleContainer}>
              <Text style={styles.title}>{t.TITLE}</Text>

              <Text style={styles.subtitle}>{t.SUBTITLE}</Text>
            </View>

            {/* WRITE YOUR OWN */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.optionCard}
              onPress={handleWriteOwn}
            >
              <View style={styles.iconCircle}>
                <Text style={styles.featherIcon}>✎</Text>
              </View>

              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{t.WRITE_YOUR_OWN}</Text>

                <Text style={styles.optionDescription}>
                  {t.WRITE_YOUR_OWN_DESCRIPTION}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            {/* USE A QUOTE */}

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.optionCard}
              onPress={handleUseQuote}
            >
              <View style={[styles.iconCircle, styles.heartCircle]}>
                <Text style={styles.bigHeart}>♥</Text>
              </View>

              <View style={styles.optionContent}>
                <Text style={styles.optionTitle}>{t.USE_A_QUOTE}</Text>

                <Text style={styles.optionDescription}>
                  {t.USE_A_QUOTE_DESCRIPTION}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>

            {/* RECENT HEADER */}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{t.RECENT_QUOTES}</Text>

              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeAll}>{t.SEE_ALL}</Text>
              </TouchableOpacity>
            </View>
          </>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{t.NO_RECENT_QUOTES}</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default CreateQuotes;
