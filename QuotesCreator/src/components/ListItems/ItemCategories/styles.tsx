import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  // =========================
  // LIST
  // =========================

  categoryList: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(12),
    paddingBottom: moderateScale(30),
  },

  categorySeparator: {
    height: moderateScale(12),
  },

  // =========================
  // COMMON CARD
  // =========================

  categoryCard: {
    width: '100%',
    borderRadius: moderateScale(18),
    backgroundColor: COLORS.white,

    elevation: moderateScale(3),

    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(5),
  },

  // =========================
  // CATEGORIES SCREEN
  // =========================

  fullWidthCard: {
    width: '100%',
    height: moderateScale(80),
    paddingHorizontal: moderateScale(24),
    paddingVertical: moderateScale(14),
  },

  categoryContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },

  categoryName: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(21),
    fontWeight: '700',
    color: COLORS.black,
  },

  quoteCount: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(21),
    marginTop: moderateScale(4),
    color: COLORS.black,
  },

  // =========================
  // HOME SCREEN
  // =========================

  homeCategoryCard: {
    width: moderateScale(155),
    height: moderateScale(80),
    paddingHorizontal: moderateScale(14),
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(18),
  },

  homeCategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
  },

  textContainer: {
    flex: 1,
    minWidth: 0,
  },

  homeCategoryName: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(20),
    fontWeight: '700',
    color: COLORS.black,
    flexShrink: 1,
  },

  homeQuoteCount: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    marginTop: moderateScale(3),
    color: COLORS.black,
    flexShrink: 1,
  },

  arrow: {
    marginLeft: moderateScale(6),
    flexShrink: 0,
  },

  // =========================
  // FOOTER
  // =========================

  footerLoader: {
    height: moderateScale(70),
    alignItems: 'center',
    justifyContent: 'center',
  },

  footerSpace: {
    height: moderateScale(30),
  },

  // =========================
  // LOADING
  // =========================

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
