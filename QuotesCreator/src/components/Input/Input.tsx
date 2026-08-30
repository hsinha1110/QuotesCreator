import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { InputComponentProps } from '@/types';
import styles from './styles';

const Input = ({
  leftIcon,
  isPassword = false,
  error,
  ...props
}: InputComponentProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.wrapper}>
      {/* Input Container */}
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        {/* Left Icon */}
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={21}
            color={error ? '#E53935' : '#777777'}
            style={styles.leftIcon}
          />
        ) : null}

        {/* Text Input */}
        <TextInput
          {...props}
          style={styles.input}
          placeholderTextColor="#999999"
          secureTextEntry={isPassword && !showPassword}
        />

        {/* Password Eye */}
        {isPassword ? (
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword(prev => !prev)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? 'eye-outline' : 'eye-off-outline'}
              size={22}
              color={error ? '#E53935' : '#777777'}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={15} color="#E53935" />

          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default Input;
