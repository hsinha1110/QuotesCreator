import React from 'react';
import { Image } from 'react-native';
import styles from './styles';

const AuthLogo = () => {
  return (
    <Image
      source={require('@/assets/images/logo.png')}
      style={styles.logo}
      resizeMode="contain"
    />
  );
};

export default AuthLogo;
