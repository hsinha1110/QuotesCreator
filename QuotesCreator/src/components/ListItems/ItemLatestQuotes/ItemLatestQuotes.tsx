import React from 'react';
import {View, Text, Pressable, Image} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';

import IMAGES from '@/assets/images';
import {Quote} from '@/types';

import styles from './styles';

import {AppDispatch, RootState} from '@/redux/store';

import {toggleFavourite} from '@/redux/slices/favouriteSlice';

import QuoteActions from '@/components/QuotesActions/QuotesActions';

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

  const favourites = useSelector(
    (state: RootState) => state.favourites.favourites || [],
  );

  const isFavourite = favourites.some(
    (fav: Quote) => fav._id === item._id,
  );

  const handleFavoritePress = () => {
    dispatch(
      toggleFavourite({
        _id: item._id,
        text: item.displayText || item.text,
        author: item.author || 'Unknown',
      }),
    );
  };

  const handleSharePress = () => {
    console.log('📤 SHARE QUOTE:', item._id);
  };

  return (
    <Pressable
      style={[
        styles.latestCard,
        fullWidth && styles.latestCardFullWidth,
      ]}
      onPress={onPress}
    >
      <Image
        source={IMAGES.QUOTES}
        style={styles.latestQuoteIcon}
      />

      <Text
        style={styles.latestQuoteText}
        numberOfLines={fullWidth ? undefined : 4}
      >
        {item.displayText || item.text}
      </Text>

      <Text
        style={styles.latestAuthor}
        numberOfLines={1}
      >
        — {item.author || 'Unknown'}
      </Text>

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