import React from 'react';
import { View, Text, Image } from 'react-native';
import { useDispatch } from 'react-redux';
import { ItemFavouritesProps } from '@/types';
import { AppDispatch } from '@/redux/store';
import { toggleFavourite } from '@/redux/slices/favouriteSlice';
import IMAGES from '@/assets/images';
import QuoteActions from '@/components/QuotesActions/QuotesActions';
import styles from './styles';

const ItemFavourites = ({ item, onShare }: ItemFavouritesProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveFavourite = () => {
    dispatch(toggleFavourite(item));
  };

  return (
    <View style={styles.card}>
      <View style={styles.quoteIconContainer}>
        <Image source={IMAGES.QUOTES} style={styles.quoteIcon} />
      </View>

      <Text style={styles.quoteText} numberOfLines={4}>
        {item.text}
      </Text>

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
