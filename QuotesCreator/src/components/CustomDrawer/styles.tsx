import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // ==========================================
    // OVERLAY
    // ==========================================

    overlay: {
      position: 'absolute',

      top: 0,
      right: 0,
      bottom: 0,
      left: 0,

      zIndex: 9999,
      elevation: 9999,
    },

    backdrop: {
      position: 'absolute',

      top: 0,
      right: 0,
      bottom: 0,
      left: 0,

      backgroundColor: 'rgba(0,0,0,0.42)',
    },

    // ==========================================
    // DRAWER
    // ==========================================

    drawer: {
      width: '78%',
      height: '100%',

      backgroundColor: colors.background,

      paddingTop: moderateScale(48),
      paddingHorizontal: moderateScale(18),

      shadowColor: '#000',

      shadowOffset: {
        width: moderateScale(5),
        height: 0,
      },

      shadowOpacity: 0.2,
      shadowRadius: moderateScale(12),

      elevation: 20,
    },

    // ==========================================
    // HEADER
    // ==========================================

    header: {
      flexDirection: 'row',
      alignItems: 'center',

      marginBottom: moderateScale(22),
    },

    logoBox: {
      width: moderateScale(42),
      height: moderateScale(42),

      borderRadius: moderateScale(13),

      backgroundColor: colors.accent,

      alignItems: 'center',
      justifyContent: 'center',
    },

    headerContent: {
      flex: 1,

      marginLeft: moderateScale(11),
    },

    appName: {
      fontSize: moderateScale(17),
      fontWeight: '800',

      color: colors.textPrimary,
    },

    appSubtitle: {
      marginTop: moderateScale(2),

      fontSize: moderateScale(10),

      color: colors.textSecondary,
    },

    closeButton: {
      width: moderateScale(34),
      height: moderateScale(34),

      borderRadius: moderateScale(17),

      backgroundColor: colors.light_grey,

      alignItems: 'center',
      justifyContent: 'center',
    },

    // ==========================================
    // PROFILE CARD
    // ==========================================

    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',

      padding: moderateScale(11),

      borderRadius: moderateScale(16),

      backgroundColor: colors.light_grey,

      marginBottom: moderateScale(20),
    },

    profileImage: {
      width: moderateScale(46),
      height: moderateScale(46),

      borderRadius: moderateScale(23),

      backgroundColor: colors.light_grey,
    },

    profilePlaceholder: {
      width: moderateScale(46),
      height: moderateScale(46),

      borderRadius: moderateScale(23),

      backgroundColor: colors.light_grey,

      alignItems: 'center',
      justifyContent: 'center',
    },

    profileLetter: {
      fontSize: moderateScale(19),
      fontWeight: '800',

      color: colors.accent,
    },

    profileContent: {
      flex: 1,

      marginLeft: moderateScale(11),
      marginRight: moderateScale(8),
    },

    profileName: {
      fontSize: moderateScale(14),
      fontWeight: '700',

      color: colors.textPrimary,
    },

    profileEmail: {
      fontSize: moderateScale(10),

      color: colors.textSecondary,

      marginTop: moderateScale(3),
    },

    // ==========================================
    // SECTION TITLE
    // ==========================================

    sectionTitle: {
      fontSize: moderateScale(9),

      fontWeight: '800',

      color: colors.textSecondary,

      letterSpacing: 1,

      marginLeft: moderateScale(5),
      marginBottom: moderateScale(7),
      marginTop: moderateScale(2),

      textTransform: 'uppercase',
    },

    // ==========================================
    // MENU ITEM
    // ==========================================

    menuItem: {
      height: moderateScale(46),

      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: moderateScale(6),

      borderRadius: moderateScale(12),

      marginBottom: moderateScale(3),
    },

    activeMenuItem: {
      backgroundColor: colors.light_grey,
    },

    iconBox: {
      width: moderateScale(36),
      height: moderateScale(36),

      borderRadius: moderateScale(10),

      alignItems: 'center',
      justifyContent: 'center',
    },

    activeIconBox: {
      backgroundColor: colors.light_grey,
    },

    menuText: {
      flex: 1,

      marginLeft: moderateScale(10),

      fontSize: moderateScale(13),

      fontWeight: '600',

      color: colors.textPrimary,
    },

    activeMenuText: {
      color: colors.accent,

      fontWeight: '700',
    },

    // ==========================================
    // BADGE
    // ==========================================

    badge: {
      minWidth: moderateScale(22),
      height: moderateScale(22),

      paddingHorizontal: moderateScale(6),

      borderRadius: moderateScale(11),

      backgroundColor: colors.red,

      alignItems: 'center',
      justifyContent: 'center',
    },

    badgeText: {
      fontSize: moderateScale(9),

      fontWeight: '800',

      color: colors.white,
    },

    // ==========================================
    // DIVIDER
    // ==========================================

    divider: {
      height: 1,

      backgroundColor: colors.border,

      marginVertical: moderateScale(10),
    },

    // ==========================================
    // SPACER
    // ==========================================

    spacer: {
      flex: 1,
    },

    // ==========================================
    // LOGOUT
    // ==========================================

    logoutButton: {
      height: moderateScale(48),

      borderRadius: moderateScale(13),

      backgroundColor: colors.light_grey,

      flexDirection: 'row',
      alignItems: 'center',

      paddingHorizontal: moderateScale(9),

      marginBottom: moderateScale(10),
    },

    logoutIconBox: {
      width: moderateScale(36),
      height: moderateScale(36),

      borderRadius: moderateScale(10),

      backgroundColor: colors.light_grey,

      alignItems: 'center',
      justifyContent: 'center',
    },

    logoutText: {
      marginLeft: moderateScale(11),

      fontSize: moderateScale(14),

      fontWeight: '700',

      color: colors.red,
    },

    // ==========================================
    // VERSION
    // ==========================================

    version: {
      textAlign: 'center',

      fontSize: moderateScale(9),

      color: colors.textSecondary,

      marginBottom: moderateScale(12),
    },
  });

export default createStyles;
