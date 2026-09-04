import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale } from 'react-native-size-matters';

import COLORS from '@/constants/Colors';
import styles from './styles';
import { QuoteActionsProps } from '@/types';

const QuoteActions = ({
  onFavoritePress,
  onSharePress,
  onDeletePress,
  favoriteSize = moderateScale(22),
  isFavorite = false,
  likes = 0,
  showLikes = false,
  showDelete = false,
}: QuoteActionsProps) => {
  return (
    <View style={styles.actions}>
      {/* FAVORITE */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.actionButton}
        onPress={onFavoritePress}
      >
        <View style={styles.likeContainer}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={favoriteSize}
            color={isFavorite ? COLORS.red : COLORS.black}
          />

          {showLikes && <Text style={styles.likesText}>{likes}</Text>}
        </View>
      </TouchableOpacity>

      {/* SHARE */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.actionButton}
        onPress={onSharePress}
      >
        <Ionicons
          name="share-social-outline"
          size={favoriteSize}
          color={COLORS.black}
        />
      </TouchableOpacity>

      {/* DELETE */}
      {showDelete && (
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.actionButton}
          onPress={onDeletePress}
        >
          <Ionicons
            name="trash-outline"
            size={favoriteSize}
            color={COLORS.red}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default QuoteActions;
