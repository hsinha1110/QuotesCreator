import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { ItemCategoriesProps } from '@/types';
import { RootState } from '@/redux/store';
import { translations } from '@/language';

import styles from './styles';

const ItemCategories = ({
  item,
  fullWidth = false,
  onPress,
}: ItemCategoriesProps) => {
  const language = useSelector((state: RootState) => state.language.language);

  const t = translations[language];

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
            <Text>
              {language === 'Hindi'
                ? item.translations?.Hindi || item.displayName || item.name
                : item.translations?.English || item.displayName || item.name}
            </Text>
          </Text>

          <Text
            style={[styles.quoteCount, !fullWidth && styles.homeQuoteCount]}
          >
            {item.quoteCount ?? 0}+ {t.HOME.QUOTES}
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
