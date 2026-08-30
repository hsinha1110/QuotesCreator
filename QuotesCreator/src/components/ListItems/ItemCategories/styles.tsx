import { StyleSheet } from 'react-native';

import { moderateScale } from '@/styles/scaling';

import COLORS from '@/constants/Colors';

const styles = StyleSheet.create({
  categoryList: {
    paddingHorizontal: moderateScale(2),
    paddingBottom: moderateScale(8),
  },

  categorySeparator: {
    width: moderateScale(12),
  },

  categoryCard: {
    width: moderateScale(100),
    height: moderateScale(60),
    padding: moderateScale(14),
    borderRadius: moderateScale(18),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light_grey,
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

  categoryName: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(19),
    fontWeight: '700',
    color: COLORS.black,
  },
  fullWidthCard: {
    width: '100%',
  },
});

export default styles;
