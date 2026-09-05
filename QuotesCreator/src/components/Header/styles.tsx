import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // =====================================================
    // CONTAINER
    // =====================================================

    container: {
      width: '100%',
      height: moderateScale(50),

      flexDirection: 'row',

      alignItems: 'center',

      paddingHorizontal: moderateScale(8),

      backgroundColor: colors.background,
    },

    // =====================================================
    // SIDE
    // =====================================================

    side: {
      width: moderateScale(45),

      height: '100%',

      alignItems: 'flex-start',

      justifyContent: 'center',
    },

    rightSide: {
      alignItems: 'flex-end',
    },

    // =====================================================
    // RIGHT BUTTON
    // =====================================================

    rightButton: {
      minHeight: moderateScale(40),

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'flex-end',

      paddingHorizontal: moderateScale(4),
    },

    rightText: {
      fontSize: moderateScale(14),

      fontWeight: 'bold',

      color: colors.accent,

      marginRight: moderateScale(6),
    },

    // =====================================================
    // CENTER
    // =====================================================

    center: {
      flex: 1,

      alignItems: 'center',

      justifyContent: 'center',
    },

    title: {
      fontSize: moderateScale(18),

      fontWeight: '700',

      color: colors.textPrimary,

      flexWrap: 'wrap',
    },

    // =====================================================
    // ICON BUTTON
    // =====================================================

    iconButton: {
      width: moderateScale(40),

      height: moderateScale(40),

      alignItems: 'center',

      justifyContent: 'center',

      position: 'relative',
    },

    // =====================================================
    // NOTIFICATION BADGE
    // =====================================================

    badge: {
      position: 'absolute',

      top: moderateScale(3),

      right: moderateScale(5),

      minWidth: moderateScale(16),

      height: moderateScale(16),

      paddingHorizontal: moderateScale(4),

      borderRadius: moderateScale(8),

      backgroundColor: colors.red,

      alignItems: 'center',

      justifyContent: 'center',

      borderWidth: moderateScale(1.5),

      borderColor: colors.background,
    },

    badgeText: {
      fontSize: moderateScale(8),

      lineHeight: moderateScale(10),

      fontWeight: '800',

      color: colors.white,
    },
  });

export default createStyles;
