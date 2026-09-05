import { StyleSheet } from 'react-native';

import { ThemeColors } from '@/constants/Colors';
import { moderateScale } from '@/styles/scaling';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    loginButton: {
      width: '100%',

      height: moderateScale(45),

      borderRadius: moderateScale(12),

      backgroundColor: colors.accent,

      alignItems: 'center',
      justifyContent: 'center',
    },

    loginText: {
      fontSize: moderateScale(16),
      fontWeight: '700',
      color: colors.white,
    },

    disabled: {
      opacity: 0.5,
    },
  });

export default createStyles;
