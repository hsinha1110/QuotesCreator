import React from 'react';
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale } from 'react-native-size-matters';

import IMAGES from '@/assets/images';
import COLORS from '@/constants/Colors';
import { Quote } from '@/types';

import styles from './styles';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { toggleFavourite } from '@/redux/slices/favouriteSlice';

type ItemLatestQuotesProps = {
  item: Quote;
};

const ItemLatestQuotes = ({ item }: ItemLatestQuotesProps) => {
  const favourites = useSelector(
    (state: RootState) => state.favourites.favourites || [],
  );
  const dispatch = useDispatch<AppDispatch>();
  const isFavourite = favourites.some((fav: Quote) => fav._id === item._id);

  console.log(isFavourite, '....isFavourite');
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.latestCard}>
      {/* QUOTE ICON */}

      <Image source={IMAGES.QUOTES} style={styles.latestQuoteIcon} />

      {/* QUOTE */}

      <Text style={styles.latestQuoteText} numberOfLines={4}>
        {item.text}
      </Text>

      {/* AUTHOR */}

      <Text style={styles.latestAuthor} numberOfLines={1}>
        — {item.author || 'Unknown'}
      </Text>

      {/* ACTIONS */}

      <View style={styles.latestActions}>
        {/* FAVORITE */}

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.latestActionButton}
          onPress={() => {
            console.log('Favorite quote:', item);
          }}
        >
          <Pressable onPress={() => dispatch(toggleFavourite(item))}>
            <Ionicons
              name={isFavourite ? 'heart' : 'heart-outline'}
              size={moderateScale(20)}
              color={isFavourite ? COLORS.red : COLORS.black}
            />
          </Pressable>
        </TouchableOpacity>

        {/* SHARE */}

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.latestActionButton}
          onPress={() => {
            console.log('Share quote:', item._id);
          }}
        >
          <Ionicons
            name="share-social-outline"
            size={moderateScale(20)}
            color={COLORS.black}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ItemLatestQuotes;
