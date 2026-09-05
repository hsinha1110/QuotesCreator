import { StyleSheet } from 'react-native';

import { moderateScale } from 'react-native-size-matters';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // =====================================================
    // NOTIFICATION CARD
    // =====================================================

    notificationCard: {
      minHeight: moderateScale(78),

      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor: colors.card,

      borderWidth: moderateScale(1),

      borderColor: colors.border,

      borderRadius: moderateScale(18),

      paddingHorizontal: moderateScale(10),

      paddingVertical: moderateScale(12),

      marginBottom: moderateScale(12),
    },

    unreadNotificationCard: {
      backgroundColor: colors.card,

      borderColor: colors.accent,
    },

    // =====================================================
    // DOT
    // =====================================================

    dotContainer: {
      width: moderateScale(16),

      alignItems: 'center',

      justifyContent: 'center',
    },

    unreadDot: {
      width: moderateScale(9),

      height: moderateScale(9),

      borderRadius: moderateScale(5),

      backgroundColor: colors.accent,
    },

    // =====================================================
    // ICON
    // =====================================================

    iconContainer: {
      width: moderateScale(58),

      height: moderateScale(58),

      borderRadius: moderateScale(30),

      backgroundColor: colors.light_grey,

      alignItems: 'center',

      justifyContent: 'center',

      marginRight: moderateScale(12),
    },

    // =====================================================
    // CONTENT
    // =====================================================

    contentContainer: {
      flex: 1,

      justifyContent: 'center',

      marginRight: moderateScale(8),
    },

    // =====================================================
    // TITLE ROW
    // =====================================================

    titleRow: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'space-between',

      marginBottom: moderateScale(5),
    },

    notificationTitle: {
      flex: 1,

      fontSize: moderateScale(16),

      fontWeight: '600',

      color: colors.textPrimary,

      marginRight: moderateScale(8),
    },

    unreadTitle: {
      fontWeight: '700',
    },

    // =====================================================
    // TIME
    // =====================================================

    timeText: {
      fontSize: moderateScale(12),

      color: colors.textSecondary,

      fontWeight: '400',
    },

    // =====================================================
    // MESSAGE
    // =====================================================

    messageText: {
      fontSize: moderateScale(14),

      lineHeight: moderateScale(21),

      color: colors.textSecondary,

      fontWeight: '400',
    },

    unreadMessage: {
      color: colors.textPrimary,
    },

    // =====================================================
    // DELETE ACTION
    // =====================================================

    deleteAction: {
      width: moderateScale(85),

      minHeight: moderateScale(78),

      backgroundColor: colors.red,

      justifyContent: 'center',

      alignItems: 'center',

      borderRadius: moderateScale(18),

      marginBottom: moderateScale(12),

      marginLeft: moderateScale(6),
    },

    deleteActionText: {
      color: colors.white,

      fontSize: moderateScale(12),

      fontWeight: '600',

      marginTop: moderateScale(4),
    },
  });

export default createStyles;
