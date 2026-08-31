import { StyleSheet } from 'react-native';
import { moderateScale } from '@/styles/scaling';
import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  content: {
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(30),
  },

  title: {
    fontSize: moderateScale(22),
    lineHeight: moderateScale(28),
    fontWeight: '700',
    color: COLORS.black,
  },

  subtitle: {
    marginTop: moderateScale(5),
    fontSize: moderateScale(13),
    lineHeight: moderateScale(19),
    color: COLORS.primary,
  },

  notificationLabel: {
    marginTop: moderateScale(24),
    marginBottom: moderateScale(10),
    fontSize: moderateScale(12),
    lineHeight: moderateScale(16),
    fontWeight: '700',
    letterSpacing: 0.3,
    color: COLORS.accent,
  },

  notificationCard: {
    width: '100%',
    paddingHorizontal: moderateScale(18),
    paddingTop: moderateScale(14),
    paddingBottom: moderateScale(14),
    borderRadius: moderateScale(20),
    backgroundColor: COLORS.white,
    position: 'relative',
    elevation: moderateScale(3),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: moderateScale(2),
    },
    shadowOpacity: 0.08,
    shadowRadius: moderateScale(6),
  },

  quoteIcon: {
    position: 'absolute',
    top: moderateScale(7),
    left: moderateScale(10),
    width: moderateScale(28),
    height: moderateScale(28),
  },

  quoteContent: {
    paddingTop: moderateScale(12),
    alignItems: 'center',
  },

  notificationTitle: {
    fontSize: moderateScale(17),
    lineHeight: moderateScale(23),
    fontWeight: '700',
    color: COLORS.black,
    textAlign: 'center',
  },

  notificationBody: {
    marginTop: moderateScale(5),
    fontSize: moderateScale(14),
    lineHeight: moderateScale(21),
    fontWeight: '400',
    color: COLORS.black,
    textAlign: 'center',
  },

  dailyQuoteBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: moderateScale(14),
  },

  dailyQuoteDate: {
    flex: 1,
    fontSize: moderateScale(10),
    lineHeight: moderateScale(14),
    color: COLORS.grey,
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: moderateScale(10),
  },

  actionButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    alignItems: 'center',
    justifyContent: 'center',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: moderateScale(24),
    marginBottom: moderateScale(12),
  },

  sectionTitle: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    fontWeight: '700',
    color: COLORS.black,
  },

  viewAll: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
    fontWeight: '600',
    color: COLORS.accent,
  },

  latestList: {
    paddingBottom: moderateScale(5),
  },

  latestSeparator: {
    width: moderateScale(12),
    paddingHorizontal: moderateScale(10),
  },

  latestCard: {
    width: moderateScale(210),
    height: moderateScale(155),
    padding: moderateScale(15),
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

  latestQuoteIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
  },

  latestQuoteText: {
    marginTop: moderateScale(7),
    fontSize: moderateScale(13),
    lineHeight: moderateScale(19),
    color: COLORS.black,
  },

  latestBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingTop: moderateScale(10),
  },

  latestAuthor: {
    flex: 1,
    marginRight: moderateScale(8),
    fontSize: moderateScale(10),
    lineHeight: moderateScale(14),
    color: COLORS.grey,
  },

  latestFavoriteButton: {
    width: moderateScale(30),
    height: moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyContainer: {
    width: moderateScale(250),
    height: moderateScale(100),
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyText: {
    fontSize: moderateScale(12),
    color: COLORS.grey,
  },

  latestActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: moderateScale(8),
  },

  latestActionButton: {
    width: moderateScale(30),
    height: moderateScale(30),
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: moderateScale(20),
    paddingTop: moderateScale(20),
    paddingBottom: moderateScale(30),
  },

  dailyBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: moderateScale(14),
  },

  dailyDate: {
    flex: 1,
    fontSize: moderateScale(10),
    lineHeight: moderateScale(14),
    color: COLORS.black,
    fontWeight: 'bold',
  },
  categoryList: {
    paddingHorizontal: moderateScale(2),
    paddingBottom: moderateScale(8),
  },

  categorySeparator: {
    width: moderateScale(12),
  },
  popularList: {
    paddingBottom: moderateScale(5),
  },

  popularSeparator: {
    width: moderateScale(12),
  },

  popularCard: {
    width: moderateScale(210),
    height: moderateScale(155),

    padding: moderateScale(15),

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

  popularQuoteIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
  },

  popularQuoteText: {
    marginTop: moderateScale(7),

    fontSize: moderateScale(13),
    lineHeight: moderateScale(19),

    color: COLORS.black,

    fontWeight: '600',
  },

  popularBottom: {
    flexDirection: 'row',

    alignItems: 'center',
    justifyContent: 'space-between',

    marginTop: 'auto',

    paddingTop: moderateScale(10),
  },

  popularAuthor: {
    flex: 1,

    marginRight: moderateScale(8),

    fontSize: moderateScale(10),
    lineHeight: moderateScale(14),

    color: COLORS.grey,
  },

  popularLikesContainer: {
    flexDirection: 'row',

    alignItems: 'center',

    marginRight: moderateScale(5),
  },

  popularLikes: {
    marginLeft: moderateScale(3),

    fontSize: moderateScale(10),
    lineHeight: moderateScale(14),

    color: COLORS.black,

    fontWeight: '600',
  },
});

export default styles;
