import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { moderateScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';

import { THEME_COLORS } from '@/constants/Colors';
import { RootState } from '@/redux/store';
import { QuoteActionsProps } from '@/types';

import createStyles from './styles';

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
  // ==========================================
  // THEME
  // ==========================================

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  // ==========================================
  // UI
  // ==========================================

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
            color={isFavorite ? colors.red : colors.textPrimary}
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
          color={colors.textPrimary}
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
            color={colors.red}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default QuoteActions;
