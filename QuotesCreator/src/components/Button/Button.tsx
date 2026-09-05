import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';

import { ButtonProps } from 'react-native';

import { RootState } from '@/redux/store';
import { THEME_COLORS } from '@/constants/Colors';

import createStyles from './styles';

const Button = ({ title, onPress, disabled = false }: ButtonProps) => {
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={[styles.loginButton, disabled && styles.disabled]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={styles.loginText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default Button;
