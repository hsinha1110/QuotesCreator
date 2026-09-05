import React from 'react';
import {View, Text, Pressable, Image} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import IMAGES from '@/assets/images';
import {Quote} from '@/types';

import {AppDispatch, RootState} from '@/redux/store';

import {toggleFavourite} from '@/redux/slices/favouriteSlice';

import QuoteActions from '@/components/QuotesActions/QuotesActions';

import {THEME_COLORS} from '@/constants/Colors';

import createStyles from './styles';

type ItemLatestQuotesProps = {
  item: Quote;
  onPress: () => void;
  fullWidth?: boolean;
};

const ItemLatestQuotes = ({
  item,
  onPress,
  fullWidth = false,
}: ItemLatestQuotesProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // =====================================================
  // FAVOURITES
  // =====================================================

  const favourites = useSelector(
    (state: RootState) =>
      state.favourites.favourites || [],
  );

  const isFavourite = favourites.some(
    (fav: Quote) => fav._id === item._id,
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
  // FAVORITE
  // =====================================================

  const handleFavoritePress = () => {
    dispatch(
      toggleFavourite({
        _id: item._id,
        text: item.displayText || item.text,
        author: item.author || 'Unknown',
      }),
    );
  };

  // =====================================================
  // SHARE
  // =====================================================

  const handleSharePress = () => {
    console.log('📤 SHARE QUOTE:', item._id);
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Pressable
      style={[
        styles.latestCard,
        fullWidth &&
          styles.latestCardFullWidth,
      ]}
      onPress={onPress}>
      
      {/* QUOTE ICON */}

      <Image
        source={IMAGES.QUOTES}
        style={styles.latestQuoteIcon}
      />

      {/* QUOTE */}

      <Text
        style={styles.latestQuoteText}
        numberOfLines={
          fullWidth ? undefined : 4
        }>
        {item.displayText || item.text}
      </Text>

      {/* AUTHOR */}

      <Text
        style={styles.latestAuthor}
        numberOfLines={1}>
        — {item.author || 'Unknown'}
      </Text>

      {/* ACTIONS */}

      <View style={styles.latestActions}>
        <QuoteActions
          isFavorite={isFavourite}
          likes={item.likes ?? 0}
          onFavoritePress={handleFavoritePress}
          onSharePress={handleSharePress}
        />
      </View>
    </Pressable>
  );
};

export default ItemLatestQuotes;