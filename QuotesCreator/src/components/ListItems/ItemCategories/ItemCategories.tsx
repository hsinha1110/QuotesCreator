import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {useSelector} from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {ItemCategoriesProps} from '@/types';
import {RootState} from '@/redux/store';
import {translations} from '@/language';

import {THEME_COLORS} from '@/constants/Colors';

import createStyles from './styles';

const ItemCategories = ({
  item,
  fullWidth = false,
  onPress,
}: ItemCategoriesProps) => {
  // =====================================================
  // LANGUAGE
  // =====================================================

  const language = useSelector(
    (state: RootState) => state.language.language,
  );

  const t = translations[language];

  // =====================================================
  // THEME
  // =====================================================

  const themeMode = useSelector(
    (state: RootState) => state.theme.mode,
  );

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  // =====================================================
  // CATEGORY NAME
  // =====================================================

  const categoryName =
    language === 'Hindi'
      ? item.translations?.Hindi ||
        item.displayName ||
        item.name
      : item.translations?.English ||
        item.displayName ||
        item.name;

  // =====================================================
  // UI
  // =====================================================

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.categoryCard,
        fullWidth
          ? styles.fullWidthCard
          : styles.homeCategoryCard,
      ]}>
      <View
        style={[
          styles.categoryContent,
          !fullWidth &&
            styles.homeCategoryContent,
        ]}>
        
        <View style={styles.textContainer}>
          {/* CATEGORY NAME */}

          <Text
            style={[
              styles.categoryName,
              !fullWidth &&
                styles.homeCategoryName,
            ]}
            numberOfLines={fullWidth ? 1 : 2}>
            {categoryName}
          </Text>

          {/* QUOTE COUNT */}

          <Text
            style={[
              styles.quoteCount,
              !fullWidth &&
                styles.homeQuoteCount,
            ]}>
            {item.quoteCount ?? 0}+ {t.HOME.QUOTES}
          </Text>
        </View>

        {/* ARROW */}

        <Ionicons
          name="chevron-forward"
          size={fullWidth ? 26 : 22}
          color={colors.iconSecondary}
          style={styles.arrow}
        />
      </View>
    </Pressable>
  );
};

export default ItemCategories;