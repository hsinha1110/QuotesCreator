import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { ItemCategoriesProps } from '@/types';

import styles from './styles';

const ItemCategories = ({ item, fullWidth = false }: ItemCategoriesProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[styles.categoryCard, fullWidth && styles.fullWidthCard]}
    >
      <Text style={styles.categoryName} numberOfLines={1}>
        {item.displayName}
      </Text>
    </TouchableOpacity>
  );
};

export default ItemCategories;
