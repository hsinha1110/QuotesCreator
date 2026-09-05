import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

import { InputComponentProps } from '@/types';
import { RootState } from '@/redux/store';
import { THEME_COLORS } from '@/constants/Colors';

import createStyles from './styles';

const Input = ({
  leftIcon,
  isPassword = false,
  error,
  ...props
}: InputComponentProps) => {
  const [showPassword, setShowPassword] = useState(false);

  // Theme
  const themeMode = useSelector((state: RootState) => state.theme.mode);

  const colors = THEME_COLORS[themeMode];

  const styles = createStyles(colors);

  return (
    <View style={styles.wrapper}>
      {/* Input Container */}
      <View style={[styles.inputContainer, error ? styles.inputError : null]}>
        {/* Left Icon */}
        {leftIcon ? (
          <Ionicons
            name={leftIcon}
            size={21}
            color={error ? colors.red : colors.iconSecondary}
            style={styles.leftIcon}
          />
        ) : null}

        {/* Text Input */}
        <TextInput
          {...props}
          style={styles.input}
          placeholderTextColor={colors.placeholder}
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
              color={error ? colors.red : colors.iconSecondary}
            />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Error */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={15} color={colors.red} />

          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default Input;
