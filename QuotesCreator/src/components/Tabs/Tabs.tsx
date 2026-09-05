import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

import { THEME_COLORS } from '@/constants/Colors';
import { RootState } from '@/redux/store';
import { TabsProps } from '@/types';

import createStyles from './styles';

const Tabs = ({ tabs, activeTab, onTabPress }: TabsProps) => {
  // ==========================================
  // THEME
  // ==========================================

  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  // ==========================================
  // UI
  // ==========================================

  return (
    <View style={styles.container}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.8}
            onPress={() => onTabPress(tab.key)}
            style={styles.tab}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.title}
            </Text>

            {isActive && <View style={styles.activeLine} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default Tabs;
