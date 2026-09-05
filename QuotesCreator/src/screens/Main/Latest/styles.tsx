import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';

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
    // LOADING
    // ==========================================

    loadingContainer: {
      flex: 1,

      alignItems: 'center',

      justifyContent: 'center',

      backgroundColor: colors.background,
    },

    // ==========================================
    // FOOTER LOADER
    // ==========================================

    footerLoader: {
      width: '100%',

      minHeight: moderateScale(60),

      alignItems: 'center',

      justifyContent: 'center',

      paddingVertical: moderateScale(12),
    },

    // ==========================================
    // LIST
    // ==========================================

    latestList: {
      paddingHorizontal: moderateScale(8),

      paddingTop: moderateScale(8),

      paddingBottom: moderateScale(30),
    },

    // ==========================================
    // EMPTY
    // ==========================================

    emptyContainer: {
      flex: 1,

      justifyContent: 'center',

      alignItems: 'center',

      paddingHorizontal: moderateScale(20),

      backgroundColor: colors.background,
    },

    emptyText: {
      fontSize: moderateScale(16),

      color: colors.textSecondary,

      textAlign: 'center',

      lineHeight: moderateScale(22),
    },
  });

export default createStyles;
