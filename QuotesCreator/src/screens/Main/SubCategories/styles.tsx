import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  // ==========================================
  // LIST
  // ==========================================

  listContainer: {
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(30),
  },

  // ==========================================
  // SUBCATEGORY
  // ==========================================

  subCategoryCard: {
    width: '100%',
    minHeight: moderateScale(75),

    paddingHorizontal: moderateScale(18),
    paddingVertical: moderateScale(14),

    marginBottom: moderateScale(12),

    borderRadius: moderateScale(16),

    backgroundColor: COLORS.light_grey,

    elevation: moderateScale(3),

    shadowColor: COLORS.black,

    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },

    shadowOpacity: 0.08,
    shadowRadius: moderateScale(5),
  },

  subCategoryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    width: '100%',
  },

  subCategoryTextContainer: {
    flex: 1,
    minWidth: 0,
  },

  subCategoryName: {
    fontSize: moderateScale(17),
    lineHeight: moderateScale(22),
    fontWeight: '700',
    color: COLORS.black,
  },

  subCategoryQuoteCount: {
    fontSize: moderateScale(12),
    marginTop: moderateScale(3),
    color: COLORS.black,
  },

  // ==========================================
  // QUOTE
  // ==========================================

  quoteCard: {
    width: '100%',

    padding: moderateScale(18),

    marginBottom: moderateScale(14),

    borderRadius: moderateScale(18),

    backgroundColor: COLORS.light_grey,

    elevation: moderateScale(3),

    shadowColor: COLORS.black,

    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },

    shadowOpacity: 0.08,
    shadowRadius: moderateScale(5),
  },

  quoteIcon: {
    fontSize: moderateScale(40),
    lineHeight: moderateScale(40),
    fontWeight: '700',
    color: '#5B21E8',
  },

  quoteText: {
    fontSize: moderateScale(17),
    lineHeight: moderateScale(25),
    fontWeight: '600',
    color: COLORS.black,

    marginTop: moderateScale(4),
  },

  author: {
    fontSize: moderateScale(13),
    marginTop: moderateScale(12),
    color: COLORS.black,
  },

  quoteBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginTop: moderateScale(14),
  },

  quoteLanguage: {
    fontSize: moderateScale(11),
    color: '#777',
  },

  quoteStats: {
    flexDirection: 'row',
    gap: moderateScale(12),
  },

  statText: {
    fontSize: moderateScale(12),
    color: COLORS.black,
  },

  // ==========================================
  // LOADING
  // ==========================================

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ==========================================
  // EMPTY
  // ==========================================

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    paddingTop: moderateScale(100),
  },

  emptyText: {
    fontSize: moderateScale(15),
    color: '#777',
  },
  footerLoader: {
    width: '100%',
    minHeight: moderateScale(60),
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: moderateScale(12),
  },
  displayText: {
    fontSize: moderateScale(18),
    lineHeight: moderateScale(24),
    fontWeight: '700',
    color: COLORS.black,
  },
});

export default styles;
