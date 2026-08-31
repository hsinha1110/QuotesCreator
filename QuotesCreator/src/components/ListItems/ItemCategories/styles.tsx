import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  // =========================
  // LIST
  // =========================

  categoryList: {
    paddingHorizontal: moderateScale(2),
    paddingBottom: moderateScale(8),
  },

  categorySeparator: {
    width: moderateScale(12),
  },

  // =========================
  // COMMON CARD
  // =========================

  categoryCard: {
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
    minHeight: moderateScale(80),
    paddingHorizontal: moderateScale(24),
  },

  categoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    flex: 1,
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
});

export default styles;
