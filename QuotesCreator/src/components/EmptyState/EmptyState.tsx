import React from 'react';
import { View, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { moderateScale } from '@/styles/scaling';

import styles from './styles';
import COLORS from '@/constants/Colors';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description: string;
}

const EmptyState = ({
  icon = 'folder-open-outline',
  title,
  description,
}: EmptyStateProps) => {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <Ionicons name={icon} size={moderateScale(45)} color={COLORS.primary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyDescription}>{description}</Text>
    </View>
  );
};

export default EmptyState;
