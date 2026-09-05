import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';

import { AuthFooterProps } from '@/types';
import { RootState } from '@/redux/store';
import { THEME_COLORS } from '@/constants/Colors';

import createStyles from './styles';

const AuthFooter = ({ text, linkText, onPress }: AuthFooterProps) => {
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>

      <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
        <Text style={styles.link}> {linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AuthFooter;
