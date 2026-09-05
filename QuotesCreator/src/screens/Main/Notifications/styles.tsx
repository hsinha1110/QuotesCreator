import { StyleSheet } from 'react-native';

import { moderateScale } from 'react-native-size-matters';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // ==========================================
    // CONTAINER
    // ==========================================

    container: {
      flex: 1,

      backgroundColor: colors.background,
    },

    // ==========================================
    // MARK ALL
    // ==========================================

    markAllContainer: {
      flexDirection: 'row',

      justifyContent: 'space-between',

      alignItems: 'center',

      paddingHorizontal: moderateScale(18),

      paddingVertical: moderateScale(12),

      backgroundColor: colors.background,
    },

    unreadText: {
      fontSize: moderateScale(13),

      color: colors.accent,

      fontWeight: '600',
    },

    markAllText: {
      fontSize: moderateScale(13),

      color: colors.accent,

      fontWeight: '600',
    },

    // ==========================================
    // LIST
    // ==========================================

    listContainer: {
      paddingHorizontal: moderateScale(16),

      paddingBottom: moderateScale(30),

      flexGrow: 1,

      backgroundColor: colors.background,
    },

    // ==========================================
    // DATE
    // ==========================================

    dateContainer: {
      paddingTop: moderateScale(8),

      paddingBottom: moderateScale(10),
    },

    dateText: {
      fontSize: moderateScale(13),

      color: colors.accent,

      fontWeight: '700',
    },

    // ==========================================
    // NOTIFICATION CARD
    // ==========================================

    notificationCard: {
      flexDirection: 'row',

      alignItems: 'center',

      backgroundColor: colors.card,

      borderRadius: moderateScale(14),

      paddingVertical: moderateScale(13),

      paddingHorizontal: moderateScale(10),

      marginBottom: moderateScale(10),

      borderWidth: 1,

      borderColor: colors.border,
    },

    unreadNotificationCard: {
      backgroundColor: colors.light_grey,
    },

    // ==========================================
    // UNREAD DOT
    // ==========================================

    dotContainer: {
      width: moderateScale(8),

      alignItems: 'center',

      marginRight: moderateScale(5),
    },

    unreadDot: {
      width: moderateScale(7),

      height: moderateScale(7),

      borderRadius: moderateScale(4),

      backgroundColor: colors.accent,
    },

    // ==========================================
    // ICON
    // ==========================================

    iconContainer: {
      width: moderateScale(42),

      height: moderateScale(42),

      borderRadius: moderateScale(21),

      alignItems: 'center',

      justifyContent: 'center',

      backgroundColor: colors.light_grey,

      marginRight: moderateScale(10),
    },

    // ==========================================
    // CONTENT
    // ==========================================

    contentContainer: {
      flex: 1,

      marginRight: moderateScale(8),
    },

    titleRow: {
      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'space-between',

      marginBottom: moderateScale(4),
    },

    notificationTitle: {
      flex: 1,

      fontSize: moderateScale(14),

      color: colors.textPrimary,

      fontWeight: '600',

      marginRight: moderateScale(8),
    },

    unreadTitle: {
      fontWeight: '700',

      color: colors.textPrimary,
    },

    timeText: {
      fontSize: moderateScale(10),

      color: colors.textSecondary,
    },

    messageText: {
      fontSize: moderateScale(12),

      lineHeight: moderateScale(18),

      color: colors.textSecondary,

      fontWeight: '400',
    },

    unreadMessage: {
      color: colors.textPrimary,
    },

    // ==========================================
    // EMPTY
    // ==========================================

    emptyContainer: {
      flex: 1,

      alignItems: 'center',

      justifyContent: 'center',

      paddingTop: moderateScale(150),

      backgroundColor: colors.background,
    },

    emptyIconContainer: {
      width: moderateScale(85),

      height: moderateScale(85),

      borderRadius: moderateScale(43),

      alignItems: 'center',

      justifyContent: 'center',

      backgroundColor: colors.light_grey,

      marginBottom: moderateScale(18),
    },

    emptyTitle: {
      fontSize: moderateScale(19),

      fontWeight: '700',

      color: colors.textPrimary,

      marginBottom: moderateScale(8),
    },

    emptyDescription: {
      fontSize: moderateScale(14),

      color: colors.textSecondary,
    },

    // ==========================================
    // DELETE ACTION
    // ==========================================

    deleteAction: {
      width: moderateScale(85),

      backgroundColor: colors.red,

      justifyContent: 'center',

      alignItems: 'center',

      borderRadius: moderateScale(16),

      marginBottom: moderateScale(10),
    },

    deleteActionText: {
      color: colors.white,

      fontSize: moderateScale(12),

      fontWeight: '600',

      marginTop: moderateScale(4),
    },
  });

export default createStyles;
