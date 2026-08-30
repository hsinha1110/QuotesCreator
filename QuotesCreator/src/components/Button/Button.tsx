import React from 'react';
import { ButtonProps, Text, TouchableOpacity } from 'react-native';
import styles from './styles';

const Button = ({ title, onPress, disabled = false }: ButtonProps) => {
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
