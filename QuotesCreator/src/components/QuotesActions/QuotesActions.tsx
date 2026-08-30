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
  favoriteSize = moderateScale(22),
  isLiked = false,
  likes,
}: QuoteActionsProps) => {
  return (
    <View style={styles.actions}>
      {/* LIKE / UNLIKE */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.actionButton}
        onPress={onFavoritePress}
      >
        <View style={styles.likeContainer}>
          <Ionicons
            name={isLiked ? 'heart' : 'heart-outline'}
            size={favoriteSize}
            color={isLiked ? COLORS.red : COLORS.black}
          />

          {/* COUNT ALWAYS SHOW */}
          <Text style={styles.likesText}>{likes}</Text>
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
    </View>
  );
};

export default QuoteActions;
