import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // =====================================================
    // LIST
    // =====================================================

    popularList: {
      paddingHorizontal: moderateScale(8),

      paddingTop: moderateScale(8),

      paddingBottom: moderateScale(30),
    },

    popularSeparator: {
      height: moderateScale(12),
    },

    // =====================================================
    // POPULAR CARD
    // =====================================================

    popularCard: {
      width: moderateScale(300),

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
    // FULL WIDTH CARD
    // =====================================================

    popularCardFullWidth: {
      width: '100%',

      minHeight: moderateScale(165),
    },

    // =====================================================
    // QUOTE ICON
    // =====================================================

    popularQuoteIcon: {
      width: moderateScale(28),

      height: moderateScale(28),

      right: moderateScale(6),

      resizeMode: 'contain',
    },

    // =====================================================
    // QUOTE TEXT
    // =====================================================

    popularQuoteText: {
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

    popularAuthor: {
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

    popularActions: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'flex-end',

      gap: moderateScale(8),

      marginTop: moderateScale(20),
    },

    popularActionButton: {
      width: moderateScale(32),

      height: moderateScale(32),

      alignItems: 'center',

      justifyContent: 'center',
    },
  });

export default createStyles;
