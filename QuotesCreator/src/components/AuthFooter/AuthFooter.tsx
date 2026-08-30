import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AuthFooterProps } from '@/types';
import styles from './styles';

const AuthFooter = ({ text, linkText, onPress }: AuthFooterProps) => {
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
