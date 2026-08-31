import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ItemCategoriesProps } from '@/types';
import styles from './styles';

const ItemCategories = ({
  item,
  fullWidth = false,
  onPress,
}: ItemCategoriesProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.categoryCard,
        fullWidth ? styles.fullWidthCard : styles.homeCategoryCard,
      ]}
    >
      <View
        style={[
          styles.categoryContent,
          !fullWidth && styles.homeCategoryContent,
        ]}
      >
        <View style={styles.textContainer}>
          <Text
            style={[styles.categoryName, !fullWidth && styles.homeCategoryName]}
            numberOfLines={fullWidth ? 1 : 2}
          >
            {item.displayName}
          </Text>

          <Text
            style={[styles.quoteCount, !fullWidth && styles.homeQuoteCount]}
          >
            {item.quoteCount ?? 0}+ Quotes
          </Text>
        </View>

        <Ionicons
          name="chevron-forward"
          size={fullWidth ? 26 : 22}
          color="#111"
          style={styles.arrow}
        />
      </View>
    </TouchableOpacity>
  );
};

export default ItemCategories;
