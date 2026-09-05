import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';

import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  // ==========================================
  // CONTAINER
  // ==========================================

  container: {
    flex: 1,
  },

  // ==========================================
  // QUOTE CARD
  // ==========================================

  quoteCard: {
    width: '100%',

    padding: moderateScale(18),

    minHeight: moderateScale(60),

    marginBottom: moderateScale(12),

    borderRadius: moderateScale(18),

    elevation: moderateScale(3),

    shadowColor: COLORS.black,

    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },

    shadowOpacity: 0.08,

    shadowRadius: moderateScale(5),
  },

  // ==========================================
  // QUOTE ICON
  // ==========================================

  quoteIcon: {
    position: 'absolute',

    left: -10,

    width: moderateScale(28),

    height: moderateScale(28),
  },

  // ==========================================
  // QUOTE TEXT
  // ==========================================

  quoteText: {
    fontSize: moderateScale(16),

    lineHeight: moderateScale(20),

    fontWeight: '600',

    marginTop: moderateScale(40),
  },

  // ==========================================
  // DISPLAY TEXT
  // ==========================================

  displayText: {
    fontSize: moderateScale(18),

    lineHeight: moderateScale(24),

    fontWeight: '700',
  },

  // ==========================================
  // AUTHOR
  // ==========================================

  author: {
    fontSize: moderateScale(13),

    marginTop: moderateScale(12),
  },

  // ==========================================
  // BOTTOM
  // ==========================================

  quoteBottom: {
    flexDirection: 'row',

    justifyContent: 'flex-end',

    alignItems: 'center',

    marginTop: moderateScale(14),
  },

  // ==========================================
  // QUOTE LANGUAGE
  // ==========================================

  quoteLanguage: {
    fontSize: moderateScale(11),
  },

  // ==========================================
  // QUOTE STATS
  // ==========================================

  quoteStats: {
    flexDirection: 'row',

    gap: moderateScale(12),
  },

  // ==========================================
  // STAT TEXT
  // ==========================================

  statText: {
    fontSize: moderateScale(12),
  },

  // ==========================================
  // INITIAL LOADING
  // ==========================================

  loadingContainer: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',
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
  // EMPTY LIST
  // ==========================================

  emptyListContainer: {
    flexGrow: 1,
  },

  // ==========================================
  // EMPTY
  // ==========================================

  emptyContainer: {
    flexGrow: 1,

    alignItems: 'center',

    justifyContent: 'center',

    paddingTop: moderateScale(100),
  },

  emptyText: {
    fontSize: moderateScale(15),
  },

  // ==========================================
  // LIST
  // ==========================================

  listContainer: {
    paddingHorizontal: moderateScale(16),

    paddingTop: moderateScale(16),

    paddingBottom: moderateScale(30),
  },

  quoteList: {
    paddingHorizontal: moderateScale(16),

    paddingTop: moderateScale(16),

    paddingBottom: moderateScale(50),
  },

  // ==========================================
  // SEPARATOR
  // ==========================================

  quoteSeparator: {
    height: moderateScale(12),
  },

  // ==========================================
  // PRESSABLE
  // ==========================================

  quotePressable: {
    width: '100%',
  },
});

export default styles;
