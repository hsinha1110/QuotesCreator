import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Image, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';

import IMAGES from '@/assets/images';
import QuoteActions from '@/components/QuotesActions/QuotesActions';

import styles from './styles';

import { QuotesDetailsRouteProp } from '@/navigations/types';
import { RootState, AppDispatch } from '@/redux/store';
import { toggleFavourite } from '@/redux/slices/favouriteSlice';

import { Quote } from '@/types';

const { width } = Dimensions.get('window');

const QuotesDetails = () => {
  const route = useRoute<QuotesDetailsRouteProp>();
  const dispatch = useDispatch<AppDispatch>();

  // ==========================================
  // ROUTE DATA
  // ==========================================

  const { item, quotes: routeQuotes, index: routeIndex } = route.params;

  // ==========================================
  // SAFE DATA
  // ==========================================
  const quotes: Quote[] =
    routeQuotes && routeQuotes.length > 0 ? routeQuotes : [item];

  const index =
    routeIndex !== undefined && routeIndex >= 0 && routeIndex < quotes.length
      ? routeIndex
      : 0;

  // ==========================================
  // CURRENT INDEX
  // ==========================================

  const [currentIndex, setCurrentIndex] = useState(index);

  const flatListRef = useRef<FlatList<Quote>>(null);

  // ==========================================
  // FAVOURITES
  // ==========================================

  const favourites = useSelector(
    (state: RootState) => state.favourites.favourites || [],
  );

  // ==========================================
  // VIEWABLE ITEM
  // ==========================================

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const newIndex = viewableItems[0]?.index;

    if (newIndex !== null && newIndex !== undefined) {
      setCurrentIndex(newIndex);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 70,
  }).current;

  useEffect(() => {
    const newIndex = routeIndex < quotes.length ? routeIndex : 0;
    setCurrentIndex(newIndex);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({
        index: newIndex,
        animated: false,
      });
    }, 50);
  }, [route.params]);

  const handleFavoritePress = (quote: Quote) => {
    dispatch(
      toggleFavourite({
        _id: quote._id,
        text: quote.displayText || quote.text,
        author: quote.author || 'Unknown',
      }),
    );
  };

  // ==========================================
  // SHARE
  // ==========================================

  const handleSharePress = (quote: Quote) => {
    console.log('📤 SHARE QUOTE:', quote._id);
  };

  // ==========================================
  // RENDER QUOTE
  // ==========================================

  const renderQuote = ({ item: quote }: { item: Quote }) => {
    const isFavorite = favourites.some(
      favourite => favourite._id === quote._id,
    );

    return (
      <View style={styles.page}>
        <View style={styles.quoteCard}>
          {/* ==================================
              QUOTE IMAGE
          ================================== */}

          <Image
            source={IMAGES.QUOTES}
            style={styles.quoteImage}
            resizeMode="contain"
          />

          {/* ==================================
              QUOTE TEXT
          ================================== */}

          <Text style={styles.quoteText}>
            {quote.displayText || quote.text}
          </Text>

          {/* ==================================
              INFO
          ================================== */}

          {/* ==================================
              ACTIONS
          ================================== */}

          <View style={styles.actions}>
            <QuoteActions
              isFavorite={isFavorite}
              likes={quote.likes ?? 0}
              showLikes={false}
              onFavoritePress={() => handleFavoritePress(quote)}
              onSharePress={() => handleSharePress(quote)}
            />
          </View>
        </View>
      </View>
    );
  };

  // ==========================================
  // SAFE INITIAL INDEX
  // ==========================================

  const safeInitialIndex =
    quotes.length > 0 ? Math.max(0, Math.min(index, quotes.length - 1)) : 0;

  // ==========================================
  // UI
  // ==========================================

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={quotes}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={safeInitialIndex}
        keyExtractor={quote => quote._id}
        renderItem={renderQuote}
        getItemLayout={(_, itemIndex) => ({
          length: width,
          offset: width * itemIndex,
          index: itemIndex,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        extraData={favourites}
      />

      {/* ======================================
          PAGE COUNTER
      ====================================== */}

      <View style={styles.counterContainer}>
        <Text style={styles.counter}>
          {currentIndex + 1} / {quotes.length}
        </Text>
      </View>
    </View>
  );
};

export default QuotesDetails;
