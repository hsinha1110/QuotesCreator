import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // =====================================================
    // EMPTY CONTAINER
    // =====================================================

    emptyContainer: {
      flex: 1,

      alignItems: 'center',

      justifyContent: 'center',

      paddingHorizontal: moderateScale(30),
    },

    // =====================================================
    // ICON CONTAINER
    // =====================================================

    emptyIconContainer: {
      width: moderateScale(85),

      height: moderateScale(85),

      borderRadius: moderateScale(42),

      alignItems: 'center',

      justifyContent: 'center',

      backgroundColor: colors.light_grey,

      marginBottom: moderateScale(18),
    },

    // =====================================================
    // TITLE
    // =====================================================

    emptyTitle: {
      fontSize: moderateScale(18),

      fontWeight: 'bold',

      color: colors.textPrimary,

      textAlign: 'center',

      marginBottom: moderateScale(8),
    },

    // =====================================================
    // DESCRIPTION
    // =====================================================

    emptyDescription: {
      fontSize: moderateScale(14),

      color: colors.textSecondary,

      textAlign: 'center',

      lineHeight: moderateScale(21),

      fontWeight: '400',
    },
  });

export default createStyles;
