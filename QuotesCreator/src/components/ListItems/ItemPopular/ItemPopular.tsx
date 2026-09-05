import React, {useState} from 'react';
import {View, Text, Image, Pressable} from 'react-native';

import {useSelector} from 'react-redux';

import {Quote} from '@/types';
import IMAGES from '@/assets/images';

import QuoteActions from '@/components/QuotesActions/QuotesActions';

import {useAppDispatch} from '@/redux/hooks';
import {likeQuoteThunk} from '@/redux/thunk/likeQuoteThunk';
import {unlikeQuoteThunk} from '@/redux/thunk/unlikeQuoteThunk';

import {RootState} from '@/redux/store';

import {THEME_COLORS} from '@/constants/Colors';

import createStyles from './styles';

interface ItemPopularProps {
  item: Quote;
  onPress: () => void;
  fullWidth?: boolean;
}

const ItemPopular = ({
  item,
  onPress,
  fullWidth = false,
}: ItemPopularProps) => {
  const dispatch = useAppDispatch();

  // =====================================================
  // THEME
  // =====================================================

  const themeMode = useSelector(
    (state: RootState) => state.theme.mode,
  );

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  // =====================================================
  // LIKE STATE
  // =====================================================

  const [isLiked, setIsLiked] = useState(
    item.isLiked ?? false,
  );

  const [likes, setLikes] = useState(
    item.likes ?? 0,
  );

  const [isLoading, setIsLoading] = useState(false);

  // =====================================================
  // LIKE / UNLIKE
  // =====================================================

  const handleLikePress = async () => {
    if (isLoading) {
      return;
    }

    console.log(
      '❤️ HEART CLICKED:',
      item._id,
    );

    try {
      setIsLoading(true);

      // ================================================
      // UNLIKE
      // ================================================

      if (isLiked) {
        const response = await dispatch(
          unlikeQuoteThunk(item._id),
        ).unwrap();

        console.log(
          'UNLIKE RESPONSE:',
          response,
        );

        if (response?.success) {
          setIsLiked(false);

          setLikes(
            response.likes ??
              Math.max(0, likes - 1),
          );
        }

        return;
      }

      // ================================================
      // LIKE
      // ================================================

      const response = await dispatch(
        likeQuoteThunk(item._id),
      ).unwrap();

      console.log(
        'LIKE RESPONSE:',
        response,
      );

      if (response?.success) {
        setIsLiked(true);

        setLikes(
          response.likes ??
            likes + 1,
        );
      }
    } catch (error: any) {
      console.log(
        'LIKE / UNLIKE ERROR:',
        error,
      );

      if (
        error?.isLiked === true ||
        error?.message ===
          'Quote already liked'
      ) {
        setIsLiked(true);

        if (
          typeof error?.likes ===
          'number'
        ) {
          setLikes(error.likes);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // SHARE
  // =====================================================

  const handleSharePress = () => {
    console.log(
      '📤 SHARE QUOTE:',
      item._id,
    );
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <Pressable
      style={[
        styles.popularCard,
        fullWidth &&
          styles.popularCardFullWidth,
      ]}
      onPress={onPress}>
      
      {/* ================================================
          QUOTE ICON
      ================================================ */}

      <Image
        source={IMAGES.QUOTES}
        style={styles.popularQuoteIcon}
      />

      {/* ================================================
          QUOTE
      ================================================ */}

      <Text
        style={styles.popularQuoteText}
        numberOfLines={
          fullWidth ? undefined : 4
        }>
        {item.displayText || item.text}
      </Text>

      {/* ================================================
          ACTIONS
      ================================================ */}

      <View style={styles.popularActions}>
        <QuoteActions
          isFavorite={isLiked}
          likes={likes}
          showLikes={false}
          onFavoritePress={
            handleLikePress
          }
          onSharePress={
            handleSharePress
          }
        />
      </View>
    </Pressable>
  );
};

export default ItemPopular;