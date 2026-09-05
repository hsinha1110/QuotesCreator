import { StyleSheet } from 'react-native';

import { THEME_COLORS, ThemeColors } from '@/constants/Colors';

import { moderateScale } from '@/styles/scaling';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    button: {
      flex: 1,

      height: moderateScale(46),

      borderRadius: moderateScale(10),

      backgroundColor: colors.card,

      borderWidth: moderateScale(1),

      borderColor: colors.border,

      alignItems: 'center',

      justifyContent: 'center',

      flexDirection: 'row',

      gap: moderateScale(8),
    },

    icon: {
      width: moderateScale(19),
      height: moderateScale(19),
    },

    text: {
      fontSize: moderateScale(14),

      fontWeight: '600',

      color: colors.textPrimary,
    },
  });

export default createStyles;
