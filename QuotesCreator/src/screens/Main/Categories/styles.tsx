import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';
import { ThemeColors } from '@/constants/Colors';

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    // =====================================================
    // CONTAINER
    // =====================================================

    container: {
      flex: 1,

      backgroundColor: colors.background,
    },

    // =====================================================
    // CATEGORY LIST
    // =====================================================

    categoryList: {
      paddingHorizontal: moderateScale(16),

      paddingTop: moderateScale(12),

      paddingBottom: moderateScale(30),
    },

    // =====================================================
    // CATEGORY ITEM
    // =====================================================

    categoryItem: {
      width: '100%',
    },

    // =====================================================
    // SEPARATOR
    // =====================================================

    categorySeparator: {
      height: moderateScale(12),
    },

    // =====================================================
    // FOOTER LOADER
    // =====================================================

    footerLoader: {
      height: moderateScale(70),

      alignItems: 'center',
      justifyContent: 'center',
    },

    // =====================================================
    // FOOTER SPACE
    // =====================================================

    footerSpace: {
      height: moderateScale(30),
    },

    // =====================================================
    // LOADING
    // =====================================================

    loadingContainer: {
      flex: 1,

      alignItems: 'center',
      justifyContent: 'center',

      backgroundColor: colors.background,
    },
  });

export default createStyles;
