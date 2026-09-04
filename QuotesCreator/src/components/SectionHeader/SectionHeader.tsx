import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

import styles from './styles';
import { SectionHeaderProps } from '@/types';
import { RootState } from '@/redux/store';

const SectionHeader = ({ title, onViewAllPress }: SectionHeaderProps) => {
  const language = useSelector((state: RootState) => state.language.language);

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
