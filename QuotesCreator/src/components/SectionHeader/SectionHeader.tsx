import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import styles from './styles';
import { SectionHeaderProps } from '@/types';

const SectionHeader = ({ title, onViewAllPress }: SectionHeaderProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity activeOpacity={0.7} onPress={onViewAllPress}>
        <Text style={styles.viewAll}>View All</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SectionHeader;
