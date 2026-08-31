import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';

import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  latestList: {
    paddingHorizontal: moderateScale(2),
    paddingBottom: moderateScale(8),
  },

  latestSeparator: {
    width: moderateScale(14),
  },

  latestCard: {
    width: moderateScale(300),
    minHeight: moderateScale(165),
    paddingHorizontal: moderateScale(16),
    paddingTop: moderateScale(14),
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
    overflow: 'hidden',
  },

  latestQuoteIcon: {
    width: moderateScale(28),
    height: moderateScale(28),
    right: moderateScale(6),
  },

  latestQuoteText: {
    marginTop: moderateScale(8),
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    color: COLORS.black,
    fontWeight: 'bold',
    flexShrink: 1,
  },

  latestAuthor: {
    marginTop: moderateScale(8),
    fontSize: moderateScale(10),
    lineHeight: moderateScale(14),
    color: COLORS.black,
    fontWeight: '400',
    flexShrink: 1,
  },

  latestActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: moderateScale(8),
    marginTop: moderateScale(8),
  },

  latestActionButton: {
    width: moderateScale(32),
    height: moderateScale(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
