import React from 'react';
import { Image } from 'react-native';
import { useSelector } from 'react-redux';

import { RootState } from '@/redux/store';
import { THEME_COLORS } from '@/constants/Colors';

import createStyles from './styles';

const AuthLogo = () => {
  const themeMode = useSelector((state: RootState) => state.theme.mode);
  const colors = THEME_COLORS[themeMode];
  const styles = createStyles(colors);
  return (
    <Image
      source={require('@/assets/images/logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
};

export default AuthLogo;
