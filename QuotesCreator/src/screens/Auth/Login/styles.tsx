import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';
import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },

    content: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: moderateScale(24),
    },

    header: {
      alignItems: 'center',
      marginBottom: moderateScale(26),
    },

    title: {
      fontSize: moderateScale(25),
      fontWeight: '800',
      color: colors.textPrimary,
      marginBottom: moderateScale(6),
      textAlign: 'center',
    },

    subtitle: {
      fontSize: moderateScale(13),
      color: colors.textSecondary,
      textAlign: 'center',
    },

    forgotButton: {
      alignSelf: 'flex-end',
      marginTop: moderateScale(-4),
      marginBottom: moderateScale(24),
    },

    forgotText: {
      fontSize: moderateScale(13),
      fontWeight: '700',
      color: colors.accent,
    },

    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: moderateScale(20),
    },

    divider: {
      flex: 1,
      height: moderateScale(1),
      backgroundColor: colors.border,
    },

    dividerText: {
      marginHorizontal: moderateScale(12),
      fontSize: moderateScale(12),
      color: colors.textSecondary,
    },

    socialContainer: {
      flexDirection: 'row',
      gap: moderateScale(12),
    },
  });

export default createStyles;
