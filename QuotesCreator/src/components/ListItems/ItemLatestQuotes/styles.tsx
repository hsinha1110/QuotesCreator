import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // =====================================================
    // LIST
    // =====================================================

    latestList: {
      paddingHorizontal: moderateScale(2),
      paddingBottom: moderateScale(8),
    },

    latestSeparator: {
      width: moderateScale(14),
    },

    // =====================================================
    // CARD
    // =====================================================

    latestCard: {
      width: moderateScale(300),

      minHeight: moderateScale(165),

      paddingHorizontal: moderateScale(16),

      paddingTop: moderateScale(14),

      paddingBottom: moderateScale(12),

      borderRadius: moderateScale(18),

      backgroundColor: colors.card,

      elevation: moderateScale(3),

      shadowColor: colors.black,

      shadowOffset: {
        width: 0,
        height: moderateScale(2),
      },

      shadowOpacity: 0.08,

      shadowRadius: moderateScale(5),

      overflow: 'hidden',

      borderWidth: moderateScale(1),

      borderColor: colors.border,
    },

    // =====================================================
    // QUOTE ICON
    // =====================================================

    latestQuoteIcon: {
      width: moderateScale(28),

      height: moderateScale(28),

      right: moderateScale(6),
    },

    // =====================================================
    // QUOTE TEXT
    // =====================================================

    latestQuoteText: {
      marginTop: moderateScale(8),

      fontSize: moderateScale(14),

      lineHeight: moderateScale(20),

      color: colors.textPrimary,

      fontWeight: 'bold',

      flexShrink: 1,
    },

    // =====================================================
    // AUTHOR
    // =====================================================

    latestAuthor: {
      marginTop: moderateScale(8),

      fontSize: moderateScale(10),

      lineHeight: moderateScale(14),

      color: colors.textSecondary,

      fontWeight: '400',

      flexShrink: 1,
    },

    // =====================================================
    // ACTIONS
    // =====================================================

    latestActions: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'flex-end',

      gap: moderateScale(8),

      marginTop: moderateScale(8),
    },

    latestActionButton: {
      width: moderateScale(32),

      height: moderateScale(32),

      alignItems: 'center',

      justifyContent: 'center',
    },

    // =====================================================
    // FULL WIDTH CARD
    // =====================================================

    latestCardFullWidth: {
      width: '100%',

      minHeight: moderateScale(165),

      marginVertical: moderateScale(10),
    },
  });

export default createStyles;
