import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

import { ItemPopularProps } from '@/types';
import IMAGES from '@/assets/images';

import QuoteActions from '@/components/QuotesActions/QuotesActions';

import { useAppDispatch } from '@/redux/hooks';
import { likeQuoteThunk } from '@/redux/thunk/likeQuoteThunk';
import { unlikeQuoteThunk } from '@/redux/thunk/unlikeQuoteThunk';

import styles from './styles';

const ItemPopular = ({ item }: ItemPopularProps) => {
  const dispatch = useAppDispatch();

  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(item.likes ?? 0);
  const [isLoading, setIsLoading] = useState(false);

  const handleLikePress = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      if (isLiked) {
        // =========================
        // UNLIKE
        // =========================
        const response = await dispatch(unlikeQuoteThunk(item._id)).unwrap();

        console.log('UNLIKE RESPONSE:', response);

        if (response?.success) {
          setIsLiked(false);
          setLikes(response.likes ?? 0);
        }
      } else {
        // =========================
        // LIKE
        // =========================
        const response = await dispatch(likeQuoteThunk(item._id)).unwrap();

        console.log('LIKE RESPONSE:', response);

        if (response?.success) {
          setIsLiked(true);
          setLikes(response.likes ?? 0);
        }
      }
    } catch (error: any) {
      console.log('LIKE / UNLIKE ERROR:', error);

      if (error?.isLiked === true || error?.message === 'Quote already liked') {
        setIsLiked(true);
        setLikes(error?.likes ?? likes);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSharePress = () => {
    console.log('Share quote:', item._id);
  };

  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.popularCard}>
      <Image source={IMAGES.QUOTES} style={styles.popularQuoteIcon} />

      <Text style={styles.popularQuoteText} numberOfLines={4}>
        {item.text}
      </Text>

      <Text style={styles.popularAuthor} numberOfLines={1}>
        — {item.author || 'Unknown'}
      </Text>

      <View style={styles.popularActions}>
        <QuoteActions
          isLiked={isLiked}
          likes={likes}
          onFavoritePress={handleLikePress}
          onSharePress={handleSharePress}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ItemPopular;
