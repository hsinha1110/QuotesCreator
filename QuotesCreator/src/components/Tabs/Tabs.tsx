import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import styles from './styles';
import { TabsProps } from '@/types';

const Tabs = ({ tabs, activeTab, onTabPress }: TabsProps) => {
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
