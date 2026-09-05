import React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';

import {SocialButtonProps} from '@/types';
import {RootState} from '@/redux/store';
import {THEME_COLORS} from '@/constants/Colors';

import createStyles from './styles';

const SocialButton = ({title, icon, onPress}: SocialButtonProps) => {
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
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {icon}

      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

export default SocialButton;