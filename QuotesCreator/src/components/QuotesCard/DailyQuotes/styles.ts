import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    card: {
      width: '100%',

      paddingHorizontal: moderateScale(18),
      paddingTop: moderateScale(14),
      paddingBottom: moderateScale(14),

      borderRadius: moderateScale(20),

      backgroundColor: colors.card,

      elevation: moderateScale(3),

      shadowOffset: {
        width: 0,
        height: moderateScale(2),
      },

      shadowOpacity: 0.1,
      shadowRadius: moderateScale(4),
    },

    quoteIcon: {
      width: moderateScale(42),
      height: moderateScale(42),

      resizeMode: 'contain',

      marginBottom: moderateScale(6),
    },

    content: {
      paddingHorizontal: moderateScale(2),
    },

    title: {
      fontSize: moderateScale(17),
      lineHeight: moderateScale(23),

      fontWeight: '700',

      color: colors.textPrimary,
    },

    body: {
      marginTop: moderateScale(5),

      fontSize: moderateScale(14),
      lineHeight: moderateScale(21),

      color: colors.textPrimary,
    },

    bottomRow: {
      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'space-between',

      marginTop: moderateScale(12),
    },

    date: {
      flex: 1,

      fontSize: moderateScale(10),
      lineHeight: moderateScale(14),

      color: colors.textSecondary,
    },

    actions: {
      flexDirection: 'row',

      alignItems: 'center',

      gap: moderateScale(8),
    },

    actionButton: {
      width: moderateScale(32),
      height: moderateScale(32),

      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default createStyles;
