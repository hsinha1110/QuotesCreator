import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';
import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      alignItems: 'center',
      justifyContent: 'center',
    },

    logo: {
      width: moderateScale(95),
      height: moderateScale(95),
      marginBottom: moderateScale(20),
    },

    title: {
      fontSize: moderateScale(28),
      fontWeight: '800',
      color: colors.textPrimary,
    },

    highlight: {
      color: colors.accent,
    },

    subtitle: {
      marginTop: moderateScale(8),
      fontSize: moderateScale(15),
      fontWeight: '500',
      color: colors.textSecondary,
    },

    pagination: {
      position: 'absolute',
      bottom: moderateScale(55),
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },

    dot: {
      width: moderateScale(8),
      height: moderateScale(8),
      borderRadius: moderateScale(4),
      backgroundColor: colors.accent,
    },
  });

export default createStyles;
