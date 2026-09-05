import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';

import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // =====================================================
    // WRAPPER
    // =====================================================

    wrapper: {
      width: '100%',
      backgroundColor: colors.background,
    },

    // =====================================================
    // TAB BAR
    // =====================================================

    tabBar: {
      height: moderateScale(68),

      flexDirection: 'row',

      alignItems: 'center',

      justifyContent: 'space-around',

      paddingHorizontal: moderateScale(8),

      backgroundColor: colors.card,

      borderTopWidth: moderateScale(1),

      borderTopColor: colors.border,

      elevation: moderateScale(8),

      shadowColor: colors.black,

      shadowOffset: {
        width: 0,
        height: moderateScale(-2),
      },

      shadowOpacity: 0.08,

      shadowRadius: moderateScale(6),
    },

    // =====================================================
    // TAB ITEM
    // =====================================================

    tabItem: {
      flex: 1,

      height: '100%',

      alignItems: 'center',

      justifyContent: 'center',

      paddingTop: moderateScale(5),
    },

    // =====================================================
    // TAB LABEL
    // =====================================================

    tabLabel: {
      marginTop: moderateScale(3),

      fontSize: moderateScale(10),

      lineHeight: moderateScale(14),

      fontWeight: '600',

      textAlign: 'center',
    },

    // =====================================================
    // CENTER ADD BUTTON CONTAINER
    // =====================================================

    centerButtonContainer: {
      flex: 1,

      height: '100%',

      alignItems: 'center',

      justifyContent: 'center',

      marginTop: moderateScale(-18),
    },

    // =====================================================
    // ADD BUTTON
    // =====================================================

    addButton: {
      width: moderateScale(58),

      height: moderateScale(58),

      borderRadius: moderateScale(29),

      alignItems: 'center',

      justifyContent: 'center',

      backgroundColor: colors.accent,

      borderWidth: moderateScale(4),

      borderColor: colors.background,

      elevation: moderateScale(6),

      shadowColor: colors.black,

      shadowOffset: {
        width: 0,
        height: moderateScale(3),
      },

      shadowOpacity: 0.2,

      shadowRadius: moderateScale(5),
    },
  });

export default createStyles;
