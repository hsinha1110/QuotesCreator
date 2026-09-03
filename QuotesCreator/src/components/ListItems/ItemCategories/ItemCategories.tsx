import React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';
import { ItemCategoriesProps } from '@/types';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './styles';

const ItemCategories = ({
  item,
  fullWidth = false,
  onPress,
}: ItemCategoriesProps) => {
  return (
    <Pressable
      onPress={onPress}
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
    </Pressable>
  );
};

export default ItemCategories;
