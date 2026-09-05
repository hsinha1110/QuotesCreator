import { StyleSheet } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // =====================================================
    // CARD
    // =====================================================

    card: {
      backgroundColor: colors.card,

      borderWidth: 1,

      borderColor: colors.border,

      borderRadius: moderateScale(14),

      padding: moderateScale(14),

      marginHorizontal: moderateScale(16),

      marginBottom: verticalScale(12),

      shadowColor: colors.black,

      shadowOffset: {
        width: 0,
        height: 2,
      },

      shadowOpacity: 0.06,

      shadowRadius: 5,

      elevation: 2,
    },

    // =====================================================
    // QUOTE ICON CONTAINER
    // =====================================================

    quoteIconContainer: {
      position: 'absolute',
    },

    // =====================================================
    // QUOTE TEXT
    // =====================================================

    quoteText: {
      fontSize: moderateScale(15),

      lineHeight: moderateScale(23),

      fontWeight: '600',

      color: colors.textPrimary,

      marginLeft: moderateScale(36),

      marginTop: moderateScale(3),
    },

    // =====================================================
    // ACTIONS
    // =====================================================

    actions: {
      flexDirection: 'row',

      justifyContent: 'flex-end',

      alignItems: 'center',

      marginTop: verticalScale(10),

      gap: moderateScale(10),
    },

    // =====================================================
    // ACTION BUTTON
    // =====================================================

    actionButton: {
      width: moderateScale(34),

      height: moderateScale(34),

      justifyContent: 'center',

      alignItems: 'center',
    },

    // =====================================================
    // QUOTE ICON
    // =====================================================

    quoteIcon: {
      position: 'absolute',

      top: moderateScale(7),

      left: moderateScale(10),

      width: moderateScale(28),

      height: moderateScale(28),
    },
  });

export default createStyles;
