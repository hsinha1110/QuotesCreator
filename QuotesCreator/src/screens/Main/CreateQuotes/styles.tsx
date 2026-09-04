import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  content: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(30),
  },

  // ==========================================
  // TITLE
  // ==========================================

  titleContainer: {
    marginTop: moderateScale(8),
    marginBottom: moderateScale(22),
  },

  title: {
    fontSize: moderateScale(28),
    lineHeight: moderateScale(34),
    fontWeight: '700',
    color: COLORS.black,
  },

  subtitle: {
    marginTop: moderateScale(8),
    fontSize: moderateScale(13),
    lineHeight: moderateScale(19),
    color: '#777777',
  },

  // ==========================================
  // OPTION CARDS
  // ==========================================

  optionCard: {
    width: '100%',
    minHeight: moderateScale(130),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: moderateScale(16),
    paddingVertical: moderateScale(16),
    marginBottom: moderateScale(14),
    borderRadius: moderateScale(20),
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

  iconCircle: {
    width: moderateScale(52),
    height: moderateScale(52),
    borderRadius: moderateScale(26),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },

  heartCircle: {
    backgroundColor: COLORS.white,
  },

  featherIcon: {
    fontSize: moderateScale(28),
    color: COLORS.black,
  },

  bigHeart: {
    fontSize: moderateScale(25),
    color: COLORS.black,
  },

  optionContent: {
    flex: 1,
    marginLeft: moderateScale(14),
  },

  optionTitle: {
    fontSize: moderateScale(17),
    lineHeight: moderateScale(22),
    fontWeight: '700',
    color: COLORS.black,
  },

  optionDescription: {
    marginTop: moderateScale(6),
    fontSize: moderateScale(12),
    lineHeight: moderateScale(17),
    color: '#777777',
  },

  arrow: {
    marginLeft: moderateScale(8),
    fontSize: moderateScale(30),
    lineHeight: moderateScale(32),
    color: COLORS.black,
  },

  // ==========================================
  // RECENT SECTION
  // ==========================================

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: moderateScale(12),
    marginBottom: moderateScale(14),
  },

  sectionTitle: {
    fontSize: moderateScale(19),
    lineHeight: moderateScale(24),
    fontWeight: '700',
    color: COLORS.black,
  },

  seeAll: {
    fontSize: moderateScale(12),
    fontWeight: '600',
    color: COLORS.accent,
  },

  // ==========================================
  // RECENT QUOTE CARD
  // ==========================================

  recentCard: {
    width: '100%',
    minHeight: moderateScale(120),
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(16),
    paddingBottom: moderateScale(12),
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

    position: 'relative',
  },

  recentContent: {
    paddingLeft: moderateScale(4),
    paddingRight: moderateScale(4),
    marginTop: moderateScale(20),
  },

  recentText: {
    marginTop: moderateScale(14),
    fontSize: moderateScale(15),
    lineHeight: moderateScale(21),
    fontWeight: '600',
    color: COLORS.black,
  },

  author: {
    marginTop: moderateScale(8),
    fontSize: moderateScale(11),
    lineHeight: moderateScale(16),
    fontWeight: '400',
    color: '#555555',
  },

  // ==========================================
  // QUOTE ACTIONS
  // ==========================================

  recentActions: {
    width: '100%',
    marginTop: moderateScale(6),
    alignItems: 'flex-end',
  },

  // ==========================================
  // EMPTY
  // ==========================================

  emptyText: {
    textAlign: 'center',
    marginTop: moderateScale(40),
    fontSize: moderateScale(13),
    color: COLORS.black,
    fontWeight: '400',
  },

  // ==========================================
  // LOADING
  // ==========================================

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteIcon: {
    position: 'absolute',
    top: moderateScale(7),
    left: moderateScale(10),
    width: moderateScale(28),
    height: moderateScale(28),
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});

export default styles;
