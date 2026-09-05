import React from 'react';
import {View, Text, Image} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {ItemFavouritesProps} from '@/types';
import {AppDispatch, RootState} from '@/redux/store';

import {toggleFavourite} from '@/redux/slices/favouriteSlice';

import IMAGES from '@/assets/images';

import QuoteActions from '@/components/QuotesActions/QuotesActions';

import {THEME_COLORS} from '@/constants/Colors';

import createStyles from './styles';

const ItemFavourites = ({
  item,
  onShare,
}: ItemFavouritesProps) => {
  const dispatch = useDispatch<AppDispatch>();

  // =====================================================
  // THEME
  // =====================================================

  const themeMode = useSelector(
    (state: RootState) => state.theme.mode,
  );

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  // =====================================================
  // REMOVE FAVOURITE
  // =====================================================

  const handleRemoveFavourite = () => {
    dispatch(toggleFavourite(item));
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <View style={styles.card}>
      {/* QUOTE ICON */}

      <View style={styles.quoteIconContainer}>
        <Image
          source={IMAGES.QUOTES}
          style={styles.quoteIcon}
        />
      </View>

      {/* QUOTE */}

      <Text
        style={styles.quoteText}
        numberOfLines={4}>
        {item.text}
      </Text>

      {/* ACTIONS */}

      <View style={styles.actions}>
        <QuoteActions
          isFavorite={true}
          onFavoritePress={handleRemoveFavourite}
          onSharePress={() => {
            onShare?.(item);
          }}
        />
      </View>
    </View>
  );
};

export default ItemFavourites;