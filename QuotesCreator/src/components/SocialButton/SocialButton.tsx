import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { SocialButtonProps } from '@/types';
import styles from './styles';

const SocialButton = ({ title, icon, onPress }: SocialButtonProps) => {
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
