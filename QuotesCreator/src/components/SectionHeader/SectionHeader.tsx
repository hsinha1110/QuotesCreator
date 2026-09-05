import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

import {THEME_COLORS} from '@/constants/Colors';
import {RootState} from '@/redux/store';
import {SectionHeaderProps} from '@/types';

import createStyles from './styles';

const SectionHeader = ({title, onViewAllPress}: SectionHeaderProps) => {
  // ==========================================
  // LANGUAGE
  // ==========================================

  const language = useSelector((state: RootState) => state.language.language);

  // ==========================================
  // THEME
  // ==========================================

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  // ==========================================
  // TITLE
  // ==========================================

  const getTitle = () => {
    if (language === 'Hindi') {
      switch (title) {
        case 'Popular':
          return 'लोकप्रिय';

        case 'Latest':
          return 'नवीनतम';

        case 'Categories':
          return 'श्रेणियाँ';

        default:
          return title;
      }
    }

    return title;
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{getTitle()}</Text>

      {onViewAllPress && (
        <TouchableOpacity activeOpacity={0.7} onPress={onViewAllPress}>
          <Text style={styles.viewAll}>
            {language === 'Hindi' ? 'सभी देखें' : 'View All'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;