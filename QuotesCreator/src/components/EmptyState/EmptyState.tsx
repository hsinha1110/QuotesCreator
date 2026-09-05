import React from 'react';
import { View, Text } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { useSelector } from 'react-redux';

import { moderateScale } from '@/styles/scaling';

import { RootState } from '@/redux/store';

import { THEME_COLORS } from '@/constants/Colors';

import createStyles from './styles';

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
  // =====================================================
  // THEME
  // =====================================================

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  return (
    <View style={styles.emptyContainer}>
      {/* ICON */}

      <View style={styles.emptyIconContainer}>
        <Ionicons name={icon} size={moderateScale(45)} color={colors.primary} />
      </View>

      {/* TITLE */}

      <Text style={styles.emptyTitle}>{title}</Text>

      {/* DESCRIPTION */}

      <Text style={styles.emptyDescription}>{description}</Text>
    </View>
  );
};

export default EmptyState;
