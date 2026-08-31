import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  markAllContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: moderateScale(18),
    paddingVertical: moderateScale(12),
  },

  unreadText: {
    fontSize: moderateScale(13),
    color: COLORS.accent,
    fontWeight: '600',
  },

  markAllText: {
    fontSize: moderateScale(13),
    color: COLORS.accent,
    fontWeight: '600',
  },

  listContainer: {
    paddingHorizontal: moderateScale(16),
    paddingBottom: moderateScale(30),
  },

  dateContainer: {
    paddingTop: moderateScale(8),
    paddingBottom: moderateScale(10),
  },

  dateText: {
    fontSize: moderateScale(13),
    color: COLORS.accent,
    fontWeight: '700',
  },

  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: moderateScale(14),
    paddingVertical: moderateScale(13),
    paddingHorizontal: moderateScale(10),
    marginBottom: moderateScale(10),

    borderWidth: 1,
    borderColor: COLORS.grey,
  },

  unreadNotificationCard: {
    backgroundColor: '#FAF8FF',
  },

  dotContainer: {
    width: moderateScale(8),
    alignItems: 'center',
    marginRight: moderateScale(5),
  },

  unreadDot: {
    width: moderateScale(7),
    height: moderateScale(7),
    borderRadius: moderateScale(4),
    backgroundColor: COLORS.accent,
  },

  iconContainer: {
    width: moderateScale(42),
    height: moderateScale(42),
    borderRadius: moderateScale(21),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0EBFF',
    marginRight: moderateScale(10),
  },

  contentContainer: {
    flex: 1,
    marginRight: moderateScale(8),
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: moderateScale(4),
  },

  notificationTitle: {
    flex: 1,
    fontSize: moderateScale(14),
    color: COLORS.black,
    fontWeight: '600',
    marginRight: moderateScale(8),
  },

  unreadTitle: {
    fontWeight: '700',
    color: COLORS.black,
  },

  timeText: {
    fontSize: moderateScale(10),
    color: COLORS.black,
  },

  messageText: {
    fontSize: moderateScale(12),
    lineHeight: moderateScale(18),
    color: COLORS.black,
    fontWeight: '400',
  },

  unreadMessage: {
    color: COLORS.black,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: moderateScale(150),
  },

  emptyIconContainer: {
    width: moderateScale(85),
    height: moderateScale(85),
    borderRadius: moderateScale(43),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0EBFF',
    marginBottom: moderateScale(18),
  },

  emptyTitle: {
    fontSize: moderateScale(19),
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: moderateScale(8),
  },

  emptyDescription: {
    fontSize: moderateScale(14),
    color: COLORS.grey,
  },
  deleteAction: {
    width: moderateScale(85),
    backgroundColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: moderateScale(16),
    marginBottom: moderateScale(10),
  },

  deleteActionText: {
    color: COLORS.white,
    fontSize: moderateScale(12),
    fontWeight: '600',
    marginTop: moderateScale(4),
  },
});

export default styles;
